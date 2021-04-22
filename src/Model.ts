/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types */
/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/25/19
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { AnyRecord, ModelApiProvider, ModelErrors, MutationList, RuleItem, RuleList } from './types';
import { Base } from './Base';
import { BadConfigException, ValidateException } from './exceptions';
import { UseHook } from './decorators';
import { updateObjState, validateForm } from './helper';

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

  protected validationBeforeSave = true;

  readonly saving: boolean = false;

  readonly deleting: boolean = false;

  constructor() {
    super();
    this.set({});
  }

  get hasError(): boolean {
    return !!Object.keys(this.errors.attrs).length || !!this.errors.model;
  }

  readonly errors: ModelErrors<this> = { model: null, attrs: null };

  get isNew(): boolean {
    return this.isNewForm;
  }

  protected get deleteOptions(): DO {
    throw new BadConfigException(this.constructor.name, 'deleteOptions');
  }

  static async fetch<T extends Model, F = Record<string, any>>(params?: F, isNew = false): Promise<T> {
    const model: T = new this() as T;
    await model.fetch(params, isNew);
    return model;
  }

  rules(): RuleList<any> {
    return {};
  }

  init(data?: D, isNew = true): this {
    this.set(data);
    this.isNewForm = isNew;
    this.onInit();
    return this;
  }

  protected clearErrors() {
    this.updateErrors({ model: null, attrs: null });
  }

  protected updateErrors(data: Partial<ModelErrors<this>>) {
    updateObjState(this, 'errors', {
      ...this.errors,
      ...data,
    } as ModelErrors<this>);
  }

  validate(): boolean {
    this.clearErrors();
    this.updateErrors({ attrs: validateForm(this, this.rules()) });
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
    before: ['toggleDeleting', 'clearErrors', 'beforeDelete'],
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

  protected mutations(data: D): MutationList<any> {
    return {};
  }

  protected set(data: AnyRecord = {}): this {
    const defaults = this.default();
    const properties = { ...defaults, ...(data || {}) };
    Object.keys(defaults).forEach((key) => {
      updateObjState(this, key as any, properties[key]);
    });

    const mutations = this.mutations(data as any);

    Object.keys(mutations).forEach((key: string) => {
      updateObjState(this, key as any, this.mutation(key, mutations[key]));
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
      this.updateErrors({ model: exception.message });
    }
    super.onError(exception);
  }

  protected toggleSaving(saving?: boolean): this {
    updateObjState(this, 'saving', saving === null ? !this.saving : saving);
    return this;
  }

  protected toggleDeleting(deleting?: boolean): this {
    updateObjState(this, 'deleting', deleting === null ? !this.loading : deleting);
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
