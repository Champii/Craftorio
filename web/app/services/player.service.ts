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

  constructor(private app: PIXI.Application, private objects: any) {
    const width = 54;
    const height = 64;
    this.rectangles[ORIENTATION.EAST] = new PIXI.Rectangle(17, 94, width, height);
    this.rectangles[ORIENTATION.WEST] = new PIXI.Rectangle(17, 94, width, height);
  }

  public createPlayer(item: any, itemTex: PIXI.RenderTexture, onComplete?: () => void) {
    this.item = item;
    return PIXI.loader
    .add(this.sprites)
    .load(() => {
      this.anim = new PIXI.extras.AnimatedSprite(this.getPlayerBasicIdleFrames(item, ORIENTATION.NORTH));
      this.anim.anchor.set(0.5);
      this.anim.animationSpeed = 0.5;
      this.anim.position.set((item.x * Config.tileSize), (item.y * Config.tileSize));
      this.anim.play();
      this.app.stage.addChild(this.anim);
      this.objects[item.id] = this.anim;
      onComplete();
    });
  }

  public idleDown(): void {
    this.isMoving = false;
    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(this.item, ORIENTATION.SOUTH));
  }

  public idleLeft(): void {
    this.isMoving = false;
    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(this.item, ORIENTATION.WEST));
  }

  public idleRight(): void {
    this.isMoving = false;
    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(this.item, ORIENTATION.EAST));
  }

  public idleUp(): void {
    this.isMoving = false;
    this.reloadPlayerFrames(this.getPlayerBasicIdleFrames(this.item, ORIENTATION.NORTH));
  }

  public move(xDiff: number, yDiff: number) {
    this.isMoving = true;
    const x = this.anim.position.x + xDiff;
    const y = this.anim.position.y + yDiff;
    this.anim.position.set(x, y);
  }

  public moveLeft(speed = 5): void {
    if (this.orientation !== ORIENTATION.WEST || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(this.item, ORIENTATION.WEST));
      this.orientation = ORIENTATION.WEST;
    }
    this.move(-speed, 0);
  }

  public moveRight(speed = 5) {
    if (this.orientation !== ORIENTATION.EAST || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(this.item, ORIENTATION.EAST));
      this.orientation = ORIENTATION.EAST;
    }
    this.move(speed, 0);
  }

  public moveUp(speed = 5) {
    if (this.orientation !== ORIENTATION.NORTH || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(this.item, ORIENTATION.NORTH));
      this.orientation = ORIENTATION.NORTH;
    }
    this.move(0, -speed);
  }

  public moveDown(speed = 5) {
    if (this.orientation !== ORIENTATION.SOUTH || !this.isMoving) {
      this.reloadPlayerFrames(this.getPlayerBasicRunFrames(this.item, ORIENTATION.SOUTH));
      this.orientation = ORIENTATION.SOUTH;
    }
    this.move(0, speed);
  }

  public updatePlayer(player: any,  itemTex: PIXI.RenderTexture) {
    if (!this.objects[player.id]) {
      const playerCreation = this.createPlayer(player, itemTex, () => this.handleUpdatePlayer(player));
    } else {
      this.handleUpdatePlayer(player);
    }
  }

  private getPlayerFrames(item: any, orientation: ORIENTATION, spritePath: string, sprites: SpriteItem[]) {
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

  private getPlayerBasicIdleFrames(item: any, orientation: ORIENTATION): PIXI.Texture[] {
    const spritePath = 'assets/graphics/entity/player/player-basic-idle.png';
    return this.getPlayerFrames(item, orientation, spritePath, playerBasicIdleSprites);
  }

  private getPlayerBasicRunFrames(item: any, orientation: ORIENTATION): PIXI.Texture[] {
    const spritePath = 'assets/graphics/entity/player/player-basic-run.png';
    return this.getPlayerFrames(item, orientation, spritePath, playerBasicRunSprite);
  }

  private handleUpdatePlayer(player: any) {
    const existing = this.objects[player.id];
    const x = this.app.renderer.screen.right - this.app.renderer.screen.right / 2;
    const y = this.app.renderer.screen.bottom - this.app.renderer.screen.bottom / 2;

    existing.position.set(
      this.app.renderer.screen.left - this.app.renderer.screen.left / 2,
      this.app.renderer.screen.top - this.app.renderer.screen.top / 2);
    this.app.stage.position.set(x, y);
  }

  private reloadPlayerFrames(frames: PIXI.Texture[]): void {
    this.anim.stop();
    this.anim.textures = frames;
    this.anim.play();
  }
}
