package game

import (
	"math/rand"

	opensimplex "github.com/ojrac/opensimplex-go"
)

const chunkRange = 1

type Map struct {
	Noise  *opensimplex.Noise
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
	rand.Seed(4244)
	return &Map{
		Noise:  opensimplex.NewWithSeed(rand.Int63()),
		Chunks: make(map[int]map[int]*Chunk),
	}
}
