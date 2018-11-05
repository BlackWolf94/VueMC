import Collection, { Item } from '../../src/modules/Collection';
import {TestModel} from './TestModel';

export default class TestCollection extends Collection<TestModel>{

  protected model(item: Item | TestModel){
    return TestModel;
  }

}