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
