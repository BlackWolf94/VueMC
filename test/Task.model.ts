/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/10/20
 */
import { IModelApiProvider, Model, TMutations, TRules } from '../src';

export type TTaskInitData = {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: number;
  done?: boolean;
  data?: any;
  author? : {
    firstName: string;
    lastName: string;
  }
}

export type TTaskFetchOpt = {
  id: number;
}

export type TTaskDelOpt = {
  id: number;
}

export class TaskModel extends Model<TTaskInitData, TTaskInitData, TTaskFetchOpt, TTaskDelOpt> {
  /**
   * @comment enable validation before save/update
   * @default true
   */
  protected _validationBeforeSave = true;

  /**
   * @comment attribute for model
   */
  id: number = null;
  title: string = null;
  description: string = null;
  createdAt: Date = new Date();
  done: boolean = false;
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
  protected mutations(data: TTaskInitData): TMutations<TaskModel> {
    return {
      createdAt: () => new Date(data.createdAt),
      author: () => data.author ? `${data.author.firstName} ${data.author.lastName}`: ''
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
  rules(): TRules<TaskModel> {
    return {
      title: [
        v => !!v || 'Title can`t be empty',
      ],
      description: [
        v => !!v || 'Description can`t be empty',
        v => v.length > 15 || 'Description must be more 15 symbols',
      ],
    };
  }

  /**
   * @comment mutate data before save/update
   * if method return null - then return model public data
   * @default method empty
   */
  protected mutateBeforeSave(): TMutations<TTaskInitData> {
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
  protected api(): IModelApiProvider<TTaskInitData, TTaskInitData, TTaskFetchOpt, TTaskDelOpt> {
    return {
      async fetch(data?: TTaskFetchOpt): Promise<TTaskInitData> {
        return null;
      },
      async save(data?: TTaskInitData): Promise<any> {
      },
      async update(data?: TTaskInitData): Promise<any> {
      },
      async delete(data?: TTaskDelOpt): Promise<any> {
      },
    };
  }

  /**
   * @comment hook run after safe/update method
   */
  protected onSave(data: any): void {
  }

  /**
   * @comment hook run after delete method
   */
  protected onDelete(data: any): void {
  }

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
  protected get deleteOptions(): TTaskDelOpt {
    return { id: this.id };
  }
}
