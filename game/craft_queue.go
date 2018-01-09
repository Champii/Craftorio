package game

import (
	"time"
)

type QueueItem struct {
	Kind   Kind
	Amount int
}

type CraftQueue struct {
	Timer  *time.Timer `json:"-"`
	Queue  []QueueItem
	player *Player
}

func NewCraftQueue(player *Player) *CraftQueue {
	return &CraftQueue{
		player: player,
	}
}

func (this *CraftQueue) Add(item QueueItem) {
	this.Queue = append(this.Queue, item)

	if len(this.Queue) == 1 {
		this.Craft()
	}
}

func (this *CraftQueue) Craft() {
	if len(this.Queue) >= 1 {
		first := this.Queue[0]

		this.Timer = time.NewTimer(time.Duration(first.Amount) * recipes[first.Kind].Duration)

		go func() {
			<-this.Timer.C

			if first.Amount > 1 {
				first.Amount--
			} else {
				this.Queue = this.Queue[1:]
			}

			this.player.Inventory[first.Kind]++

			GAME.SendTo(this.player, this.player.Inventory)
			GAME.SendTo(this.player, this.player.CraftQueue)

			this.Craft()
		}()
	}
}
