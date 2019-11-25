/**
 * @author Dmytro Zataidukh
 * @created_at 11/25/19
 */
export type TApiConf = {
  save(...params: any[]): any;
  update(...params: any[]): any;
  delete(...params: any[]): any;
  create(...params: any[]): any;
}
