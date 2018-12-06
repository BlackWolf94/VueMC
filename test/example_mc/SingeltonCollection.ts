import { Collection, Model } from '../../src';

class SingeltonCollection extends Collection<Model>{

  get singleton(): boolean {
    return true;
  }
}

const generetae = count => {
  let data: object[] = [];
  for(count; count > 0; count-- ) {
    data.push({
      id: count,
      name: `Item ${count}`
    })
  }
  return data
};

describe('Singleton', () => {
  const collection = new SingeltonCollection(generetae(5));
  const collection2 = new SingeltonCollection(generetae(15));

  it('test singleton pattern ', () => {
    console.debug(collection, collection2);
    expect(collection.models.length).toBe(collection2.models.length)
  })

});
