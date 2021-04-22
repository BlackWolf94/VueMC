# Model

## Create model class

Simply usage

```typescript
export class TaskModel extends Model {
    // you code here     
}
```

Advanced

```typescript
import { Model } from '@zidadindimon/vue-mc';

export type Timestamp = number;

export enum TASK_STATUS {
    NEW = 'new',
    PROCESSING = 'processing',
    PAUSE = 'pause',
    DONE = 'done',
}

export interface Task {
    readonly id: number;
    title: string;
    description: string;
    assignTo: string;
    status: TASK_STATUS;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * here we extends class Model and
 */
export class TaskModel extends Model implements Task {
    //...
}
```

## Initialize

```typescript
// TaskModel.ts

export class TaskModel extends Model<Task> implements Task {
    //...
}

```

In `vue component`

```typescript
@Component({})
export default class SomeComponentForm extends Vue {
    model: TaskModel = new TaskModel()

    @Prop(Number) id: number;

    @Watch('id')
    async fetch(): Promise<void> {
        await this.model.fetch({ id: this.id });
    }
}
````

or

```typescript
@Component({})
export default class PostListItem extends Vue {
    @Prop(PostModel) readonly model: PostModel;
}

```

or

```typescript
const data: Task = {
    id: 1,
    title: 'Title',
    // ...
}

const model = new TaskModel().init(data, false);
```

## Default value

In order to specify a default value, it is enough to specify the attributes of the model and set them values.

```typescript
export class TaskModel extends Model implements Task {
    readonly id: number = null;

    description: string = null;

    status: TASK_STATUS = TASK_STATUS.NEW;

    title: string = null;

    assignTo: string = null;

    // apply default value
    createdAt: Date = new Date();

    updatedAt: Date = new Date();
    //...
}
```

**Always specify a default value or null for attributes to be reactive**; :warning: :warning: :warning:

## Mutations

When you want to bring the input (types) to the model data (types), you can use the mutations' method as shown in the
example below

```typescript
export class TaskModel extends Model<TaskDto> implements Task {


    // call wehen initialize model 
    protected mutations(data: TaskDto): MutationList<Task> {
        return {
            createdAt: () => new Date(data.createdAt),
            author: () => data.author ? `${data.author.firstName} ${data.author.lastName}` : ''
        };
    }

    // call before save/update model (RESTapi)
    protected mutateBeforeSave(): MutationList<TaskDto> {
        return {
            ...this,
            createdAt: this.createdAt.valueOf(),
            updatedAt: this.updatedAt.valueOf(),
        };
    }
}
```

## Computed value

```typescript
export class TaskModel extends Model<TaskDto> implements Task {

    get dateFormat(): string {
        return this.createdAt.toDateString();
    }
}
```

## GRUD operation

Api of Model provide next api operation:

- `fetch` - initialize model from some source
- `save` - create new record on some source or update existing
- `delete` - delete record in some source

Configure api provider:

```typescript
// sample api.provider.ts
import { ModelApiProvider } from '@zidadindimon/vue-mc';

export const apiProvider: ModelApiProvider<TaskDto, TaskDto, ModelFetchDto, ModelFetchDto> = {
    async fetch(data?: ModelFetchDto): Promise<TaskDto> {
        // use axios or fetc for http reguest 
    },

    async save(data?: TaskDto): Promise<TaskDto> {
        // use axios or fetc for http reguest 
    },

    async update(data?: TaskDto): Promise<TaskDto> {
        // use axios or fetc for http reguest 
    },

    delete(data?: ModelFetchDto): Promise<any> {
        // use axios or fetc for http reguest 
    }
};

```

add api provider to model

```typescript
export class TaskModel extends Model<TaskDto, TaskDto, ModelFetchDto, ModelFetchDto> implements Task {
    //...
    protected api(): ModelApiProvider<TaskDto, TaskDto, ModelFetchDto, ModelFetchDto> {
        return apiProvider;
    }

    //...
}
```

Usage:

```typescript

@Component({})
export default class TodoForm extends Vue {
    model: TaskModel = new TaskModel()

    @Prop(Number) id: number;

    @Watch('id')
    async fetch(): Promise<void> {
        await this.model.fetch({ id: this.id });
    }

    get formErrors() {
        return this.model.errors.attrs || {};
    }

    async save(): Promise<void> {
        try {
            await this.model.save();
        } catch (e) {
            // do something with errors
            console.error(e);
        }
    }
}
```

### Hooks

Also, you can use and override next **hooks**

- `beforeSave` - run before call `save` method
- `onSave` - run after call `save` method
- `beforeFetch` - run before call `fetch` method
- `onFetch` - run after call `fetch` method
- `beforeDelete` - run before call `delete` method
- `onError` - run after any api method if

### Processing indicators

You can also use the following indicators when requesting a server:

- `loading`
- `saving`
- `deleting`

## Validation

Sometimes you need to validate the data before sending it to the server. This is done very simply. Just describe the
validation rules in the model:

```typescript
export class TaskModel extends Model<TaskDto, TaskDto, ModelFetchDto, ModelFetchDto> implements Task {

    rules(): RuleList<Task> {
        return {
            title: [
                (v) => !!v || 'Title can`t be empty',
            ],
            description: [
                (v) => !!v || 'Description can`t be empty',
                (v) => v.length > 15 || 'Description must be more 15 symbols',
            ],
            assignTo: [
                (v) => !!v || 'Assign to can`t be empty',
            ],
        };
    }  
}
```
If call save method and validation failed than method throw `ValidateException`;

Get validation error:

```typescript
this.model.errors.attrs
```
Other model error
```typescript
this.model.errors.model
```

if you want to disable validation before save or update use next:
```typescript
this.model.validationBeforeSave = false
```