const r = require('redis')
const Promise = require('bluebird')
Promise.promisifyAll(r.Multi.prototype)
Promise.promisifyAll(r.RedisClient.prototype)

module.exports = r
