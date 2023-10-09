start /b cmd /c "cd web-dashboard && npm run dev"
start /b cmd /c "cd server && npm start"
cd server && python flask_server.py