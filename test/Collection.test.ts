import {Collection, Model} from '../src';
import { send } from '../src/modules/Interfaces';

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

const apiSend = async (filters) => {
  return {
    content: generetae(filters.pager.size),
    pages: 1
  }
};

class CollectionTest extends Collection <Model>{

  model(){
    return Model
  }

  get updateMethod(): send {
    return apiSend
  }

}

describe('Collection test', () => {

  const collection = new CollectionTest();

  it('INIT COLLECTION',() => {
    collection.update()
      .then(() => {
        expect(collection.models.length).toBe(25);
        expect(collection.totalItems).toBe(25);
        collection.destruct();
        expect(collection.models.length).toBe(0);

      });

  })

});