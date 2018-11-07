import Vue from 'vue';
import {Model} from './Model';
import { Finder } from 'arraysearch';
import TypeHelper from '@zidadindimon/js-typehelper';
import { BaseModel, FilterIteration, Item } from './Interfaces';

export  class BaseCollection<M extends BaseModel> {
  public models: Array<M>;
  public loading;

  constructor(models: Array<Item> | Item = []) {
    this.models = [];
    this.clear()
      .toggleLoading(false)
      .add(models);
  }

  public clear() {
    Vue.set(this, 'models', []);
    return this;
  }

  public add(items: Array<Item> | Item = []) {
    this.toggleLoading(true);
    if (!(items instanceof Array)) items = [items];

    for (let idx = 0; idx < items.length; idx++) {
      this.addOne(items[idx]);
    }
    this.toggleLoading(false);
    return this;
  }

  search(search: string = ''): Array<M> {
    return this.models.filter(model =>
      JSON.stringify(model)
        .toLowerCase()
        .match(search.toLowerCase()),
    );
  }

  protected toggleLoading(value: boolean) {
    this.loading = value;
    return this;
  }

  protected model(item: Item | Model) {
    return Model;
  }

  protected initModel(item: Item | M): M {
    if (item instanceof BaseModel) return item;
    const model = this.model(item);
    // @ts-ignore
    return new model(item);
  }

  private addOne(item: Item | Model) {
    this.models.push(this.initModel(item));
    return this;
  }

  replace(items: Array<Item> | Item = []) {
    return this.clear().add(items);
  }

  find(filter: object): M | Model {
    return Finder.one.in(this.models).with(filter);
  }

  filter(filter: FilterIteration<M> | object): Array<M> {
    if (TypeHelper.isFunction(filter)) {
      // @ts-ignore
      return this.models.filter(filter);
    }

    return Finder.all.in(this.models).with(filter);
  }

  removeItem(filter: object) {
    const item = JSON.stringify(this.find(filter));
    for (let idx = 0; idx < this.models.length; idx++) {
      if (JSON.stringify(this.models[idx]) !== item) continue;
      this.models.splice(idx, 1);
    }
    return JSON.parse(item);
  }
}
