import CameraRay from "../cases/CameraRay";
import DirectionLight from "../cases/DirectionLight";
import EnvironmentalReflection from "../cases/EnvironmentalReflection";
import GarbageCollection from "../cases/GarbageCollection";
import Load3DAssetDemo from "../cases/Load3DAssetDemo";
import RenderTargetCamera from "../cases/RenderTargetCamera";
import SceneLoad from "../cases/SceneLoad";
import Simple3DDemo from "../cases/Simple3DDemo";
import SpriteDemo from "../cases/SpriteDemo";

export default class DemoScene extends Laya.Script {

    onEnable(): void {
        this.owner.removeChildren();

        // this.owner.addComponent(SpriteDemo);
        // this.owner.addComponent(Simple3DDemo);
        // this.owner.addComponent(Load3DAssetDemo);
        // this.owner.addComponent(GarbageCollection);
        // this.owner.addComponent(SceneLoad);
        // this.owner.addComponent(EnvironmentalReflection);
        // this.owner.addComponent(CameraRay);
        // this.owner.addComponent(RenderTargetCamera);
        this.owner.addComponent(DirectionLight);
    }

    onDisable(): void {
    }
}