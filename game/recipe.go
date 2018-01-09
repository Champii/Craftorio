package game

import (
	"io/ioutil"
	"time"

	yaml "gopkg.in/yaml.v2"
)

type RecipeBook map[Kind]*Recipe

type Recipe struct {
	Kind     Kind
	Items    AmountMap
	Duration time.Duration
}

func SetupRecipes(filename string) error {
	content, err := ioutil.ReadFile(filename)

	if err != nil {
		return err
	}

	res := map[string]interface{}{}

	err = yaml.Unmarshal(content, res)

	if err != nil {
		return err
	}

	for str, rec := range res["recipes"].(map[interface{}]interface{}) {
		recipe := Recipe{
			Kind:     StringToKind(str.(string)),
			Items:    make(AmountMap),
			Duration: time.Duration(rec.(map[interface{}]interface{})["duration"].(int)) * time.Second,
		}

		for strKind, amount := range rec.(map[interface{}]interface{})["items"].(map[interface{}]interface{}) {
			recipe.Items[StringToKind(strKind.(string))] = amount.(int)
		}

		recipes[StringToKind(str.(string))] = &recipe
	}

	return nil
}
