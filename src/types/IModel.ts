/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TApiConf } from './TApiConf';

export type TMutation<T> = (value?: any) => T;

export type TMutations<T> = {
  [P in keyof T]?: T[P] | TMutation<T[P]>;
};

export type TObject = {
  [key: string]: any;
};

export interface IModelD {
  mutations(): TMutations<IModelD>;
  mutateBeforeSave(): TMutations<TObject> | null;
  api(): TApiConf;
  set(data?: TObject): this;
  default(): Partial<IModelD>;

  save(): Promise<boolean>;
  update(): Promise<boolean>;
  delete(): Promise<boolean>;
  create(): Promise<boolean>;

  onSave(data: any): void;
  onCreate(data: any): void;
  onUpdate(data: any): void;
  onDelete(data: any): void;
}
