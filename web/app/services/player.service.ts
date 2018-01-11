import { Config } from '../config';
import { ORIENTATION } from '../enum';
import { SpriteItem } from '../interfaces';

import { playerBasicIdleSprites, playerBasicRunSprite } from '../data/sprites';

export class PlayerService {
  public anim: PIXI.extras.AnimatedSprite;
  private rectangles: PIXI.Rectangle[] = [];
  private orientation: ORIENTATION = ORIENTATION.EAST;
  private isMoving = false;
  private item: any;
  private sprites: string[] = [
    'assets/graphics/entity/player/player-basic-idle.png',
    'assets/graphics/entity/player/player-basic-run.png',
  ];

  constructor(private app: PIXI.Application, private container: PIXI.Container, private objects: any) {
    const width = 54;
    const height = 64;

    this.rectangles[ORIENTATION.EAST] = new PIXI.Rectangle(17, 94, width, height);
    this.rectangles[ORIENTATION.WEST] = new PIXI.Rectangle(17, 94, width, height);
  }

  public createPlayer(item: any, onComplete?: () => void) {
    this.item = item;

    return PIXI.loader
      .add(this.sprites)
      .load(() => {
        this.anim = new PIXI.extras.AnimatedSprite(this.getPlayerBasicIdleFrames(ORIENTATION.NORTH));

        // this.anim.anchor.set(0.5);
        this.anim.animationSpeed = 0.5;
        this.anim.position.set((item.x * Config.tileSize), (item.y * Config.tileSize));
        this.anim.play();

        this.container.addChild(this.anim);

        this.objects[item.id] = this.anim;

        onComplete();
      })
    ;
  }

  public idleDown(): void {
    this.isMoving = false;

    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(ORIENTATION.SOUTH));
  }

  public idleLeft(): void {
    this.isMoving = false;

    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(ORIENTATION.WEST));
  }

  public idleRight(): void {
    this.isMoving = false;

    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(ORIENTATION.EAST));
  }

  public idleUp(): void {
    this.isMoving = false;

    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(ORIENTATION.NORTH));
  }

  public move(xDiff: number, yDiff: number) {
    this.isMoving = true;

    const x = this.anim.position.x + xDiff;
    const y = this.anim.position.y + yDiff;

    this.anim.position.set(x, y);
  }

  public moveToward(orientation: number, speed = 5): void {
    if (this.orientation !== orientation || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(orientation));

      this.orientation = orientation;
    }

    switch (orientation) {
      case ORIENTATION.NORTH:
        this.moveUp(speed);
        break;
        case ORIENTATION.EAST:
        this.moveRight(speed);
        break;
        case ORIENTATION.SOUTH:
        this.moveDown(speed);
        break;
        case ORIENTATION.WEST:
        this.moveLeft(speed);
        break;
    }

    // this.move(-speed, 0);
  }

  public moveLeft(speed = 5): void {
    if (this.orientation !== ORIENTATION.WEST || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(ORIENTATION.WEST));

      this.orientation = ORIENTATION.WEST;
    }

    this.move(-speed, 0);
  }

  public moveRight(speed = 5) {
    if (this.orientation !== ORIENTATION.EAST || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(ORIENTATION.EAST));

      this.orientation = ORIENTATION.EAST;
    }

    this.move(speed, 0);
  }

  public moveUp(speed = 5) {
    if (this.orientation !== ORIENTATION.NORTH || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(ORIENTATION.NORTH));

      this.orientation = ORIENTATION.NORTH;
    }

    this.move(0, -speed);
  }

  public moveDown(speed = 5) {
    if (this.orientation !== ORIENTATION.SOUTH || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(ORIENTATION.SOUTH));

      this.orientation = ORIENTATION.SOUTH;
    }

    this.move(0, speed);
  }

  public updatePlayer(player: any,  itemTex: PIXI.RenderTexture) {
    if (!this.objects[player.id]) {
      const playerCreation = this.createPlayer(player, () => this.handleUpdatePlayer(player));
    } else {
      this.handleUpdatePlayer(player);
    }
  }

  private getPlayerFrames(orientation: ORIENTATION, spritePath: string, sprites: SpriteItem[]) {
    const frames: PIXI.Texture[] = [];

    const baseTexture = PIXI.utils.TextureCache[spritePath] as PIXI.BaseTexture;

    const textures = sprites.filter((tex: any) => tex.orientation === orientation);

    textures.map(({ x, y, width, height }) => {
      const rectangle = new PIXI.Rectangle(x, y, width, height);

      const texture = new PIXI.Texture(baseTexture, rectangle);

      frames.push(texture);
    });

    return frames;
  }

  private getPlayerBasicIdleFrames(orientation: ORIENTATION): PIXI.Texture[] {
    const spritePath = 'assets/graphics/entity/player/player-basic-idle.png';

    return this.getPlayerFrames(orientation, spritePath, playerBasicIdleSprites);
  }

  private getPlayerBasicRunFrames(orientation: ORIENTATION): PIXI.Texture[] {
    const spritePath = 'assets/graphics/entity/player/player-basic-run.png';

    return this.getPlayerFrames(orientation, spritePath, playerBasicRunSprite);
  }

  private handleUpdatePlayer(player: any) {
    // console.log(player)
    const existing = this.objects[player.id];

    // const x = this.app.renderer.screen.right - this.app.renderer.screen.right / 2;
    // const y = this.app.renderer.screen.bottom - this.app.renderer.screen.bottom / 2;

    // existing.position.set(
    //   this.app.renderer.screen.left - this.app.renderer.screen.left / 2,
    //   this.app.renderer.screen.top - this.app.renderer.screen.top / 2);

    // existing.position.set(player.x * Config.tileSize, player.y * Config.tileSize);

    const xDiff = (player.x * Config.tileSize) - existing.x;
    const yDiff = (player.y * Config.tileSize) - existing.y;

    this.move(xDiff, yDiff);

    this.container.position.x -= xDiff;
    this.container.position.y -= yDiff;

    // this.moveToward(ORIENTATION.SOUTH)
  }

  private reloadPlayerFrames(frames: PIXI.Texture[]): void {
    this.anim.stop();
    this.anim.textures = frames;
    this.anim.play();
  }
}
