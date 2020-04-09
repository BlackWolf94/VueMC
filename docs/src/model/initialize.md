# Base usage
---
## Create instance

```typescript
import { Model} from '@zidadindimon/vue-mc';

type TTaskInitProps = {
  id: number;
  name: string;
  createdAt: number;
}

export class Task extends Model<TTaskInitProps> {
  id: number;
  name: string;
  createdAt: number;
}

const task = new Task();

task.init({ id: 1, name: 'Sample task', createdAt: 1111111 });
```

## Default value 

```typescript
import { Model} from '@zidadindimon/vue-mc';

type TTaskInitProps = {
  id: number;
  name?: string;
  createdAt?: number;
}

export class Task extends Model<TTaskInitProps> {
  id: number = null; //default value
  name: string = 'Empty task'; //default value
  createdAt: Date = new Date(); //default value
}

const task = new Task()
  .init({id: 5});

```
**:exclamation: Зауваження.**

```typescript
import { Model} from '@zidadindimon/vue-mc';

type TTaskInitProps = {
  id: number;
  name?: string;
  createdAt?: number;
}

export class Task extends Model<TTaskInitProps> {
  id: number = null; //default value
  name: string;
  createdAt: Date = new Date(); //default value
}

const task = new Task()
  .init({id: 5});
```

В данному прикладі поле `name` не буде реактивним оскільки відсутне початкове значення та значення при ініціалізації 

## Mutations

You can define functions for each attribute to pass through before they are set on the model, which makes things 
like type coercion or rounding very easy.

Mutators are defined by a model’s `mutations()` method, which should return an object mapping attribute names 
to their mutator functions. 

```typescript
import { Model, TMutations } from '@zidadindimon/vue-mc';

type TTaskInitProps = {
  id: number;
  name: string;
  createdAt: number;
}

export class Task extends Model<TTaskInitProps> {
  id: number = null; //default value
  name: string; 
  createdAt: Date = new Date();

  protected mutations(data: TTaskInitProps): TMutations<Task> {
    return {
      createdAt: () => new Date(data.createdAt),
      name: data.name.toUpperCase(),
    };
  }
}

const task = new Task()
  .init({
    id: 5,
    name: 'Empty task',
    createdAt: 1586422836000,
  });

```
## Computed value

Computed value працюють аналогічно тому як і в Vue Component:

```typescript
import { Model, TMutations } from '@zidadindimon/vue-mc';

type TTaskInitProps = {
  id: number;
  name: string;
  createdAt: number;
}

export class Task extends Model<TTaskInitProps> {
  id: number = null; //default value
  name: string; //
  createdAt: Date = new Date();

  protected mutations(data: TTaskInitProps): TMutations<Task> {
    return {
      createdAt: () => new Date(data.createdAt),
      name: data.name.toUpperCase(),
    };
  }

  //Computed value
  get dateFormat(){
    return this.createdAt.toDateString()
  }
}

const task = new Task()
  .init({
    id: 5,
    name: 'Empty task',
    createdAt: 1586422836000,
  });

task.dateFormat // "Thu Apr 09 2020"

``` 
