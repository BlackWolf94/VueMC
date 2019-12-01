/**
 * @author Dmytro Zataidukh
 * @created_at 11/30/19
 */
/* tslint:disable:max-classes-per-file */
import { BaseModel } from '../src';
import { TMutations, TObject } from '../src/types/IModel';
import { TApiConf } from '../src/types/TApiConf';

describe('Model', () => {
  it('Initialize', () => {
    class Model extends BaseModel {
      id: number;
      name: string;
    }

    const model = new Model({ id: 1, name: 'Test' });

    expect(model.id).toBe(1);
    expect(model.name).toBe('Test');
  });

  it('Apply default', () => {
    class Model extends BaseModel {
      id: number;
      name: string;
      secondName: string;

      default(): Partial<Model> {
        return {
          secondName: 'Test second name',
          id: null,
        };
      }
    }

    const model = new Model({ id: 1, name: 'Test' });

    expect(model.id).toBe(1);
    expect(model.name).toBe('Test');
    expect(model.secondName).toBe('Test second name');
  });

  it('Apply mutation', () => {
    class Model extends BaseModel {
      id: number;
      firsName: string;
      secondName: string;
      fullName: string;
      uuid: string;

      mutations(): TMutations<Model> {
        return {
          fullName: `${this.firsName} ${this.secondName}`,
          uuid: () => `--- ${this.id}`,
        };
      }
    }

    const model = new Model({ id: 1, firsName: 'Test', secondName: 'user' });
    expect(model.id).toBe(1);
    expect(model.fullName).toBe('Test user');
    expect(model.uuid).toBe('--- 1');
  });

  it('Error Handler', async () => {
    class Model extends BaseModel {}
    const model = new Model();
    try {
      await model.save();
    } catch (e) {
      expect(e.message).toBe('Save api method not configure');
    }
  });

  it('Save', async () => {
    class Model extends BaseModel {
      id: number;
      name: string;

      api(): TApiConf{
        return{
          ...super.api(),
          save(data) {
            return data;
          }
        }
      }

      mutateBeforeSave(): TObject{
        return {
          name: {
            first: this.name,
            second: this.name
          },
          uuid: () => `--- ${this.id}`
        };
      }

      onSave(data: any): void {
        expect(data.name.first).toBe(this.name);
        expect(data.name.second).toBe(this.name);
        expect(data.uuid).toBe('--- 1');
      }

    }

    const model = new Model({
      name: 'Test',
      id: 1
    });
    expect(await model.save()).toBe(true);

  });

});
