/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/8/20
 */

import { TaskModel, TTaskDelOpt, TTaskInitData } from '../Task.model';
import { ConfigureApiException } from '../../src';


describe('Model:api', () => {

  it('should be save success', async function() {
    const model = new TaskModel();
    model.title = 'Test task title';
    model.description = 'Todo description';

    model.useApi({
      async save(data?: TTaskInitData): Promise<any> {
        expect<boolean>(model.isNew).toBeTruthy();
        expect<TTaskInitData>(data).toStrictEqual({
          id: model.id,
          title: model.title,
          description: model.description,
          done: model.done,
          createdAt: model.createdAt.valueOf(),
        });
      },
    });

    expect(await model.save()).toBeTruthy();
    expect<boolean>(model.loading).toBeFalsy();
    expect<boolean>(model.isNew).toBeFalsy();
  });

  it('should be update success', async function() {
    const model = new TaskModel();
    model.init({
      title: 'Test task title',
      description: 'Todo description',
      done: false,
    }, false);

    model.done = true;

    model.useApi({
      async update(data?: TTaskInitData): Promise<any> {
        expect<boolean>(model.isNew).toBeFalsy();
        expect<TTaskInitData>(data).toStrictEqual({
          id: model.id,
          title: model.title,
          description: model.description,
          done: model.done,
          createdAt: model.createdAt.valueOf(),
        });
      },
    });

    expect(await model.save()).toBeTruthy();
    expect<boolean>(model.loading).toBeFalsy();
    expect<boolean>(model.isNew).toBeFalsy();
  });


  it('should be delete success', async function() {
    const model = new TaskModel();
    model.init({
      id: 1,
    }, false);

    model.useApi({
      async delete(data?: TTaskDelOpt): Promise<any> {
        expect<TTaskInitData>(data).toStrictEqual({ id: model.id });
      },
    });

    await model.delete();
    expect<boolean>(model.loading).toBeFalsy();
  });

  it('should be fetch success', async function() {
    const id = 1;

    const model = await TaskModel.fetch<TaskModel>({ id });

    expect(model.id).toBe(id);
    expect(model.title).toBe(`Task #${id}`);
    expect<boolean>(model.loading).toBeFalsy();

  });


  it('should be configure exception', async function() {
    const model = new TaskModel();
    model.useApi({});

    try {
      await model.save();
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigureApiException);
      expect(model.hasError).toBeTruthy();
      expect(model.errors).toStrictEqual({
        model: 'TaskModel: save api method not configure',
        attrs: {},
      });
    }
  });
});
