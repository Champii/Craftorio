// tslint:disable-next-line:no-implicit-dependencies
import { ChunkService } from './chunck.service';
import { ItemService } from './item.service';
import { PlayerService } from './player.service';

const OrigWebSocket = WebSocket;
// tslint:disable-next-line:only-arrow-functions
WebSocket = function(url: string, protocols?: string | string[])  {
    const self = new OrigWebSocket(url, protocols);
    /* Add hooks here. */
    return self;
} as any;

export class SocketService {
  public ws: WebSocket;
  constructor(url: string,
              private chunkService: ChunkService,
              private playerService: PlayerService,
              private itemService: ItemService,
              private itemTex: PIXI.RenderTexture) {
    this.ws = new WebSocket(url);
    this.ws.onclose = this._onclose.bind(this);
    this.ws.onerror = this._onerror.bind(this);
    this.ws.onmessage = this._onmessage.bind(this);
    this.ws.onopen = this._onopen.bind(this);
  }

  public _onclose(info: any) {
    console.info('CLOSE', info);
  }

  public _onerror(info: any) {
    console.info('ERROR', info);
  }

  public _onmessage(info: any) {
    const item = JSON.parse(info.data);


    if (item.name === 'Chunk') {
      this.chunkService.render(item);
    } else if (item.name === 'CoalItem') {
      this.itemService.updateItem(item, this.itemTex);
    } else if (item.name === 'Player') {
      this.playerService.updatePlayer(item, this.itemTex);
    } else {
      console.log(item)
    }
  }

  public _onopen() {
    console.info('socket opened');
    this.send(JSON.stringify({
      message: 'ready',
    }));
  }

  public send(data: any) {
    this.ws.send(data);
  }
}
