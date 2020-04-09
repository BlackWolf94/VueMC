# **GET STARTED**

Дана бібліотека розроблена для того щоб зручно маніпулювати станом компонетів та 
розділити бізнес логіку і маніпуляцю відображенням на різні рівні абстракцій.

Базова концепція основана на моделях (`Model`) і колекціях (`Colection`). 

При розробці `api` бібліотеки була орієнтація на бібліотеку [vue-mc](https://vuemc.io/#introduction) 

Бібліотека надає єдину точку входу та послідовний API:
* GRUD.
* Керування станами моделі.
* Керування станами компонентів.

____
## Instalation

Add the `@zidadindimon/vue-mc` package to your package dependencies:

```bash
npm i @zidadindimon/vue-mc
```

## Basic Usage

Розгляну приклад базового використання на основі звичайної задачі **Todo List**

`Task model`
```typescript
import { Model, TMutations } from '@zidadindimon/vue-mc';

type TTaskInitProps = {
  id: number;
  done?: boolean;
  name: string;
  description?: string;
  createdAt: number;
}

export class Task extends Model<TTaskInitProps> {
  id: number = null;
  done?: boolean = false;
  name: string = null;
  description: string = '';
  createdAt: Date = null;
  uuid: string =  null;

  protected mutations(data: TTaskInitProps): TMutations<Task> {
    return {
      createdAt: () => new Date(data.createdAt),
      uuid: `${data.id}-${data.id}-${data.id}`
    };
  }

  get dateFormat(): string {
    return `${this.createdAt.getMonth()} - ${this.createdAt.getDay()}`;
  }
}

const task = new Task()
  .init({
    id: 1,
    name: 'Task 1',
    createdAt: 0,
  }, false)

```


`Collection of task`

```typescript
import { Collection } from '@zidadindimon/vue-mc';

class TaskList extends Collection<Task> {

  protected model(): typeof Task {
    return Task;
  }
}

const list = new TaskList();
list.add([{
    id: 1,
    name: 'Task 1',
    createdAt: 0,
  }])

list.add({
  id: 2,
  name: 'Task 3',
  createdAt: 5,
})

```
