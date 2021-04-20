/* eslint-disable no-return-assign */
import Vue from 'vue';
import TypeHelper from '@zidadindimon/js-typehelper';
import { RuleItem, RuleList } from '../types';

export const updateObjState = <T, K extends keyof T>(obj: T, key: K, newVal: T[K]): T[K] => Vue.set(obj as any, key as string | number, newVal);

export const validateForm = <T, K extends keyof T>(obj: T, rules: RuleList<T>): Record<K, string> => {
  const attrsErrors: Record<K, string> = {} as any;

  const map = new Map<string, RuleItem<keyof T>[]>(Object.entries(rules));
  map.forEach((validateRules, key) => {
    validateRules.find((ruleCb) => {
      const msg = ruleCb.call(obj, obj[key]);
      return TypeHelper.isString(msg) && !!(attrsErrors[key] = msg);
    });
  });

  return attrsErrors;
};
