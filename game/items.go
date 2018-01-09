package game

type Item struct {
	Obj Object
}

type CoalItem struct {
	BaseObject
}

func NewCoalItem(chunk *Chunk, x, y int) *CoalItem {
	coalItem := &CoalItem{
		BaseObject: *NewBaseObject(x, y, chunk, NORTH, "CoalItem", TYPE_ITEM),
	}

	GAME.Broadcast(coalItem)

	return coalItem
}
