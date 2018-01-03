import { Machine } from './machine.interface';
import { Obj } from './obj.interface';
import { Resource } from './resource.interface';

export interface Tile {
  machine: Machine;
  resource: Resource[];
  buffer: Obj[];
}
