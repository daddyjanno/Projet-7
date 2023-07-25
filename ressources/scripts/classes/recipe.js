
export class Recipe {
  constructor(recipe) {
    const { image, name, ingredients, time, description, appliance, ustensils} = recipe
    this.image = image;
    this.name = name;
    this.ingredients = ingredients;
    this.time = time;
    this.description = description;
    this.appliance = appliance;
    this.ustensils = ustensils;
  }
  get recipeCard() {
    return this.renderCard();
  }

  renderIngredientsinCard() {
    const ingredientsDiv = document.createElement("div");
    ingredientsDiv.classList.add("recipe__ingredientsDiv");
    const ingredientsTitle = document.createElement("h4");
    ingredientsTitle.innerText = "INGREDIENTS"
    ingredientsTitle.classList.add("recipe__ingredientsTitle");
    ingredientsDiv.appendChild(ingredientsTitle);
    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.classList.add("recipe__ingredientsContainer");
    ingredientsDiv.appendChild(ingredientsContainer)


    this.ingredients.forEach(ingredient => {
      const ingredientDiv = document.createElement("div");
      ingredientDiv.classList.add("recipe__ingredientContainer");
      ingredientsContainer.appendChild(ingredientDiv)
      const ingredientName = document.createElement("p");
      ingredientName.classList.add("recipe__ingredientName");
      ingredientName.innerText = ingredient.ingredient;
      ingredientDiv.appendChild(ingredientName)

      const quantity = document.createElement("p");
      quantity.classList.add("recipe__ingredientQuantity");
      quantity.innerText = `${ingredient.quantity || "-"} ${ingredient.unit ||""}`
      ingredientDiv.appendChild(quantity);
    });
    return ingredientsDiv;
  }

  renderCard() {
    const recipeSection = document.querySelector(".recipes__section")

    const article = document.createElement("article");
    article.classList.add("recipe__card");

    const image = document.createElement("img");
    image.src = `./ressources/assets/images/${this.image}`;
    image.classList.add("recipe__img");

    const title = document.createElement("h3");
    title.innerText = this.name;
    title.classList.add("recipe__title");

    const recette = document.createElement("div");
    recette.classList.add("recipe__recette");
    const recetteTitle = document.createElement("h4")
    recetteTitle.innerText = "RECETTE";
    const desc = document.createElement("div");
    desc.classList.add("recipe__desc")
    const descTitle = document.createElement("p")
    descTitle.innerText = this.description;
    descTitle.classList.add("recipe__descText");

    const ingredients = this.renderIngredientsinCard()

    const time = document.createElement("div");
    time.classList.add("recipe__time");
    const timeText = document.createElement("p");
    timeText.classList.add("timeText");
    timeText.innerText = `${this.time}min`;

    recipeSection.appendChild(article);
    article.appendChild(image);
    article.appendChild(title);
    article.appendChild(recette);
    recette.appendChild(recetteTitle);
    recette.appendChild(desc);
    desc.appendChild(descTitle);
    article.appendChild(ingredients);
    article.appendChild(time);
    time.appendChild(timeText)

    return article;
  }
}
