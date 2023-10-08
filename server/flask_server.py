from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import pandas as pd
from flask_cors import CORS
import logging

model_status = "loading"
loaded_w_revin_model = None

try:
    loaded_w_revin_model = tf.keras.models.load_model("./nbeats_revin_model")
    model_status = "loaded"
except Exception as e:
    print(f"Error loading model: {e}")
    model_status = "error"


def preprocess(df2):

    # Sort the DataFrame by its index (which is the date)
    df2 = df2.sort_index()

    df2 = df2[['date','open','high','low','close','adjClose']]
    df2.set_index('date', inplace=True)

    # Extract the last date in the index
    last_date = df2.index[len(df2)-1]
    new_date = last_date + 100

    # Append the new date to the DataFrame with NaN values for all columns
    df2.loc[new_date] = [pd.NA] * len(df2.columns)


    WINDOW_SIZE=7

    # Make a copy of the stock historical data with block reward feature
    df_windowed2 = df2.copy()

    # Add windowed columns
    for i in range(WINDOW_SIZE): # Shift values for each step in WINDOW_SIZE
      df_windowed2[f"open-{WINDOW_SIZE-i}"] = df_windowed2['open'].shift(periods=i+1)
      df_windowed2[f"high-{WINDOW_SIZE-i}"] = df_windowed2['high'].shift(periods=i+1)
      df_windowed2[f"low-{WINDOW_SIZE-i}"] = df_windowed2['low'].shift(periods=i+1)
      df_windowed2[f"close-{WINDOW_SIZE-i}"] = df_windowed2['close'].shift(periods=i+1)
      df_windowed2[f"adjClose-{WINDOW_SIZE-i}"] = df_windowed2['adjClose'].shift(periods=i+1)


    # Step 1: Filter out columns with -7 to -1 suffix
    suffixes_to_check = [f"-{i}" for i in range(WINDOW_SIZE, 0, -1)]
    columns_to_check_for_nan = [col for col in df_windowed2.columns if any(suffix in col for suffix in suffixes_to_check)]

    # Step 2: Drop rows only if there's a NaN in columns with the -7 to -1 suffix
    indices_to_keep = df_windowed2.dropna(subset=columns_to_check_for_nan).index
    df_filtered = df_windowed2.loc[indices_to_keep]

    # Step 3: Drop columns 'Open', 'High', 'Low', and 'Adj Close' without the -7 to -1 suffixes
    cols_to_exclude = ['open', 'high', 'low', 'adjClose']
    cols_to_drop = [col for col in df_filtered.columns if col in cols_to_exclude and not any(suffix in col for suffix in suffixes_to_check)]
    df_filtered = df_filtered.drop(columns=cols_to_drop)

    # Separating into X2 and y2
    X2 = df_filtered.drop(columns=['close'])
    X_test2 = X2.tail(50)

    return X_test2


def make_preds(model, input_data):
  forecast = model.predict(input_data, verbose=0)
  return tf.squeeze(forecast) # return 1D array of predictions

app = Flask(__name__)
CORS(app)

@app.route('/api/model', methods=['POST'])
def get_predictions():

    try:
        # Retrieve the data from the request
        data = request.json['historicalData']
        df = pd.DataFrame(data)

        X_test2 = preprocess(df)
        model_w_revin_preds = make_preds(loaded_w_revin_model, X_test2)

        model_w_revin_preds_lastcol = model_w_revin_preds[:, -1]
        model_w_revin_preds_lastcol = tf.expand_dims(model_w_revin_preds_lastcol, axis=-1)
        model_w_revin_preds_lastcol_seven = model_w_revin_preds_lastcol[-7:]
        pred_list = model_w_revin_preds_lastcol_seven.numpy().tolist()

        flattened_data = [item for sublist in pred_list for item in sublist]

        if len(pred_list) > 0:
            prediction = {"forecastData": flattened_data}
            return jsonify(prediction)
        else:
            return jsonify({"forecastData": "null"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    
@app.route('/api/model_status', methods=['GET'])
def get_model_status():
    return jsonify({"status": model_status})

    
@app.route('/')
def index():
    return "Welcome to the Flask server!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7000)

