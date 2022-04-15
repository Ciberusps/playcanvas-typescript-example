// from https://github.com/Glidias/playcanvas-typescript-babel-intellisense-template/tree/6a35dab6d229c3857673e56861b34cc1a658cb54
import { TAttributeParams } from "../types/attributes";
import { ScriptTypeBase } from "../types/ScriptTypeBase";

/**
 * Class decorator allowing the use of ES6 classes
 * to define and create PlayCanvas script types.
 * Caveat is: There is a slight iterative runtime overhead to this. (unlike Haxe which can utilize precompiled-macros)
 * The cool thing is that your script (if it uses properties) has an additional property called `attributesData` that can facilitate offboard property reflection/runtime-component
 * property GUI creation.
 * @param {pc.Application} [app]
 */
export function createScript(name: string) {
  return function (obj: any) {
    // @ts-ignore
    const instance = new obj();
    const script: any = pc.createScript(name);

    instance.attributesData = instance.attributesData || {};
    // Add public attributes accessible in the editor
    for (let attr in instance.attributesData) {
      script.attributes.add(attr, instance.attributesData[attr]);
    }

    // Add instance properties and methods to prototype
    let proto = script.prototype;
    for (let prop in instance) {
      if (prop !== "attributes" && !instance?.attributesData?.[prop]) {
        proto[prop] = instance?.[prop];
      }
    }

    // Add static properties
    for (let prop in obj) {
      script[prop] = obj?.[prop];
    }
  };
}

export function attrib<T>(params: TAttributeParams): any {
  return function (
    target: ScriptTypeBase,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): any {
    if (!target.attributesData) {
      target.attributesData = {};
    }
    target.attributesData[propertyKey] = params;
  };
}
