/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TApiConf } from './TApiConf';

export type TMutation = (value: any) => any | Object | Array<any> | string | number | null;

export type TMutations<T> = {
  [P in keyof T]?: TMutation;
}

export type TObject = {
  [key: string]: any
}



export interface IModel {
  mutations(): TMutations<IModel>;
  mutateBeforeSave(): TMutations<TObject> | null;
  prepareForSave(): TMutations<TObject>;
  api(): TApiConf;
  fetchData(data?: TObject): this;

  save(): Promise<boolean>
  update(): Promise<boolean>
  delete(): Promise<boolean>
  create(): Promise<boolean>

  onSave(data: any): void;
  onCreate(data: any): void;
  onUpdate(data: any): void;
  onDelete(data: any): void;
}
