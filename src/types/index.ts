/**
 * @author Dmitriy Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/11/20
 */

/**
 * @abbreviation
 *  - FO - fetch data options type
 *  - M - model type
 *  - D - addition collection data type
 *  - PD - post data type
 *  - DO - delete option type
 */

export interface ModelErrors<M> {
  model: string;
  attrs: Record<keyof M, string>;
}

export type AnyRecord = Record<string, any>;

export interface CollectionFetchResponse<M, D = AnyRecord> {
  content: M[];
  pages: number;
  page?: number;
  size?: number;
  total?: number;
  data?: D;
}

export interface CollectionApiProvider<M, FO = AnyRecord, D = AnyRecord> {
  fetch(filter?: FO): Promise<CollectionFetchResponse<M, D>>;
}

export interface Base<A> {
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

export interface ModelApiProvider<PD = AnyRecord, FD = AnyRecord, FO = AnyRecord, DO = AnyRecord> {
  fetch?(data?: FO): Promise<FD>;
  save?(data?: PD): Promise<any>;
  update?(data?: PD): Promise<any>;
  delete?(data?: DO): Promise<any>;
}

export interface Hook<T, K extends keyof T> {
  before?: K[];
  after?: K[];
  onError?: K;
}

export type CbFunction = (...args: any[]) => void;
