import CameraMove from "../common/CameraMove";

export default class DirectionLight extends Laya.Script {

    private _quaternion: Laya.Quaternion = new Laya.Quaternion();
    private _direction: Laya.Vector3 = new Laya.Vector3();

    onStart() {
        let scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;

        let camera: Laya.Camera = scene.addChild(new Laya.Camera(0, 0.1, 1000)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMove);

        let directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);

        let matrix: Laya.Matrix4x4 = directionLight.transform.worldMatrix;
        matrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = matrix;

        Laya.MeshSprite3D.load("res/d3/staticModel/grid/plane.lh", Laya.Handler.create(this, (sprite: Laya.MeshSprite3D) => {
            let grid: Laya.MeshSprite3D = scene.addChild(sprite) as Laya.MeshSprite3D;

            Laya.MeshSprite3D.load("res/d3/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, (monkey: Laya.MeshSprite3D) => {
                let layaMonkey: Laya.MeshSprite3D = scene.addChild(monkey) as Laya.MeshSprite3D;
                let aniSp: Laya.Sprite3D = layaMonkey.getChildAt(0) as Laya.Sprite3D;
                let animator: Laya.Animator = aniSp.getComponent(Laya.Animator) as Laya.Animator;

                let state: Laya.AnimatorState = new Laya.AnimatorState();
                state.name = "run";
                state.clipStart = 40 / 150;
                state.clipEnd = 70 / 150;
                state.clip = animator.getDefaultState().clip;
                animator.addState(state);

                // animator.play("run");

                Laya.timer.frameLoop(1, this, () => {
                    Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);

                    directionLight.transform.worldMatrix.getForward(this._direction);

                    Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
                    directionLight.transform.worldMatrix.setForward(this._direction);

                    let mat = directionLight.transform.worldMatrix;
                    mat.setForward(this._direction);
                    directionLight.transform.worldMatrix = mat;
                });
            }));
        }));
    }
}