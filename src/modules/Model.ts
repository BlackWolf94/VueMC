import Vue from 'vue';
import { Attributes, BaseModel, Mutations } from './Interfaces';

export class Model extends BaseModel {
  protected init(attributes: Attributes = {}): void {
    attributes = (<Attributes>Object).assign(this.defaults(), attributes);
    for (let key in attributes) Vue.set(this, key, attributes[key]);
    const mutations = this.mutations();
    for (const key in mutations) Vue.set(this, key, mutations[key].call(this, attributes[key]));
  }

  constructor(attributes: Attributes = {}) {
    super(attributes);
  }

  defaults(): Attributes {
    return {};
  }

  mutations(): Mutations {
    return {};
  }
}
