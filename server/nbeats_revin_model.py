import tensorflow as tf
import numpy as np
from tensorflow.keras import layers
import matplotlib.pyplot as plt
import os
import pandas as pd

def preprocess():

    # Set the relative path to the AAPL directory
    dir_path2 = './AAPL'

    # Get a list of all the CSV filenames in the directory
    all_files2 = [dir_path2 + '/' + filename for filename in os.listdir(dir_path2) if filename.endswith('.csv')]

    # Read each file and append its content to a list of DataFrames
    dfs2 = [pd.read_csv(file, parse_dates=["Datetime"], index_col=["Datetime"]) for file in all_files2]

    # Combine all the DataFrames into one
    df2 = pd.concat(dfs2, axis=0)

    # Sort the DataFrame by its index (which is the date)
    df2 = df2.sort_index()

    df2 = df2[['Open','High','Low','Close','Adj Close']]


    HORIZON=7
    WINDOW_SIZE=49

    # Make a copy of the Bitcoin historical data with block reward feature
    df_windowed2 = df2.copy()

    # Add windowed columns
    for i in range(7): # Shift values for each step in WINDOW_SIZE
        df_windowed2[f"Open-{7-i}"] = df_windowed2["Open"].shift(periods=i+1)
        df_windowed2[f"High-{7-i}"] = df_windowed2["High"].shift(periods=i+1)
        df_windowed2[f"Low-{7-i}"] = df_windowed2["Low"].shift(periods=i+1)
        df_windowed2[f"Close-{7-i}"] = df_windowed2["Close"].shift(periods=i+1)
        df_windowed2[f"Adj Close-{7-i}"] = df_windowed2["Adj Close"].shift(periods=i+1)


    feature_cols2 = ['Open', 'High', 'Low', 'Adj Close']+[f"{col}-{i}" for i in range(7, 0, -1) for col in ['Open', 'High', 'Low', 'Close', 'Adj Close']]
    X2 = df_windowed2.dropna()[feature_cols2]
    y2 = df_windowed2.dropna()['Close']
    X2, y2


    # Ensure timestamps you're using for indexing have timezone information.
    # start_train = pd.Timestamp('2022-10-01').tz_localize('US/Eastern')
    # end_train = pd.Timestamp('2023-04-30').tz_localize('US/Eastern')

    # start_val = pd.Timestamp('2023-05-01').tz_localize('US/Eastern')
    # end_val = pd.Timestamp('2023-05-31').tz_localize('US/Eastern')

    start_test = pd.Timestamp('2023-08-31').tz_localize('US/Eastern')
    end_test = pd.Timestamp('2023-09-12').tz_localize('US/Eastern')

    # start_pred = pd.Timestamp('2023-09-12').tz_localize('US/Eastern')
    # end_pred = pd.Timestamp('2023-09-13').tz_localize('US/Eastern')

    X_test2, y_test2 = X2.loc[start_test:end_test], y2.loc[start_test:end_test]

    BATCH_SIZE = 1024

    test_dataset_norm2 = (tf.data.Dataset
                    .from_tensor_slices((X_test2, y_test2))
                    .batch(BATCH_SIZE)
                    .prefetch(buffer_size=tf.data.AUTOTUNE))
    
    return test_dataset_norm2


def make_preds(model, input_data):
  """
  Uses model to make predictions on input_data.

  Parameters
  ----------
  model: trained model
  input_data: windowed input data (same kind of data model was trained on)

  Returns model predictions on input_data.
  """
  forecast = model.predict(input_data)
  return tf.squeeze(forecast) # return 1D array of predictions


# if __name__=="__main__":
test_dataset_norm2=preprocess()

loaded_w_revin_model=tf.keras.models.load_model("./nbeats_revin_model")

model_w_revin_preds = make_preds(loaded_w_revin_model, test_dataset_norm2)

model_w_revin_preds_reshaped = model_w_revin_preds[:, -1]  # Take the last column
model_w_revin_preds_reshaped = tf.expand_dims(model_w_revin_preds_reshaped, axis=-1)  
model_w_revin_preds_lastcol=model_w_revin_preds_reshaped[-7:]

print(model_w_revin_preds_lastcol)