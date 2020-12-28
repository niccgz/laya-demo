import CameraMove from "../common/CameraMove";

//摄像机渲染贴图
export default class RenderTargetCamera extends Laya.Script {

    onStart() {
        Laya.Scene3D.load("res/d3/scene/CourtyardScene/Courtyard.ls", Laya.Handler.create(this, (scene: Laya.Scene3D) => {
            Laya.stage.addChild(scene);

            let camera: Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 1000)) as Laya.Camera;
            camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
            camera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
            camera.clearFlag = Laya.CameraClearFlags.Sky;
            camera.addComponent(CameraMove);

            let renderTargetCamera:Laya.Camera = scene.addChild(new Laya.Camera(0,0.1,1000)) as Laya.Camera;
            renderTargetCamera.transform.translate(new Laya.Vector3(57,2.5,58));
            renderTargetCamera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
            
            renderTargetCamera.renderTarget = new Laya.RenderTexture(2048,2048);
            renderTargetCamera.renderingOrder = -1;
            renderTargetCamera.addComponent(CameraMove);

            let renderTargetObj:Laya.MeshSprite3D = scene.getChildAt(0).getChildByName("RenderTarget") as Laya.MeshSprite3D;

            (renderTargetObj.meshRenderer.material as Laya.BlinnPhongMaterial).albedoTexture = renderTargetCamera.renderTarget;

        }));
    }
}