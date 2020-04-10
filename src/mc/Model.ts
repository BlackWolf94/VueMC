/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { ErrorHandler } from './Handler';
import { IModel, TApiConf, TModelError, TMutations, TObject, TRule, TRules } from '../types';
import { ConfigureApiException, ValidateException } from './Exception';

export class Model<Initial = TObject, S = any, U = S> implements IModel<Initial> {

  static async fetch<T extends Model>(...params: any[]): Promise<T> {
    const model: T = (new this) as T;
    return await model.fetch(params);
  }

  private _loading: boolean = false;
  private _isNew: boolean = true;
  private _attrsErrors: TObject<string> = {};
  private _error: string = null;
  protected validationBeforeSave: boolean = true;

  constructor() {
    this.set({});
  }

  rules(): TRules<Model> {
    return {};
  };

  init(data?: Initial, isNew: boolean = true) {
    this.set(data);
    this._isNew = isNew;
    this.onInit();
    return this;
  }

  protected onInit() {
  }

  api(): Partial<TApiConf<Initial, S, U>> {
    return {};
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

  protected mutations(data: Initial): TMutations<Model> {
    return {};
  }

  protected mutateBeforeSave(): TMutations<any> {
    return {};
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
    if (!this.api().fetch) {
      throw new ConfigureApiException(this.constructor.name, 'fetch');
    }

    this.init(await this.api().fetch(filters), false);
    return this;
  }

  @ErrorHandler()
  async delete(): Promise<boolean> {
    if (!this.api().delete) {
      throw new ConfigureApiException(this.constructor.name, 'delete');
    }

    this.onDelete(await this.api().delete());
    return true;
  }

  @ErrorHandler()
  async save(): Promise<boolean> {
    const methodName = this.isNew ? 'save' : 'update';
    const method = this.api()[methodName];

    if (!method) {
      throw new ConfigureApiException(this.constructor.name, methodName);
    }

    if (this.validationBeforeSave && !this.validate()) {
      throw new ValidateException();
    }

    this.onSave(await method.call(this, this.prepareForSave()));
    this._isNew = false;
    return true;
  }

  protected onDelete(data: any): void {
  }

  protected onSave(data: any): void {
  }

  protected onError(exception: Error) {
    this._loading = false;

    if (!(exception instanceof ValidateException)) {
      this._error = exception.message;
    }

    throw exception;
  }

  protected prepareForSave(): S | U {
    const mutations = this.mutateBeforeSave();
    const data: TObject = {};

    Object.keys(mutations)
      .forEach((key: string) => {
        data[key] = this.mutation(key, mutations[key]);
      });

    return (TypeHelper.isEmpty(mutations) ? Object.values(this) : data) as S | U;
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

        for (const rule of rules) {
          const error = rule.call(this, this[key]);

          if (TypeHelper.isString(error)) {
            attrsErrors[key] = error;
            break;
          }
        }
      });

    Vue.set(this, '_attrsErrors', attrsErrors);
    return !this.hasError;
  }

  get errors(): TModelError {
    return {
      model: this._error,
      attrs: this._attrsErrors,
    };
  }

  get loading(): boolean {
    return this._loading;
  }

  get isNew(): boolean {
    return this._isNew;
  }
}
