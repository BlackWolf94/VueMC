# Collection

## Create collection

```typescript
export class TaskCollection extends Collection {}
```

## Models
You can provide initial models as an array of either model instances or plain objects that should be converted into models.

```typescript
export class TaskCollection extends Collection<TaskModel, Task> {
    protected model(item?: Task | TaskModel): {new(): TaskModel} {
        return TaskModel;
    }
}
```
## Request `fetch`

You can fetch model data that belongs to a collection. 
Response data is expected to be an array of attributes which will be passed to replace.

When a fetch request is made, `loading` will be `true` on the collection, and `false` again when the data has been 
received and replaced (or if the request failed). This allows the UI to indicate a loading state.

The request will be ignored if loading is already `true` when the request is made.

Configure api provider for collection (like as for model):

```typescript
interface FilterOption {
    size: number;
    page: number;
}

interface AdditionCollectionData {
    metaInfo: any
}

export const taskCollectionApiProvider: CollectionApiProvider<Task, FilterOption> = {
  async fetch(filter?: FilterOption): Promise<CollectionFetchResponse<Task, AdditionCollectionData>> {
    //
  },
};
```

Pay attention `interface AdditionCollectionData` is optional and is used only when you need to add
additional properties to the collection;

Add provider to collection:
```typescript
export class TaskCollection extends Collection<TaskModel, Task, FilterOption, AdditionCollectionData> {
  protected model(item?: Task | TaskModel): {new(): TaskModel} {
    return TaskModel;
  }
  
  protected defaultFilterOptions(): FilterOption {
    return { size: 10, page: 1 };
  }

  protected api(): CollectionApiProvider<Task, FilterOption> {
    return taskCollectionApiProvider;
  }

  // initialize additional property from fetch request
  metaInfo: any = null;
}
```
Use in `component`

```typescript

@Component({})
export default class TodosLayout extends Vue {
  collection: TaskCollection = new TaskCollection();
  
  beforeMount() {
    this.fetch();
  }
  async fetch(): Promise<void> {
    await this.collection.fetch({ size: 50 });
  }
}
```

or example #2

```typescript
@Component({})
export default class PostList extends Vue {
  collection = new PostCollection()

  @Prop({ type: Object, default: () => ({}) }) readonly filters: FilterOption;

  @Watch('filters', { immediate: true })
  async fetch(): Promise<void> {
    await this.collection.fetch(this.filters);
  }
}
```
### Use in template

```pug
 v-list
  v-list-item(v-for="(item, index) in collection" :key="index" two-line)
    v-list-item-avatar # {{index + 1}}
    v-list-item-content
        v-list-item-title {{item.title}}
        v-list-item-subtitle {{item.description}}
   v-list-item-action-text {{item.status}}
```
or 

```pug
 v-virtual-scroll(:items="collection.getItems()" height="300" item-height="64")
    template(v-slot:default="{ item }")
      post-list-item(:model='item' :key='item.id')
```

### Hooks

- `onError`
- `beforeFetch`, `onFetch`
- `onModelInit` - called after each initialize model

## Computed property 

You can use computed property (like as `Model`) 

```typescript

export class TodoListCollection extends Collection {

    get progress(): number {
        return (this.onlyDone.length / this.length) * 100;
    }

    get onlyDone(): TaskModel[] {
        return this.models.filter((model) => model.done);
    }

    /**
     * @comment simply pagination
     */
    set page(page: number) {
        this.fetch({ page });
    }    
}

```

## Other Method
- `add` - add one or more item to collection;
- `getItems` get items of collection
- `get` - get item by index
- `first/last` 
- `remove` - remove one or more item from collection
- `select` - select some el by index
- `replace` 