/**
 * @author Dmytro Zataidukh
 * @created_at 11/30/19
 */
/* tslint:disable:max-classes-per-file */
import { BaseModel } from '../src';
import { BaseCollection } from '../src';
import { TApiCollectionConf, TFetchData } from '../src/types/TApiConf';
import { TCollectionFilter } from '../src/types/ICollection';

class Model extends BaseModel {
  id: number;
  name: string;
}

class Collection extends BaseCollection<Model> {
  model(): typeof Model{
    return Model;
  }

  api(): TApiCollectionConf<Model> {
    return {
      async fetch(filter?: TCollectionFilter): Promise<TFetchData<Model>> {
        return  {
          page: filter.page,
          pages: 10,
          content: Array(filter.size || 10)
            .fill(0)
            .map( (item, index) => ({
              name:`Test ${filter.page}:${index}`,
              id: index + (filter.page * filter.size || 10)
            }as Model))
        }
      }
    };
  }

  interval: number = 0;

  protected updateInterval(): number {
    return this.interval
  }
}


describe( 'Collection', () =>{
  const collection = new Collection();

  it('Init', () => {
    collection.add(Array(5)
      .fill(0)
      .map( (item, index) => ({
        name:`Test item ${index}`,
        id: index
      }))
    );

    expect(collection.length).toBe(5);
  });

  it('Fetch: page 0', async () => {
    await collection.fetch({size: 10});
    expect(collection.length).toBe(10);
    expect(collection.filter.page).toBe(0);
  });

  it('Fetch: page 1', async () => {
    await collection.fetch({size: 5, page: 1});
    expect(collection.length).toBe(5);
    expect(collection.filter.page).toBe(1);
    expect(collection.pages).toBe(10);
    expect(collection.total).toBe(50);
  });
});

