# Usage

Consider the following collection as an example:
```typescript

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
```

# Initialize collection

```typescript
const collection = new TodoListCollection()
collection.add({...});
collection.add([{...}, {...}])
```
or use fetch method

```typescript
const collection = new TodoListCollection()
await collection.fetch({});
await collection.fetch({page: 2, size: 1});
``` 

