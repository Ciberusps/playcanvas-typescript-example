import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { TJsonAttributeSchemaProp } from "../types/attributes";

import { lifecycleEvents } from "../utils/events";
import { createScript, attrib } from "../utils/createScriptDecorator";

const pitchLimitScheme: TJsonAttributeSchemaProp[] = [
  {
    name: "min",
    type: "number",
    default: -90,
  },
  {
    name: "max",
    type: "number",
    default: 90,
  },
];

@createScript("camera")
class Camera extends ScriptTypeBase {
  @attrib({ type: "vec2", default: [0.15, 0.1] })
  sensivity: pc.Vec2;
  @attrib({ type: "json", schema: pitchLimitScheme })
  pitchLimit: { min: number; max: number };

  rotationX: number = 0;
  rotationY: number = 0;

  initialize() {
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.lockPointer, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);

    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.lockPointer, this);
    this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
  }

  lockPointer() {
    if (pc.Mouse.isPointerLocked()) return;
    this.app.mouse.enablePointerLock();
  }

  onMouseMove(event: pc.MouseEvent) {
    this.rotationY -= event.dx * this.sensivity.x;
    this.rotationX = pc.math.clamp(
      this.rotationX - event.dy * this.sensivity.y,
      this.pitchLimit.min,
      this.pitchLimit.max
    );
    this.entity.setLocalEulerAngles(this.rotationX, this.rotationY, 0);
  }
}

export default Camera;
