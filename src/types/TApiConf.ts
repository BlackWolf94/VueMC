/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
import { TCollectionFilter } from './ICollection';

export type TApiConf = {
  fetch(...params: any[]): any;
  save(...params: any[]): any;
  update(...params: any[]): any;
  delete(...params: any[]): any;
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
