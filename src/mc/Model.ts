/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import { IModelD, TMutations, TObject } from '../types/IModel';
import { TApiConf } from '../types/TApiConf';
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { ErrorHandler } from './ErrorHandler';

export class Model implements IModelD {
  static async factoryFetch<T extends Model>(modelClass: typeof Model, filter?: any): Promise<T> {
    return new modelClass(await modelClass.fetchApi(filter)) as T;
  }

  protected static fetchApi(filter: any): Promise<TObject> {
    throw new Error(`${this.name} fetchApi not configure`);
  }

  error: any;
  constructor(data: TObject = {}) {
    this.set(data);
  }

  api(): TApiConf {
    return {
      save(): any {
        throw new Error('Save api method not configure');
      },
      update(): any {
        throw new Error('Update api method not configure');
      },
      delete(): any {
        throw new Error('Delete api method not configure');
      },
      create(): any {
        throw new Error('Create api method not configure');
      },
    };
  }

  default(): Partial<Model> {
    return {};
  }

  set(data?: TObject): this {
    if (data) {
      data = { ...this.default(), ...data };
      Object.keys(data).forEach(key => Vue.set(this, key, data[key]));
    }

    const mutations = this.mutations();

    // @ts-ignore
    const mutate = (key: string) => Vue.set(this, key, this.mutation(key, mutations[key]));
    Object.keys(mutations).forEach(mutate);
    return this;
  }

  mutations(): TMutations<IModelD> {
    return {};
  }

  mutateBeforeSave(): TObject | null {
    return null;
  }

  @ErrorHandler()
  async create(): Promise<boolean> {
    this.onCreate(await this.api().create(this.prepareForSave()));
    return true;
  }

  @ErrorHandler()
  async delete(): Promise<boolean> {
    this.onDelete(await this.api().delete());
    return true;
  }

  @ErrorHandler()
  async save(): Promise<boolean> {
    this.onSave(await this.api().save(this.prepareForSave()));
    return true;
  }

  @ErrorHandler()
  async update(): Promise<boolean> {
    this.onSave(await this.api().update(this.prepareForSave()));
    return true;
  }

  onCreate(data: any): void {}

  onDelete(data: any): void {}

  onSave(data: any): void {}

  onUpdate(data: any): void {}

  protected prepareForSave(): TObject {
    const mutations = this.mutateBeforeSave();
    if (!mutations) {
      return Object.values(this);
    }

    const data: TObject = {};
    const mutate = (key: string) => (data[key] = this.mutation(key, mutations[key]));
    Object.keys(mutations).forEach(mutate);
    return data;
  }

  private mutation(key: string, mutation: any): any {
    return TypeHelper.isFunction(mutation) ? mutation.call(this, this[key]) : mutation;
  }
}
