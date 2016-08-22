const app = require('express')()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
const socketio = require('socket.io')(server)

const API_VERSION = 'v1'
const PORT = process.env.PORT || 3000

socketio.on('connection', function(socket) {
  socket.on('data', function(data) {
    socket.broadcast.emit('data', data)
  })
})

app.use(bodyParser.json())
app.use(`/api/${API_VERSION}`, require('./api'))
server.listen(PORT)
