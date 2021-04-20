/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { Model, ModelApiProvider, MutationList, RuleList } from '../index';

export type TaskInitData = {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: number;
  done?: boolean;
  data?: any;
  author?: {
    firstName: string;
    lastName: string;
  };
};

export type TaskFetchOpt = {
  id: number;
};

export type TaskDelOpt = {
  id: number;
};

export interface Task extends Model {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  done: boolean;
  author: string;
}

export class TaskModel extends Model<TaskInitData, TaskInitData, TaskFetchOpt, TaskDelOpt> {
  /**
   * @comment enable validation before a save/update
   * @default true
   */
  protected validationBeforeSave = true;

  /**
   * @comment attribute for model
   */
  id: number = null;

  title: string = null;

  description: string = null;

  createdAt: Date = new Date();

  done = false;

  author: string;

  /**
   * @comment computed property
   */
  get dateFormat(): string {
    return this.createdAt.toDateString();
  }

  /**
   * @comment mutate initial data before apply to model
   */
  protected mutations(data: TaskInitData): MutationList<Task> {
    return {
      createdAt: () => new Date(data.createdAt),
      author: () => (data.author ? `${data.author.firstName} ${data.author.lastName}` : ''),
    };
  }

  /**
   * @comment hook run after call init method
   */
  protected onInit() {
    super.onInit();
  }

  /**
   * @comment rule for validate model before save/update
   */
  rules(): RuleList<Task> {
    return {
      title: [(v) => !!v || 'Title can`t be empty'],
      description: [(v) => !!v || 'Description can`t be empty', (v) => v.length > 15 || 'Description must be more 15 symbols'],
    };
  }

  /**
   * @comment mutate data before the save/update
   * if method return null - then return model public data
   * @default method empty
   */
  protected mutateBeforeSave(): MutationList<TaskInitData> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      done: this.done,
      createdAt: () => this.createdAt.valueOf(),
    };
  }

  /**
   * @comment configure api method
   */
  protected api(): ModelApiProvider<TaskInitData, TaskInitData, TaskFetchOpt, TaskDelOpt> {
    return {
      async fetch(data?: TaskFetchOpt): Promise<TaskInitData> {
        return {
          id: data.id,
          title: `Task #${data.id}`,
          description: 'Description of task',
        };
      },
      async save(data?: TaskInitData): Promise<any> {},
      async update(data?: TaskInitData): Promise<any> {},
      async delete(data?: TaskDelOpt): Promise<any> {},
    };
  }

  /**
   * @comment hook run after safe/update method
   */
  protected onSave(data: any): void {}

  /**
   * @comment hook run after delete method
   */
  protected onDelete(data: any): void {}

  /**
   * @comment hook that call when GRUD operation is fail
   *
   */
  protected onError(exception: Error) {
    /**
     * pats your code hear
     */
    super.onError(exception);
  }

  /**
   * @comment hook run after any GRUD method
   */
  protected after() {
    super.after();
  }

  /**
   * @comment hook run before any GRUD method
   */
  protected before() {
    super.before();
  }

  /**
   * @comment configure delete filter options
   */
  protected get deleteOptions(): TaskDelOpt {
    return { id: this.id };
  }
}
