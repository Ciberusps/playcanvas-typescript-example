import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { getCollisionHeight, randomNumberInRange } from "../utils";
import { attrib, createScript } from "../utils/createScriptDecorator";
import { IS_DEV } from "../utils/config";
import { lifecycleEvents } from "../utils/events";
import { ebEvents } from "../utils/events";
import { entityTags } from "../utils/tags";

@createScript("spawner")
class Spawner extends ScriptTypeBase {
  @attrib({ type: "asset", assetType: "template" })
  enemiesTemplateAsset: pc.Asset;

  @attrib({ type: "entity" })
  enemiesParentEntity: pc.Entity;

  @attrib({ type: "vec3", default: [0, 0.25, 0] })
  spawnPositionOffset: pc.Vec3;

  spawnPositions: pc.Vec3[];

  initialize() {
    if (!this.enemiesTemplateAsset || !this.enemiesParentEntity) {
      IS_DEV &&
        console.warn("[spawner] enemiesTemplateAsset and enemiesParentEntity required");
      return;
    }

    const enemies = this.entity.findByTag(entityTags.damageable);
    const player = this.entity.findByTag(entityTags.player)[0];
    this.spawnPositions = [
      player.getPosition().clone(),
      ...enemies.map((e) => e.getPosition().clone()),
    ];

    this.app.on(ebEvents["player:falled"], this.spawnAtRandomPoint, this);
    this.app.on(ebEvents["enemy:died"], this.spawnAtRandomPoint, this);

    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["player:falled"], this.spawnAtRandomPoint, this);
    this.app.off(ebEvents["enemy:died"], this.spawnAtRandomPoint, this);
  }

  spawnAtRandomPoint(entity: pc.Entity) {
    // here "sweep test" should be used - sweep a shape down(box, capsule...)
    // and check if something blocks spawn
    const randomIdx = randomNumberInRange(0, this.spawnPositions.length);

    let spawnPoint = this.spawnPositions[randomIdx];
    spawnPoint = spawnPoint.add(this.spawnPositionOffset);
    spawnPoint.y += getCollisionHeight(entity.collision);

    if (entity.tags.has(entityTags.damageable)) {
      const newEnemy = this.enemiesTemplateAsset.resource.instantiate();
      this.enemiesParentEntity.addChild(newEnemy);
      newEnemy.rigidbody?.teleport(spawnPoint, pc.Vec3.ZERO);
    } else {
      entity.rigidbody?.teleport(spawnPoint, pc.Vec3.ZERO);
    }
  }
}

export default Spawner;
