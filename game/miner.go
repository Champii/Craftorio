package game

import "time"

type Miner struct {
	BaseMachine
}

func NewMiner(chunk *Chunk, x, y int, ori Orientation) *Miner {
	miner := &Miner{
		BaseMachine: BaseMachine{
			BaseObject: *NewBaseObject(x, y, chunk, ori, "Miner", TYPE_MACHINE),
			Level:      1,
			Frequency:  1,
			LastTick:   time.Now(),
			In:         make(chan Object, 1),
			Deployed:   true,
		},
	}

	chunk.AddObject(miner)

	miner.Connect()

	go miner.loop()

	return miner
}

func (this *Miner) Tick() {
	if this.BaseMachine.Tick() {
		this.Action()
	}
}

func (this *Miner) Action() {
	resources := this.Chunk.GetTile(this.X, this.Y).Resources

	for i, resource := range resources {
		if resource.(*Resource).Amount == 0 {
			resources = append(resources[:i], resources[i+1:]...)

			continue
		}

		// Fixme
		this.Output(resource.(*Resource).Spawn())

		return
	}
}
