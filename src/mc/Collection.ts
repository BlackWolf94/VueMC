/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { AbstractObject } from './AbstractObject';
import { CollectionApiProvider } from '../types';
import { AbstractModel } from './AbstractModel';
import { HooksBehaviour } from './Handler';

export class Collection<M, T, F = Record<string, any>, D = Record<string, any>> extends AbstractObject<string, CollectionApiProvider<T, F, D>> {
  protected _models: M[] = [];

  protected _pages: number = 0;

  protected _total: number = 0;

  private _filterOpt: F = null;

  selected: M = null;

  [Symbol.iterator](): IterableIterator<M> {
    return this._models[Symbol.iterator]();
  }

  get length(): number {
    return this._models.length;
  }

  get errors(): string {
    return this.dataErrors;
  }

  get pages(): number {
    return this._pages;
  }

  get total(): number {
    return this._total;
  }

  get filterOpt(): Readonly<F> {
    return this._filterOpt;
  }

  clear(): this {
    this._models = [];
    return this;
  }

  private addItem(item: T | M) {
    this._models.push(this.initModel(item));
    return this;
  }

  add(items: Array<T | M> | T | M): this {
    items = Array.isArray(items) ? items : [items];
    items.forEach(this.addItem.bind(this));
    return this;
  }

  replace(items: Array<T | M> | T | M): this {
    return this.clear().add(items);
  }

  protected model(item?: T | M): { new (): M } {
    return null;
  }

  protected onModelInit(model: M): this {
    return this;
  }

  protected initModel(item: T | M): M {
    const modelClass: { new (): M } = this.model(item);
    if ((item as M) instanceof AbstractModel || !modelClass) {
      return item as M;
    }
    const model: M = new modelClass();
    (model as any).init(item, false);
    this.onModelInit(model as M);
    return model;
  }

  getItems(): M[] {
    return this._models;
  }

  get(index: number): M {
    return this._models[index];
  }

  first(): M {
    return this._models.length ? this._models[0] : null;
  }

  last(): M {
    const { length } = this._models;
    return length ? this._models[length - 1] : null;
  }

  remove(el: Array<number | M> | number | M): this {
    const arr = Array.isArray(el) ? el : [el];
    arr.forEach(this.removeItem.bind(this));
    return this;
  }

  select(index: number): this {
    this.selected = this._models[index] || null;
    return this;
  }

  protected removeItem(el: number | M) {
    const index: number = TypeHelper.isNumber(el) ? (el as number) : this._models.findIndex(model => model === el);
    this._models.splice(index, 1);
    return this.replace(this._models);
  }

  protected defFilterOpt(): F {
    return {};
  }

  protected setFilterOpt(filterOpt: Partial<F>): this {
    Vue.set(this, '_filterOpt', {
      ...this.defFilterOpt(),
      ...this._filterOpt,
      ...filterOpt,
    });
    return this;
  }

  destruct(): void {
    this.clear();
  }

  protected beforeFetch(): void | Promise<void> {}

  protected afterFetch(): void | Promise<void> {}

  protected init(data: D): this {
    if (!TypeHelper.isObject(data)) {
      console.warn(`[${this.constructor.name}]: initAttributes data is not object`);
      return this;
    }
    const descriptors = Object.getOwnPropertyDescriptors(this);

    Object.keys(descriptors)
      .filter(descriptor => !descriptor.match(/^_.*$/gm))
      .forEach(descriptor => {
        Vue.set<this>(this, descriptor, data[descriptor] || this[descriptor]);
      });
    return this;
  }

  @HooksBehaviour({
    before: 'toggleLoading',
    after: 'toggleLoading',
  })
  protected async fetchList(): Promise<void> {
    this.dataErrors = null;
    await this.beforeFetch();
    const method = this.getApiProvideMethod('fetch');
    const { content, pages, size, total, data } = await method.call(this, this._filterOpt);
    this._pages = pages;
    this._total = total || pages * (size || (this._filterOpt as any).size);
    this.init(data);
    this.replace(content);
    await this.afterFetch();
  }

  fetch(filters?: Partial<F>): Promise<void> {
    this.setFilterOpt(filters);
    return this.fetchList();
  }

  protected onError(exception: Error) {
    this.toggleLoading(false);
    this.dataErrors = exception.message;
    super.onError(exception);
  }
}
