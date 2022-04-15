import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";
import { ebEvents, lifecycleEvents, TPlayerScoreChangedEvent } from "../utils/events";

@createScript("playerScoreView")
class PlayerScoreView extends ScriptTypeBase {
  @attrib({ type: "entity" })
  scoreCountText: pc.Entity;

  initialize() {
    if (!this.scoreCountText?.element?.text) {
      console.warn("[PlayerScoreView] scoreCountText and text element on it required");
    }
    this.app.on(ebEvents["player:score:changed"], this.updateValues, this);
    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["player:score:changed"], this.updateValues, this);
  }

  updateValues({ newScore }: TPlayerScoreChangedEvent) {
    if (this.scoreCountText.element?.text) {
      this.scoreCountText.element.text = newScore.toString();
    }
  }
}

export default PlayerScoreView;
