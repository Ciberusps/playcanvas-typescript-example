import { ScriptTypeBase } from "../../types/ScriptTypeBase";

import { createScript } from "../../utils/createScriptDecorator";

@createScript("lookAtMainCamera")
class LookAtMainCamera extends ScriptTypeBase {
  update() {
    const camera = this.app.systems.camera?.cameras[0];
    if (!camera) return;
    this.entity.lookAt(camera.entity.getPosition());
    this.entity.rotateLocal(0, 180, 0);
  }
}

export default LookAtMainCamera;
