const STORAGE_KEY = "kroha-program";
const ROWS = 16;
const ROW_LEN = 15;
const BITS = ROWS * ROW_LEN;
const HEX_LEN = BITS / 4;

export default class Program {
  static inputs() {
    return document.querySelectorAll(".table input");
  }

  static readBits() {
    let bits = "";
    for (const input of Program.inputs()) {
      bits += input.value === "1" ? "1" : "0";
    }
    return bits;
  }

  static writeBits(bits) {
    const inputs = Program.inputs();
    for (let i = 0; i < BITS; i++) {
      inputs[i].value = bits[i] === "1" ? "1" : "0";
    }
  }

  static writeCells(cells) {
    let bits = "";
    for (let row = 0; row < ROWS; row++) {
      const rowBits = (cells[row] || "").replace(/\s/g, "");
      bits += rowBits.padStart(ROW_LEN, "0");
    }

    Program.writeBits(bits);
  }

  static toHex(bits) {
    return BigInt("0b" + bits)
      .toString(16)
      .padStart(HEX_LEN, "0");
  }

  static fromHex(hex) {
    if (!new RegExp(`^[0-9a-f]{1,${HEX_LEN}}$`, "i").test(hex)) {
      return null;
    }

    return BigInt("0x" + hex)
      .toString(2)
      .padStart(BITS, "0");
  }

  static save() {
    localStorage.setItem(STORAGE_KEY, Program.toHex(Program.readBits()));
  }

  // URL hash (#p=<hex>) wins over localStorage; once applied it is copied
  // to localStorage and dropped from the URL so later edits aren't
  // overridden by a stale hash on reload
  static restore() {
    const match = location.hash.match(/^#p=([0-9a-f]+)$/i);
    if (match) {
      const bits = Program.fromHex(match[1]);
      if (bits) {
        Program.writeBits(bits);
        Program.save();
        history.replaceState(null, "", location.pathname + location.search);
        return;
      }
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const bits = Program.fromHex(stored);
      if (bits) {
        Program.writeBits(bits);
      }
    }
  }

  static shareUrl() {
    const url = new URL(location.href);
    url.hash = "p=" + Program.toHex(Program.readBits());
    return url.toString();
  }
}
