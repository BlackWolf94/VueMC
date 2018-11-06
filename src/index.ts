import _Model from './modules/Model';
import _BaseCollection from './modules/BaseCollection';
import _Collection from './modules/Collection';

export class Model extends _Model{};
export class BaseCollection extends _BaseCollection<Model>{}
export class Collection <M extends Model> extends _Collection<Model>{}
