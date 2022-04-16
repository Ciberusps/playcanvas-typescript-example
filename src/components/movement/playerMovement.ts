import { ScriptTypeBase } from "../../types/ScriptTypeBase";

import { falledCheckEvents } from "./falledCheck";

import { createScript, attrib } from "../../utils/createScriptDecorator";
import { ebEvents, lifecycleEvents } from "../../utils/events";
import { entityTags } from "../../utils/tags";

@createScript("playerMovement")
class PlayerMovement extends ScriptTypeBase {
  direction = new pc.Vec3(0, 0, 0);
  jumpAvailable = true;

  @attrib({ type: "entity" })
  cameraEntity?: pc.Entity;
  @attrib({ type: "number", default: 8 })
  speed: number;
  @attrib({ type: "number", default: 4 })
  jumpPower: number;

  initialize() {
    this.entity.rigidbody?.on(
      lifecycleEvents.collisionstart,
      this.onCollisionStart,
      this
    );

    this.entity.on?.(falledCheckEvents.falled, this.onFalled, this);
  }

  onCollisionStart(result: pc.ContactResult) {
    const { tags } = result.other;
    if (!tags.has(entityTags.ground, entityTags.damageable)) {
      return;
    }

    this.jumpAvailable = true;
  }

  onFalled() {
    this.app.fire(ebEvents["player:falled"], this.entity);
  }

  update() {
    if (!this.cameraEntity || !this.entity.rigidbody?.enabled) {
      return;
    }

    // WASD
    if (this.app.keyboard.isPressed(pc.KEY_A))
      this.direction.sub(this.cameraEntity.right);

    if (this.app.keyboard.isPressed(pc.KEY_D))
      this.direction.add(this.cameraEntity.right);

    if (this.app.keyboard.isPressed(pc.KEY_W))
      this.direction.add(this.cameraEntity.forward);

    if (this.app.keyboard.isPressed(pc.KEY_S))
      this.direction.sub(this.cameraEntity.forward);

    this.direction.mulScalar(this.speed);

    // SPACE (jump)
    if (this.app.keyboard.wasPressed(pc.KEY_SPACE) && this.jumpAvailable) {
      this.direction.y = this.jumpPower;
      this.jumpAvailable = false;
    } else {
      this.direction.y = this.entity.rigidbody.linearVelocity.y;
    }

    this.entity.rigidbody.linearVelocity = this.direction;
    this.direction.set(0, this.direction.y, 0);
  }
}

export default PlayerMovement;
