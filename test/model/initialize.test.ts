/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/3/20
 */

import { TaskModel, TTaskInitData } from '../Task.model';

describe('Model: initialize', () => {

  it('should be apply default value', function() {
    const model = new TaskModel();

    expect(model.createdAt).toBeInstanceOf(Date);
    expect(model.id).toBeNull()
    expect(model.isNew).toBeTruthy()
  });

  it('should be apply initialize', function() {
    const model = new TaskModel();
    const data: TTaskInitData = {
      id: 1,
      title: 'Title',
      description: 'Description',
      createdAt: new Date().valueOf(),
      done: false,
      data: 'this field is not asign into model'
    }
    model.init(data, false);
    expect(model.id).toBe(data.id);
    expect(model.isNew).toBeFalsy();
    expect((model as any).data).toBeUndefined();

  });

  it('should be apply mutations', function() {
    const model = new TaskModel();
    const data: TTaskInitData = {
      author: {
        firstName: 'Dmitro',
        lastName: 'Zataidukh'
      },
    }

    const {firstName, lastName} = data.author;
    model.init(data, false);
    expect(model.author).toBe(`${firstName} ${lastName}`);
  });

  it('should be reactive computed value', function() {
    const model = new TaskModel();
    const data: TTaskInitData = {
      createdAt: new Date().valueOf(),
    }
    model.init(data, false);
    expect(model.dateFormat).toBe(new Date(data.createdAt).toDateString());

  });
});
