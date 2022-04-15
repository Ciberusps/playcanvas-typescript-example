import { ScriptTypeBase } from "../types/ScriptTypeBase";

import { createScript, attrib } from "../utils/createScriptDecorator";
import { ebEvents, lifecycleEvents, TWeaponAmmoChangedEvent } from "../utils/events";

@createScript("playerAmmoView")
class PlayerAmmoView extends ScriptTypeBase {
  @attrib({ type: "entity" })
  ammoCountText: pc.Entity;
  @attrib({ type: "entity" })
  totalAmmoCountText: pc.Entity;

  initialize() {
    if (!this.ammoCountText?.element?.text || !this.totalAmmoCountText.element?.text) {
      console.warn("[PlayerAmmoView] scoreCountText and text element on it required");
    }
    this.app.on(ebEvents["weapon:ammo:changed"], this.updateValues, this);
    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.off(ebEvents["weapon:ammo:changed"], this.updateValues, this);
  }

  updateValues({ ammo, totalAmmo }: TWeaponAmmoChangedEvent) {
    if (this.ammoCountText.element?.text) {
      this.ammoCountText.element.text = ammo.toString();
    }
    if (this.totalAmmoCountText.element?.text) {
      this.totalAmmoCountText.element.text =
        totalAmmo === Number.POSITIVE_INFINITY ? "infinite" : totalAmmo.toString();
    }
  }
}

export default PlayerAmmoView;
