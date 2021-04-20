/* eslint-disable no-underscore-dangle,@typescript-eslint/no-unused-vars */
// noinspection JSUnusedGlobalSymbols

/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { Base } from './Base';
import { AnyRecord, CollectionApiProvider } from './types';
import { Model } from './Model';
import { UseHook } from './decorators';
import { updateObjState } from './helper';

export class Collection<M, T, F = AnyRecord, D = AnyRecord> extends Base<string, CollectionApiProvider<T, F, D>> {
  selected: M = null;

  protected models: M[] = [];

  protected pages = 0;

  protected count = 0;

  protected options: F = null;

  get totalPages(): number {
    return this.pages;
  }

  get totalCount(): number {
    return this.count;
  }

  readonly filterOptions: Readonly<F> = null;

  get length(): number {
    return this.models.length;
  }

  [Symbol.iterator](): IterableIterator<M> {
    return this.models[Symbol.iterator]();
  }

  clear(): this {
    this.models = [];
    return this;
  }

  add(items: Array<T | M> | T | M): this {
    (Array.isArray(items) ? items : [items]).forEach(this.addItem.bind(this));
    return this;
  }

  replace(items: Array<T | M> | T | M): this {
    return this.clear().add(items);
  }

  getItems(): M[] {
    return this.models;
  }

  get(index: number): M {
    return this.models[index];
  }

  first(): M {
    return this.models.length ? this.models[0] : null;
  }

  last(): M {
    const { length } = this.models;
    return length ? this.models[length - 1] : null;
  }

  remove(el: Array<number | M> | number | M): this {
    const arr = Array.isArray(el) ? el : [el];
    arr.forEach(this.removeItem.bind(this));
    return this;
  }

  select(index: number): this {
    this.selected = this.models[index] || null;
    return this;
  }

  destruct(): void {
    this.clear();
  }

  fetch(filters?: Partial<F>): Promise<void> {
    this.updateFilterOptions(filters);
    return this.fetchList();
  }

  protected model(item?: T | M): { new (): M } {
    return null;
  }

  protected onModelInit(model: M): this {
    return this;
  }

  protected initModel(item: T | M): M {
    const modelClass: { new (): M } = this.model(item);
    if ((item as M) instanceof Model || !modelClass) {
      return item as M;
    }
    // eslint-disable-next-line new-cap
    const model: M = new modelClass();
    (model as any).init(item, false);
    this.onModelInit(model as M);
    return model;
  }

  protected removeItem(el: number | M): this {
    const index: number = TypeHelper.isNumber(el) ? (el as number) : this.models.findIndex((model) => model === el);
    this.models.splice(index, 1);
    return this.replace(this.models);
  }

  protected defaultFilterOptions(): F {
    return {} as F;
  }

  protected updateFilterOptions(filterOpt: Partial<F>): this {
    updateObjState(this, 'filterOptions', {
      ...this.defaultFilterOptions(),
      ...this.filterOptions,
      ...filterOpt,
    });
    return this;
  }

  protected beforeFetch(): void | Promise<void> {}

  protected onFetch(): void | Promise<void> {}

  protected init(data: D): this {
    if (!TypeHelper.isObject(data)) {
      return this;
    }
    const descriptors = Object.getOwnPropertyDescriptors(this);

    Object.keys(descriptors)
      .filter((descriptor) => !descriptor.match(/^_.*$/gm))
      .forEach((descriptor) => {
        Vue.set<this>(this, descriptor, data[descriptor] || this[descriptor]);
      });
    return this;
  }

  @UseHook<Collection<any, any>>({
    before: ['toggleLoading', 'clearErrors', 'beforeFetch'],
    after: ['toggleLoading', 'onFetch'],
  })
  protected async fetchList(): Promise<void> {
    const method = this.getApiProvideMethod('fetch');
    const { content, pages, size, total, data } = await method.call(this, this.filterOptions);
    this.pages = pages;
    this.count = total || pages * (size || (this.options as any).size);
    this.init(data);
    this.replace(content);
  }

  protected onError(exception: Error): void {
    this.toggleLoading(false);
    updateObjState(this, 'errors', exception.message);
    super.onError(exception);
  }

  private addItem(item: T | M) {
    this.models.push(this.initModel(item));
    return this;
  }
}
