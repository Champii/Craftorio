import { GuiItem } from './';

export class MinimapService extends GuiItem {
  constructor(protected app: PIXI.Application) {
    super(app,
      app.renderer.screen.width / 2 - 200,
      -app.renderer.screen.height / 2,
      200,
      200);
  }
}
