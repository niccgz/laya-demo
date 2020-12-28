import CameraMove from "../common/CameraMove";

export default class SceneLoad extends Laya.Script {

    onStart() {
        Laya.Scene3D.load("res/d3/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, (scene: Laya.Scene3D) => {
            Laya.stage.addChild(scene);

            scene.enableFog = true;
            scene.fogColor = new Laya.Vector3(0, 0, 0.6);
            scene.fogStart = 10;
            scene.fogRange = 40;
            scene.ambientColor = new Laya.Vector3(0.6, 0, 0);

            let camera = new Laya.Camera(0, 0.1, 100);
            scene.addChild(camera);
            camera.fieldOfView = 60;
            camera.transform.translate(new Laya.Vector3(10, 15, -25));
            camera.transform.rotate(new Laya.Vector3(-20, 170, 0), false, false);
            camera.clearFlag = Laya.CameraClearFlags.Sky;
            camera.addComponent(CameraMove);

            Laya.Material.load("res/d3/skyBox/skyBox3/skyBox3.lmat", Laya.Handler.create(this, (material: Laya.Material) => {
                let skyRenderer = camera.skyRenderer;
                skyRenderer.mesh = Laya.SkyBox.instance;
                skyRenderer.material = material;
            }))

            let light = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
            light.transform.translate(new Laya.Vector3(0, 2, 5));

            //调整灯光方向
            let matrix: Laya.Matrix4x4 = light.transform.worldMatrix;
            matrix.setForward(new Laya.Vector3(0, -5, 1));
            light.transform.worldMatrix = matrix;

            //设置灯光漫反射颜色
            light.color = new Laya.Vector3(0.3, 0.3, 0.3);

            scene.getChildByName("Scenes").getChildByName("HeightMap").active = false;
            scene.getChildByName("Scenes").getChildByName("Area").active = false;
        }));
    }
}