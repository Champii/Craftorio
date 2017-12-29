package game

type Tile struct {
	BaseObject
	Machine   Machine     `json:"machine"`
	Resources []IResource `json:"resources"`
	Buffer    []Object    `json:"buffer"`
}

func (this *Tile) Add(obj Object) {
	switch obj.GetType() {
	case TYPE_RESOURCE:
		this.Resources = append(this.Resources, obj.(IResource))
	case TYPE_MACHINE:
		this.Machine = obj.(Machine)
	case TYPE_ITEM:
		this.Buffer = append(this.Buffer, obj)
	}
}

func (this *Tile) GetMachine() Machine {
	return this.Machine
}
