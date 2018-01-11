interface SpriteDef {
  filename: string;
  h: number;
  w: number;
  rows: number;
  cols: number;
}

export class SpritesService {
  public frames: PIXI.Texture[][] = [];

  private spriteDefs: SpriteDef[] = [
    {
      filename: 'assets/graphics/entity/burner-mining-drill/east.png',
      h: 74,
      w: 94,
      // tslint:disable-next-line:object-literal-sort-keys
      rows: 8,
      cols: 4,
    },
  ];

  constructor(private app: PIXI.Application, onComplete?: () => void) {
    let loader: PIXI.loaders.Loader = PIXI.loader;

    for (const def of this.spriteDefs) {
      loader = loader.add(def.filename);
    }

    loader.load(() => {
      for (const def of this.spriteDefs) {
        const baseTexture = PIXI.utils.TextureCache[def.filename] as PIXI.BaseTexture;
        const frames: PIXI.Texture[] = [];

        let x = 0;
        for (let col = 0; col < def.cols; col++) {
        let y = 0;

        for (let row = 0; row < def.rows; row++) {
            const rectangle = new PIXI.Rectangle(x, y, def.w, def.h);

            const texture = new PIXI.Texture(baseTexture, rectangle);

            frames.push(texture);

            y += def.h;
          }

        x += def.w;
        }

        this.frames.push(frames);
      }

      onComplete();
    });
  }
}
