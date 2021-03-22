/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/11/20
 */

export interface CollectionFetchResponse<M, D = Record<string, any>> {
  content: M[];
  pages: number;
  page?: number;
  size?: number;
  total?: number;
  data?: D;
}

export interface CollectionApiProvider<Model, FetchData = Record<string, any>, Meta = Record<string, any>> {
  fetch(filter?: FetchData): Promise<CollectionFetchResponse<Model, Meta>>;
}

export interface IBase<A> {
  readonly loading: boolean;
  readonly hasError: boolean;
  readonly errors: any;

  useApi(apiProvider: Partial<A>): this;
}

export type Mutation<T> = (value?: T) => T;

export type MutationList<T> = {
  [P in keyof T]?: Mutation<T[P]> | T[P];
};

export type RuleItem<T> = (val: T) => boolean | string;

export type RuleList<T> = {
  [P in keyof T]?: RuleItem<T[P]>[];
};

export interface ModelApiProvider<
  PostData = Record<string, any>,
  FetchData = Record<string, any>,
  FetchOpt = Record<string, any>,
  DeleteOpt = Record<string, any>
> {
  fetch?(data?: FetchOpt): Promise<FetchData>;
  save?(data?: PostData): Promise<any>;
  update?(data?: PostData): Promise<any>;
  delete?(data?: DeleteOpt): Promise<any>;
}
