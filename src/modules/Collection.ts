import { BaseCollection } from './BaseCollection';
import { Model } from './Model';
import { Item, send } from './Interfaces';
import Vue from 'vue';
import merge from 'deepmerge';
import TypeHelper from '@zidadindimon/js-typehelper';

export class Collection<M extends Model> extends BaseCollection<Model> {
  protected $timer_id: any;
  protected $filters: any;
  protected $pages;


  constructor(models: Array<Item> | Item = [], filters: object = {}) {
    super(models);
    this.updateFilters(filters);
  }

  get defaultFilter() {
    return {
      pager: {
        size: 25,
        page: 0,
      },
    };
  }

  get totalItems() {
    if (this.$filters) {
      return this.pages * this.$filters.pager.size;
    }
    return this.pages * this.defaultFilter.pager.size;
  }

  get pages() {
    return this.$pages;
  }

  get updateInterval() {
    return 0;
  }

  protected updateFilters = (filters: object = {}) => {
    let _filters = merge(this.defaultFilter, this.$filters || {});
    if (!TypeHelper.isEmpty(filters)) {
      _filters = merge(_filters, filters);
    }
    Vue.set(this, '$filters', _filters);
  };

  get updateMethod(): send {
    throw new Error('Implement this method');
  }

  destruct() {
    clearInterval(this.$timer_id);
    this.clear();
  }

  update(filters = {}): Promise<Collection<M>> {
    this.toggleLoading(true);
    this.updateFilters(filters);

    const update = async () => {
      const { content, pages } = await this.updateMethod(this.$filters);
      this.$pages = pages;
      this.replace(content);
      return this;
    };

    clearInterval(this.$timer_id);
    if (this.updateInterval) {
      this.$timer_id = setInterval(update, this.updateInterval);
    }

    return update();
  }

  pagination(page: number) {
    return this.update(merge(this.$filters, { pager: { page: page } }));
  }

  static instant(filters = {}) {
    return new this().update(filters);
  }
}
