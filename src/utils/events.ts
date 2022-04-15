// remove then playcanvas add types for default events
export const events = {
  contact: "contact",
  collisionend: "collisionend",
  collisionstart: "collisionstart",
  destroy: "destroy",
};

// EventBus(this.app.on/fire) events
export const ebEvents = {
  "player:falled": "player:falled",
  "player:score:changed": "player:score:changed",
  "weapon:ammo:changed": "weapon:ammo:changed",
  "weapon:reloading:changed": "weapon:reloading:changed",
  "enemy:died": "enemy:died",
};

export type TOnPlayerScoreChanged = (newScore: number) => void;
export type TOnWeaponAmmoChanged = (ammo: number, totalAmmo: number) => void;
