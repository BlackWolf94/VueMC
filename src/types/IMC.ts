/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/11/20
 */

export type TFetchResp<M, D = TObject> = {
  content: M[];
  pages: number;
  page?: number;
  size?: number;
  total?: number;
  data?: D;
};

export interface ICollectionApiProvider<T, F, D = TObject> {
  fetch(filter?: F): Promise<TFetchResp<T, D>>;
}

export interface IBase<A> {
  readonly loading: boolean;
  readonly hasError: boolean;
  readonly errors: any;

  useApi(apiProvider: Partial<A>): this;
}

export type TMutation<T> = (value?: T) => T;

export type TMutations<T> = {
  [P in keyof T]?: TMutation<T[P]> | T[P];
};

export type TObject<T = any> = {
  [key: string]: T;
};

export type TRule<T> = (val: T) => boolean | string;

export type TRules<T> = {
  [P in keyof T]?: TRule<T[P]>[];
};

export interface IModelApiProvider<PD = TObject, FD = TObject, FO = TObject, DO = TObject> {
  fetch?(data?: FO): Promise<FD>;
  save?(data?: PD): Promise<any>;
  update?(data?: PD): Promise<any>;
  delete?(data?: DO): Promise<any>;
}
