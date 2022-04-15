export const entityTags = {
  ground: "ground",
  damageable: "damageable",
  player: "player",
} as const;

export type TEntityTags = typeof entityTags;
