/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/12/20
 */

import * as faker from 'faker';
import { TInitialData, TodoListCollection, TTodoFilterOpt } from './mock/TodoList.collection';
import { TaskInitData } from './mock/Task.model';
import { CollectionFetchResponse } from '../src';

describe('Collection', () => {
  const generateContent = ({ size, page }: TTodoFilterOpt) =>
    Array(size)
      .fill(0)
      .map<TaskInitData>((item, index) => ({
        id: size * (page - 1) + index + 1,
        title: faker.name.title(),
        description: faker.lorem.paragraph(),
        done: faker.datatype.boolean(),
        createdAt: faker.date.past().valueOf(),
        author: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
      }));

  it('should be initialize', () => {
    const collection = new TodoListCollection();
    collection.add(generateContent({ size: 50, page: 1 }));
    expect(collection.length).toBe(50);
  });

  it('should be initialize by api', async () => {
    const collection = new TodoListCollection();

    collection.useApi({
      async fetch(filter: TTodoFilterOpt): Promise<CollectionFetchResponse<TaskInitData, TInitialData>> {
        return {
          content: generateContent(filter),
          pages: filter.page,
          total: filter.page * filter.size,
          data: {
            metaInfo: 'Meta Info',
            otherField: faker.lorem.text(),
          },
        };
      },
    });
    await expect(collection.fetch({ page: 2 })).resolves.not.toThrow();
    expect(collection).toMatchObject({
      length: collection.filterOptions.size,
      page: collection.filterOptions.page,
      totalCount: 2 * collection.filterOptions.size,
      metaInfo: expect.stringMatching('Meta Info'),
    });

    expect((collection as any).otherField).toBeUndefined();
  });
});
