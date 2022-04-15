import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript } from "../utils/createScriptDecorator";
import { ebEvents, lifecycleEvents, TPlayerScoreChangedEvent } from "../utils/events";

@createScript("player")
class Player extends ScriptTypeBase {
  score: number = 0;

  initialize() {
    this.setScore(0);

    this.app.on(ebEvents["enemy:died"], this.onEnemyKill, this);
    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["enemy:died"], this.onEnemyKill, this);
  }

  setScore(newScore: number) {
    this.score = newScore;

    const eventData: TPlayerScoreChangedEvent = { newScore: this.score };
    this.app.fire(ebEvents["player:score:changed"], eventData);
  }

  onEnemyKill() {
    this.setScore(this.score + 1);
  }
}

export default Player;
