export type CardAction = "enter" | "leave" | "move";

const CURVE = "cubic-bezier(0.46, 1, 0.29, 0.99)";
const MOVE_MS = 500;
const OPEN_MS = 400;
const CLOSE_MS = 300;

function geometry(ms: number): string {
  return `transform ${ms}ms ${CURVE}, width ${ms}ms ${CURVE}, height ${ms}ms ${CURVE}`;
}

export function cardTransition(action: CardAction): string {
  if (action === "enter") {
    return `${geometry(OPEN_MS)}, opacity ${OPEN_MS}ms ${CURVE}`;
  }
  if (action === "leave") {
    return `${geometry(CLOSE_MS)}, opacity ${CLOSE_MS}ms linear`;
  }
  return geometry(MOVE_MS);
}
