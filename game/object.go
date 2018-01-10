package game

import "fmt"

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
	GetKind() Kind
	String() string

	GetAdjacentPos(orientation Orientation) (x, y int)

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
	Kind        Kind        `json:"kind"`
	UserId      int         `json:"userId"`
}

var idInc int = 0

func NewBaseObject(x, y int, chunk *Chunk, ori Orientation, name string, _type Type, kind Kind) *BaseObject {
	idInc++

	return &BaseObject{
		Id:          idInc,
		X:           x,
		Y:           y,
		Orientation: ori,
		Chunk:       chunk,
		Name:        name,
		Type:        _type,
		Kind:        kind,
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

func (this *BaseObject) GetKind() Kind {
	return this.Kind
}

func (this *BaseObject) SetChunk(chunk *Chunk) {
	this.Chunk = chunk
}

func (this *BaseObject) Connect() {
}

func (this *BaseObject) GetAdjacentPos(orientation Orientation) (x, y int) {
	x = this.X
	y = this.Y

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
