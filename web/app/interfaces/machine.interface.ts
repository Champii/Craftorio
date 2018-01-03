import { ORIENTATION } from '../enum';

import { Obj } from './obj.interface';

export interface Machine extends Obj {
  buffer: any;
  deployed: boolean;
  level: number;
  frequency: number;
}
