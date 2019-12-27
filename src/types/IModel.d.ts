/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TApiConf } from './TApiConf';

export type TMutation<T> = (value?: any) => T;

export type TMutations<T> = {
  [P in keyof T]?: T[P] | TMutation<T[P]>;
};

export type TObject<T = any> = {
  [key: string]: T;
};

export type TRule<T> = (val: T) => boolean | string;

export type TRules<T = IModel> = {
  [P in keyof T]?: TRule<T[P]>[];
};

export interface IModel {
  readonly rules: TRules<IModel>;
  mutateBeforeSave(): TMutations<TObject> | null;
  api(): TApiConf;
  set(data?: TObject): this;
  default(): Partial<IModel>;
  mutations(): TMutations<IModel>;

  save(): Promise<boolean>;
  delete(): Promise<boolean>;

  onSave(data: any): void;
  onCreate(data: any): void;
  hasErrors(): boolean;
  readonly errors: TObject<string[]>;
}
