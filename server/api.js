const r = require('redis')
const e = require('express')
const redis = r.createClient()
const Promise = require('bluebird')

const api = e.Router()
Promise.promisifyAll(r.Multi.prototype)
Promise.promisifyAll(r.RedisClient.prototype)

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
    .then(() => res.json({ msg: 'DELETED' }))
    .catch((err) => res.status(500).json({ err: err.message ? err.message : err }))
})

function getLobby(id) {
  return redis.getAsync(`lobby:${id}`)
    .then((lobby) => lobby ? lobby : Promise.reject('Lobby does not exist'))
}

module.exports = api
