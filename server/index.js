const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

const {spawn} = require('child_process');

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    res.send('{"message":"Hello from the custom server!"}');
  });

  app.get('/api/exactify', function (req, res) {
    var song_indexes = [];
    var {time, n_songs, songs_duration} = req.query
    console.log(`[New Exactify Request]\nParams: { Time: ${time}, Num Songs: ${n_songs}, Song Durations: ${songs_duration} }`)
    
    // spawn new child process to call the python script
    const python = spawn('python', ['./server/exact_playlist.py', time, n_songs, songs_duration]);

    // collect data from script
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      song_indexes.push(JSON.parse(data));
    });

    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    console.log('solution:', song_indexes)
    res.set('Content-Type', 'application/json');
    res.send(song_indexes)
    });
  });


  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
  });

}

