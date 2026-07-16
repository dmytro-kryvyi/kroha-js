import Info from "./Parts/Info";

export default class Control {
  static getInstance() {
    if (!this.instance) {
      this.instance = new Control();
    }

    return this.instance;
  }

  constructor() {
    this.initValues();
    this.updateUI();
  }

  initValues() {
    this.focus = 0;
    this.inputs = document.querySelectorAll(".table input");
    this.addresses = document.querySelectorAll(".table__elem-adr");
    this.info = Info.getInstance();
    this.setFocus();
  }

  process(key) {
    switch (key) {
      case "ArrowRight":
      case "6":
        this.increaseFocus();
        break;
      case "ArrowLeft":
      case "4":
        this.decreaseFocus();
        break;
      case "ArrowUp":
      case "2":
        this.decreaseFocus(15);
        break;
      case "ArrowDown":
      case "8":
        this.increaseFocus(15);
        break;
      case "1":
        this.setNumberContent(1);
        break;
      case "0":
      case "Backspace":
        this.setNumberContent(0);
        break;
    }

    this.updateUI();
  }

  increaseFocus(num = 1) {
    this.focus = (this.focus + num) % this.inputs.length;
    this.setFocus();
  }

  decreaseFocus(num = 1) {
    if (num <= this.focus) {
      this.focus = this.focus - num;
    } else {
      this.focus = this.focus + this.inputs.length - num;
    }

    this.setFocus();
  }

  setFocus() {
    this.inputs[this.focus].focus({ preventScroll: true });
    this.inputs[this.focus].setSelectionRange(1, 1);
  }

  setNumberContent(value) {
    this.inputs[this.focus].value = value;
    this.increaseFocus(1);
  }

  setFocusVal(value, higlight = true) {
    this.focus = value;
    this.setFocus();
    this.updateUI();

    if (higlight) {
      this.addHighlight(value);
    }
  }

  removeHighlight() {
    for (let address of this.addresses) {
      if (address.classList.contains("active-adr")) {
        address.classList.remove("active-adr");
      }
    }
  }

  addHighlight(addr) {
    this.removeHighlight();
    this.addresses[addr / 15].classList.add("active-adr");
  }

  updateUI() {
    const addr = Math.trunc(this.focus / 15);
    const start = addr * 15;

    const line = Array.prototype.slice
      .apply(this.inputs)
      .slice(start, start + 15)
      .map((input) => input.value);

    this.info.updateUI(addr, line);
  }
}
