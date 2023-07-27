import { ElementLi } from "../classes/dropdownList.js";
import { Tag } from "../classes/tag.js";
import { fetchData } from "../pages/index.js";
import { renderRecipeCard, renderRecipesNumber, renderNoRecipes } from "../utils/recipes.js";
import { closeElementsList, emptyElementSearch, openElementsList } from "./elementsDropdown.js";

// initialisation des arrays
let filteredRecipesBySearch = [];
let filteredRecipesByTags = []
let filteredIngredients = []
let filteredApparels = []
let filteredUstensils = []
let searchBarValue = "";
let selectedElements = [];
let regex = /(?!<>)[a-z0-9]+$/;


export async function initHomePage() {

  // pour commencer, appelle la fonction mainSearch avec toutes les recettes
  let recipes = await fetchData();
  filteredRecipesBySearch = mainSearch(recipes, "");

  // on affiche les recettes, ainsi que le nombre de recettes
  renderRecipeCard(filteredRecipesBySearch);
  renderRecipesNumber(filteredRecipesBySearch);

  // on vient cibler la bare de recherche, on annule le rechargement de la page au submit du formulaire, et on lance la recherche avec la valeur du champ de recherche
  const searchButton = document.querySelector(".search__bar");
  const searchInput = document.querySelector(".search__input");
  searchButton.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBarValue = searchInput.value.toLowerCase();
    if (regex.test(searchBarValue)) {
      filteredRecipesBySearch = mainSearch(recipes, searchBarValue);
    }
  });
  // au keyup dans la barre de recherche, on appelle la fonction mainSearch avec ce qui a été tapé dans la barre de recherche en argument
  searchInput.addEventListener("keyup", async(event) => {
    searchBarValue = event.target.value.toLowerCase();
    if (regex.test(searchBarValue)) {
      filteredRecipesBySearch = mainSearch(recipes, searchBarValue);
    }
  })
  resetForm(recipes)

  // appel des fonctions qui gèrent l'ouverture et la fermeture des dropdown lists
  openElementsList("ingredient");
  openElementsList("apparel");
  openElementsList("ustensil");
}

// algorithme de recherche via searchbar
function getFilteredRecipes(recipes, searchValue) {

  let output = "";
  console.time("algorithme");
  for (let i = 0; i < 1e6; i++) {
    output+=i
  }
  let filteredRecipes = [];

  for (let recipe of recipes) {
    if (recipe.description.toLowerCase().includes(searchValue) || recipe.name.toLowerCase().includes(searchValue)) {
      filteredRecipes.push(recipe);
    } else {
      for (const ingredient of recipe.ingredients) {
        if (ingredient.ingredient.toLowerCase().includes(searchValue)) {
          filteredRecipes.push(recipe);
          break;
        }
      }
    }
  }
  console.timeEnd("algorithme");
  return filteredRecipes;
}

function renderElementLi(element, type) {
  new ElementLi(element, type).ElementLi
}

function renderFilteredElements(recipes, type) {
  // initialisation de l'array
  let filteredElements = []
  const elementsOptions = document.querySelector(`.${type}s__options`);
  elementsOptions.innerHTML = "";
  recipes.forEach(recipe => {
    // en fonction du type de l'élément, on l'envoie dans l'array correspondant si il n'y est pas déjà
    switch (type) {
      case "ingredient":
        recipe.ingredients.forEach(ingredient => {
          if (!filteredElements.includes(ingredient.ingredient.toLowerCase())) {
            filteredElements.push(ingredient.ingredient.toLowerCase());
            filteredElements = filteredElements.sort(function(a, b) {
              return a.localeCompare(b)
            });
          }
        })
        break;
      case "apparel":
        recipes.forEach(recipe => {
          if (!filteredElements.includes(recipe.appliance.toLowerCase())) {
            filteredElements.push(recipe.appliance.toLowerCase());
            filteredElements = filteredElements.sort(function(a, b) {
              return a.localeCompare(b)
            })
          }
        })
        break;
      case "ustensil":
        recipe.ustensils.forEach(ustensil => {
          if (!filteredElements.includes(ustensil.toLowerCase())) {
            filteredElements.push(ustensil.toLowerCase());
            filteredElements = filteredElements.sort(function(a, b) {
              return a.localeCompare(b)
            })
          }
        })
        break;
    }
  })
  // pour chaque élément de l'array, on le rend via la fonction renderElementLi
  filteredElements.forEach(element => renderElementLi(element, type));
  return filteredElements
}

