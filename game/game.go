package game

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	logging "github.com/op/go-logging"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

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
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	// e.Use(middleware.CORS())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://127.0.0.1:4200", "http://127.0.0.1:8080"},
		AllowCredentials: true,
		AllowMethods:     []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	e.GET("/ws", this.handleConnections)
	e.Static("/", "./web/dist")

	this.log.Info("Web: Starting HTTP Server on :8080...")
	e.Logger.Fatal(e.Start(":8080"))
	// if err := http.ListenAndServe(":8080", nil); err != nil {
	// 	this.log.Error("Web: Server error: ", err)

	// 	os.Exit(1)
	// }

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
