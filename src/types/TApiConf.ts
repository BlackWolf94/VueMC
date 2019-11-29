/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TCollectionFilter } from './ICollection';

export type TApiConf = {
  save(...params: any[]): any;
  update(...params: any[]): any;
  delete(...params: any[]): any;
  create(...params: any[]): any;
}

export type TFetchData<M> = {
  content: M[];
  pages: number;
  page: number;
  size: number;
}

export type TFetch<M>  = (filter?: TCollectionFilter) => Promise<TFetchData<M>>;
