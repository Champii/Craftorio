package game

type AmountMap map[Kind]int

func (this AmountMap) Restore(old AmountMap) {
	for kind, amount := range old {
		this[kind] = amount
	}
}

func (this AmountMap) Save() AmountMap {
	res := make(AmountMap)

	for kind, amount := range this {
		res[kind] = amount
	}

	return res
}

func (this AmountMap) CanReserve(recipe *Recipe, quantity int) bool {
	old := this.Save()

	res := this.Reserve(recipe, quantity)

	this.Restore(old)

	return res
}

func (this AmountMap) Reserve(recipe *Recipe, quantity int) bool {
	old := this.Save()

	for kind, amount := range recipe.Items {
		have, ok := this[kind]

		if !ok || (ok && have < amount*quantity) {
			innerRecipe, exists := recipes[kind]

			if !exists {
				this.Restore(old)

				return false
			}

			if !this.Reserve(innerRecipe, amount*quantity) {
				this.Restore(old)

				return false
			}
		} else {
			this[kind] -= amount * quantity
		}

	}

	return true
}
