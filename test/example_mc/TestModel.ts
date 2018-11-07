import {Model} from '../../src/modules/Model';

export class TestModel extends Model{
  public name: any;
  public id: any;

  defaults(){
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
