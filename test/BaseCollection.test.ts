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


describe("Simple Collection test", () => {
  const collection = new TestCollection(generetae(3));

  it('Simple init', function() {
    expect(collection.models.length).toBe(3);
  });

  it('Add many to collection', function() {
    collection.add(generetae(3));
    expect(collection.models.length).toBe(6);

  });

  it('Add one to collection', function() {
    collection.add({
      id: 7,
      name: `Item ${7}`
    });
    expect(collection.models.length).toBe(7);
  });

  it('Search in collection', function() {
    expect(collection.search('item 1').length).toBe(2);
  });

  it('Replace collection', function() {
    collection.replace(generetae(3));
    expect(collection.models.length).toBe(3);
  });

  it('Clear in collection', function() {
    collection.clear();
    expect(collection.models.length).toBe(0);
  });

  it('Find one in collection', function() {
    collection.add(generetae(20));
    expect(collection.find({id: 1})).toMatchObject({ name: 'Item 1', id: 1 });
  });

  it('Filter in collection use object', function() {
    expect(collection.filter({id: 1}).length).toBe(1);
    expect(collection.filter({id: 1})).toEqual(expect.arrayContaining([{ name: 'Item 1', id: 1 }]));
  });

  it('Filter in collection use function', function() {
    expect(collection.filter((item => item.id === 1)).length).toBe(1);
    expect(collection.filter((item => item.id === 1))).toEqual(expect.arrayContaining([{ name: 'Item 1', id: 1 }]));
  });

  it('Init collection large data', function() {
    collection.replace(generetae(2000));
    expect(collection.models.length).toBe(2000);
  });

  it('Remove item', function() {
    collection.removeItem({name: 'Item 1'});
    expect(collection.find({name: 'Item 1'})).toBe(undefined);
    expect(collection.models.length).toBe(1999);
  });


});