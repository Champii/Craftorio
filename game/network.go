package game

import (
	"fmt"
	"log"

	"github.com/labstack/echo"
)

type Req interface {
	Resolve() []byte
}

type GameAnswer struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func (this *Game) handleConnections(c echo.Context) error {
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)

	if err != nil {
		c.Logger().Error(err)
	}

	defer ws.Close()

	player := NewPlayer(this.Map.GetChunk(0, 0), ws)

	this.Players[ws] = player

	// test crafting

	// player.Inventory = AmountMap{
	// 	IRON:  9,
	// 	STONE: 5,
	// }

	// player.Craft(MINER_BURNER, 1)

	//

	for {
		var req map[string]interface{}

		err := ws.ReadJSON(&req)

		if err != nil {
			c.Logger().Error(err)

			player.UnsubscribeAll()

			delete(this.Players, ws)

			break
		}

		this.handleIncomingMessage(player, req)
	}
	return nil
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
	player.Lock()
	defer player.Unlock()

	err := player.Socket.WriteJSON(obj)

	if err != nil {
		player.UnsubscribeAll()

		delete(this.Players, player.Socket)

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

	case "build":

	case "player_craft":
		if !player.Craft(req["data"].(map[string]interface{})["kind"].(Kind), 1) {
			fmt.Println("CANNOT CRAFT")
		}

	case "player_move":
		player.Move(Orientation(req["data"].(map[string]interface{})["ori"].(float64)))

		this.Broadcast(player)
	}
}
