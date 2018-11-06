import {TestModel} from './TestModel';
import { Item } from '../../src/modules/Interfaces';
import BaseCollection from '../../src/modules/BaseCollection';

export default class TestCollection extends BaseCollection<TestModel>{

  protected model(item: Item | TestModel){
    return TestModel;
  }

}