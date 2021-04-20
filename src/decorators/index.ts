/* eslint-disable @typescript-eslint/naming-convention,func-names,no-param-reassign,@typescript-eslint/no-this-alias,@typescript-eslint/explicit-module-boundary-types */
/**
 * @author Dimitry Zataidukh
 * @created_at 11/25/19
 */

import { CbFunction, Hook } from '../types';

const pipe = async function (this: any, callbacks: CbFunction[]): Promise<void> {
  if (!callbacks) return;
  callbacks = Array.isArray(callbacks) ? callbacks : [callbacks];
  const self = this;
  await callbacks.reduce<any>(async (res, callback) => callback.apply(self, [await res]), null);
};

export function UseHook<T>({ before, after, onError = 'onError' }: Hook<T, any> = {}) {
  return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any => {
    const originMethod = descriptor.value;

    descriptor.value = async function (this: T, ...arg: any[]): Promise<any> {
      try {
        await pipe.apply(this, [before.map((fn) => this[fn])]);
        await originMethod.apply(this, arg);
        await pipe.apply(this, [after.map((fn) => this[fn])]);
      } catch (exception) {
        this[onError].apply(this, [exception]);
      }
    };
    return descriptor;
  };
}
