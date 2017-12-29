package game

import "fmt"

type Orientation int

const (
	NORTH Orientation = iota
	WEST
	SOUTH
	EAST
)

func (this Orientation) Oposite() Orientation {
	switch this {
	case NORTH:
		return SOUTH
	case SOUTH:
		return NORTH
	case WEST:
		return EAST
	case EAST:
		return WEST
	}

	return NORTH
}

type Type int

const (
	TYPE_MACHINE Type = iota
	TYPE_RESOURCE
	TYPE_PLAYER
	TYPE_ITEM
)

type Object interface {
	GetId() int
	GetX() int
	GetY() int
	GetChunk() *Chunk
	GetOrientation() Orientation
	GetType() Type
	String() string

	SetX(int)
	SetY(int)
}

type BaseObject struct {
	Id          int         `json:"id"`
	X           int         `json:"x"`
	Y           int         `json:"y"`
	Chunk       *Chunk      `json:"-"`
	Orientation Orientation `json:"orientation"`
	Name        string      `json:"name"`
	Type        Type        `json:"_type"`
	UserId      int         `json:"userId"`
}

var idInc int = 0

func NewBaseObject(x, y int, chunk *Chunk, ori Orientation, name string, _type Type) *BaseObject {
	idInc++

	return &BaseObject{
		Id:          idInc,
		X:           x,
		Y:           y,
		Orientation: ori,
		Chunk:       chunk,
		Name:        name,
		Type:        _type,
		UserId:      0,
	}
}

func (this *BaseObject) String() string {
	return fmt.Sprintf("[%d,%d] (%d, %d)\n", this.X, this.Y, this.Chunk.X, this.Chunk.Y)
}

func (this *BaseObject) GetId() int {
	return this.Id
}

func (this *BaseObject) GetX() int {
	return this.X
}

func (this *BaseObject) GetY() int {
	return this.Y
}

func (this *BaseObject) SetX(x int) {
	this.X = x
}

func (this *BaseObject) SetY(y int) {
	this.Y = y
}

func (this *BaseObject) GetChunk() *Chunk {
	return this.Chunk
}

func (this *BaseObject) GetOrientation() Orientation {
	return this.Orientation
}

func (this *BaseObject) GetType() Type {
	return this.Type
}

func (this *BaseObject) SetChunk(chunk *Chunk) {
	this.Chunk = chunk
}

func (this *BaseObject) Connect() {
}
