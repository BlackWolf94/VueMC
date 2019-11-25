import {TestModel} from './TestModel';
import { IItem } from '../../src/modules/Interfaces';
import {BaseCollection} from '../../src/modules/BaseCollection';

export default class TestCollection extends BaseCollection<TestModel>{

  protected model(item: IItem | TestModel){
    return TestModel;
  }

}
