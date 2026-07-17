const acc = document.querySelectorAll(".accordion__btn");

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");

    const panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;

      for (let node of this.nextElementSibling.childNodes) {
        if (node.className === "accordion") {
          if (node.firstElementChild.classList.contains("active")) {
            node.firstElementChild.classList.remove("active");
            node.firstElementChild.nextElementSibling.style.maxHeight = null;
          }
        }
      }
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";

      const parentHeight = this.parentElement.parentElement.style.maxHeight;
      if (parentHeight) {
        this.parentElement.parentElement.style.maxHeight =
          parseInt(parentHeight) + panel.scrollHeight + "px";
      }
    }
  });
}
