/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { Collection, ICollectionApiProvider, TFetchResp } from '../../src';
import { TaskModel, TTaskInitData } from './Task.model';

export type TTodoFilterOpt = {
  page: number;
  size: number;
}
export type TInitialData = {
  metaInfo?: string;
  otherField?: any;
}

export class TodoListCollection extends Collection<TaskModel, TTaskInitData, TTodoFilterOpt, TInitialData> {

  protected model(item?: TTaskInitData | TaskModel): { new(): TaskModel } {
    return TaskModel;
  }

  metaInfo: string = null;

  protected api(): ICollectionApiProvider<TTaskInitData, TTodoFilterOpt, TInitialData> {
    return {
      async fetch(filter?: TTodoFilterOpt): Promise<TFetchResp<TTaskInitData, TInitialData>> {
        return {
          content: [],
          pages: 0,
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
    return this.onlyDone.length / this.length * 100;
  }

  get onlyDone(): TaskModel[] {
    return this._models.filter(model => model.done);
  }

  get page(){
    return this.filterOpt.page
  }

  set page(page: number) {
    this.fetch({page})
  }
}
