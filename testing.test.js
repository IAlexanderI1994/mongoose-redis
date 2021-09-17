const mongoose = require('mongoose');
const { applyMongooseCache } = require('./mongoose.cache')
describe('base test', function () {

  let cats;
  let Cat;
  beforeAll( async () => {
    mongoose.connect('mongodb://root:root@localhost:27017/cats?authSource=admin');

    Cat = mongoose.model('Cat', { name: String });

    cats = ['First', 'Second', 'Third'].map(name => ({name}))
    await Cat.deleteMany()
    await Cat.insertMany(cats)

  })
  it('should correctly cache', async function () {
    const cats = await Cat.find().exec()
  })
})