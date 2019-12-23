import { TObject } from './IModel';
import { Model } from '../Model';

/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */

export interface ICollection<M> {
  first(): M;
  last(): M;
  active(): M;
  select(index: number): this;

  add(items: Array<M | TObject>): this;
  add(items: M | TObject): this;

  replace(items: Array<M | TObject>): this;
  replace(items: M | TObject): this;

  remove(el: M[] | M): this;
  remove(index: number | number[]): this;

  get(index: number): M;
  getItems(): M[];

  destruct(): void;
  fetch(filters?: TCollectionFilter): Promise<this>;
  setFilters(): this;
}

export type TCollectionFilter<T = TObject> =
  | {
      size: number;
      page: number;
    }
  | T;
