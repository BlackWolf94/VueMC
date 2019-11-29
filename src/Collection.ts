import { IModel, TObject } from './types/IModel';
import { ICollection, TCollectionFilter } from './types/ICollection';
import Vue from 'vue';
import { BaseModel } from './Model';
import TypeHelper from '@zidadindimon/js-typehelper';

/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/26/19
 */
export class BaseCollection<M extends BaseModel, F = TObject> implements ICollection<M>{
  protected models: M[];
  protected modelsMap: Map<string | number, M> = new Map<string|number, M>();
  protected selected: M ;
  protected filters: TCollectionFilter<F>;

  clear(): this {
    Vue.set(this, 'models', []);
    return this;
  }

  constructor(models: (M | TObject)[] | M | TObject ){
    this.clear().add(models);
  }

  active(): M {
    return this.selected;
  }

  protected model(item: TObject | M): typeof BaseModel {
    return BaseModel;
  }

  protected initModel(item: TObject | M): M {
    if (item instanceof BaseModel) return item;
    const Model = this.model(item);
    // @ts-ignore
    return new Model(item).setCollection(this);
  }

  private addItem(item: TObject | M) {
    this.models.push(this.initModel(item));
    return this;
  }

  add(items: (TObject | M)[] | TObject | M): this {
    if(!Array.isArray(items)) items = [items];
    (items as (TObject | M)[]).forEach( this.addItem.bind(this));
    return this;
  }

  first(): M {
    return this.models.length ? this.models[0] : null;
  }

  last(): M {
    const {length} = this.models;
    return length ? this.models[length - 1] : null;
  }

  protected removeItem(el: number | M) {
    const index: number = TypeHelper.isNumber(el) ? el as number : this.models.findIndex( model => model === el);
    this.models.splice(index,1);
    return this;
  }

  remove(el: (number | M)[] | number | M): this {
    const arr = Array.isArray(el) ? el : [el];
    arr.forEach(this.removeItem.bind(this));
    return this;
  }

  select(index: number): this {
    this.selected = this.models[index];
    return this;
  }

  get(index: number): M {
    return this.models[index]
  }

  protected defFilter(): TCollectionFilter<F>{
    return {
      page: 0,
      size: 50,
    }
  }

  protected mutateFilter(filters){
    return filters
  }

  setFilters(filters: TObject = {}){
    Vue.set(this, 'filters', this.mutateFilter({
      ...this.defFilter(),
      ...this.filters || {},
      ...filters}));
  }

  updateInterval(): number {
    return  0
  }
}
