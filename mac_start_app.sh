npm run dev &
echo $! >> pids.txt

npm start &
echo $! >> pids.txt

python flask_server.py &
echo $! >> pids.txt
