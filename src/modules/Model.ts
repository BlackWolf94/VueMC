import Vue from 'vue';
import { Attributes, BaseModel, Mutations } from './Interfaces';

export class Model extends BaseModel {
  protected init(attributes: Attributes = {}): void {
    attributes = (<Attributes>Object).assign(this.defaults, attributes);
    for (let key in attributes) Vue.set(this, key, attributes[key]);
    for (const key in this.mutations) Vue.set(this, key, this.mutations[key](attributes[key]));
  }

  constructor(attributes: Attributes = {}) {
    super(attributes);
  }

  get defaults(): Attributes {
    return {};
  }

  get mutations(): Mutations {
    return {};
  }
}
