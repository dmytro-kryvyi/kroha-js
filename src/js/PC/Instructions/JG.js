import Info from "../Parts/Info";
import ALU from "../Parts/ALU";
import RAM from "../Parts/RAM";

export default class JG {
  constructor() {
    this.initValues();
  }

  initValues() {
    this.step = 1;
    this.condition = false;
    this.ram = RAM.getInstance();
    this.alu = ALU.getInstance();
    this.info = Info.getInstance();
  }

  execute() {
    for (let i = 1; i < 6; i++) {
      this.executeStep();
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
        const acVal = this.alu.getAC().getValueDec();
        const a2Val = this.ram
          .getByAddr(this.alu.getIR().getA2Bin())
          .getValueDec();

        this.condition = acVal > a2Val;
        break;
      }
      case 5:
        if (this.condition) {
          this.alu.setPCBin(this.alu.getIR().getA3Bin());
        }
        return 0;
    }

    this.step++;
  }

  printStatus() {
    if (this.condition) {
      this.info.setStatusContent(tacts[6]);
    } else {
      this.info.setStatusContent(tacts[this.step]);
    }
  }
}

const tacts = {
  1: "Read the instruction at the PC address into the IR",
  2: "Increase the PC by 1 (prepare for the next instruction)",
  3: "Load the value at address A1 into the AC",
  4: "Compare the AC with the value at address A2",
  5: "Condition not met — no jump",
  6: "Condition met — jump to the address in A3",
};
