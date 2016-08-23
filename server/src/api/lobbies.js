const lobbyAPI = require('express').Router()
const sub = require('../redis').createClient()
const redis = require('../redis').createClient()

redis.sinterAsync('lobbies')
  .then(function(lobbies) {
    for (const lobby of lobbies) {
      sub.subscribe(`lobby:channel:${lobby}`)
    }
  })

lobbyAPI.get('/lobbies', function(req, res) {
  redis.sinterAsync('lobbies')
    .then((lobbies) => res.json({ lobbies }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

lobbyAPI.post('/lobbies', function(req, res) {
  const body = JSON.stringify(req.body)

  redis.incrAsync('id:lobbies')
    .then((id) =>
      redis.multi()
        .sadd('lobbies', id)
        .set(`lobby:${id}`, body)
        .execAsync()
        .then(function() {
          res.json({ id })
          sub.subscribe(`lobby:channel:${id}`)
        })
      )
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

lobbyAPI.get('/lobbies/:id', function(req, res) {
  const id = req.params.id
  getLobby(id)
    .then((lobby) => res.json({ lobby: JSON.parse(lobby) }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

lobbyAPI.put('/lobbies/:id', function(req, res) {
  const id = req.params.id
  const body = JSON.stringify(req.body)

  getLobby(id)
    .then(() => redis.multi().set(`lobby:${id}`, body).publish(`lobby:channel:${id}`, body).execAsync())
    .then(() => res.json({ msg: 'UPDATED' }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

lobbyAPI.delete('/lobbies/:id', function(req, res) {
  const id = req.params.id

  getLobby(id)
    .then(() => redis.multi().del(`lobby:${id}`).srem('lobbies', id).execAsync())
    .then(() => res.json({ msg: 'DELETED' }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

function getLobby(id) {
  return redis.getAsync(`lobby:${id}`)
    .then((lobby) => lobby ? lobby : Promise.reject('Lobby does not exist'))
}

module.exports = { lobbyAPI, sub }
