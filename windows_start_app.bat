@echo off
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
python flask_server.py

echo Run completed.