import "../scss/style.scss";
import Computer from "./PC/Computer";
import PageBuilder from "./PC/pageBuilder";
import Program from "./PC/Program";
import examples from "./PC/examples";
import Info from "./PC/Parts/Info";

new PageBuilder(3, 4, 16).buildComputer();

Program.restore();

const inputs = document.querySelectorAll(".table input");

const computer = new Computer();

const control = computer.getControl();

// Resolve a key press to an emulator command independently of the keyboard
// layout: the typed character wins (so any Latin layout works as labeled),
// otherwise the physical key position decides (so non-Latin layouts like
// Cyrillic work without switching)
function toCommand(e) {
  if (e.key.startsWith("Arrow") || e.key === "Backspace") {
    return e.key;
  }

  if (/^[0-9]$/.test(e.key)) {
    return e.key;
  }

  const letter = e.key.toUpperCase();
  if (["A", "S", "T", "E"].includes(letter)) {
    return letter;
  }

  const physical =
    e.code.match(/^(?:Digit|Numpad)([0-9])$/) || e.code.match(/^Key([ASTE])$/);

  return physical ? physical[1] : null;
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return;
  }

  // Intercept printable characters (so nothing but the emulator writes into
  // the cells), Backspace and arrows; let F5, Tab, Escape etc. through
  const isPrintable = e.key.length === 1;
  if (!isPrintable && e.key !== "Backspace" && !e.key.startsWith("Arrow")) {
    return;
  }

  e.preventDefault();

  const command = toCommand(e);
  if (!command) {
    return;
  }

  control.process(command);

  switch (command) {
    case "A":
      computer.auto();
      break;
    case "S":
      computer.step();
      break;
    case "T":
      computer.tact();
      break;
    case "1":
    case "0":
    case "Backspace":
      computer.reset();
      Program.save();
      break;
    case "E":
      computer.reset();
  }
});

for (let input of inputs) {
  input.addEventListener("click", function () {
    control.setFocusVal(parseInt(this.id.slice(1)), false);
  });

  // Paste and mobile keyboards bypass the keydown handler — force binary
  input.addEventListener("input", function () {
    this.value = this.value === "1" ? "1" : "0";
    control.updateUI();
    Program.save();
  });
}

// The toolbar exists twice (desktop Commands panel and under the table on
// small screens) — wire every instance and keep them in sync
const exampleSelects = document.querySelectorAll(".program-select");

exampleSelects.forEach((select) => {
  examples.forEach((example, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = example.name;
    select.append(option);
  });

  select.addEventListener("change", function () {
    const example = examples[this.value];
    if (!example) {
      return;
    }

    computer.reset();
    Program.writeCells(example.cells);
    Program.save();
    exampleSelects.forEach((s) => (s.value = ""));
    control.setFocusVal(0, false);
  });
});

document.querySelectorAll(".btn-share").forEach((btn) =>
  btn.addEventListener("click", async () => {
    const url = Program.shareUrl();
    history.replaceState(null, "", url);

    try {
      await navigator.clipboard.writeText(url);
      Info.getInstance().setStatusContent("Link copied");
    } catch {
      Info.getInstance().setStatusContent("Link is in the URL bar");
    }
  })
);

document.querySelectorAll(".btn-clear").forEach((btn) =>
  btn.addEventListener("click", () => {
    computer.reset();
    Program.writeCells({});
    Program.save();
    control.setFocusVal(0, false);
  })
);

const speedSliders = document.querySelectorAll(".speed-slider");

const applySpeed = (value) => {
  computer.setSpeed(1000 - Number(value));
  speedSliders.forEach((s) => (s.value = value));
};

speedSliders.forEach((slider) =>
  slider.addEventListener("input", () => applySpeed(slider.value))
);
applySpeed(speedSliders[0].value);

document
  .querySelectorAll(".btn-auto")
  .forEach((btn) => btn.addEventListener("click", () => computer.auto()));

document
  .querySelectorAll(".btn-step")
  .forEach((btn) => btn.addEventListener("click", () => computer.step()));

document
  .querySelectorAll(".btn-tact")
  .forEach((btn) => btn.addEventListener("click", () => computer.tact()));

