// PlayCanvas life-cycle methods
// TODO: remove there is not much lifecycle methods
// they just can be remembered and typed by hand using pc.SomeType
export type OnCollisionStart = (result: pc.ContactResult) => void;
export type OnCollisionEnd = (result: pc.Entity) => void;
export type Update = (dt: number) => void;
