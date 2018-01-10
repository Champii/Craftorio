package game

import "github.com/gorilla/websocket"
import "sync"

type Player struct {
	sync.RWMutex
	BaseObject
	Username   string          `json:"username"`
	Password   string          `json:"password"`
	Socket     *websocket.Conn `json:"-"`
	Inventory  AmountMap
	CraftQueue *CraftQueue
}

func NewPlayer(chunk *Chunk, socket *websocket.Conn) *Player {
	player := &Player{
		BaseObject: *NewBaseObject(0, 0, chunk, NORTH, "Player", TYPE_PLAYER, UNKNOWN),
		Socket:     socket,
		Inventory:  make(AmountMap),
	}

	player.CraftQueue = NewCraftQueue(player)

	for _, chunk := range chunk.Map.GetAllChunksAround(player) {
		chunk.Subscribe(player)
	}

	return player
}

func (this *Player) Move(ori Orientation) bool {
	x, y := this.GetAdjacentPos(ori)

	this.X = x
	this.Y = y

	// c := GAME.Map.GetChunk((this.X-(CHUNK_SIZE/2))/CHUNK_SIZE, (this.Y-(CHUNK_SIZE/2))/CHUNK_SIZE)
	c := GAME.Map.GetChunk(this.X/CHUNK_SIZE, this.Y/CHUNK_SIZE)

	if c != this.Chunk {
		this.UnsubscribeAll()

		this.Chunk = c

		GAME.SendTo(this, this.Chunk)

		this.SubscribeAll()
	}

	GAME.Broadcast(this)

	return true
}

func (this *Player) Craft(kind Kind, amount int) bool {
	reserved := NewReserved()

	if !this.Inventory.Reserve(recipes[kind], amount, reserved) {
		return false
	}

	reserved.ToCraft[len(reserved.ToCraft)-1].ToInventory = true

	for _, queueItem := range reserved.ToCraft {
		this.CraftQueue.Add(queueItem)
	}

	GAME.SendTo(this, this.Inventory)
	GAME.SendTo(this, this.CraftQueue)

	return true
}

func (this *Player) SubscribeAll() {
	for _, chunk := range this.Chunk.Map.GetAllChunksAround(this) {
		chunk.Subscribe(this)
		GAME.SendTo(this, chunk)
	}
}

func (this *Player) UnsubscribeAll() {
	for _, chunk := range this.Chunk.Map.GetAllChunksAround(this) {
		chunk.Unsubscribe(this)
	}
}
