const display = document.querySelector('input[name="display"]');
const buttons = document.querySelectorAll('.button');

let justCalculated = false;

buttons.forEach(btn => {
  btn.addEventListener('click', () => handleInput(btn.value));
});

function handleInput(value) {
  if (value === "C") {
    clearAll();
    return;
  }

  if (value === "X") {
    deleteOne();
    return;
  }

  if (value === "=") {
    calculate();
    return;
  }

  if (value === "%") {
    addPercent();
    return;
  }

  if (justCalculated && isNumber(value)) {
    display.value = value;
    justCalculated = false;
    return;
  }

  if (isOperator(value)) {
    addOperator(value);
    return;
  }

  if (value === ".") {
    addDot();
    return;
  }

  addNumber(value);
}

/* ---------- core ---------- */

function clearAll() {
  display.value = "";
}

function deleteOne() {
  display.value = display.value.slice(0, -1);
}

/* ---------- percent display ---------- */

function addPercent() {
  if (!display.value) return;

  const lastChar = display.value.slice(-1);
  if (isOperator(lastChar) || lastChar === "%") return;

  display.value += "%";
  justCalculated = false;
}

/* ---------- calculation ---------- */

function calculate() {
  if (!display.value) return;

  try {
    let exp = display.value;

    // Handle percent expressions
    exp = resolvePercents(exp);

    exp = exp.replace(/×/g, "*").replace(/÷/g, "/");

    display.value = eval(exp);
    justCalculated = true;
  } catch {
    display.value = "Error";
  }
}

/* ---------- percent resolver ---------- */

function resolvePercents(exp) {
  // Case: number%
  exp = exp.replace(/(\d+\.?\d*)%/g, (_, num) => {
    return `(${num}/100)`;
  });

  // Case: A + B%, A - B%, A × B%, A ÷ B%
  exp = exp.replace(
    /(\d+\.?\d*)([+\-×÷])\((\d+\.?\d*)\/100\)/g,
    (_, base, op, percent) => {
      switch (op) {
        case "+":
          return base + "+" + "(" + base + "*" + percent + ")";
        case "-":
          return base + "-" + "(" + base + "*" + percent + ")";
        case "×":
          return base + "*" + percent;
        case "÷":
          return base + "/" + percent;
      }
    }
  );

  return exp;
}

/* ---------- input helpers ---------- */

function addNumber(num) {
  display.value += num;
}

function addOperator(op) {
  if (!display.value) return;

  const lastChar = display.value.slice(-1);
  if (isOperator(lastChar)) {
    display.value = display.value.slice(0, -1) + op;
  } else {
    display.value += op;
  }

  justCalculated = false;
}

function addDot() {
  const parts = display.value.split(/[+\-×÷]/);
  const lastPart = parts[parts.length - 1];

  if (!lastPart.includes(".")) {
    display.value += ".";
  }
}

function isOperator(val) {
  return ["+", "-", "×", "÷"].includes(val);
}

function isNumber(val) {
  return !isNaN(val);
}
