import Cell from "./Cell";

export default class RAM {
  ram = new Map();

  static getInstance() {
    if (!this.instance) {
      this.instance = new RAM();
    }

    return this.instance;
  }

  constructor() {
    this.initValues();
  }

  initValues() {
    this.inputs = document.querySelectorAll(".table input");
    this.initRAM();
  }

  initRAM() {
    for (let i = 0; i < 16; i++) {
      const address = i.toString(2).padStart(4, "0");
      const start = i * 15;
      const cell = new Cell(
        Array.prototype.slice.apply(this.inputs).slice(start, start + 15),
      );

      this.ram.set(address, cell);
    }
  }

  getByAddr(addr) {
    this.initRAM();
    return this.ram.get(addr);
  }
}
