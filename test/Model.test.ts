import Model, {Attributes} from "../src/Model";

describe("Base Model test", () => {

    it('Defaults value test', () => {
        class TestModel extends Model{
            public name: string | undefined;
            public id: null | undefined;
            protected defaults(): Attributes {
                return {
                    name: 'Test',
                    id: null
                };
            }
        }

        let model = new TestModel();
        expect(model.name).toBe("Test");
        expect(model.id).toBe(null);
    });

    it('Mutations test ', () => {
        class TestModel extends Model{
            public name: string | undefined;
            public id: null | undefined;
            public fullName: string | undefined;
            protected defaults(){
                return {
                    name: 'Test',
                    id: null
                };
            }

            protected mutations(){
                let self = this;
                return {
                    name: (name: string) => `Mutations ${name}`,
                    fullName: () => `Full ${self.name}`
                }
            }
        }

        let model = new TestModel();
        expect(model.name).toBe("Mutations Test");
        expect(model.fullName).toBe("Full Mutations Test");
    })

});
