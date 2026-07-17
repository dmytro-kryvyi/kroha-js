import Info from "../Parts/Info";
import ALU from "../Parts/ALU";
import RAM from "../Parts/RAM";

export default class LW {
  constructor() {
    this.initValues();
  }

  initValues() {
    this.step = 1;
    this.ram = RAM.getInstance();
    this.alu = ALU.getInstance();
    this.info = Info.getInstance();
  }

  execute() {
    for (let i = 1; i < 5; i++) {
      this.executeStep(i);
    }
  }

  executeStep() {
    this.printStatus();

    switch (this.step) {
      case 1:
        this.alu.initIR();
        break;
      case 2:
        this.alu.incPC();
        break;
      case 3:
        this.alu.initAC();
        break;
      case 4: {
        const cell = this.ram.getByAddr(this.alu.getIR().getA3Bin());
        cell.setValueBin(this.alu.getAC().getValueBin());
        return 0;
      }
    }

    this.step++;
  }

  printStatus() {
    this.info.setStatusContent(tacts[this.step]);
  }
}

const tacts = {
  1: "Read the instruction at the PC address into the IR",
  2: "Increase the PC by 1 (prepare for the next instruction)",
  3: "Load the value at address A1 into the AC",
  4: "Write the AC to the cell at address A3",
};
