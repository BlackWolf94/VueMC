/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types */
/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { AnyRecord, ModelApiProvider, ModelErrors, MutationList, RuleItem, RuleList } from '../types';
import { Base } from './Base';
import { BadConfigException, ValidateException } from './exceptions';
import { UseHook } from './decorators';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Model {}

/**
 * @description generic description
 *  D - initial data type
 *  SD - save data type
 *  FO - fetch option type
 *  DO - delete option type
 */
export class Model<D = Record<string, any>, SD = unknown, FO = Record<string, any>, DO = Record<string, any>>
  extends Base<ModelErrors<Model>, ModelApiProvider<SD, D, FO, DO>>
  implements Model {
  protected isNewForm = true;

  protected dataAttrsErrors: Record<string, string> = {};

  protected validationBeforeSave = true;

  protected dataSaving = false;

  protected deletingModel = false;

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
    throw new BadConfigException(this.constructor.name, 'deleteOptions');
  }

  protected set attrsError(value: Record<string, any>) {
    Vue.set(this, 'dataAttrsErrors' as keyof Model, value);
  }

  static async fetch<T extends Model, F = Record<string, any>>(params?: F, isNew = false): Promise<T> {
    const model: T = new this() as T;
    await model.fetch(params, isNew);
    return model;
  }

  rules<T extends Model>(): RuleList<T> {
    return {};
  }

  init(data?: D, isNew = true): this {
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

    Object.keys(attrsRules).forEach((key) => {
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

  /**
   * @example
   * ```
   *  @Component({})
   *  export default class Task {
   *    @Prop(Number) readonly id: number;

   *    model: TaskModel = new TaskModel();
   *    @Watch('id')
   *    fetch() {
   *      this.model.fetch({id})
   *    }
   *  }
   * ```
   */
  @UseHook<Model>({
    before: ['toggleLoading', 'clearErrors', 'beforeFetch'],
    after: ['toggleLoading', 'onFetch'],
  })
  async fetch(filters?: FO, isNew = false): Promise<void> {
    const method = this.getApiProvideMethod('fetch');
    this.init(await method.call(this, filters), isNew);
  }

  @UseHook<Model>({
    before: ['toggleDeleting', 'clearErrors', ' beforeDelete'],
    after: ['toggleDeleting'],
  })
  async delete(): Promise<void> {
    const method = this.getApiProvideMethod('delete');
    this.onDelete(await method.call(this, this.deleteOptions));
  }

  @UseHook<Model>({
    before: ['toggleSaving', 'clearErrors', 'beforeSave'],
    after: ['toggleSaving'],
  })
  async save(): Promise<void> {
    if (this.validationBeforeSave && !this.validate()) {
      throw new ValidateException();
    }
    const method = this.getApiProvideMethod(this.isNew ? 'save' : 'update');
    this.onSave(await method.call(this, this.prepareForSave()));
    this.isNewForm = false;
  }

  protected onInit(): void {}

  protected mutations<T extends Model>(data: D): MutationList<Model> {
    return {};
  }

  protected set(data: AnyRecord = {}): this {
    const defaults = this.default();
    const properties = { ...defaults, ...(data || {}) };
    Object.keys(defaults).forEach((key) => {
      Vue.set(this, key, properties[key]);
    });

    const mutations = this.mutations(data as any);

    Object.keys(mutations).forEach((key: string) => {
      Vue.set(this, key, this.mutation(key, mutations[key]));
    });

    return this;
  }

  protected mutateBeforeSave(): MutationList<SD> {
    return {};
  }

  protected prepareForSave(): SD {
    const mutations = this.mutateBeforeSave();
    const data: Record<string, any> = {};

    Object.keys(mutations).forEach((key: string) => {
      data[key] = this.mutation(key, mutations[key]);
    });

    return (TypeHelper.isEmpty(data) ? this : data) as SD;
  }

  protected beforeFetch(): void | Promise<void> {}

  protected onFetch(): void | Promise<void> {}

  protected beforeDelete(): void | Promise<void> {}

  protected beforeSave(): void | Promise<void> {}

  protected onDelete(data?: any): void {}

  protected onSave(data?: any): void {}

  protected onError(exception: Error): void {
    this.toggleSaving(false).toggleLoading(false).toggleDeleting(false);

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
      .filter((descriptor) => !descriptor.match(/^_.*$/gm))
      .forEach((descriptor) => {
        defaults[descriptor] = this[descriptor];
      });
    return defaults;
  }

  private mutation(key: string, mutation: any): any {
    return TypeHelper.isFunction(mutation) ? mutation.call(this, this[key]) : mutation;
  }
}
