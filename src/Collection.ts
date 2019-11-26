import { IModel, TObject } from './types/IModel';
import { ICollection } from './types/ICollection';
import Vue from 'vue';
import { BaseModel } from './Model';

/**
 * @author Dimitry Zataidukh
 * @email zidadindimon@gmail.com
 * @created_at 11/26/19
 */
export class BaseCollection<M extends BaseModel> implements ICollection<M>{
  models: M[];
  modelsMap: Map<string | number, M> = new Map<string|number, M>();
  selected: number = null;

  clear(): this {
    this.selected = null;
    Vue.set(this, 'models', []);
    return this;
  }

  constructor(models: (M | TObject)[] | M | TObject ){
    this.clear().add(models);
  }

  active(): M {
    return undefined;
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
    (items as (TObject | M)[]).forEach( this.addItem.bind(this))

    return this;
  }

  first(): M {
    return this.models.length ? this.models[0] : null;
  }

  last(): M {
    return this.models.length ? this.models[this.models.length - 1] : null;
  }

  remove(el: (number | M)[] | number | M): this {
    return undefined;
  }

  select(index: number): M {
    return undefined;
  }

}
