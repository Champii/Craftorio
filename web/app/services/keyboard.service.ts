import { clearInterval, setInterval } from 'timers';
import { Key } from 'ts-keycode-enum';
import { ORIENTATION } from '../enum/index';

export class KeyboardService {
  private isDown = false;
  private isUp = true;
  private action: () => void;
  private releaseAction: () => void;
  private tick: number;
  private timer: NodeJS.Timer;
  private activeKeys: boolean[] = [];
  private doubleKeys: boolean;

  constructor(private code: Key, private code2?: Key) {
    this.doubleKeys = !!code2;
    window.addEventListener(
      'keydown', this.downHandler.bind(this), false,
    );
    window.addEventListener(
      'keyup', this.upHandler.bind(this), false,
    );
  }

  public downHandler(event: any) {
    this.activeKeys[event.key] = true;
    if (event.keyCode === this.code &&
        this.isUp && this.press) {
      this.press();
      this.isDown = true;
      this.isUp = false;
    }
    event.preventDefault();
  }

  public press() {
    this.timer = setInterval(() => {
      this.action();
    }, this.tick);
  }

  public setAction(action: () => void, tick: number = 50) {
    this.tick = tick;
    this.action = action;
    return this;
  }

  public setReleaseAction(releaseAction: () => void) {
    this.releaseAction = releaseAction;
    return this;
  }

  public release() {
    this.releaseAction();
    clearInterval(this.timer);
  }

  public upHandler(event: any)  {
    if (event.keyCode === this.code && this.isDown && this.release) {
      this.activeKeys[event.key] = false;
      this.release();
      this.isDown = false;
      this.isUp = true;
    }
    event.preventDefault();
  }

  private isDoubleKeyDown(): boolean {
    return this.activeKeys.filter((key) => key).length === 2;
  }
}
