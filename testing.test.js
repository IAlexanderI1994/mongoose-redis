const mongoose = require('mongoose');

describe('base test', function () {

  let kitty;
  beforeAll( () => {
    mongoose.connect('mongodb://root:root@localhost:27017/cats?authSource=admin');
    const Cat = mongoose.model('Cat', { name: String });
    kitty = new Cat({ name: 'Zildjian' });


  })
  it('should correctly cache', async function () {
    await kitty.save()
  })
})