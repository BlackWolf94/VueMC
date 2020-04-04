/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { ErrorHandler } from './ErrorHandler';
import { IModel, TApiConf, TMutations, TObject, TRule, TRules } from '@/types';
import { TModelError } from '@/types/IException';

export class Model<D = TObject> implements IModel<D> {

  static async fetch<T extends Model>(...params: any[]): Promise<T> {
    const model: T = (new this) as T;
    return await model.fetch(params);
  }

  private _loading: boolean;
  private _isNew: boolean = true;
  private _attrsErrors: TObject<string> = {};
  private _error: string = null;

  rules(): TRules<Model> {
    return {};
  };

  init(data?: D, isNew: boolean = true) {
    this.set(data);
    this._isNew = isNew;
    this.onInit();
    return this;
  }

  protected onInit() {
  }

  api(): TApiConf {
    return {
      fetch(): any {
        throw new Error(`${this.constructor.name}:  fetch api not configure`);
      },
      save(): any {
        throw new Error(`${this.constructor.name}: Save api method not configure`);
      },
      update(): any {
        throw new Error(`${this.constructor.name}: Update api method not configure`);
      },
      delete(): any {
        throw new Error(`${this.constructor.name}: Delete api method not configure`);
      },
    };
  }

  private default(): Partial<this> {
    const defaults: Partial<this> = {};
    const descriptors = Object.getOwnPropertyDescriptors(this);
    Object.keys(descriptors)
      .forEach((descriptor) => {
        const property = descriptors[descriptor];
        defaults[descriptor] = property.value;
      });
    return defaults;
  }

  protected set(data: any = {}): this {
    const properties = { ...this.default(), ...data || {} };
    Object.keys(properties)
      .forEach((key) => {
        Vue.set(this, key, properties[key]);
      });

    const mutations = this.mutations(data);

    Object.keys(mutations)
      .forEach((key: string) => {
        Vue.set(this, key, this.mutation(key, mutations[key]));
      });

    return this;
  }

  protected mutations(data: D): TMutations<Model> {
    return {};
  }

  protected mutateBeforeSave(): TObject | null {
    return null;
  }

  protected before() {
    this._loading = true;
    this._error = null;
  }

  protected after() {
    this._loading = false;
    this._error = null;
  }

  @ErrorHandler()
  async fetch(...filters: any[]) {
    this.init(await this.api().fetch(filters), false);
    return this;
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
    this._isNew = false;
    return true;
  }

  protected onDelete(data: any): void {
  }

  protected onSave(data: any): void {
  }

  protected onError(exception: Error | any) {
    this._loading = false;
    this._error = exception.message;
    throw exception;
  }

  protected prepareForSave(): TObject {
    const mutations = this.mutateBeforeSave();
    if (!mutations) {
      return Object.values(this);
    }

    const data: TObject = {};
    Object.keys(mutations)
      .forEach((key: string) => {
        data[key] = this.mutation(key, mutations[key]);
      });
    return data;
  }

  private mutation(key: string, mutation: any): any {
    return TypeHelper.isFunction(mutation) ? mutation.call(this, this[key]) : mutation;
  }

  get hasError(): boolean {
    return !!Object.keys(this._attrsErrors).length || !!this._error;
  }

  resetValidation() {
    Vue.set(this, '_attrsErrors', null);
    this._error = null;
    return this;
  }

  validate(): boolean {
    const attrsErrors: { [key in keyof this]?: string } = {};
    const attrsRules = this.rules();

    Object.keys(attrsRules)
      .forEach(key => {
        const rules: TRule<keyof this>[] = attrsRules[key];
        const errors: string[] = rules.map<true | string>(rule => rule.call(this, this[key]))
          .filter(error => TypeHelper.isString(error)) as string[];
        errors.length && (attrsErrors[key] = errors.shift());
      });

    Vue.set(this, '_attrsErrors', attrsErrors);
    return this.hasError;
  }

  get errors(): TModelError {
    return {
      model: this._error,
      attrs: this._attrsErrors,
    };
  }

  get loading() {
    return this._loading;
  }
}
