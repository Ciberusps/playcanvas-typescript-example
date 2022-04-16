export const lifecycleEvents = {
  contact: "contact",
  collisionend: "collisionend",
  collisionstart: "collisionstart",
  destroy: "destroy",
  update: "update",
};

// EventBus(this.app.on/fire) events
export const ebEvents = {
  "player:falled": "player:falled",
  "player:score:changed": "player:score:changed",
  "weapon:ammo:changed": "weapon:ammo:changed",
  "weapon:reloading:changed": "weapon:reloading:changed",
  "enemy:died": "enemy:died",
};

export type TPlayerScoreChangedEvent = { newScore: number };
export type TWeaponAmmoChangedEvent = { ammo: number; totalAmmo: number };
