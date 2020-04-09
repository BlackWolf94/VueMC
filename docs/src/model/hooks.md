# HOOKS

* `onInit` - call after init model 
* `onSave` - call after save/update model
* `onDelete` - call after delete
* `before` - call before save/delete/fetch
* `after` - call after success save/delete/fetch
* `onError` - call if save/delete/fetch has error

```typescript
import { Model} from '@zidadindimon/vue-mc';

export class Task extends Model<any> {
  
  protected onInit() {
    super.onInit();
  }

  protected onDelete(data: any): void {
    super.onDelete(data);
  }

  protected onSave(data: any): void {
    super.onSave(data);
  }

  protected after() {
    super.after();
  }
  
  protected before() {
    super.before();
  }

  protected onError(exception: any) {
    super.onError(exception);
  }
}
``` 
