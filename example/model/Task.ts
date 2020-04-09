/**
 * @author Dmitro Zataidukh
 * @email zidadindimon@gmail.com
 * @createdAt 4/8/20
 */
import { Model, TMutations } from '../../src';

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
