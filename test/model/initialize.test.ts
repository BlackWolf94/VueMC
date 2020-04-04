/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/3/20
 */
import { Model, TMutations } from '../../src';

type TModelInitProps = {
  id: number;
  secondName: string;
  name?: string;
}

class TestModel extends Model<TModelInitProps> {
  id: number;
  name: string = 'Test';
  secondName: string;
  uuid: string;

  protected mutations(data: TModelInitProps): TMutations<TestModel> {
    return {
      id: data.id * 100,
      uuid: () => `uuid: ${this.id}`,
    };
  }

  get fullName(): string {
    return `${this.name} ${this.secondName}`;
  }
}

describe('Model: initialize', () => {
  const model = new TestModel();
  model.init({ secondName: 'Second name', id: 5 });


  it('default value', () => {
    expect(model.name).toBe('Test');
    expect(model.secondName).toBe('Second name');
  });

  it('mutations value', () => {
    expect(model.id).toBe(500);
    expect(model.uuid).toBe('uuid: 500');
  });

  it('computed value', () => {
    expect(model.fullName).toBe('Test Second name');
  });

  it('computed: after change value', () => {
    model.name = 'Change';
    expect(model.fullName).toBe('Change Second name');
  });

});
