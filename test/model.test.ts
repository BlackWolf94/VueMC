import { TaskDelOpt, TaskInitData, TaskModel } from './mock/Task.model';
import { BadConfigException, ValidateException } from '../src';

describe('Model', () => {
  let model: TaskModel;

  beforeEach(() => {
    model = new TaskModel();
  });

  describe('Model: [initialize]', () => {
    it('should be apply default value', () => {
      expect(model.createdAt).toBeInstanceOf(Date);
      expect(model.id).toBeNull();
      expect(model.isNew).toBeTruthy();
    });

    it('should be apply initialize', () => {
      model.init(
        {
          id: 1,
          title: 'Title',
          description: 'Description',
          createdAt: new Date().valueOf(),
          done: false,
          data: 'this field is not asign into model',
        },
        false,
      );
      expect(model.id).toBe(1);
      expect(model.isNew).toBeFalsy();
      expect((model as any).data).toBeUndefined();
    });

    it('should be apply mutations', () => {
      const [firstName, lastName] = ['Dmitriy', 'Zataidukh'];
      model.init({ author: { firstName, lastName } }, false);
      expect(model.author).toBe(`${firstName} ${lastName}`);
    });

    it('should be reactive computed value', () => {
      const createdAt = new Date().valueOf();
      model.init({ createdAt }, false);
      expect(model.dateFormat).toBe(new Date(createdAt).toDateString());
    });
  });

  describe('Model: validation', () => {
    it('should be validation error', () => {
      model.description = 'Description';
      expect<boolean>(model.validate()).toBeFalsy();
      expect(model.errors.attrs).toMatchObject({
        title: 'Title can`t be empty',
        description: 'Description must be more 15 symbols',
      });
    });

    it('should be validation success', () => {
      model.title = 'Test task title';
      model.description = 'Todo description';
      expect<boolean>(model.validate()).toBeTruthy();
    });

    it('should be throw Validate exception', async () => {
      await expect(model.save()).rejects.toThrow(ValidateException);
      expect<boolean>(model.hasError).toBeTruthy();
    });

    it('should be save success', async () => {
      model.title = 'Test task title';
      model.description = 'Todo description';
      expect(model.save()).resolves.not.toThrow();
    });
  });

  describe('Model:api', () => {
    it('should be save success', async () => {
      model.title = 'Test task title';
      model.description = 'Todo description';

      model.useApi({
        async save(data?: TaskInitData): Promise<any> {
          expect<boolean>(model.isNew).toBeTruthy();
          expect<TaskInitData>(data).toStrictEqual({
            id: model.id,
            title: model.title,
            description: model.description,
            done: model.done,
            createdAt: model.createdAt.valueOf(),
          });
        },
      });
      await model.save();
      expect<boolean>(model.loading).toBeFalsy();
      expect<boolean>(model.isNew).toBeFalsy();
    });

    it('should be update success', async () => {
      model.init(
        {
          title: 'Test task title',
          description: 'Todo description',
          done: false,
        },
        false,
      );

      model.done = true;

      model.useApi({
        async update(data?: TaskInitData): Promise<any> {
          expect<boolean>(model.isNew).toBeFalsy();
          expect<TaskInitData>(data).toStrictEqual({
            id: model.id,
            title: model.title,
            description: model.description,
            done: model.done,
            createdAt: model.createdAt.valueOf(),
          });
        },
      });
      await model.save();
      // expect().toBeTruthy();
      expect<boolean>(model.saving).toBeFalsy();
      expect<boolean>(model.isNew).toBeFalsy();
    });

    it('should be delete success', async () => {
      model.init(
        {
          id: 1,
        },
        false,
      );

      model.useApi({
        async delete(data?: TaskDelOpt): Promise<any> {
          expect<TaskInitData>(data).toStrictEqual({ id: model.id });
        },
      });

      await model.delete();
      expect<boolean>(model.loading).toBeFalsy();
    });

    it('should be fetch success', async () => {
      const id = 1;

      await expect(
        TaskModel.fetch<TaskModel>({ id }),
      ).resolves.toMatchObject({
        id,
        title: `Task #${id}`,
        loading: false,
      });
    });

    it('should be configure exception', async () => {
      model.useApi({});

      try {
        model.title = 'Test task title';
        model.description = 'Todo description';
        await model.save();
      } catch (e) {
        expect(e).toBeInstanceOf(BadConfigException);
        expect(model.hasError).toBeTruthy();
        expect(model.errors).toStrictEqual({
          model: 'TaskModel: save api method not configure',
          attrs: {},
        });
      }
    });
  });
});
