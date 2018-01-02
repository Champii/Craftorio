package game

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
