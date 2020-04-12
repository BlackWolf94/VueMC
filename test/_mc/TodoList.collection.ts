/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { Collection, ICollectionApiProvider, TFetchResp } from '../../src';
import { TaskModel, TTaskInitData } from './Task.model';

/**
 * @comment collection filter data interface
 */
export type TTodoFilterOpt = {
  page: number;
  size: number;
}

/**
 * @comment addition data attributes that can get by fetch api
 */
export type TInitialData = {
  metaInfo?: string;
  otherField?: any;
}

export class TodoListCollection extends Collection<TaskModel, TTaskInitData, TTodoFilterOpt, TInitialData> {

  /**
   * @comment set model that use in collection
   */
  protected model(item?: TTaskInitData | TaskModel): { new(): TaskModel } {
    return TaskModel;
  }

  /**
   * @comment custom value
   */
  metaInfo: string = null;

  /**
   * @comment  configure api method
   */
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

  /**
   * @default filter
   */
  protected defFilterOpt(): TTodoFilterOpt {
    return {
      page: 1,
      size: 20,
    };
  }


  /**
   * @comment computed value
   */
  get progress(): number {
    return this.onlyDone.length / this.length * 100;
  }

  /**
   * @comment computed value
   */
  get onlyDone(): TaskModel[] {
    return this._models.filter(model => model.done);
  }

  /**
   * @comment computed value
   */
  get page(){
    return this.filterOpt.page
  }

  /**
   * @comment simply pagination
   */
  set page(page: number) {
    this.fetch({page})
  }

  /**
   * @comment The hook is called every time the model is initialized
   */
  protected onModelInit(model: TaskModel): this {
    return super.onModelInit(model);
  }
}