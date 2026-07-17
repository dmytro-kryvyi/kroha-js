export default class PageBuilder {
  constructor(codeLen, addrLen, ramSize) {
    this.codeLen = codeLen;
    this.addrLen = addrLen;
    this.ramSize = ramSize;
    this.initValues();
  }

  initValues() {
    this.rowLen = this.codeLen + this.addrLen * 3;
    this.container = document.querySelector(".table");
  }

  buildComputer() {
    for (let i = 0; i < this.ramSize; i++) {
      this.insertColumn(i);

      for (let k = 0; k < this.rowLen; k++) {
        this.insertRow(i, k);
      }
    }
  }

  insertColumn(num) {
    const addr = num.toString(2).padStart(4, 0);

    this.container.insertAdjacentHTML(
      "beforeend",
      `<tr class="table__row" id="${"r" + num}">
        <td class="table__elem-adr">${addr}</td>
      </tr>`,
    );
  }

  insertRow(row, column) {
    const rowContainer = document.querySelector("#r" + row);
    rowContainer.insertAdjacentHTML(
      "beforeend",
      `<td class="table__elem-mem">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-1]"
          value="0"
          maxlength="1"
          id="${"i" + (row * this.rowLen + column)}"
        />
      </td>`,
    );
  }
}
