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

    # Extract the last date in the index
    last_date = df2.index[-1]

    # Add one day to the date and set the time to 09:30:00-04:00
    new_date = pd.Timestamp(last_date.date() + pd.Timedelta(days=1), tz='US/Eastern').replace(hour=9, minute=30)

    # Append the new date to the DataFrame with NaN values for all columns
    df2.loc[new_date] = [pd.NA] * len(df2.columns)


    WINDOW_SIZE=7

    # Make a copy of the stock historical data with block reward feature
    df_windowed2 = df2.copy()

    # Add windowed columns
    for i in range(WINDOW_SIZE): # Shift values for each step in WINDOW_SIZE
      df_windowed2[f"Open-{WINDOW_SIZE-i}"] = df_windowed2["Open"].shift(periods=i+1)
      df_windowed2[f"High-{WINDOW_SIZE-i}"] = df_windowed2["High"].shift(periods=i+1)
      df_windowed2[f"Low-{WINDOW_SIZE-i}"] = df_windowed2["Low"].shift(periods=i+1)
      df_windowed2[f"Close-{WINDOW_SIZE-i}"] = df_windowed2["Close"].shift(periods=i+1)
      df_windowed2[f"Adj Close-{WINDOW_SIZE-i}"] = df_windowed2["Adj Close"].shift(periods=i+1)


    # Step 1: Filter out columns with -7 to -1 suffix
    suffixes_to_check = [f"-{i}" for i in range(WINDOW_SIZE, 0, -1)]
    columns_to_check_for_nan = [col for col in df_windowed2.columns if any(suffix in col for suffix in suffixes_to_check)]

    # Step 2: Drop rows only if there's a NaN in columns with the -7 to -1 suffix
    indices_to_keep = df_windowed2.dropna(subset=columns_to_check_for_nan).index
    df_filtered = df_windowed2.loc[indices_to_keep]

    # Step 3: Drop columns 'Open', 'High', 'Low', and 'Adj Close' without the -7 to -1 suffixes
    cols_to_exclude = ['Open', 'High', 'Low', 'Adj Close']
    cols_to_drop = [col for col in df_filtered.columns if col in cols_to_exclude and not any(suffix in col for suffix in suffixes_to_check)]
    df_filtered = df_filtered.drop(columns=cols_to_drop)

    # Separating into X2 and y2
    X2 = df_filtered.drop(columns=['Close'])
    X_test2 = X2.tail(50)

    return X_test2


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
X_test2=preprocess()

loaded_w_revin_model=tf.keras.models.load_model("./nbeats_revin_model")

model_w_revin_preds = make_preds(loaded_w_revin_model, X_test2)

model_w_revin_preds_lastcol = model_w_revin_preds[:, -1]  # Take the last column
model_w_revin_preds_lastcol = tf.expand_dims(model_w_revin_preds_lastcol, axis=-1)  # Expand dimensions to shape (494, 1)
model_w_revin_preds_lastcol_seven=model_w_revin_preds_lastcol[-7:]

print(model_w_revin_preds_lastcol_seven)