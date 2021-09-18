const mongoose = require('mongoose');
const redis = require('redis')
const { applyMongooseCache } = require('./mongoose.cache')
describe('base test', function () {

  let cats;
  let Cat;
  let client;

  beforeAll( async () => {
    mongoose.connect('mongodb://root:root@localhost:27017/cats?authSource=admin');
    process.env.REDIS_CACHE_URL = 'redis://localhost:6379'
     client = redis.createClient(process.env.REDIS_CACHE_URL)

    Cat = mongoose.model('Cat', { name: String });

    cats = ['First', 'Second', 'Third'].map(name => ({name}))
    await Cat.deleteMany()
    await Cat.insertMany(cats)
    applyMongooseCache()


  })


  afterAll(async () => {
    await new Promise(r => {
      client.flushdb('ASYNC', () => {
        r(1)
      });
    })
  })
  it('should correctly cache', async function () {

    const cats = await Cat.find().exec()

  })
})