async function manageTags() {
  // on vient sélectionner tous les éléments ayant la classe "dropdown item"
  const elementsList = document.querySelectorAll(`.dropdown__item`);
  elementsList.forEach(elementLi => {
    elementLi.addEventListener("click", async(event) => {
      const dropdown = event.target.parentElement.parentElement;
      const input = dropdown.querySelector(".dropdown__input");
      // au click sur un de ces éléments, on le push dans l'array selectedElements si il n'y est pas déjà
      if (!selectedElements.includes(elementLi.innerText.toLowerCase())) {
        selectedElements.push(elementLi.innerText.toLowerCase());
      }
      // on génère l'affichage du tag correspondant via la fonction renderElementTag()
      renderElementTag(selectedElements);
      // on donne la possibilité de supprimer le tag, ce qui enlevera également l'élément de l'array
      selectedElements = deleteTag(selectedElements);
      closeElementsList(event);
      let recipes = await fetchData()
      // on filtre toutes les recettes en fonction des éléments présents dans l'array
      filteredRecipesByTags = searchByTag(selectedElements, recipes);

      emptyElementSearch(input)

      // en rappelant la fonction, on permet de faire ce processus plusieurs fois de suite
      manageTags()
    })
  })
  return filteredRecipesByTags
}

function renderElementTag(selectedElementArray) {
  // dans l'élément ayant la classe "tag__wrapper", on vient vider le contenu HTML, puis pour chaque élément sélectionné, on crée le tag en appelant une nouvelle instance de la classe Tag
  const specificWrapper = document.querySelector(".tag__wrapper");
  specificWrapper.innerHTML = "";
  selectedElementArray.forEach(element => new Tag(element).selectedElement);
}

function deleteTag(selectedElementArray) {
  // on sélectionne tous les boutons "X" des tags, et au click, on sélectionne le tag, on cherche dans l'array des éléments sélectionné l'index du produit correspondant au tag, puis on supprime cet élément de l'array, on supprime le tag, et on actualise la liste des filteredRecipesByTags
  const tagsWrapper = document.querySelector(".tags__wrapper")
  const deleteButtons = tagsWrapper.querySelectorAll(".fa-xmark");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", async (event) => {
      const tag = event.target.parentElement.parentElement;
      const element = btn.parentElement.parentElement.querySelector(".tag__name").innerText.toLowerCase();
      const index = selectedElementArray.indexOf(element);
      selectedElementArray.splice(index, 1);
      let recipes = await fetchData()
      filteredRecipesByTags = searchByTag(selectedElements, recipes);
      tag.remove();
      manageTags();
    })
  })
  return selectedElementArray
}

async function searchInDropdowns(elements, type, recipes) {
  // en fonction du type d'élément, on sélectionne la barre de recherche de chaque menu dropdown, et on place un eventListener au keyup
  filteredRecipesByTags = recipes
  const elementsDropdown = document.querySelector(`.${type}s__container`);
  const elementSearch = elementsDropdown.querySelector(".dropdown__input");
  elementSearch.addEventListener("keyup", async(event) => {
    // à chaque keyup, on itinitialise l'array filtredElements, ainsi que la valeur de searchValue
    let filteredElements = []
    let searchValue = "";
    const elementsOptions = document.querySelector(`.${type}s__options`);
    if (event.target.value.length > 2 && regex.test(event.target.value)) {

    // si plus de 2 caractères sont entrés dans la barre de recherche, on filtre les éléments avec la valeur du champ de recherche, et pour chaque élément filtré on crée l'éléménet html
      searchValue = event.target.value.toLowerCase();
      filteredElements = elements.filter((element) => element.toLowerCase().includes(searchValue));
      elementsOptions.innerHTML = "";
      filteredElements.forEach(element => {
        renderElementLi(element, type);
      })
    } else {
    // si moins de 2 caractères, la valeur de searchValue sera une string vide
      elementsOptions.innerHTML = "";
      // renderFilteredElements(recipes, type);
      elements.forEach(element => {
        renderElementLi(element, type)
      })
    }
    manageTags()
    return elements
  })
  const form = elementsDropdown.querySelector(`.${type}s__headerContainer`)
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  })
}

