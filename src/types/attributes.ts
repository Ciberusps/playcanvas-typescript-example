export type TJsonAttributeSchemaProp = {
  name: string;
  type: "number" | "string";
  default: number | string;
};

// A duplicate copy of the inline type definition in Playcanvas attributes.add(param1...)
export type TAttributeParams = {
  type:
    | "boolean"
    | "number"
    | "string"
    | "json"
    | "asset"
    | "entity"
    | "rgb"
    | "rgba"
    | "vec2"
    | "vec3"
    | "vec4"
    | "curve";
  default?: any;
  title?: string;
  description?: string;
  placeholder?: string | string[];
  array?: boolean;
  size?: number;
  min?: number;
  max?: number;
  precision?: number;
  step?: number;
  assetType?: string;
  curves?: string[];
  color?: string;
  enum?: object[];
  schema?: TJsonAttributeSchemaProp[];
};
