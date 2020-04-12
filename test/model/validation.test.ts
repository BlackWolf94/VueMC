/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */



import { TaskModel } from '../_mc/Task.model';
import { ValidateException } from '../../src';

describe('Model: validation', function() {

  it('should be validation error', function() {
    const model = new TaskModel();

    model.description = 'Description';

    expect<boolean>(model.validate()).toBeFalsy();
    expect(JSON.stringify(model.errors.attrs))
      .toBe(JSON.stringify({
        title: 'Title can`t be empty',
        description: 'Description must be more 15 symbols',
      }));
  });

  it('should be validation success', function() {
    const model = new TaskModel();
    model.title = 'Test task title';
    model.description = 'Todo description';

    expect<boolean>(model.validate()).toBeTruthy();
  });

  it('should be throw Validate exception', async function() {
    const model = new TaskModel();
    try {
      await model.save();
    } catch (e) {
      expect<boolean>(model.hasError).toBeTruthy();
      expect(e).toBeInstanceOf(ValidateException);
    }
  });

  it('should be save success', async function() {
    const model = new TaskModel();
    model.title = 'Test task title';
    model.description = 'Todo description';
    expect<boolean>(await model.save()).toBeTruthy();
  });
});
