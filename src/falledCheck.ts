import { ScriptTypeBase } from "./types/ScriptTypeBase";
import { OnCollisionEnd, OnCollisionStart } from "./types/lifecycle";

import { getCollisionHeight } from "./utils";
import { createScript, attrib } from "./utils/createScriptDecorator";
import { events } from "./utils/events";
import { IS_DEV } from "./utils/config";
import { entityTags } from "./utils/tags";

// for script debugging change on true TODO: debug subsystem
const IS_DEBUG = IS_DEV && false;

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
    this.entity.rigidbody?.on(events.collisionstart, this.onCollisionStart, this);
    this.entity.rigidbody?.on(events.collisionend, this.onCollisionEnd, this);
  }

  checkIsFalled() {
    if (!this.entity?.collision) return;

    const halfHeight = getCollisionHeight(this.entity.collision) / 2;
    const position = this.entity.getPosition();
    const from = new pc.Vec3(
      position.x,
      position.y - halfHeight + groundOffset,
      position.z
    );
    const to = new pc.Vec3(from.x, from.y - this.maxFallDistance, from.z);

    IS_DEBUG &&
      console.log("Raycast to find the 'ground'", { halfHeight, position, from, to });

    // @ts-ignore
    const result: pc.RaycastResult | undefined = this.app.systems.rigidbody.raycastFirst(
      from,
      to
    );

    if (!result || !result?.entity?.tags?.has(entityTags.ground)) {
      IS_DEBUG && console.info("Raycast has no result - falled");
      this.entity.fire(falledCheckEvents.falled);
    }
  }

  onCollisionStart: OnCollisionStart = function (result) {
    if (!result.other.tags.has(entityTags.ground)) return;
    clearTimeout(this.fallTimer);
  };

  onCollisionEnd: OnCollisionEnd = function (result) {
    if (!result.tags.has(entityTags.ground)) return;
    this.fallTimer = setTimeout(this.checkIsFalled.bind(this), this.checkDelay * 1000);
  };
}
