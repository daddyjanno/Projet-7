import { initHomePage } from "../utils/mainSearch.js";

let recipes = [];

export async function fetchData() {
  const response = await fetch("./ressources/data/recipes.json");
  recipes = (await response.json()).recipes;
  return recipes;
}

async function init() {
  initHomePage()
}
init();
