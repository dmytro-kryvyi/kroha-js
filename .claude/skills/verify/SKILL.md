---
name: verify
description: Build and drive the KrohaJS emulator in headless Chrome to verify changes end-to-end.
---

# Verifying KrohaJS

## Build & run

- `npm run build` → static site in `dist/` (index.html + hashed js/css). No server needed: `file:///…/dist/index.html` works in Chrome.
- `npm run serve` → dev server on port 4200 (add `--no-open` when headless).

## Drive it (headless Chrome)

System Chrome lives at `/usr/bin/google-chrome`. Install `puppeteer-core` in the scratchpad and launch with `{ executablePath: "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox"] }`.

The whole app is keyboard-driven; puppeteer `page.keyboard.press(...)` exercises the real input path:

- On load, focus is on memory bit 0; typing `0`/`1` writes a bit and auto-advances, so a program is entered by typing rows of 15 bits in sequence. Arrows move the cursor.
- `a` = run (auto), `s` = one instruction (step), `t` = one clock (tact). Any `0`/`1`/`Backspace`/`e` resets to Editor mode.
- Instruction row layout: 3-bit code + three 4-bit addresses. Codes: 000 LW, 001 ADD, 010 DIV, 011 SUB, 100 JEQ, 101 MUL, 110 JG, 111 HALT (outputs cells A1,A2,A3).

## Read state back

- Memory: the 240 `<input>` elements in DOM order, 15 per cell (cell N = inputs N*15 … N*15+14).
- Status line: `.info__status` textContent (errors look like `ERROR Division by zero`, `ERROR Overflow`).
- Mode: `.mode-content`; screen output: `.screenB` (binary) and `.screenDec` (decimal).

## Toolbar

- Exists twice: in the Commands panel (visible > 1200px, target with `.commands__inner .btn-share` etc.) and under the memory table (`.toolbar--table`, visible ≤ 1200px). JS syncs both instances.
- `.program-select` — examples dropdown (drive with `page.select`); `.speed-slider` — range 0–1000, delay = 1000 − value, 1000 = instant synchronous run; `.btn-share` / `.btn-clear`.
- Program auto-saves to localStorage (`kroha-program`, hex) on every edit; `#p=<hex>` URL hash overrides it on load and is then dropped from the URL.

## Gotchas

- Viewports ≤ 810px wide switch to the mobile layout where the desktop `.info` panel (and its Auto/Step/Tact buttons) is `display: none` — set a ≥ 1280px viewport in puppeteer or clicks on `.btn-auto` fail as "not clickable".
- All file:// pages share one localStorage; `localStorage.clear()` + reload for clean-state tests.

- Cells are 15-bit unsigned; max value 32767. ADD/MUL overflow and DIV by zero halt with an ERROR status.
- A useful minimal program: row0 = op `0010 0011 0100` (c2, c3 → c4), row1 = HALT `111 0100 0100 0100`, then values in cells 2 and 3.
