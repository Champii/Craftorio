package game

import (
	"time"
)

type Machine interface {
	Object
	Connect()
	Tick()
	Action()
	Input(Object)
	Output(Object)
	GetDeployed() bool
}

type BaseMachine struct {
	BaseObject
	Level     int         `json:"level"`
	Frequency float32     `json:"frequency"`
	LastTick  time.Time   `json:"-"`
	Buffer    []Object    `json:"buffer"`
	In        chan Object `json:"-"`
	Out       *Tile       `json:"out"`
	Deployed  bool        `json:"deployed"`
}

func (this *BaseMachine) GetDeployed() bool {
	return this.Deployed
}

func (this *BaseMachine) Connect() {
	this.Out = this.Chunk.GetAdjacentTile(this, this.Orientation)
}

func (this *BaseMachine) Input(obj Object) {
	obj.SetX(this.X)
	obj.SetY(this.Y)

	GAME.Broadcast(obj)

	this.In <- obj
}

func (this *BaseMachine) Output(obj Object) {
	outMachine := this.Out.Machine

	if outMachine != nil {
		outMachine.Input(obj)
	} else {
		this.Out.Buffer = append(this.Out.Buffer, obj)
	}
}

func (this *BaseMachine) Tick() bool {
	if this.LastTick.Add(time.Duration(float32(time.Second) * this.Frequency)).Before(time.Now()) {
		this.LastTick = time.Now()

		return true
	}

	return false
}

// func (this *BaseMachine) Action() {
// 	fmt.Println("LOL")
// }

func (this *BaseMachine) loop() {
	for obj := range this.In {
		this.Buffer = append(this.Buffer, obj)
	}
}
