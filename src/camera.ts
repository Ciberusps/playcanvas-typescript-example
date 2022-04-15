import { createScript, attrib } from "./utils/createScriptDecorator";
import { TJsonAttributeSchemaProp } from "./types/attributes";
import { ScriptTypeBase } from "./types/ScriptTypeBase";

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
  rotationX: number = 0;
  rotationY: number = 0;

  @attrib({ type: "vec2", default: [0.15, 0.1] })
  sensivity: pc.Vec2;
  @attrib({ type: "json", schema: pitchLimitScheme })
  pitchLimit: any;

  initialize() {
    // pointer lock
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, () => {
      if (pc.Mouse.isPointerLocked()) return;

      this.app.mouse.enablePointerLock();
    });

    // mouse move
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.rotate, this);
  }

  // TODO: add type
  rotate(e: any) {
    this.rotationY -= e.dx * this.sensivity.x;
    this.rotationX = pc.math.clamp(
      this.rotationX - e.dy * this.sensivity.y,
      this.pitchLimit.min,
      this.pitchLimit.max
    );
    this.entity.setLocalEulerAngles(this.rotationX, this.rotationY, 0);
  }
}
