package game

type ResourceType int

type IResource interface {
	Object
}

type Resource struct {
	BaseObject
	Kind   Kind `json:"resourceType"`
	Amount int  `json:"amount"`
}

func NewResource(chunk *Chunk, x, y int, resourceType Kind, amount int) *Resource {
	res := &Resource{
		BaseObject: BaseObject{
			X:           x,
			Y:           y,
			Orientation: NORTH,
			Chunk:       chunk,
			Name:        "Resource",
			Type:        TYPE_RESOURCE,
			UserId:      0,
		},
		Kind:   resourceType,
		Amount: amount,
	}

	chunk.AddObject(res)

	return res
}

func (this *Resource) Spawn() IResource {
	switch this.Kind {
	case COAL:
		this.Amount--
		return NewCoalItem(this.Chunk, this.X, this.Y)
	}

	return NewCoalItem(this.Chunk, this.X, this.Y)
}
