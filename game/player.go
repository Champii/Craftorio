package game

import "github.com/gorilla/websocket"

type Player struct {
	BaseObject
	Username string          `json:"username"`
	Password string          `json:"password"`
	Socket   *websocket.Conn `json:"-"`
}

func NewPlayer(chunk *Chunk, socket *websocket.Conn) *Player {
	player := &Player{
		BaseObject: *NewBaseObject(5, 5, chunk, NORTH, "Player", TYPE_PLAYER),
		Socket:     socket,
	}

	for _, chunk := range chunk.Map.GetAllChunksAround(player) {
		chunk.Subscribe(player)
	}

	return player
}

func (this *Player) UnsubscribeAll() {
	for _, chunk := range this.Chunk.Map.GetAllChunksAround(this) {
		chunk.Unsubscribe(this)
	}
}
