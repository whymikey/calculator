import "./style.css";

const calculations = document.querySelector<HTMLSpanElement>(".calculations");
const calculationsResult = document.querySelector<HTMLSpanElement>(
  ".calculation__result",
);

const calculatorBtns = document.querySelector<HTMLDivElement>(
  ".calculator__buttons",
);

let expression: string = "";

function updateDisplay(expression: string): void {
  if (calculations) {
    calculations.textContent = expression || "0";
  }
}

if (calculatorBtns) {
  calculatorBtns.addEventListener("click", (evt: MouseEvent) => {
    if (evt.target instanceof HTMLButtonElement) {
      const text = evt.target.textContent?.trim() ?? "";
      if (evt.target.classList.contains("calculator__btn--clear")) {
        expression = "";
        updateDisplay(expression);
        if (calculationsResult) calculationsResult.textContent = "";
      } else if (evt.target.classList.contains("calculator__btn--delete")) {
        expression = expression.slice(0, -1);
        updateDisplay(expression);
      } else if (evt.target.classList.contains("calculator__btn--equals")) {
        if (!calculationsResult) return;
        if (!expression) {
          calculationsResult.textContent = "";
          return;
        }
        try {
          const result = evaluateExpression(expression);
          calculationsResult.textContent = Number.isFinite(result)
            ? `=${result}`
            : "Ошибка";
        } catch {
          calculationsResult.textContent = "Ошибка";
        }
      } else {
        expression += text;
        updateDisplay(expression);
      }
    }
  });
}

function evaluateExpression(expr: string): number {
  const sanitized = expr.replace(/[^0-9+\-*/.]/g, "");
  if (!sanitized) return 0;
  return Function(`"use strict"; return (${sanitized})`)() as number;
}

document.addEventListener("keydown", (evt: KeyboardEvent) => {
  const key = evt.key;
  if (key === "Escape") {
    expression = "";
    updateDisplay(expression);
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
  } else if (key === "Enter") {
    if (!calculationsResult) return;
    if (!expression) {
      calculationsResult.textContent = "";
      return;
    }
    try {
      const result = evaluateExpression(expression);
      calculationsResult.textContent = Number.isFinite(result)
        ? `=${result}`
        : "Ошибка";
    } catch {
      calculationsResult.textContent = "Ошибка";
    }
  } else if (/^[0-9+\-*/.]$/.test(key)) {
    expression += key;
    updateDisplay(expression);
  }
});

updateDisplay(expression);
