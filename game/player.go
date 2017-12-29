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
		BaseObject: *NewBaseObject(0, 0, chunk, NORTH, "Player", TYPE_PLAYER),
		Socket:     socket,
	}

	chunks := chunk.Map.GetAllChunksAround(player)

	for _, chunk := range chunks {
		chunk.Subscribe(player)
	}

	return player
}

func (this *Player) UnsubscribeAll() {
	chunks := this.Chunk.Map.GetAllChunksAround(this)

	for _, chunk := range chunks {
		chunk.Unsubscribe(this)
	}
}
