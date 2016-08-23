const presetAPI = require('express').Router()
const redis = require('../redis').createClient()

presetAPI.get('/presets/:name', function(req, res) {
  redis.getAsync(`presets:${req.params.name}`)
    .then((preset) => res.json({ preset: JSON.parse(preset) }))
})

module.exports = presetAPI
