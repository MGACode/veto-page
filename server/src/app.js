const cors = require('cors')
const app = require('express')()
const bodyParser = require('body-parser')
const server = require('http').Server(app)
const socketIO = require('socket.io')(server)
const { lobbyAPI, sub } = require('./api/lobbies')
const presetAPI = require('./api/presets')

app.use(cors())
app.use(bodyParser.json())

socketIO.on('connection', function(socket) {
  socket.on('join room', (room) => socket.join(room))
  socket.on('leave room', (room) => socket.leave(room))
})

sub.on('message', function(channel, message) {
  const channelId = channel.split(':')[2]
  socketIO.to(channelId).emit('data', JSON.parse(message))
})

app.use('/api', lobbyAPI)
app.use('/api', presetAPI)
server.listen(process.env.PORT || 3000)
