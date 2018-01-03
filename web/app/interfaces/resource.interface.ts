import { ORIENTATION } from '../enum';
import { Obj } from './obj.interface';

export interface Resource extends Obj {
  amout: number;
  resourceType: number;
}
