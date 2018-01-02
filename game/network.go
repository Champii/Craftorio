package game

import (
	"log"
	"net/http"
)

type Req interface {
	Resolve() []byte
}

type GameAnswer struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (this *Game) handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Fatal(err)
	}

	defer ws.Close()

	player := NewPlayer(this.Map.GetChunk(0, 0), ws)
	this.Players[ws] = player

	for {
		var req map[string]interface{}
		err := ws.ReadJSON(&req)

		if err != nil {
			log.Printf("Read error: %v", err)

			player.UnsubscribeAll()

			delete(this.Players, ws)

			break
		}

		this.handleIncomingMessage(player, req)
	}
}

func (this *Game) Broadcast(obj Object) {
	chunks := this.Map.GetAllChunksAround(obj)
	players := make(map[int]*Player)

	for _, chunk := range chunks {
		for _, player := range chunk.Subscribers {
			players[player.Id] = player
		}
	}

	for _, player := range players {
		this.SendTo(player, obj)
	}
}

func (this *Game) SendTo(player *Player, obj interface{}) {
	err := player.Socket.WriteJSON(obj)

	if err != nil {
		log.Printf("Send error: %v", err)
	}
}

func (this *Game) handleIncomingMessage(player *Player, req map[string]interface{}) {

	switch req["message"] {
	case "ready":
		chunks := this.Map.GetAllChunksAround(player)

		this.SendTo(player, player)

		for _, chunk := range chunks {
			this.SendTo(player, chunk)
		}

	case "player_move":
		tile := player.Chunk.GetAdjacentTile(player, Orientation(req["data"].(map[string]interface{})["ori"].(float64)))

		player.X = tile.X
		player.Y = tile.Y
		player.Chunk = tile.Chunk

		this.Broadcast(player)
	}
}
