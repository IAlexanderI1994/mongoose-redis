const redis = require('redis')
const util = require('util')
const mongoose = require('mongoose')


module.exports =
  {
    applyMongooseCache() {
      const redisUrl = process.env.REDIS_CACHE_URL
      const client = redis.createClient(redisUrl)
      client.get = util.promisify(client.get)
      const exec = mongoose.Query.prototype.exec

      mongoose.Query.prototype.exec = async function () {
        const key = JSON.stringify(
          {
            ...this.getQuery(),
            collection: this.mongooseCollection.name,
            op: this.op,
            options: this.options
          }
        )

        const cacheValue = await client.get(key)

        if ( cacheValue ) return JSON.parse(cacheValue)

        const result = await exec.apply(this, arguments)

        if ( result ) {
          await client.set(key, JSON.stringify(result))
        }
        return result
      }
    },
  }


