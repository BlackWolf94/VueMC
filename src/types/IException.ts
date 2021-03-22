/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/3/20
 */

export interface ModelErrors<M> {
  model: string;
  attrs: Record<keyof M, string>;
}
