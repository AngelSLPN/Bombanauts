

const path = require('path');
const chalk = require('chalk');
const http = require('http');
const server = http.createServer();
const port = process.env.PORT || 1337;

const express = require('express');
const app = express();

const socketio = require('socket.io');

const {addPlayer} = require('./players/action-creator');

const store = require('./store')

server.on('request', app);

// creates a new connection server for web sockets and integrates
// it into our HTTP server
// this needs to be below the server.on('request', app) so that our
// express app takes precedence over our socekt server for typical
// HTTP requests
const io = socketio(server);


// // use socket server as an event emitter in order to listen for new connctions
io.on('connection', function(socket){

  console.log(chalk.blue('A new client has connected'));
  console.log(chalk.yellow('socket id: ', socket.id));
  store.dispatch(addPlayer({id: socket.id,
                            position: {x: 0, y: 0, z: 0}
                          }));
  socket.on('moveForward', function(data) {
    store.dispatch(addPlayer(data));
    io.sockets.emit('movefwd', store.getState())
  })
  //THIS NEED REFACTORING
  socket.on('moveRight', function(data) {
    store.dispatch(addPlayer(data));

    io.sockets.emit('moverght', store.getState())
  })

  socket.on('moveLeft', function(data) {
    store.dispatch(addPlayer(data));

    io.sockets.emit('movelft', store.getState())
  })

  socket.on('moveDown', function(data) {
    store.dispatch(addPlayer(data));
    io.sockets.emit('movedwn', store.getState())
  })

  socket.on('disconnect', function(){
    //REMOVE ON DISCONECT
    console.log('socket id ' + socket.id + ' has disconnected. : (');
  })

})

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'browser', 'index.html'));
});


server.listen(port, function () {
    console.log(`The server is listening on port ${port}!`);
});

