/**
 * @author Dimitry Zataidukh
 * @created_at 11/25/19
 */
import { Base } from './Base';

type TBehaviourOption = {
    before?: string;
    after?: string;
    onError?: string;
}

const pipe = function(this: any, callbacks: Function | Function[]) {
    if (!callbacks) return;
    callbacks = Array.isArray(callbacks) ? callbacks : [callbacks];
    const _self = this;
    return callbacks.reduce<any>(async (res, callback) => callback.apply(_self, [await res]), null);
};

export function HooksBehaviour<T>({ before, after, onError = 'onError' }: TBehaviourOption = {}) {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any => {
        const originMethod = descriptor.value;

        descriptor.value = async function(this: Base<any, any>) {
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
