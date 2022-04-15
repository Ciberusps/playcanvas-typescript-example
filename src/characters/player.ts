import { createScript } from "../utils/createScriptDecorator";

import { ScriptTypeBase } from "../types/ScriptTypeBase";
import { ebEvents, events, TOnPlayerScoreChanged } from "../utils/events";

@createScript("player")
class Player extends ScriptTypeBase {
  score: number = 0;

  initialize() {
    this.setScore(0);

    this.app.on(ebEvents["enemy:died"], this.onEnemyKill, this);
    this.on?.(events.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["enemy:died"], this.onEnemyKill);
  }

  setScore(newScore: number) {
    this.score = newScore;

    const args: Parameters<TOnPlayerScoreChanged> = [this.score];
    this.app.fire(ebEvents["player:score:changed"], ...args);
  }

  onEnemyKill() {
    this.setScore(this.score + 1);
  }
}

export default Player;
