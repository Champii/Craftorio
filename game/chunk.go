package game

import (
	"fmt"
)

const (
	CHUNK_SIZE       = 32
	GENERATION_SCALE = 24
)

type Chunk struct {
	X           int                          `json:"x"`
	Y           int                          `json:"y"`
	Map         *Map                         `json:"-"`
	Data        [CHUNK_SIZE][CHUNK_SIZE]Tile `json:"data"`
	Subscribers map[int]*Player              `json:"-"`
	Name        string                       `json:"name"`
}

func NewChunk(Map *Map, x, y int) *Chunk {
	chunk := &Chunk{
		X:           x,
		Y:           y,
		Map:         Map,
		Subscribers: make(map[int]*Player),
		Name:        "Chunk",
	}

	chunk.Generate()

	return chunk
}

func (this *Chunk) Subscribe(player *Player) {
	this.Subscribers[player.Id] = player
}

func (this *Chunk) Unsubscribe(player *Player) {
	delete(this.Subscribers, player.Id)
}

func (this *Chunk) Generate() {
	for x, rows := range this.Data {
		for y, _ := range rows {
			xFloat := float64(x+(CHUNK_SIZE*this.X)) / float64(GENERATION_SCALE)
			yFloat := float64(y+(CHUNK_SIZE*this.Y)) / float64(GENERATION_SCALE)

			height := this.Map.Noise.Eval2(xFloat, yFloat)

			if height >= 0.3 {
				NewResource(this, x, y, COAL, 20)
				// game.log.Info("Height", height, tile)
			}

		}
	}
}

func (this *Chunk) Print() {
	for x := len(this.Data) - 1; x >= 0; x-- {
		for y := 0; y < len(this.Data[x]); y++ {
			// for y := len(this.Data[x]) - 1; y >= 0; y-- {
			if this.Data[y][x].Machine != nil && this.Data[y][x].Machine.GetDeployed() {
				fmt.Print("x")
			} else if len(this.Data[y][x].Resources) > 0 {
				fmt.Printf("%d", len(this.Data[y][x].Resources))
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Print("\n")
	}
}

func (this *Chunk) AddObject(obj Object) {
	this.Data[obj.GetY()][obj.GetX()].Add(obj)
}

func (this *Chunk) InitTile(t *Tile, x, y int) {
	t.Chunk = this
	t.X = x
	t.Y = y
}

func (this *Chunk) GetTile(x, y int) *Tile {
	t := &this.Data[y][x]

	if t.Chunk == nil {
		this.InitTile(t, x, y)
	}

	return t
}

func (this *Chunk) GetAdjacentChunk(orientation Orientation) *Chunk {
	x, y := this.GetAdjacentPos(&BaseObject{X: this.X, Y: this.Y}, orientation)

	return this.Map.GetChunk(x, y)
}

func (this *Chunk) GetAdjacentPos(obj Object, orientation Orientation) (x, y int) {
	x = obj.GetX()
	y = obj.GetY()

	switch orientation {
	case NORTH:
		y -= 1
	case SOUTH:
		y += 1
	case WEST:
		x -= 1
	case EAST:
		x += 1
	}

	return
}

func (this *Chunk) GetAdjacentTile(obj Object, orientation Orientation) *Tile {
	x, y := this.GetAdjacentPos(obj, orientation)

	c := this

	if x < 0 || y < 0 || x >= CHUNK_SIZE || y >= CHUNK_SIZE {
		c = this.GetAdjacentChunk(orientation)

		x = relativePosToChunk(x)
		y = relativePosToChunk(y)
	}

	fmt.Println("X, Y", x, y)

	return c.GetTile(x, y)
}

func relativePosToChunk(val int) (res int) {
	res = val

	if val < 0 {
		res = CHUNK_SIZE + val
	} else if val >= CHUNK_SIZE {
		res = val - CHUNK_SIZE
	}

	return
}
