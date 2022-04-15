import { pc } from "playcanvas";

declare global {
  const pc: typeof pc;

  type TDebugSystem = {
    enabledCategories: TDebugCategory[];
    isCategoryEnabled(category: TDebugCategory): boolean;
    enableCategory(category: TDebugCategory): void;
  };

  type TTimeout = ReturnType<typeof setTimeout>;
  type TInterval = ReturnType<typeof setInterval>;

  interface Window {
    debugSystem: TDebugSystem;
  }
}
