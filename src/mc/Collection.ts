/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { Base } from './Base';
import { ICollectionApiProvider, TObject } from '../types';
import Vue from 'vue';
import { Model } from './Model';
import TypeHelper from '@zidadindimon/js-typehelper';
import Timeout = NodeJS.Timeout;
import { ExceptionHandler } from './Handler';

export class Collection<M, T,  F = TObject> extends Base<string, ICollectionApiProvider<T, F>> {
  protected _timerId: Timeout;
  protected _updateInterval: number = null;
  protected _models: M[] = [];
  protected _pages: number = 0;
  protected _total: number = 0;
  private _filterOpt: F = null;

  selected: M = null;

  [Symbol.iterator](): IterableIterator<M> {
    return this._models[Symbol.iterator]();
  }

  get length() {
    return this._models.length;
  }

  get errors(): string {
    return this._error;
  }

  get pages(): number {
    return this._pages;
  }

  get total(): number {
    return this._total;
  }

  get filterOpt(): F {
    return this._filterOpt;
  }

  clear(): this {
    Vue.set(this, 'models', []);
    return this;
  }

  private addItem(item: TObject | M) {
    this._models.push(this.initModel(item));
    return this;
  }

  add(items: Array<TObject | M> | TObject | M): this {
    if (!Array.isArray(items)) items = [items];
    (items as Array<TObject | M>).forEach(this.addItem.bind(this));
    return this;
  }

  replace(items: Array<TObject | M> | TObject | M): this {
    return this.clear().add(items);
  }

  protected model(item?: TObject | M): { new(): M } {
    return null;
  }

  protected onModelInit(model: M): this {
    return this
  }

  protected initModel(item: TObject | M): M {
    const modelClass: { new(): M } = this.model(item);
    if (item as M instanceof Model || !modelClass) {
      return item as M;
    }
    const model: M = new modelClass();
    (model as any).init(item, false);
    this.onModelInit(model as M)
    return model;
  }

  getItems(): M[] {
    return this._models;
  }

  get(index: number) : M {
    return this._models[index]
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
    return {} as F;
  }

  protected setFilterOpt(filterOpt: F) {
    Vue.set(
      this,
      '_filterOpt',
      {
        ...this.defFilterOpt(),
        ...this._filterOpt,
        ...filterOpt
      },
    );
    return this;
  }

  destruct(): void {
    clearInterval(this._timerId);
    this.clear();
  }

  protected beforeFetch() {}

  protected afterFetch() {}

  @ExceptionHandler()
  protected async fetchList(): Promise<this> {
    const method = this.getApiProvideMethod('fetch');

    this.beforeFetch();
    const { content, pages, size, total } = await method.call(this, this._filterOpt);
    this._pages = pages;
    this._total = total || pages * (size || (this._filterOpt as any).size);
    this.replace(content);
    this.afterFetch();
    return this;
  }

  fetch(filters?: F): Promise<this> {
    this.setFilterOpt(filters);
    clearInterval(this._timerId);
    if (process.env.VUE_ENV === 'client' && this._updateInterval) {
      this._timerId = setInterval(this.fetchList.bind(this), this._updateInterval);
    }
    return this.fetchList();
  }

  protected onError(exception: Error) {
    this._error = exception.message;
    super.onError(exception);
  }
}
