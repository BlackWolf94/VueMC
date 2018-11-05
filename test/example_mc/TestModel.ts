import Model, { Attributes } from '../../src/modules/Model';
import { TestModelMutations } from './TestModelMutations';

export class TestModel extends Model{
  public name;
  public id;

  protected defaults(): Attributes {
    return {
      name: 'Test',
      id: null
    };
  }


}

describe("Base Model test", () => {

  it('Defaults value test', () => {
    const model = new TestModel();
    expect(model.name).toBe("Test");
    expect(model.id).toBe(null);
  });

  it('Init value test', () => {
    const model = new TestModel({ name: 'name', id: 1 });
    expect(model.name).toBe('name');
    expect(model.id).toBe(1);
  });

});