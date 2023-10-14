@echo off
echo Please provide the path to your Python 3.9 installation directory (e.g., C:\Python39):
set /p PYTHON_PATH="Enter path: "

echo Install python libraries required
"%PYTHON_PATH%\Scripts\pip" install -r requirements.txt

echo Installing npm packages in the root directory...
cmd /c npm install

cd web-dashboard
echo Installing npm packages for web-dashboard...
cmd /c npm install

echo Start dashboard...
start /b cmd /c "npm run dev"

cd ..
cd server
echo Start servers...
start /b cmd /c "npm start"
"%PYTHON_PATH%\python.exe" flask_server.py

echo Run completed.