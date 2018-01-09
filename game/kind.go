package game

type Kind int

const (
	// Resources
	UNKNOWN Kind = iota
	COAL
	IRON
	COPPER
	STONE

	IRON_GEAR_WHEEL

	STONE_FURNACE

	MINER_BURNER

	// Machines
	MINER
	ROLL
)

var KindNames = [...]string{
	// Resources
	"UNKNOWN",
	"COAL",
	"IRON",
	"COPPER",
	"STONE",

	"IRON_GEAR_WHEEL",

	"STONE_FURNACE",

	"MINER_BURNER",

	// Machines,
	"MINER",
	"ROLL",
}

func (this Kind) String() string {
	return KindNames[this]
}

func StringToKind(str string) Kind {
	for i, name := range KindNames {
		if name == str {
			return Kind(i)
		}
	}

	return UNKNOWN
}
