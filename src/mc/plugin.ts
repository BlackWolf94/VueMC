import Vue, { PluginObject } from 'vue';
import { Collection } from './Collection';
import { TObject } from '@/types';
import { Model } from './Model';

/**
 * @author D
 * @email user@mail.com
 * @created_at 18.12.19
 */

type TMCSSRContext = {
  collections: {
    [key: string]: Collection<any>;
  };
  models: {
    [key: string]: TObject;
  };
};

export const ssrMCPlugin: PluginObject<any> = {
  install() {
    //@TODO FIXED
    const state: WeakMap<Vue, TMCSSRContext> = new WeakMap<Vue, TMCSSRContext>();
    // Vue.prototype.$mcServerSSR = function() {
    //   const localState: TMCSSRContext = { collections: {}, models: {} };
    //   state.set(this, localState);
    //   const add = Collection.prototype.add;
    //   Collection.prototype.add = function(...args: any) {
    //     add.apply(this, args);
    //     // @ts-ignore
    //     localState.collections[this.ssrKey()] = this;
    //     return this;
    //   };
    //
    //   // // @ts-ignore
    //   // Model.fetch = async function(...params: any[]) {
    //   //   const key = `${this.name}:${JSON.stringify(params)}`;
    //   //   // @ts-ignore
    //   //   localState.models[key] = await modelClass.fetchApi(params);
    //   //   return new modelClass(localState.models[key]);
    //   // };
    // };
    //
    // Vue.prototype.$mcClientSSR = function(key: string) {
    //   const localState: TMCSSRContext = (window as any)[key];
    //
    //   // @ts-ignore
    //   const srrInit = Collection.prototype.srrInit;
    //
    //   // @ts-ignore
    //   Collection.prototype.srrInit = async function() {
    //     // @ts-ignore
    //     const data = localState.collections[this.ssrKey()];
    //     if (!data) {
    //       srrInit.apply(this);
    //       Collection.prototype.srrInit = srrInit;
    //       return;
    //     }
    //
    //     this.setFilters((data as any).filters);
    //     this.pages = (data as any).pages;
    //     this.add((data as any).models);
    //     // @ts-ignore
    //     clearInterval(this.timerId);
    //     // @ts-ignore
    //     if (this.updateInterval()) {
    //       // @ts-ignore
    //       this.timerId = setInterval(this.fetchList.bind(this), this.updateInterval());
    //     }
    //     // @ts-ignore
    //     Collection.prototype.srrInit = srrInit;
    //     // @ts-ignore
    //     delete localState.collections[this.ssrKey()];
    //     return this;
    //   };
    //
    //   const factoryFetch = Model.factoryFetch;
    //
    //   // @ts-ignore
    //   Model.factoryFetch = async function(modelClass: typeof Model, filters: any) {
    //     const key = `${modelClass.name}:${JSON.stringify(filters)}`;
    //     const data = localState.models[key];
    //     if (!data) {
    //       return factoryFetch.apply(this, [modelClass, filters]);
    //     }
    //
    //     delete localState.models[key];
    //     return new modelClass(data);
    //   };
    // };
    //
    // Vue.prototype.$mcServerSSRContext = function(): string {
    //   const context = JSON.stringify(state.get(this));
    //   state.delete(this);
    //   return context;
    // };
  },
};
