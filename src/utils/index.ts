export const getCollisionHeight = (collision: pc.CollisionComponent | undefined) => {
  if (!collision) return 0;

  if (collision.type === "box") {
    return collision.halfExtents.y * 2;
  }
  if (collision.type === "sphere" || collision.type === "capsule") {
    return collision.radius * 2;
  }
  throw new Error("[getCollisionHeight] Not implemented");
};

export const randomNumberInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);
