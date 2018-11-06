import { TestModel } from './TestModel';

export class TestModelMutations extends TestModel {
  public fullName;

  get mutations(){
    let self = this;
    return {
      name: (name: string) => `Mutations ${name}`,
      fullName: () => `Full ${self.name}`
    }
  }
}

it('Mutations test ', () => {
  const model = new TestModelMutations();
  expect(model.name).toBe("Mutations Test");
  expect(model.fullName).toBe("Full Mutations Test");
});