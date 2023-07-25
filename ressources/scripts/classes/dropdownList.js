
export class ElementLi {
  constructor(element, type) {
    this.element = element;
    this.type = type
  }
  renderElementLi() {
    const elementsDropdown = document.querySelector(`.${this.type}s__options`);
    const elementLi = document.createElement("li");
    elementLi.classList.add(`${this.type}__item`, "dropdown__item");
    elementLi.innerText = this.element.charAt(0).toUpperCase()+this.element.slice(1);
    elementsDropdown.appendChild(elementLi);
  }
  get ElementLi() {
    return this.renderElementLi()
  }
}
