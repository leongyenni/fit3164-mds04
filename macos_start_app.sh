#!/bin/bash

echo "Please provide the path to your Python 3.9 installation directory (e.g., /usr/local/bin/python3.9):"
read PYTHON_PATH

$PYTHON_PATH -m pip install -r requirements.txt

echo "Installing npm packages in the root directory..."
npm install

cd web-dashboard
echo "Installing npm packages for web-dashboard..."
npm install

echo "Start dashboard..."
npm run dev &

cd ..
cd server
echo "Start servers..."
npm start &
$PYTHON_PATH flask_server.py
