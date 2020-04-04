/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TModelError } from '@/types/IException';

export type TMutation<T> = (value?: T) => T;

export type TMutations<T> = {
  [P in keyof T]?: TMutation<T[P]> | T[P];
};

export type TObject<T = any> = {
  [key: string]: T;
};

export type TRule<T> = (val: T) => boolean | string;

export type TRules<T = IModel> = {
  [P in keyof T]?: TRule<T[P]>[];
};

export interface IBase {

  readonly loading: boolean;
  readonly hasError: boolean;


  // hasErrors(): boolean;
  // readonly errors: TObject<string[]>;
}

export interface IModel<D = TObject> extends IBase {

  readonly errors: TModelError;

  init(data?: D, isNew?: boolean): this;

  resetValidation(): this;
  validate(): boolean;

  fetch(...params: any[]): Promise<this>
  save(): Promise<boolean>;
  delete(): Promise<boolean>;
  rules(): TRules<any>;
}
