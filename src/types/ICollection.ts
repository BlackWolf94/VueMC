import { IItem } from '../modules/Interfaces';
import { TObject } from './IModel';

/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */

export interface ICollection<M> {
  models: M[];
  modelsMap: Map<string| number, M>;
  first(): M;
  last():M;
  active():M;
  select(index: number): M;
  add(items: (M | TObject)[] | M | TObject ): this;
  remove(el: (M | number)[] | M | number): this
}
