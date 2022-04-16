import { ScriptTypeBase } from "../../types/ScriptTypeBase";

import { createScript, attrib } from "../../utils/createScriptDecorator";
import { ebEvents, lifecycleEvents, TWeaponAmmoChangedEvent } from "../../utils/events";
import TraceUtils from "../../utils/traceUtils";

const defaultAmmoCount = 30;

@createScript("shooting")
class Shooting extends ScriptTypeBase {
  @attrib({ type: "entity" })
  cameraEntity?: pc.Entity;
  @attrib({ type: "entity" })
  particlesEntity?: pc.Entity;
  @attrib({ type: "entity" })
  gunEntity?: pc.Entity;
  @attrib({
    type: "number",
    default: 50,
    min: 1,
    description: "Time between 'shots' in ms",
  })
  fireRateMs: number = 50;
  @attrib({ type: "number", default: defaultAmmoCount, min: 1 })
  ammo: number;
  @attrib({ type: "number", default: defaultAmmoCount, min: 1 })
  maxAmmo: number;
  @attrib({ type: "boolean", default: true })
  autoReload: boolean;
  @attrib({
    type: "number",
    default: 1,
    min: 0.01,
    description: "Reload time in seconds",
  })
  reloadTime: number;

  shotTimer: TInterval;
  reloadingTimer: TTimeout;
  isReloading: boolean = false;

  initialize() {
    if (!this.cameraEntity || !this.particlesEntity) {
      console.warn("[Shooting] cameraEntity && particlesEntity required");
    }

    this.setAmmo(this.ammo);
    this.app.fire(ebEvents["weapon:reloading:changed"], false);

    // player controller and "pawn" should be splitted
    // controller should handle events and send to "pawn"(player or ai enemy)
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    this.on?.(lifecycleEvents.destroy, this.onDestroy, this);
  }

  onDestroy() {
    this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    this.app.keyboard.off(pc.EVENT_KEYDOWN, this.onKeyDown, this);
  }

  setAmmo(newAmmo: number) {
    this.ammo = newAmmo;

    const data: TWeaponAmmoChangedEvent = {
      ammo: this.ammo,
      totalAmmo: Number.POSITIVE_INFINITY,
    };
    this.app.fire(ebEvents["weapon:ammo:changed"], data);
  }

  canShoot(): boolean {
    return this.ammo > 0 && !this.isReloading;
  }

  makeShot() {
    const cameraComponent = this.cameraEntity?.camera;
    if (!cameraComponent) {
      console.warn("[Shooting] cameraComponent required");
      return;
    }

    if (!this.canShoot()) {
      this.stopFire();
      if (this.ammo === 0 && this.autoReload) {
        this.startReload();
      }
      return;
    }

    this.setAmmo(this.ammo - 1);

    if (this.particlesEntity) {
      this.particlesEntity.particlesystem?.reset();
      this.particlesEntity.particlesystem?.play();
    }

    // screen center
    const x = this.app.graphicsDevice.width / 2;
    const y = this.app.graphicsDevice.height / 2;

    const from = cameraComponent.screenToWorld(x, y, cameraComponent.nearClip);
    const to = cameraComponent.screenToWorld(x, y, cameraComponent.farClip);

    const result = TraceUtils.raycastFirst(this.app, from, to);

    if (!result || !result.entity.tags.has("damageable")) return;
    result.entity.fire("damage", 1);
  }

  startFire() {
    clearInterval(this.shotTimer);
    this.shotTimer = setInterval(this.makeShot.bind(this), this.fireRateMs);
  }

  stopFire() {
    clearInterval(this.shotTimer);
  }

  startReload() {
    if (this.ammo === this.maxAmmo || this.isReloading) return;
    this.isReloading = true;
    this.reloadingTimer = setTimeout(this.endReload.bind(this), this.reloadTime * 1000);
    this.gunEntity?.rotateLocal(45, 0, 0);
    this.app.fire(ebEvents["weapon:reloading:changed"], true);
  }

  endReload() {
    this.isReloading = false;
    this.setAmmo(this.maxAmmo);
    clearTimeout(this.reloadingTimer);
    this.gunEntity?.rotateLocal(-45, 0, 0);
    this.app.fire(ebEvents["weapon:reloading:changed"], false);
  }

  onMouseDown(event: pc.MouseEvent) {
    if (event.button === pc.MOUSEBUTTON_LEFT) this.startFire();
  }

  onMouseUp(event: pc.MouseEvent) {
    if (event.button === pc.MOUSEBUTTON_LEFT) this.stopFire();
  }

  onKeyDown(event: pc.KeyboardEvent) {
    if (event.key === pc.KEY_R) this.startReload();
  }
}

export default Shooting;
