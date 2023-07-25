import { Recipe } from "../classes/recipe.js";


export function renderRecipeCard(recipes) {
  const recipes__section = document.querySelector(".recipes__section");
  recipes__section.innerHTML = ""
  recipes.map((recipe) =>
    recipes__section.appendChild(new Recipe(recipe).recipeCard)
  )
}

export function renderRecipesNumber(recipes) {
  const recipeNumber = document.querySelector(".recipes__number");
  recipeNumber.innerHTML = ""
  if (recipes) {
    if (recipes.length < 2) {
      recipeNumber.innerText = `${recipes.length} recette`
    } else {
      recipeNumber.innerText = `${recipes.length} recettes`
    }
  } else {
    recipeNumber.innerText = "0 recette";
  }
}

export function renderNoRecipes(search = "") {
  const recipes__section = document.querySelector(".recipes__section");
  if (search) {
    recipes__section.innerHTML = `<div class="recipes__noRecipe"><h2>Aucune recette ne contient "${search}", vous pouvez chercher "tarte aux pommes" ou "poisson", etc...</h2></div>`;
  } else {
    recipes__section.innerHTML = `<div class="recipes__noRecipe"><h2>Aucune recette ne correspond à votre recherche, vous pouvez chercher "tarte aux pommes" ou "poisson", etc...</h2></div>`
  }
}
