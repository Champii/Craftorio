package game

import (
	"time"
)

type Roll struct {
	BaseMachine `json:""`
}

func NewRoll(chunk *Chunk, x, y int, or Orientation) *Roll {
	roll := &Roll{
		BaseMachine: BaseMachine{
			BaseObject: BaseObject{
				X:           x,
				Y:           y,
				Orientation: or,
				Chunk:       chunk,
				Name:        "Roll",
				Type:        TYPE_MACHINE,
				Kind:        ROLL,
				UserId:      0,
			},
			Level:     1,
			Frequency: 1,
			LastTick:  time.Now(),
			In:        make(chan Object, 1),
			Deployed:  true,
		},
	}

	chunk.AddObject(roll)

	roll.Connect()

	go roll.loop()

	return roll
}

func (this *Roll) Tick() {
	if this.BaseMachine.Tick() {
		this.Action()
	}
}

func (this *Roll) Action() {
	if len(this.Buffer) > 0 {
		this.Output(this.Buffer[0])

		this.Buffer = this.Buffer[1:]
	}
}
