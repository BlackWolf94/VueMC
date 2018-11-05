import Vue from 'vue';
import Model from './Model';

export interface Item extends Object {
  [key: string]: any
}

export interface TemplateModel <M extends Model> extends Array<M|Model>{}


export default class Collection <M  extends Model>{

  public models: TemplateModel<M>;
  public loading;
  private timer_id;

  constructor(models: Array<Item> | Item = [], filters: object = {}) {
    this.models = [];
    this.clear()
      .toggleLoading(false)
      .add(models)
    ;
  }

  public clear() {
    Vue.set(this, 'models', []);
    return this;
  }

  public add(items: Array<Item> | Item = []){
    this.toggleLoading(true);
    if (!(items instanceof Array))
      items = [items];

    for (let idx = 0; idx < items.length; idx++) {
      this.addOne(items[idx]);
    }
    this.toggleLoading(false);
    return this;
  }

  search (search: string = ''): TemplateModel<M> {
    return this.models.filter(
      model => JSON.stringify(model)
        .toLowerCase()
        .match(search.toLowerCase()))
  }

  protected get updateInterval() {
    return 0;
  }

  protected toggleLoading(value: boolean) {
    this.loading = value;
    return this;
  }

  protected model(item: Item | Model) {
    return Model
  }

  protected initModel(item: Item | Model): M | Model {
    if (item instanceof Model)
      return item;
    const model = this.model(item);
    return new model(item);
  }

  private addOne(item: Item | Model) {
    this.models.push(this.initModel(item));
    return this;
  }

  replace (items: Array<Item> | Item = []) {
    return this.clear().add(items)
  }
}
