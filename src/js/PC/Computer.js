import Control from "./Control";
import ALU from "./Parts/ALU";
import Info from "./Parts/Info";
import RAM from "./Parts/RAM";
import Screen from "./Parts/Screen";
import Instruction from "./Instructions/Instruction";

export default class Computer {
  constructor(inputs) {
    this.inputs = inputs;
    this.initValues();
  }

  initValues() {
    this.ram = RAM.getInstance();
    this.alu = ALU.getInstance();
    this.info = Info.getInstance();
    this.control = Control.getInstance();
    this.screen = Screen.getInstance();
    this.instruction = null;
    this.isHalted = false;
    this.autoTimer = null;
    this.delay = 250;
  }

  getControl() {
    return this.control;
  }

  setSpeed(delay) {
    this.delay = delay;
  }

  stopAuto() {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  // Pressing Auto while running pauses; delay 0 runs instantly like the
  // original program
  auto() {
    if (this.autoTimer) {
      this.stopAuto();
      this.info.setStatusContent("Paused");
      return;
    }

    if (this.isHalted) {
      this.reset();
      return;
    }

    this.info.setModeContent("Auto");

    if (this.delay === 0) {
      let flag = 0;
      while (!this.isHalted) {
        if (flag < 5000) {
          this.executeInstruction();
          flag++;
        } else {
          this.reset();
          this.info.setStatusContent("ERROR Infinite loop");
          break;
        }
      }
      return;
    }

    let flag = 0;
    const tick = () => {
      this.executeInstruction();
      flag++;

      if (this.isHalted) {
        this.autoTimer = null;
      } else if (flag >= 5000) {
        this.autoTimer = null;
        this.reset();
        this.info.setStatusContent("ERROR Infinite loop");
      } else {
        this.autoTimer = setTimeout(tick, this.delay);
      }
    };

    this.autoTimer = setTimeout(tick, this.delay);
  }

  step() {
    this.stopAuto();
    this.info.setModeContent("Step");
    if (this.isHalted) {
      this.reset();
      return;
    }

    this.executeInstruction();
  }

  tact() {
    this.stopAuto();
    this.info.setModeContent("Tact");
    if (this.isHalted) {
      this.reset();
      return;
    }

    this.selectInstruction();

    const tact = this.instruction.executeStep();

    this.processResult(tact);
    this.control.updateUI();
  }

  processResult(tact) {
    if (tact === 0) {
      this.instruction = null;
    } else if (tact === -1) {
      this.instruction = null;
      this.isHalted = true;
      this.control.removeHighlight();
    }
  }

  selectInstruction() {
    if (!this.instruction) {
      this.control.setFocusVal(this.alu.getPCDec() * 15);

      const code = this.ram.getByAddr(this.alu.getPCBin()).getCodeBin();
      this.instruction = Instruction.getInstruction(code);
    }
  }

  executeInstruction() {
    this.selectInstruction();
    if (this.instruction.execute() === -1) {
      this.processResult(-1);
    }
    this.instruction = null;
    this.control.updateUI();
  }

  reset() {
    this.stopAuto();
    this.instruction = null;
    this.isHalted = false;
    this.info.setModeContent("Editor");
    this.info.setStatusContent("");
    this.control.removeHighlight();
    this.alu.reset();
    this.screen.resetScreen();
  }
}
