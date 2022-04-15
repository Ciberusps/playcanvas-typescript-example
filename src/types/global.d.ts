import { pc } from "playcanvas";

declare global {
  const pc: typeof pc;

  type TTimeout = ReturnType<typeof setTimeout>;
  type TInterval = ReturnType<typeof setInterval>;
}
