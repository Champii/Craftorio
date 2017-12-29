package game

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	logging "github.com/op/go-logging"
)

var upgrader = websocket.Upgrader{}

type Game struct {
	log     *logging.Logger
	Map     *Map
	Players map[*websocket.Conn]*Player
}

var (
	GAME *Game
)

func New() *Game {
	GAME = &Game{
		log:     logging.MustGetLogger("game"),
		Players: make(map[*websocket.Conn]*Player),
	}

	return GAME
}

func (this *Game) Init() {
	this.Map = NewMap()

	// generate map

	chunk := this.Map.GetChunk(0, 0)
	NewMiner(chunk, 0, 16, SOUTH)
	NewRoll(chunk, 0, 17, SOUTH)
	NewRoll(chunk, 0, 18, SOUTH)

	// chunk.Print()
	// this.log.Info(chunk)
	// chunk.Print()
	// this.Map.GetChunk(0, -1).Print()
	// this.Map.GetChunk(0, -2).Print()
	// this.Map.GetChunk(0, -3).Print()

	go this.handleMessages()
	go this.loop()

	http.HandleFunc("/ws", this.handleConnections)
	http.Handle("/", http.FileServer(http.Dir("./web")))

	this.log.Info("Web: Starting HTTP Server on :8080...")

	if err := http.ListenAndServe(":8080", nil); err != nil {
		this.log.Error("Web: Server error: ", err)

		os.Exit(1)
	}

	this.loop()

}

func (this *Game) loop() {
	for {
		for _, chunks := range this.Map.Chunks {
			for _, chunk := range chunks {
				for _, datas := range chunk.Data {
					for _, tile := range datas {
						if tile.Machine != nil && tile.Machine.GetDeployed() {
							tile.Machine.Tick()
						}
					}
				}
			}
		}

		time.Sleep(time.Microsecond * 100)
	}
}

type Req interface {
	Resolve() []byte
}

type GameAnswer struct {
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// type ChunkRequest struct {
// 	X int `json:"x"`
// 	Y int `json:"y"`
// }

// func (this *ChunkRequest) Resolve() GameAnswer {
// 	return GameAnswer{
// 		Message: "chunk",
// 		Data:    GAME.Map.GetChunk(this.X, this.Y),
// 	}
// }

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

		// fmt.Println("Got", t, string(arr))

		this.handleIncomingMessage(player, req)

		// broadcast <- this.JSONMarshal(this.Map.GetChunk(0, 0))
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

		// player.Socket.Close()

		// player.UnsubscribeAll()
		// delete(this.Players, player.Socket)
	}
}

func (this *Game) handleMessages() {
	// for {
	// 	msg := <-broadcast

	// 	for client := range clients {
	// 		err := client.WriteMessage(websocket.TextMessage, []byte(msg))

	// 		if err != nil {
	// 			log.Printf("error: %v", err)

	// 			client.Close()

	// 			delete(clients, client)
	// 		}
	// 	}
	// }
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
		// var res
		// mapstructure.Decode(req, &req)

	}
	// res := result.Resolve()

}
