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

  it('should be init', () => {

    const emptyModel = new class extends Model {
      id: number;
      name: string = 'Test';
    };

    expect(emptyModel.id).toBeUndefined();
    expect(emptyModel.name).toBe('Test');
  });

  model.init({ secondName: 'Second name', id: 5 });

  it('should be applied default value', () => {
    expect(model.name).toBe('Test');
    expect(model.secondName).toBe('Second name');
  });

  it('should be mutations value', () => {
    expect(model.id).toBe(500);
    expect(model.uuid).toBe('uuid: 500');
    console.error(model)
  });

  it('should be computed value', () => {
    expect(model.fullName).toBe('Test Second name');
  });

  it('should be computed after change value', () => {
    model.name = 'Change';
    expect(model.fullName).toBe('Change Second name');
  });

});
