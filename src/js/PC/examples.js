// Demo programs for the examples menu. Each program is a sparse map of
// memory cell index -> 15-bit row (spaces are stripped on load).
// Instruction rows: 3-bit code + three 4-bit addresses (A1 A2 A3).
const examples = [
  {
    name: "Add: 5 + 7",
    cells: {
      0: "001 1000 1001 1010", // ADD c8 + c9 -> c10
      1: "111 1000 1001 1010", // HALT: output c8, c9, c10
      8: "000 0000 0000 0101", // 5
      9: "000 0000 0000 0111", // 7
    },
  },
  {
    name: "Greater of two",
    cells: {
      0: "110 1000 1001 0011", // JG: if c8 > c9 goto 3
      1: "000 1001 0000 1010", // LW c9 -> c10
      2: "100 1100 1100 0100", // JEQ c12 == c12 -> goto 4 (always)
      3: "000 1000 0000 1010", // LW c8 -> c10
      4: "111 1000 1001 1010", // HALT: output c8, c9, c10
      8: "000 0000 0000 0110", // 6
      9: "000 0000 0000 1001", // 9
      12: "000 0000 0000 0001", // 1 (used for the unconditional jump)
    },
  },
  {
    name: "Multiply via loop: 3 x 4",
    cells: {
      0: "100 1011 1001 0100", // JEQ: if counter c11 == c9 goto 4
      1: "001 1010 1000 1010", // ADD c10 + c8 -> c10 (accumulate)
      2: "001 1011 1100 1011", // ADD c11 + c12 -> c11 (counter + 1)
      3: "100 1100 1100 0000", // JEQ c12 == c12 -> goto 0 (always)
      4: "111 1000 1001 1010", // HALT: output c8, c9, c10
      8: "000 0000 0000 0011", // 3
      9: "000 0000 0000 0100", // 4
      12: "000 0000 0000 0001", // 1
    },
  },
  {
    name: "Fibonacci (5 steps)",
    cells: {
      0: "100 1011 1101 0110", // JEQ: if counter c11 == c13 goto 6
      1: "001 1000 1001 1010", // ADD c8 + c9 -> c10
      2: "000 1001 0000 1000", // LW c9 -> c8
      3: "000 1010 0000 1001", // LW c10 -> c9
      4: "001 1011 1100 1011", // ADD c11 + c12 -> c11 (counter + 1)
      5: "100 1100 1100 0000", // JEQ c12 == c12 -> goto 0 (always)
      6: "111 1000 1001 1011", // HALT: output c8, c9, c11
      8: "000 0000 0000 0001", // fib a = 1
      9: "000 0000 0000 0001", // fib b = 1
      12: "000 0000 0000 0001", // 1
      13: "000 0000 0000 0101", // iterations = 5
    },
  },
];

export default examples;
