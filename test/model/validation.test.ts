/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */

import { TaskModel } from '../../src/sample/Task.model';
import { ValidateException } from '../../src/mc/exceptions';

describe('Model: validation', () => {
  it('should be validation error', () => {
    const model = new TaskModel();

    model.description = 'Description';

    expect<boolean>(model.validate()).toBeFalsy();
    expect(JSON.stringify(model.errors.attrs)).toBe(
      JSON.stringify({
        title: 'Title can`t be empty',
        description: 'Description must be more 15 symbols',
      }),
    );
  });

  it('should be validation success', () => {
    const model = new TaskModel();
    model.title = 'Test task title';
    model.description = 'Todo description';

    expect<boolean>(model.validate()).toBeTruthy();
  });

  it('should be throw Validate exception', async () => {
    const model = new TaskModel();
    try {
      await model.save();
    } catch (e) {
      expect<boolean>(model.hasError).toBeTruthy();
      expect(e).toBeInstanceOf(ValidateException);
    }
  });

  it('should be save success', async () => {
    const model = new TaskModel();
    model.title = 'Test task title';
    model.description = 'Todo description';
    expect(model.save()).resolves.not.toThrow();
  });
});
