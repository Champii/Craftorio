package game

import (
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
	NewRoll(chunk, 0, 19, SOUTH)
	NewRoll(chunk, 0, 20, SOUTH)

	// chunk.Print()
	// this.log.Info(chunk)
	// chunk.Print()
	// this.Map.GetChunk(0, -1).Print()
	// this.Map.GetChunk(0, -2).Print()
	// this.Map.GetChunk(0, -3).Print()

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
