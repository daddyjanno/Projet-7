
// affiche la div contenant la liste des options , et change le sens de la flèche en fonction
export function openElementsList(type) {
  const list = document.querySelector(`.${type}s__list`);
  const button = document.querySelector(`.${type}s__button`);
  button.addEventListener("click", function() {
    const sort = document.querySelector(`.${type}s__container`);
    if (list.classList.contains("dropdown__open")) {
      sort.querySelector("i").classList.toggle("fa-chevron-up");
      sort.querySelector("i").classList.toggle("fa-chevron-down");
      list.classList.toggle("dropdown__close");
      list.classList.toggle("dropdown__open");
    } else {
      sort.querySelector("i").classList.toggle("fa-chevron-down");
      sort.querySelector("i").classList.toggle("fa-chevron-up");
      list.classList.toggle("dropdown__close");
      list.classList.toggle("dropdown__open");
    }
  })
}

// ferme la dropdown list
export function closeElementsList(event) {
  const list = event.target.parentElement.parentElement;
  const sort = event.target.parentElement.parentElement.parentElement;
  sort.querySelector("i").classList.toggle("fa-chevron-up");
  sort.querySelector("i").classList.toggle("fa-chevron-down")
  list.classList.add("dropdown__close");
  list.classList.remove("dropdown__open");
}

// permet de vider le champ de recherche
export function emptyElementSearch(input) {
  input.value = ""
}
