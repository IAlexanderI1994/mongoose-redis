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
        const key = JSON.stringify(Object.assign({}, this.getQuery(), {
          collection: this.mongooseCollection.name,
          op: this.op,
          options: this.options
        }))
        console.log(key)


        const cacheValue = await client.get(key)

        if ( cacheValue ) {
          const doc = JSON.parse(cacheValue)

          // const newValue = Array.isArray(doc) ? doc.map(d => new this.model(d)) :
          //     ( typeof doc === 'object' ? new this.model(doc): doc)
          // return newValue

          return doc
        }
        const result = await exec.apply(this, arguments)

        if ( result ) {
          await client.set(key, JSON.stringify(result))
        }
        return result
      }
    },
  }


