/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/3/20
 */
import { TObject } from './IMC';

export type TModelError = {
  model: string;
  attrs: TObject<string>;
};
