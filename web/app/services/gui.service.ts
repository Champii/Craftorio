import { Config } from '../config';
import {
  BuildQueueService,
  InventoryService,
  MinimapService,
} from './'

export class GuiService {
  constructor(private app: PIXI.Application) {
    new BuildQueueService(app)
    new InventoryService(app)
    new MinimapService(app)
  }
}
