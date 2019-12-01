/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/26/19
 */

import { TObject } from './types/IModel';
import { ICollection, TCollectionFilter } from './types/ICollection';
import Vue from 'vue';
import { BaseModel } from './Model';
import TypeHelper from '@zidadindimon/js-typehelper';
import { TApiCollectionConf } from './types/TApiConf';

export class BaseCollection<M extends BaseModel, F = TObject> implements ICollection<M> {
  protected models: M[];
  protected selected: M;
  protected filters: TCollectionFilter<F>;
  protected timerId: number;
  pages: number;
  total: number;

  clear(): this {
    Vue.set(this, 'models', []);
    return this;
  }

  constructor(models: (M | TObject)[] | M | TObject = []) {
    this.clear().add(models);
  }

  active(): M {
    return this.selected;
  }

  model(item?: TObject | M): typeof BaseModel {
    return BaseModel;
  }

  get pageSize(): number {
    return this.models.length
  }

  protected initModel(item: TObject | M): M {
    if (item instanceof BaseModel) return item;
    const Model = this.model(item);
    // @ts-ignore
    return new Model(item);
  }

  private addItem(item: TObject | M) {
    this.models.push(this.initModel(item));
    return this;
  }

  replace(items: (TObject | M)[] | TObject | M): this {
    return this.clear().add(items);
  }

  add(items: (TObject | M)[] | TObject | M): this {
    if (!Array.isArray(items)) items = [items];
    (items as (TObject | M)[]).forEach(this.addItem.bind(this));
    return this;
  }

  first(): M {
    return this.models.length ? this.models[0] : null;
  }

  last(): M {
    const { length } = this.models;
    return length ? this.models[length - 1] : null;
  }

  protected removeItem(el: number | M) {
    const index: number = TypeHelper.isNumber(el) ? el as number : this.models.findIndex(model => model === el);
    this.models.splice(index, 1);
    return this;
  }

  remove(el: (number | M)[] | number | M): this {
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

  protected defFilter(): TCollectionFilter<F> {
    return {
      page: 0,
      size: 50,
    };
  }

  protected mutateFilter(filters) {
    return filters;
  }

  setFilters(filters: TObject = {}): this {
    Vue.set(this, 'filters', this.mutateFilter({
      ...this.defFilter(),
      ...this.filters || {},
      ...filters,
    }));
    return this;
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
    if (this.updateInterval()) {
      this.timerId = setInterval(this.fetchList.bind(this));
    }
    return this.fetchList();
  }

  beforeFetch() {}
  afterFetch() {}

  destruct(): void {
    clearInterval(this.timerId);
    this.clear();
  }

  [Symbol.iterator](): IterableIterator<M> {
    return this.models[Symbol.iterator]();
  }

  get length(){
    return this.models.length
  }

  get filter(): TCollectionFilter<F>{
    return this.filters;
  }
}
