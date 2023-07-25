export class Tag {
  constructor(element) {
    this.element = element;
  }
  renderSelectedElement() {
    const tagWrapper = document.querySelector(".tag__wrapper")
    const div = document.createElement("div");
    div.classList.add(`tag__container`)
    const tag = document.createElement("p");
    tag.classList.add("tag__name");
    tag.innerText = this.element.charAt(0).toUpperCase()+this.element.slice(1);
    const close = document.createElement("span");
    close.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    close.classList.add("tag__delete");
    tagWrapper.appendChild(div);
    div.appendChild(tag);
    div.appendChild(close);
  }
  get selectedElement() {
    return this.renderSelectedElement()
  }
}
