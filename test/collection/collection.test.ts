/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/12/20
 */

import { TInitialData, TodoListCollection, TTodoFilterOpt } from '../../src/sample/TodoList.collection';
import { TTaskInitData } from '../../src/sample/Task.model';
import faker from 'faker';
import { TFetchResp } from '../../src/types';

describe('Collection', function() {

  const generateContent = ({ size, page }: TTodoFilterOpt) => Array(size)
    .fill(0)
    .map<TTaskInitData>((item, index) => ({
      id: (size * (page - 1)) + index + 1,
      title: faker.name.title(),
      description: faker.lorem.paragraph(),
      done: faker.random.boolean(),
      createdAt: faker.date.past().valueOf(),
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      }
    }));


  it('should be initialize', function() {
    const collection = new TodoListCollection()
    collection.add(generateContent({ size: 50, page: 1 }));
    expect(collection.length).toBe(50);
  });

  it('should be initialize by api', async function() {
    const collection = new TodoListCollection()

    collection.useApi( {
      async fetch(filter: TTodoFilterOpt): Promise<TFetchResp<TTaskInitData, TInitialData>> {
        return {
          content: generateContent(filter),
          pages: filter.page,
          total: filter.page * filter.size,
          data: {
            metaInfo: 'Meta Info',
            otherField: faker.lorem.text(),
          }
        }
      }
    })
    await collection.fetch({page: 2})
    expect(collection.length).toBe(collection.filterOpt.size);
    expect(collection.page).toBe(collection.filterOpt.page);
    expect(collection.total).toBe( 2 * collection.filterOpt.size);
    expect(collection.metaInfo).toBe('Meta Info');
    expect((collection as any).otherField).toBeUndefined();
  });



});
