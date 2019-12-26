/**
 * @author Dmytro Zataidukh
 * @created_at 11/30/19
 */
/* tslint:disable:max-classes-per-file */
import { TMutations, TObject } from '../src';
import { TApiConf } from '../src';
import { Model } from '../src';

describe('Model', () => {
  it('Initialize', () => {
    class TestModel extends Model {
      id: number;
      name: string;
    }

    const model = new TestModel({ id: 1, name: 'Test' });

    expect(model.id).toBe(1);
    expect(model.name).toBe('Test');
  });

  it('Apply default', () => {
    class TestModel extends Model {
      id: number;
      name: string;
      secondName: string;

      default(): Partial<TestModel> {
        return {
          secondName: 'Test second name',
          id: null,
        };
      }
    }

    const model = new TestModel({ id: 1, name: 'Test' });

    expect(model.id).toBe(1);
    expect(model.name).toBe('Test');
    expect(model.secondName).toBe('Test second name');
  });

  it('Apply mutation', () => {
    class TestModel extends Model {
      id: number;
      firsName: string;
      secondName: string;
      fullName: string;
      uuid: string;

      mutations(): TMutations<TestModel> {
        return {
          fullName: `${this.firsName} ${this.secondName}`,
          uuid: () => `--- ${this.id}`,
        };
      }
    }

    const model = new TestModel({ id: 1, firsName: 'Test', secondName: 'user' });
    expect(model.id).toBe(1);
    expect(model.fullName).toBe('Test user');
    expect(model.uuid).toBe('--- 1');
  });

  it('Error Handler', async () => {
    class TestModel extends Model {}
    const model = new TestModel();
    try {
      await model.save();
    } catch (e) {
      expect(e.message).toBe('Save api method not configure');
    }
  });

  it('Save', async () => {
    class TestModel extends Model {
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

    const model = new TestModel({
      name: 'Test',
      id: 1
    });
    expect(await model.save()).toBe(true);

  });

});
