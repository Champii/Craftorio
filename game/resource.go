package game

type ResourceType int

const (
	COAL ResourceType = iota
	IRON
	COPER
)

type IResource interface {
	Object
}

type Resource struct {
	BaseObject
	ResourceType ResourceType `json:"resourceType"`
	Amount       int          `json:"amount"`
}

func NewResource(chunk *Chunk, x, y int, resourceType ResourceType, amount int) *Resource {
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
		ResourceType: resourceType,
		Amount:       amount,
	}

	chunk.AddObject(res)

	return res
}

func (this *Resource) Spawn() IResource {
	switch this.ResourceType {
	case COAL:
		this.Amount--
		return NewCoalItem(this.Chunk, this.X, this.Y)
	}

	return NewCoalItem(this.Chunk, this.X, this.Y)
}
