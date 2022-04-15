import { createScript, attrib } from "../utils/createScriptDecorator";

import { ScriptTypeBase } from "../types/ScriptTypeBase";

@createScript("enemyHpBarView")
class EnemyHpBarView extends ScriptTypeBase {
  @attrib({ type: "entity" })
  sliderImage: pc.Entity;

  updateValues(hp: number, maxHp: number) {
    const newScaleX = hp / maxHp;
    if (this.sliderImage.element?.width) {
      this.sliderImage.element.width = newScaleX;
    }
  }
}

export default EnemyHpBarView;
