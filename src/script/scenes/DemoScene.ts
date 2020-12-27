import Load3DAssetDemo from "../cases/Load3DAssetDemo";
import Simple3DDemo from "../cases/Simple3DDemo";
import SpriteDemo from "../cases/SpriteDemo";

export default class DemoScene extends Laya.Script {

    onEnable(): void {
        this.owner.removeChildren();

        // this.owner.addComponent(SpriteDemo);
        // this.owner.addComponent(Simple3DDemo);
        this.owner.addComponent(Load3DAssetDemo);
    }

    onDisable(): void {
    }
}