// recherche par tag
function searchByTag(elements, recipes) {

  if (elements.length > 0) {
    recipes = filteredRecipesBySearch
    // si l'utilisateur a sélectionné des éléments dans l'un des 3 dropdoxn menu, pour chaque élement, on va appliquer notre algorithme de recherche afin de filtrer les recettes
    elements.forEach(element => {
      recipes = recipes.filter((recipe) =>
        recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase().includes(element))
        || recipe.appliance.toLowerCase().includes(element)
        || recipe.ustensils.some((ustensil) => ustensil.toLowerCase().includes(element))
      )
      if (recipes.length > 0) {
        // si l'algorithme de recherche trouve des résultats, on vient rendre les cards de recettes et le nombre de recettes
        renderRecipeCard(recipes);
        renderRecipesNumber(recipes)
      } else {
        // sinon, on affiche un message disant qu'il n'y a pas de résultats
        renderNoRecipes()
      }
    });
  } else {
    // si l'utilisateur n'a pas sélectionné d'éléments, on va prendre les recettes filtrées par la recherche principale, et rendres les cards de recettes ainsi que le nombre de recettes
    recipes = filteredRecipesBySearch
    renderRecipeCard(recipes);
    renderRecipesNumber(recipes)
  }
  filteredIngredients = renderFilteredElements(recipes, "ingredient");
  filteredApparels = renderFilteredElements(recipes, "apparel");
  filteredUstensils = renderFilteredElements(recipes, "ustensil");

  return recipes
}

// recherche à partir de la barre de recherche
function mainSearch(recipes, searchBarValue) {

  // si + de 2 caractères dans le champs de recherche, on filtre les recettes
  if (searchBarValue.length > 2 && regex.test(searchBarValue)) {
    filteredRecipesBySearch = getFilteredRecipes(recipes, searchBarValue)
  } else {
    filteredRecipesBySearch = getFilteredRecipes(recipes, "")
  }
  // s'il existe des recettes filtrées, on rend les cards et le nombre de recettes
  if (filteredRecipesBySearch.length > 0) {
    renderRecipeCard(filteredRecipesBySearch);
    renderRecipesNumber(filteredRecipesBySearch);
  } else {
    // sinoon on affiche un message d'erreur
    renderNoRecipes(searchBarValue)
    renderRecipesNumber(filteredRecipesBySearch);
  }
  filteredIngredients = renderFilteredElements(filteredRecipesBySearch,  "ingredient");
  filteredApparels = renderFilteredElements(filteredRecipesBySearch,  "apparel");
  filteredUstensils = renderFilteredElements(filteredRecipesBySearch,  "ustensil");

    // // appel des fonctions qui gèrent la recherche dans chaque dropdown menu
  searchInDropdowns(filteredIngredients, "ingredient", filteredRecipesBySearch)
  searchInDropdowns(filteredApparels, "apparel", filteredRecipesBySearch)
  searchInDropdowns(filteredUstensils, "ustensil", filteredRecipesBySearch)

  manageTags()
  return filteredRecipesBySearch
}

function resetForm(recipes) {
  const searchInput = document.querySelector(".search__input");
  const reset = document.querySelector(".search__reset")
  // on rend le bouton invisible tant que rien n'est rentré dans l'input, et visible dès qu'un caractère est rentré dans l'input
  searchInput.addEventListener("input", () => {
    if (searchInput.value === "") {
      reset.style.opacity = 0
    } else {
      reset.style.opacity = 1
    }
  })
  // au click sur le bouton, on efface le champ input et on update recipes avec potentiellement la recherche par tag s'il y en a de sélectionnés, puis on rend les cards et le nombre de recettes
  reset.addEventListener("click", async () => {
    searchInput.value = "";
    filteredRecipesBySearch = recipes
    recipes = searchByTag(selectedElements, recipes);
    manageTags();
    renderRecipeCard(recipes);
    renderRecipesNumber(recipes);
    reset.style.opacity = 0
  })
}
