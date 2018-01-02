// import 'requirejs';
// import * as PIXI from 'pixi.js';
// import * as _ from 'lodash';

console.log('test');

const ws = new WebSocket('ws://' + window.location.host + '/ws');

const objects:{ [index:number] : PIXI.Sprite} = {};

class GameMap {
  chunks: Chunk[]
}

class Chunk {
  x: number
  y: number

  data: Tile[]
}

class Tile {
  machine: Machine
  resource: Resource[]
  buffer: Obj[]
}

class Machine {

}

class Resource {

}

class Obj {

}

const tileSize = 20;

interface GameRequest {
  message: string
  data: any
}

ws.onopen = () => {
  ws.send(JSON.stringify({
    message: 'ready'
  }))
}

ws.onerror = (e) => {
  console.log("ERROR", e)
}
ws.onclose = (e) => {
  console.log("CLOSE", e)
}

ws.onmessage = (e) => {
  const answer = JSON.parse(e.data)

  if (answer.name === "Chunk") {
    renderChunk(answer)
  } else if (answer.name === "CoalItem") {
    updateItem(answer)
  } else if (answer.name === "Player") {
    updatePlayer(answer)
  }

};
const updatePlayer = (player: any) => {
  if (objects[player.id] == null) {
    createPlayer(player)
  }

  const existing = objects[player.id]

  existing.position.set((player.x * tileSize) + app.renderer.width / 2, (player.y * tileSize) + app.renderer.height / 2)
  app.stage.position.set((player.x * tileSize) + app.renderer.width / 2, (player.y * tileSize) + app.renderer.height / 2)
};

// const getChunk = (x: number, y: number) => {
//   ws.send(JSON.stringify({
//     message: 'chunk',
//     data: {x, y},
//   }));
// };

let c: any;


const renderChunk = (chunk:any) => {
  console.log(chunk)
  let x = 0;
  let y = 0;

  const chunkContainer = new PIXI.Container()

  _.forEach(chunk.data, (row: any) => {
    _.forEach(row, (tile: any) => {
      createTile(chunkContainer, x, y, tile)
      x += tileSize;
    })
    y += tileSize;
    x = 0;
  });


  // chunkContainer.pivot.set(chunkContainer.x, chunkContainer.y)

  chunkContainer.x = chunk.x * 32 * tileSize
  chunkContainer.y = chunk.y * 32 * tileSize

  // chunkContainer.pivot.set((chunkContainer.width / 2), (chunkContainer.height / 2))


  // chunkContainer.rotation = Math.PI / 2

  main.addChild(chunkContainer)


  // c = chunkContainer
};

let app: PIXI.Application;

let main: PIXI.Container;

const createTile = (container: PIXI.Container, x: number, y: number, tile: any) => {
  let rectangle = new PIXI.Graphics();

  rectangle.lineStyle(1, 0x000000, 1);

  if (tile.machine != null) {
    if (tile.machine.name === 'Miner') {
      rectangle.beginFill(0xCC3344);
    } else if (tile.machine.name === 'Roll') {
      rectangle.beginFill(0x55AA44);
    }
  } else if (tile.resources != null) {
    rectangle.beginFill(0x222222);
  } else {
    rectangle.beginFill(0x444444);
  }

  rectangle.drawRect(0, 0, tileSize, tileSize);
  rectangle.endFill();
  rectangle.x = x;
  rectangle.y = y;

  const a:any = rectangle
  a.vx = 0;
  a.vy = 0;


  container.addChild(rectangle);
};


const updateItem = (item: any) => {
  if (objects[item.id] == null) {
    createItem(item)
  }

  const existing = objects[item.id]

  // console.log(existing)
  // const pos = existing.toGlobal(existing.position);
  // existing.position = pos
  // existing.position.set(item.x, item.y);
  existing.position.set((item.x * tileSize), (item.y * tileSize));
  // console.log(existing.position)
  // existing.y = ;
};


const createItemTex = () => {
  let circle = new PIXI.Graphics();
  circle.beginFill(0x9966FF);
  circle.drawCircle(0, 0, tileSize / 2);
  circle.endFill();

  return app.renderer.generateTexture(circle);
}

let itemTex:any;

const createItem = (item: any) => {
  const circle = new PIXI.Sprite(itemTex);

  circle.position.set((item.x * tileSize), (item.y * tileSize));

  const a:any = circle
  a.vx = 0;
  a.vy = 0;
  // a.vy = tileSize / 60;

  main.addChild(circle);

  circle.setParent(main)


  objects[item.id] = circle
};

const createPlayer = (item: any) => {
  const circle = new PIXI.Sprite(itemTex);

  circle.position.set((item.x * tileSize), (item.y * tileSize));

  const a:any = circle
  a.vx = 0;
  // a.vy = 0;
  a.vy = 0;

  app.stage.addChild(circle);

  // circle.setParent(main)


  objects[item.id] = circle
};

const
	TYPE_MACHINE = 0,
	TYPE_RESOURCE = 1,
	TYPE_PLAYER = 2,
	TYPE_ITEM = 3

const
	NORTH = 0,
	WEST = 1,
	SOUTH = 2,
	EAST = 3



const update = (obj:any, delta: number) => {
  obj.x += obj.vx * delta;
  obj.y += obj.vy * delta;
}

const gameLoop = (delta:number) => {
  _(objects)
    .values()
    .forEach((obj: any) => update(obj, delta))
  ;
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('dom downloaded');
  app = new PIXI.Application({
    // width: 700,
    // height: 700,
  });

  app.ticker.add(gameLoop);

  main = new PIXI.Container()

  main.position.x = 0
  main.position.y = 0
  app.stage.addChild(main)

  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
  app.renderer.autoResize = true;
  app.renderer.resize(window.innerWidth, window.innerHeight);

  let aObject = keyboard(65); // a

  let timer: any;
  aObject.press = () => {
    timer = setInterval(() => {
      ws.send(JSON.stringify({
        message: "player_move",
        data: {
          ori: WEST,
        }
      }))
    }, 100)
  };

  aObject.release = () => {
    clearInterval(timer)
  };

  let sObject = keyboard(83); // s

  let timer1: any;
  sObject.press = () => {
    timer1 = setInterval(() => {
      app.stage.position.y -= 5;
    }, 50)
  };

  sObject.release = () => {
    clearInterval(timer1)
  };

  let dObject = keyboard(68); // d

  let timer2: any;
  dObject.press = () => {
    timer2 = setInterval(() => {
      app.stage.position.x -= 5;
    }, 50)
  };

  dObject.release = () => {
    clearInterval(timer2)
  };

  let wObject = keyboard(87); // s

  let timer3: any;
  wObject.press = () => {
    timer3 = setInterval(() => {
      app.stage.position.y += 5;
    }, 50)
  };

  wObject.release = () => {
    clearInterval(timer3)
  };

  document.body.appendChild(app.view);

  itemTex = createItemTex();
});


function keyboard(keyCode: any) {
  let key:any = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = (event:any) => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = (event:any) => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
