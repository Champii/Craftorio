package game

import "github.com/gorilla/websocket"

type Player struct {
	BaseObject
	Username   string          `json:"username"`
	Password   string          `json:"password"`
	Socket     *websocket.Conn `json:"-"`
	Inventory  AmountMap
	CraftQueue *CraftQueue
}

func NewPlayer(chunk *Chunk, socket *websocket.Conn) *Player {
	player := &Player{
		BaseObject: *NewBaseObject(5, 5, chunk, NORTH, "Player", TYPE_PLAYER),
		Socket:     socket,
		Inventory:  make(AmountMap),
	}

	player.CraftQueue = NewCraftQueue(player)

	for _, chunk := range chunk.Map.GetAllChunksAround(player) {
		chunk.Subscribe(player)
	}

	return player
}

func (this *Player) Craft(kind Kind, amount int) bool {
	if !this.Inventory.Reserve(recipes[kind], amount) {
		return false
	}

	this.CraftQueue.Add(QueueItem{kind, amount})

	GAME.SendTo(this, this.Inventory)
	GAME.SendTo(this, this.CraftQueue)

	return true
}

func (this *Player) UnsubscribeAll() {
	for _, chunk := range this.Chunk.Map.GetAllChunksAround(this) {
		chunk.Unsubscribe(this)
	}
}
