/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/26/19
 */

import { TObject } from '../types/IModel';
import { ICollection, TCollectionFilter } from '../types/ICollection';
import Vue from 'vue';
import { Model } from './Model';
import TypeHelper from '@zidadindimon/js-typehelper';
import { TApiCollectionConf } from '../types/TApiConf';

export class Collection<M extends Model, F = TObject> implements ICollection<M> {
  get pageSize(): number {
    return this.models.length;
  }

  get length() {
    return this.models.length;
  }

  get filter(): TCollectionFilter<F> {
    return this.filters;
  }

  pages: number;
  total: number;
  protected models: M[];
  protected selected: M;
  protected filters: TCollectionFilter<F>;
  protected timerId: any;

  constructor() {
    this.clear().srrInit();
  }

  clear(): this {
    Vue.set(this, 'models', []);
    return this;
  }

  active(): M {
    return this.selected;
  }

  replace(items: Array<TObject | M> | TObject | M): this {
    return this.clear().add(items);
  }

  add(items: Array<TObject | M> | TObject | M): this {
    if (!Array.isArray(items)) items = [items];
    (items as Array<TObject | M>).forEach(this.addItem.bind(this));
    return this;
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

  get(index: number): M {
    return this.models[index];
  }

  getItems(): M[] {
    return this.models;
  }

  setFilters(filters: TObject = {}): this {
    Vue.set(
      this,
      'filters',
      this.mutateFilter({
        ...this.defFilter(),
        ...(this.filters || {}),
        ...filters,
      }),
    );
    return this;
  }

  api(): TApiCollectionConf<M> {
    return {
      fetch() {
        throw new Error('Fetch api method not configure');
      },
    };
  }

  fetch(filters?: TCollectionFilter<F>): Promise<this> {
    this.setFilters(filters);
    clearInterval(this.timerId);
    if (process.env.VUE_ENV === 'client' && this.updateInterval()) {
      this.timerId = setInterval(this.fetchList.bind(this), this.updateInterval());
    }
    return this.fetchList();
  }

  destruct(): void {
    clearInterval(this.timerId);
    this.clear();
  }

  [Symbol.iterator](): IterableIterator<M> {
    return this.models[Symbol.iterator]();
  }

  srrInit() {
    return this;
  }

  protected ssrKey(): string {
    return this.constructor.name;
  }

  protected model(item?: TObject | M): typeof Model {
    return Model;
  }

  protected initModel(item: TObject | M): M {
    if (item instanceof Model) return item;
    const modelClass = this.model(item);
    // @ts-ignore
    return new modelClass(item);
  }

  protected removeItem(el: number | M) {
    const index: number = TypeHelper.isNumber(el) ? (el as number) : this.models.findIndex(model => model === el);
    this.models.splice(index, 1);
    return this;
  }

  protected defFilter(): TCollectionFilter<F> {
    return {
      page: 0,
      size: 50,
    };
  }

  protected mutateFilter(filters: TCollectionFilter<F>): any {
    return filters;
  }

  protected updateInterval(): number {
    return 0;
  }

  protected async fetchList(): Promise<this> {
    this.beforeFetch();
    const { content, pages, size, total } = await this.api().fetch(this.filters);
    this.pages = pages;
    this.total = total || pages * (size || (this.filters as any).size);
    this.replace(content);
    this.afterFetch();
    return this;
  }

  protected beforeFetch() {}

  protected afterFetch() {}

  private addItem(item: TObject | M) {
    this.models.push(this.initModel(item));
    return this;
  }
}
