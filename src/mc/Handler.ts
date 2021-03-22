/* eslint-disable prefer-rest-params,@typescript-eslint/explicit-module-boundary-types,no-param-reassign */
/**
 * @author Dimitry Zataidukh
 * @created_at 11/25/19
 */
import { AbstractObject } from './AbstractObject';

interface TBehaviourOption {
  before?: string;
  after?: string;
  onError?: string;
}

const pipe = async function(this: any, callbacks: Function | Function[]): Promise<void> {
  if (!callbacks) return;
  callbacks = Array.isArray(callbacks) ? callbacks : [callbacks];
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  await callbacks.reduce<any>(async (res, callback) => callback.apply(self, [await res]), null);
};

export function HooksBehaviour<T>({ before, after, onError = 'onError' }: TBehaviourOption = {}) {
                                                                                                   return (
                                                                                                     target: any,
                                                                                                     key: string,
                                                                                                     descriptor: TypedPropertyDescriptor<any>,
                                                                                                   ): any => {
                                                                                                     const originMethod = descriptor.value;

                                                                                                     // eslint-disable-next-line func-names
                                                                                                     descriptor.value = async function(
                                                                                                       this: AbstractObject<any, any>,
                                                                                                     ): Promise<any> {
                                                                                                       try {
                                                                                                         await pipe.apply(this, [this[before]]);
                                                                                                         await originMethod.apply(this, arguments);
                                                                                                         await pipe.apply(this, [this[after]]);
                                                                                                       } catch (exception) {
                                                                                                         this[onError].apply(this, [exception]);
                                                                                                       }
                                                                                                     };
                                                                                                     return descriptor;
                                                                                                   };
                                                                                                 }
