/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TCollectionFilter } from './ICollection';

export type TApiConf<F= any, S = any, U = S> = {
  fetch(...params: any[]): Promise<F>;
  save(data?: S): Promise<any>;
  update(data?: U): Promise<any>;
  delete(): Promise<any>;
};

export type TFetchData<M> = {
  content: M[];
  pages: number;
  page?: number;
  size?: number;
  total?: number;
};

export type TApiCollectionConf<M> = {
  fetch(filter?: TCollectionFilter): Promise<TFetchData<M>>;
};
