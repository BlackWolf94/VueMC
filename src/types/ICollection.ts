import { TObject } from './IModel';

/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */

export interface ICollection<M> {
  first(): M;

  last(): M;

  active(): M;

  select(index: number): this;

  add(items: (M | TObject)[] | M | TObject): this;

  remove(el: M[] | M): this

  remove(index: number | number []): this

  get(index: number): M;

  destruct(): void;

  fetch(filters?: TCollectionFilter): Promise<this>;

  updateInterval(): number;

}

export type TCollectionFilter<T = any> = {
  size: number;
  page: number;
} | T
