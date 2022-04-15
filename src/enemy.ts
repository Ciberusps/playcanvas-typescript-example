import EnemyHpBarView from "./ui/enemyHpBarView";
import { falledCheckEvents } from "./falledCheck";

import { createScript, attrib } from "./utils/createScriptDecorator";
import { ebEvents } from "./utils/events";

import { ScriptTypeBase } from "./types/ScriptTypeBase";

@createScript("enemy")
class Enemy extends ScriptTypeBase {
  @attrib({ type: "number", default: 3 })
  hp: number;

  @attrib({ type: "entity" })
  hpBarView: pc.Entity;

  maxHp: number;
  hpBarViewScript: EnemyHpBarView;

  initialize() {
    this.maxHp = this.hp;

    this.hpBarViewScript = (this.hpBarView.script as any)
      ?.enemyHpBarView as EnemyHpBarView;
    if (!this.hpBarViewScript) {
      console.warn("[Enemy] hpBarViewScript required");
    } else {
      this.hpBarViewScript.updateValues(this.hp, this.maxHp);
    }

    this.entity.on("damage", this.tryTakeDamage, this);
    this.entity.on?.(falledCheckEvents.falled, this.onFalled, this);
  }

  tryTakeDamage(damage: number) {
    this.hp -= damage;

    this.hpBarViewScript.updateValues(this.hp, this.maxHp);
    if (this.hp <= 0) {
      this.die();
    }
  }

  onFalled() {
    console.log("Enemy falled");
    this.tryTakeDamage(this.hp);
  }

  die() {
    this.app.fire(ebEvents["enemy:died"], this.entity);
    this.entity.destroy();
  }
}

export default Enemy;
