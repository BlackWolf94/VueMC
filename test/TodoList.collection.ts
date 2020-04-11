/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { Collection, ICollectionApiProvider, TFetchResp } from '../src';
import { TaskModel, TTaskInitData } from './Task.model';

export type TTodoFilterOpt = {
  page: number;
  size: number;
}

export class TodoListCollection extends Collection<TaskModel, TTaskInitData, TTodoFilterOpt> {

  protected api(): ICollectionApiProvider<TTaskInitData, TTodoFilterOpt> {
    return {
      async fetch(filter?: TTodoFilterOpt): Promise<TFetchResp<TTaskInitData>> {
        return {
          content: [],
          page: 0,
          pages: 0,
          total: 0,
          size: 10,
        };
      },
    };
  }

  protected defFilterOpt(): TTodoFilterOpt {
    return {
      page: 1,
      size: 20,
    };
  }

  get progress(): number {
    return this._models.filter( model => model.done).length / this.length;
  }

  onlyDone(): TaskModel[]{
    return this._models.filter( model => model.done)
  }

}
