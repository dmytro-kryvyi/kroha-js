# KrohaJS
## _A first-generation computer emulator_

## About
KROHA.JS is an emulator of a first-generation von Neumann machine with a CISC (complex instruction set) architecture. It is based on "Krokha", a real educational DOS program from 1995, with the amount of RAM increased to 16 cells.

Working with it feels like working with a first-generation computer: data and results are in binary, memory and registers are scarce, and there is no operating system.

> The computer does not distinguish between data and instructions — the programmer decides what each cell means.

## Interface
The emulator has five panels:

- **Memory (RAM)** — the main window; move the cursor here and enter your program bit by bit.
- **Info** — the current memory cell and the state of the computer.
- **Commands** — a quick reference of instruction codes and hotkeys, plus the Program toolbar.
- **ALU** — the state of the instruction register (IR), the accumulator (AC), and the program counter (PC).
- **Screen** — the cells output by the HALT instruction.

## Program toolbar
- **Examples...** — loads a demo program (add two numbers, greater of two, multiply via loop, Fibonacci).
- **Speed** — how fast Auto mode executes; the rightmost position runs instantly.
- **Share** — copies a link with the current program encoded in the URL, so you can send it to someone else.
- **Clear** — resets all memory cells to zero.

The program in memory is saved to the browser's localStorage on every edit and restored on your next visit.

## Modes
The computer runs in three modes:

- **Auto (A)** — executes instructions one after another until it reaches HALT. The Speed slider sets the pace; pressing Auto again pauses and resumes. Runaway programs are stopped after 5000 instructions with an "ERROR Infinite loop" message.
- **Step (S)** — executes one instruction per key press.
- **Tact (T)** — executes one clock cycle per key press and explains in the Info window what is happening.

Editing memory (0, 1, Backspace) or pressing E returns the computer to Editor mode and resets execution.

## Instructions
| Name | Code | Legend | Description |
| ------ | ------ | ------ | ------ |
| LW | 000 | A1 ==> A3 | Copy the value from the cell at address A1 to the cell at address A3 (A2 is unused) |
| ADD | 001 | A1 + A2 ==> A3 | Add the value at address A1 to the value at address A2; store the result at A3 |
| DIV | 010 | A1 / A2 ==> A3 | Divide the value at address A1 by the value at address A2; store the result at A3 (the fraction is discarded) |
| SUB | 011 | \|A1 - A2\| ==> A3 | Subtract the value at address A2 from the value at address A1; store the absolute value at A3 |
| JEQ | 100 | if A1 = A2 goto A3 | Jump to the instruction at address A3 if the values at A1 and A2 are equal |
| MUL | 101 | A1 * A2 ==> A3 | Multiply the value at address A1 by the value at address A2; store the result at A3 |
| JG | 110 | if A1 > A2 goto A3 | Jump to the instruction at address A3 if the value at A1 is greater than the value at A2 |
| HALT | 111 | STOP, OUTPUT | Stop execution and output the values at addresses A1, A2, A3 on the Screen |

> Cell values are 15-bit and unsigned (0–32767). Subtraction always stores the absolute value. Addition or multiplication overflow and division by zero stop the machine with an error message.

## Why KROHA.JS
The original "Krokha" is a DOS program, so the only way to run it on a modern computer is a DOS emulator or a virtual machine — inconvenient, and the age of the software causes plenty of problems along the way. KROHA.JS brings it to the browser. It was written for educational purposes while learning JavaScript.

## Development
```bash
npm install
npm run serve   # dev server on http://localhost:4200
npm run build   # production build in dist/
```

Pushes to `main` are deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`.
