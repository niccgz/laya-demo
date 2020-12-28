import CameraMove from "../common/CameraMove";

//资源释放

export default class GarbageCollection extends Laya.Script {

    private _scene: Laya.Scene3D | null = null;
    private _scene2: Laya.Scene3D | null = null;
    private _btnType: number = 0;

    onStart() {
        Laya.Stat.show(0, Laya.stage.height - 480)

        this.loadScene();

        this.addButton(200, 200, 160, 40, "释放显存", (e:any) => {
            this._btnType++;
            this._btnType %= 2;

            switch (this._btnType) {
                case 0:
                    (e.target).label = "释放显存"
                    this.loadScene();
                    break;
                case 1:
                    (e.target).label = "加载场景"
                    this.garbageCollection();
                    break;
                default:
                    break;
            }
        });




        Laya.Scene3D.load("res/d3/TerrainScene/XunLongShi.ls", Laya.Handler.create(this, (scene: Laya.Scene3D) => {
           this._scene2= Laya.stage.addChildAt(scene, 0) as Laya.Scene3D;
        }));
    }

    private addButton(x: number, y: number, width: number, height: number, text: string, onClick: Function): void {
        Laya.loader.load(["res/d3/ui/button.png"], Laya.Handler.create(this, () => {
            let btn: Laya.Button = Laya.stage.addChild(new Laya.Button("res/d3/ui/button.png", text)) as Laya.Button;
            btn.size(width, height);
            btn.labelBold = true;
            btn.labelSize = 30;
            btn.sizeGrid = "4,4,4,4";
            btn.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            btn.pos(x, y);
            btn.on(Laya.Event.CLICK, this, onClick);
        }));
    }

    private loadScene() {
        Laya.Scene3D.load("res/d3/scene/ParticleScene/Example_01.ls", Laya.Handler.create(this, (scene:any) => {
            this._scene = Laya.stage.addChildAt(scene, 0) as Laya.Scene3D;

            let camera: Laya.Camera = this._scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
            camera.transform.translate(new Laya.Vector3(0, 1, 0));
            camera.addComponent(CameraMove);
        }));




    }

    private garbageCollection() {
        if (this._scene) {
            this._scene.destroy();
        }

        // if (this._scene2){
        //     this._scene2.destroy()
        // }
        Laya.Resource.destroyUnusedResources();
    }

}