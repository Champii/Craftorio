package game

import (
	"math/rand"

	opensimplex "github.com/ojrac/opensimplex-go"
)

const chunkRange = 1

type Map struct {
	Noises map[Kind]*opensimplex.Noise
	Chunks map[int]map[int]*Chunk
}

func (this *Map) GetChunk(x, y int) (chunk *Chunk) {
	chunkRow, ok := this.Chunks[x]

	if !ok {
		this.Chunks[x] = make(map[int]*Chunk)

		chunkRow = this.Chunks[x]
	}

	chunk, ok = chunkRow[y]

	if !ok || chunk == nil {
		chunk = NewChunk(this, x, y)

		chunkRow[y] = chunk

		return
	}

	return
}

func (this *Map) GetAllChunksAround(obj Object) (res []*Chunk) {
	chunk := obj.GetChunk()

	for x := chunk.X - chunkRange; x < chunk.X+chunkRange; x++ {
		for y := chunk.Y - chunkRange; y < chunk.Y+chunkRange; y++ {
			// Fixme: Here x and y have to be guarded if x or y < 0 or > CHUNK_SIZE
			res = append(res, this.GetChunk(x, y))
		}
	}

	return
}

func NewMap() *Map {
	m := &Map{
		Noises: make(map[Kind]*opensimplex.Noise),
		Chunks: make(map[int]map[int]*Chunk),
	}

	var seed int64 = 4244

	rand.Seed(seed)
	m.Noises[COAL] = opensimplex.NewWithSeed(rand.Int63())
	seed++

	rand.Seed(seed)
	m.Noises[IRON] = opensimplex.NewWithSeed(rand.Int63())
	seed++

	rand.Seed(seed)
	m.Noises[COPPER] = opensimplex.NewWithSeed(rand.Int63())
	seed++

	rand.Seed(seed)
	m.Noises[STONE] = opensimplex.NewWithSeed(rand.Int63())
	seed++

	return m
}
