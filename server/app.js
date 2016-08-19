'use strict'

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen('3000')

app.get('/', function(req, res) {
  res.json({ hello: 'world' })
})

io.on('connection', function(socket) {
  socket.on('data', function(data) {
    socket.broadcast.emit('data', data)
  })
})
