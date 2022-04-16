import { ScriptTypeBase } from "../../types/ScriptTypeBase";

import DebugSystem from "../../utils/debugSystem";
import { getCollisionHeight } from "../../utils";
import { createScript, attrib } from "../../utils/createScriptDecorator";
import { lifecycleEvents } from "../../utils/events";
import { entityTags } from "../../utils/tags";
import { IS_DEV } from "../../utils/config";
import TraceUtils from "../../utils/traceUtils";

export const falledCheckEvents = { falled: "falled" };
const groundOffset = 0.05;

@createScript("falledCheck")
class FalledCheck extends ScriptTypeBase {
  @attrib({
    type: "number",
    default: 2,
    description: "Delay before checking that entity falled",
  })
  checkDelay: number;

  @attrib({
    type: "number",
    default: 10,
    description: "Max distance to check",
  })
  maxFallDistance: number;

  fallTimer: TTimeout;

  initialize() {
    if (!this.entity.rigidbody || !this.entity.collision) {
      IS_DEV && console.warn("[falledCheck] rigidbody and collision required");
      return;
    }
    this.entity.rigidbody?.on(
      lifecycleEvents.collisionstart,
      this.onCollisionStart,
      this
    );
    this.entity.rigidbody?.on(lifecycleEvents.collisionend, this.onCollisionEnd, this);
  }

  checkIsFalled() {
    const isDebug = DebugSystem.isCategoryEnabled("character");
    if (!this.entity?.collision) return;

    const halfHeight = getCollisionHeight(this.entity.collision) / 2;
    const position = this.entity.getPosition();
    const from = new pc.Vec3(
      position.x,
      position.y - halfHeight + groundOffset,
      position.z
    );
    const to = new pc.Vec3(from.x, from.y - this.maxFallDistance, from.z);

    if (isDebug) {
      console.log("Raycast to find the 'ground'", { halfHeight, position, from, to });
    }

    const result = TraceUtils.raycastFirst(this.app, from, to);

    if (!result || !result?.entity?.tags?.has(entityTags.ground)) {
      if (isDebug) {
        console.info("Raycast has no result - falled");
      }
      this.entity.fire(falledCheckEvents.falled);
    }
  }

  onCollisionStart(result: pc.ContactResult) {
    if (!result.other.tags.has(entityTags.ground)) return;
    clearTimeout(this.fallTimer);
  }

  onCollisionEnd(result: pc.Entity) {
    if (!result.tags.has(entityTags.ground)) return;
    this.fallTimer = setTimeout(this.checkIsFalled.bind(this), this.checkDelay * 1000);
  }
}

export default FalledCheck;
