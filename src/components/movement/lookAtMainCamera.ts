import { ScriptTypeBase } from "../../types/ScriptTypeBase";

import { createScript } from "../../utils/createScriptDecorator";

@createScript("lookAtMainCamera")
class LookAtMainCamera extends ScriptTypeBase {
  update() {
    // @ts-ignore
    this.entity.lookAt(this.app.systems.camera.cameras[0].entity.getPosition());
    this.entity.rotateLocal(0, 180, 0);
  }
}

export default LookAtMainCamera;
