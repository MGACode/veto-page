'use strict'

const r = require('redis')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')

const app = express()
const server = require('http').Server(app)
const socketio = require('socket.io')(server)

const API_VERSION = 'v1'
const api = express.Router()
const redis = r.createClient()
const PORT = process.env.PORT || 3000

Promise.promisifyAll(r.Multi.prototype)
Promise.promisifyAll(r.RedisClient.prototype)

socketio.on('connection', function(socket) {
  socket.on('data', function(data) {
    socket.broadcast.emit('data', data)
  })
})

api.get('/lobbies', function(req, res) {
  redis.sinterAsync('lobbies')
    .then((lobbies) => res.json({ lobbies }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

api.post('/lobbies', function(req, res) {
  redis.incrAsync('id:lobbies')
    .then((id) =>
      redis.multi()
        .set(`lobby:${id}`, '{}')
        .sadd('lobbies', id)
        .execAsync()
        .then(() => res.json({ id })))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

api.get('/lobbies/:id', function(req, res) {
  const id = req.params.id
  getLobby(id)
    .then((lobby) => res.json({ lobby }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})


api.put('/lobbies/:id', function(req, res) {
  const id = req.params.id

  getLobby(id)
    .then(() => redis.setAsync(`lobby:${id}`, JSON.stringify(req.body)))
    .then((msg) => res.json({ msg }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

api.delete('/lobbies/:id', function(req, res) {
  const id = req.params.id

  getLobby(id)
    .then(() => redis.multi().del(`lobby:${id}`).srem('lobbies', id).execAsync())
    .then((msgs) => res.json({ status: msgs.map((val) => val === 0 ? 'fail' : 'success') }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

function getLobby(id) {
  return redis.getAsync(`lobby:${id}`)
    .then((lobby) => lobby ? lobby : Promise.reject('Lobby does not exist'))
}

app.use(bodyParser.json())
app.use(`/api/${API_VERSION}`, api)
server.listen(PORT)
