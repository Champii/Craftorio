import { GuiItem } from './guiItem.service';

export class BuildQueueService extends GuiItem {
  constructor(protected app: PIXI.Application) {
    super(app,
      -app.renderer.screen.width / 2,
      app.renderer.screen.height / 2 - 200,
      200,
      200);
  }
}
