/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { ErrorHandler } from './ErrorHandler';
import { IModel, TMutations, TObject, TRule, TRules } from '@declaration/IModel';
import { TApiConf } from '@declaration/TApiConf';

export class Model implements IModel {
  static async factoryFetch<T extends Model>(modelClass: typeof Model, filter?: any): Promise<T> {
    return new modelClass(await modelClass.fetchApi(filter), false) as T;
  }

  protected static fetchApi(filter: any): Promise<TObject> {
    throw new Error(`${this.name} fetchApi not configure`);
  }

  constructor(data: TObject = {}, private _isNew: boolean = true) {
    this.set(data);
  }

  private _cacheErrors: TObject<TObject<string[]>> = {};
  private _hasError: boolean;

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
    };
  }

  // @ts-ignore
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

  // @ts-ignore
  mutations(): TMutations<Model> {
    return {};
  }

  mutateBeforeSave(): TObject | null {
    return null;
  }

  @ErrorHandler()
  async delete(): Promise<boolean> {
    this.onDelete(await this.api().delete());
    return true;
  }

  @ErrorHandler()
  async save(): Promise<boolean> {
    const method = this._isNew ? 'save' : 'update';
    this.onSave(await this.api()[method](this.prepareForSave()));
    this._isNew = true;
    return true;
  }

  onDelete(data: any): void {}

  onSave(data: any): void {}

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

  get errors(): TObject<string[]> {
    const key = JSON.stringify(this);
    if (this._cacheErrors[key] !== undefined) {
      return this._cacheErrors[key];
    }
    this._cacheErrors = {};

    const errors: TObject<string[]> = {};

    this._hasError = false;

    Object.keys(this.rules).forEach(key => {
      const rules: TRule<any>[] = this.rules[key];
      errors[key] = rules.map(rule => rule.call(this, this[key])).filter(error => TypeHelper.isString(error));

      this._hasError = this._hasError || !!errors[key].length;

      if (!errors[key].length) {
        delete errors[key];
      }
    });
    this._cacheErrors[key] = errors;
    return errors;
  }

  hasErrors(): boolean {
    return this.errors && this._hasError;
  }

  // @ts-ignore
  readonly rules: TRules<Model> = {};
}
