/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { ModelApiProvider, ModelErrors, MutationList, RuleItem, RuleList } from '../types';
import { ConfigureApiException, ValidateException } from './Exception';
import { AbstractObject } from './AbstractObject';
import { HooksBehaviour } from './Handler';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Model {
}

export class AbstractModel<InitialData = Record<string, any> | any,
    SaveData = any,
    FetchOption = Record<string, any> | any,
    DO = Record<string, any> | any> extends AbstractObject<ModelErrors<AbstractModel>, ModelApiProvider<SaveData, InitialData, FetchOption, DO>>
    implements Model {
  protected isNewForm: boolean = true;
  protected dataAttrsErrors: Record<string, string> = {};
  protected validationBeforeSave: boolean = true;
  protected dataSaving: boolean = false;
  protected deletingModel: boolean = false;

  constructor() {
    super();
    this.set({});
  }

  get hasError(): boolean {
    return !!Object.keys(this.dataAttrsErrors).length || !!this.dataErrors;
  }

  get saving(): boolean {
    return this.dataSaving;
  }

  get deleting(): boolean {
    return this.deletingModel;
  }

  get errors(): ModelErrors<this> {
    return {
      model: this.dataErrors,
      attrs: this.dataAttrsErrors as Record<keyof this, string>,
    };
  }

  get isNew(): boolean {
    return this.isNewForm;
  }

  protected get deleteOptions(): DO {
    throw new ConfigureApiException(this.constructor.name, 'deleteOptions');
  }

  protected set attrsError(value: Record<string, any>) {
    Vue.set(this, 'dataAttrsErrors', value);
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow, prettier/prettier
  static async fetch<T extends AbstractModel, FetchOpt = Record<string, any>>(params?: FetchOpt, isNew: boolean = false): Promise<T> {
    const model: T = new this() as T;
    await model.fetch(params, isNew);
    return model;
  }

  rules<T extends Model>(): RuleList<T> {
    return {};
  }

  init(data?: InitialData, isNew: boolean = true): this {
    this.set(data);
    this.isNewForm = isNew;
    this.onInit();
    return this;
  }

  resetValidation(): this {
    this.attrsError = null;
    this.dataErrors = null;
    return this;
  }

  validate(): boolean {
    this.resetValidation();
    const attrsErrors: { [key in keyof this]?: string } = {};
    const attrsRules = this.rules();

    Object.keys(attrsRules).forEach(key => {
      const rules: RuleItem<keyof this>[] = attrsRules[key];

      // eslint-disable-next-line no-restricted-syntax
      for (const rule of rules) {
        const error = rule.call(this, this[key]);

        if (TypeHelper.isString(error)) {
          attrsErrors[key] = error;
          break;
        }
      }
    });
    this.attrsError = attrsErrors;

    return !this.hasError;
  }

  @HooksBehaviour({
    before: 'toggleLoading',
    after: 'toggleLoading',
  })
  async fetch(filters?: FetchOption, isNew: boolean = false): Promise<void> {
    this.dataErrors = null;
    await this.beforeFetch();
    const method = this.getApiProvideMethod('fetch');
    this.init(await method.call(this, filters), isNew);
    await this.onFetch();
  }

  @HooksBehav iour({
                     before: 'toggleDeleting',
                     after: 'toggleDeleting',
                   })

  async delete(): Promise<void> {
    this.dataErrors = null;
    await this.beforeDelete();
    const method = this.getApiProvideMethod('delete');
    this.onDelete(await method.call(this, this.deleteOptions));
  }

  @HooksBehaviour({
    before: 'toggleSaving',
    after: 'toggleSaving',
  })
  async save(): Promise<void> {
    this.dataErrors = null;
    await this.beforeSave();
    if (this.validationBeforeSave && !this.validate()) {
      throw new ValidateException();
    }
    const method = this.getApiProvideMethod(this.isNew ? 'save' : 'update');
    this.onSave(await method.call(this, this.prepareForSave()));
    this.isNewForm = false;
  }

  protected onInit(): void {
  }

  protected mutations<T extends Model>(data: InitialData): MutationList<Model> {
    return {};
  }

  protected set(data: any = {}): this {
    const defaults = this.default();
    const properties = { ...defaults, ...(data || {}) };
    Object.keys(defaults).forEach(key => {
      Vue.set(this, key, properties[key]);
    });

    const mutations = this.mutations(data);

    Object.keys(mutations).forEach((key: string) => {
      Vue.set(this, key, this.mutation(key, mutations[key]));
    });

    return this;
  }

  /* api block */

  protected mutateBeforeSave(): MutationList<SaveData> {
    return {};
  }

  protected prepareForSave(): SaveData {
    const mutations = this.mutateBeforeSave();
    const data: Record<string, any> = {};

    Object.keys(mutations).forEach((key: string) => {
      data[key] = this.mutation(key, mutations[key]);
    });

    return (TypeHelper.isEmpty(data) ? this : data) as SaveData;
  }

  protected beforeFetch(): void | Promise<void> {
  }

  protected onFetch(): void | Promise<void> {
  }

  protected beforeDelete(): void | Promise<void> {
  }

  protected beforeSave(): void | Promise<void> {
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected onDelete(data?: any): void {
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected onSave(data?: any): void {
  }

  protected onError(exception: Error): void {
    this.toggleSaving(false)
        .toggleLoading(false)
        .toggleDeleting(false);

    if (!(exception instanceof ValidateException)) {
      this.dataErrors = exception.message;
    }
    super.onError(exception);
  }

  protected toggleSaving(saving?: boolean): this {
    this.dataSaving = saving === undefined ? !this.dataSaving : saving;
    return this;
  }

  protected toggleDeleting(deleting?: boolean): this {
    this.deletingModel = deleting === undefined ? !this.dataLoading : deleting;
    return this;
  }

  private default(): Partial<this> {
    const defaults: Partial<this> = {};
    const descriptors = Object.getOwnPropertyDescriptors(this);
    Object.keys(descriptors)
        .filter(descriptor => !descriptor.match(/^_.*$/gm))
        .forEach(descriptor => {
          defaults[descriptor] = this[descriptor];
        });
    return defaults;
  }

  private mutation(key: string, mutation: any): any {
    return TypeHelper.isFunction(mutation) ? mutation.call(this, this[key]) : mutation;
  }

  /* api block end */
}
