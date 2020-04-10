/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { Model, TApiConf, TRules, ValidateException } from '../../src';

class Todo extends Model {
  id: number = null;
  name: string = null;
  description: string = null;
  createdAt: Date = new Date();
  done: boolean = false;

  rules(): TRules<Todo> {
    return {
      name: [
        (v) => !!v || 'Name of task is required',
        (v) => v.length < 10 || 'Max length 10 symbols',
      ],
      description: [
        (v) => !!v || 'Description can`t be empty',
        (v) => v.length > 10 || 'Min length 10 symbols',
      ],
    };
  }

  api(): Partial<TApiConf> {
    return {
      save(): Promise<any> {
        return
      }
    };
  }
}


describe('Model: validation', function() {

  it('should be validation error', function() {
    const model = new Todo();

    expect<boolean>(model.validate()).toBeFalsy();
    expect(JSON.stringify(model.errors.attrs))
      .toBe(JSON.stringify({
        name: 'Name of task is required',
        description: 'Description can`t be empty',
      }));

    model.name = 'Long long name';
    model.description = 'aaa';

    expect<boolean>(model.validate()).toBeFalsy();
    expect(JSON.stringify(model.errors.attrs))
      .toBe(JSON.stringify({
        name: 'Max length 10 symbols',
        description: 'Min length 10 symbols',
      }));
  });

  it('should be validation success', function() {
    const model = new Todo();
    model.name = 'Todo name';
    model.description = 'Todo description';

    expect<boolean>(model.validate()).toBeTruthy();
  });

  it('should be throw Validate exception', async function() {
    const model = new Todo();
    try {
      await model.save();
    } catch (e) {
      expect<boolean>(model.hasError).toBeTruthy();
      expect(e).toBeInstanceOf(ValidateException);
    }
  });

  it('should be save success', async function() {
    const model = new Todo();
    model.name = 'Todo name';
    model.description = 'Todo description';
    expect<boolean>(await model.save()).toBeTruthy();
  });
});
