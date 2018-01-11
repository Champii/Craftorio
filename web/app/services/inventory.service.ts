import { GuiItem } from './';

export class InventoryService extends GuiItem {
  constructor(protected app: PIXI.Application) {
    super(app,
      app.renderer.screen.width / 2 - 400,
      app.renderer.screen.height / 2 - 400,
      400,
      400);
  }
}
