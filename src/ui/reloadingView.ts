import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";
import { ebEvents, lifecycleEvents } from "../utils/events";

@createScript("reloadingView")
class ReloadingView extends ScriptTypeBase {
  @attrib({ type: "entity" })
  reloadingText: pc.Entity;

  initialize() {
    if (!this.reloadingText?.element?.text) {
      console.warn("[ReloadingView] reloadingText and text element on it required");
    }
    this.app.on(ebEvents["weapon:reloading:changed"], this.updateValues, this);
    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["weapon:reloading:changed"], this.updateValues, this);
  }

  updateValues(isReloading: boolean) {
    if (this.reloadingText.element?.text) {
      this.reloadingText.element.enabled = isReloading;
    }
  }
}

export default ReloadingView;
