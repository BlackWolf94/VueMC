import Collection from '../src/modules/Collection';
import TestCollection from './example_mc/TestCollection';

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


describe("Collection test", () => {

  it('Simple init', function() {
    const collection = new TestCollection(generetae(3));
    expect(collection.models.length).toBe(3);
    console.debug(collection)
  });
  



});