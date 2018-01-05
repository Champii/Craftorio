import * as PIXI from 'pixi.js';

export class App extends PIXI.Application {
  constructor(gameloop: (delta: number) => void,
              main: PIXI.Container,
              options?: PIXI.ApplicationOptions) {
    super(options);
    this.ticker.add(gameloop);
    this.stage.addChild(main);
    this.renderer.view.style.position = 'absolute';
    this.renderer.view.style.display = 'block';
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
