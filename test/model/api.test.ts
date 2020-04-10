/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/8/20
 */

import { ConfigureApiException, Model, TMutations } from '../../src';

type TTestApiData = {
  isNew: boolean;
  data: {
    option1: string;
    option2: string;
    createdAt: string;
  };
}

type TModelInitData = {
  option1: string;
  option2: string;
  createdAt: Date;
}

const today = new Date();

class TestModel extends Model<TModelInitData, TTestApiData> {
  option1: string = 'option 1';
  option2: string = 'option 2';
  createdAt: Date = today;

  protected mutateBeforeSave(): TMutations<TTestApiData> {
    return {
      isNew: this.isNew,
      data: () => ({
        option1: this.option1,
        option2: this.option2,
        createdAt: this.createdAt.toDateString(),
      }),
    };
  }
}

describe('Model:api', () => {
  const model = new TestModel();

  it('should be save success', async function() {
    TestModel.prototype.api = function() {
      expect<boolean>(this.loading).toBe(true);
      return {
        async save(data: TTestApiData): Promise<void> {
          expect<boolean>(data.isNew).toBe(true);
          expect<string>(data.data.createdAt).toBe(today.toDateString());
        },
      };
    };

    await model.save();
    expect<boolean>(model.loading).toBe(false);
    expect<boolean>(model.isNew).toBe(false);
  });

  it('should be update success', async function() {
    TestModel.prototype.api = function() {
      expect<boolean>(this.loading).toBe(true);
      return {
        async update(data: TTestApiData): Promise<void> {
          expect<boolean>(data.isNew).toBe(false);
        },
      };
    };

    await model.save();
    expect<boolean>(model.loading).toBe(false);
    expect<boolean>(model.isNew).toBe(false);
  });

  it('should be delete success', async function() {
    TestModel.prototype.api = function() {
      expect<boolean>(this.loading).toBe(true);
      return {
        async delete(): Promise<void> {
          expect(true).toBeTruthy();
        },
      };
    };
    await model.delete();
    expect<boolean>(model.loading).toBe(false);
  });

  it('should be fetch success', async function() {
    const date = new Date();
    TestModel.prototype.api = function() {
      expect<boolean>(this.loading).toBeTruthy();
      return {
        async fetch(): Promise<TModelInitData> {
          return {
            option1: 'TestModel option 1',
            option2: 'TestModel option 2',
            createdAt: date,
          };
        },
      };
    };

    const model2 = await TestModel.fetch<TestModel>();

    expect<boolean>(model2.loading).toBeFalsy();
    expect<boolean>(model2.isNew).toBeFalsy();

    expect(model2.option1).toBe('TestModel option 1');
    expect(model2.createdAt).toBe(date);
  });

  it('should be configure exception', async function() {
    TestModel.prototype.api = function() {
      expect<boolean>(this.loading).toBeTruthy();
      return {};
    };
    const model2 = new TestModel();
    try {
      await model2.save();
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigureApiException);
      expect(model2.hasError).toBeTruthy();
      expect(JSON.stringify(model2.errors)).toBe(JSON.stringify({
        model: 'TestModel: save api method not configure',
        attrs: {},
      }));
    }
  });


});
