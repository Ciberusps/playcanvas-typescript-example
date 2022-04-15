import { createScript, attrib } from "../utils/createScriptDecorator";
import { ebEvents, events, TOnPlayerScoreChanged } from "../utils/events";

import { ScriptTypeBase } from "../types/ScriptTypeBase";

@createScript("playerScoreView")
class PlayerScoreView extends ScriptTypeBase {
  @attrib({ type: "entity" })
  scoreCountText: pc.Entity;

  initialize() {
    if (!this.scoreCountText?.element?.text) {
      console.warn("[PlayerScoreView] scoreCountText and text element on it required");
    }
    this.app.on(ebEvents["player:score:changed"], this.updateValues, this);
    this.on?.(events.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["player:score:changed"], this.updateValues);
  }

  updateValues: TOnPlayerScoreChanged = function (score) {
    if (this.scoreCountText.element?.text) {
      this.scoreCountText.element.text = score.toString();
    }
  };
}

export default PlayerScoreView;
