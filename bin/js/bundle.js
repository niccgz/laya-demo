(function () {
    'use strict';

    class CameraMove extends Laya.Script3D {
        constructor() {
            super(...arguments);
            this._tempVector3 = new Laya.Vector3();
            this.lastMouseX = 0;
            this.lastMouseY = 0;
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.isMouseDown = false;
            this.rotaionSpeed = 0.00006;
        }
        onAwake() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
            this.camera = this.owner;
        }
        onUpdate() {
            var elapsedTime = Laya.timer.delta;
            if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
                var scene = this.owner.scene;
                Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);
                var offsetX = Laya.stage.mouseX - this.lastMouseX;
                var offsetY = Laya.stage.mouseY - this.lastMouseY;
                var yprElem = this.yawPitchRoll;
                yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
                yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
                this._updateRotation();
            }
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
        }
        _updateRotation() {
            if (this.camera && Math.abs(this.yawPitchRoll.y) < 1.50) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
        }
        onDestroy() {
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        }
        mouseDown(e) {
            if (!this.camera || !this.camera.transform) {
                return;
            }
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this.isMouseDown = true;
        }
        mouseUp(e) {
            this.isMouseDown = false;
        }
        mouseOut(e) {
            this.isMouseDown = false;
        }
        moveForward(distance) {
            if (this.camera) {
                this._tempVector3.x = this._tempVector3.y = 0;
                this._tempVector3.z = distance;
                this.camera.transform.translate(this._tempVector3);
            }
        }
        moveRight(distance) {
            if (this.camera) {
                this._tempVector3.y = this._tempVector3.z = 0;
                this._tempVector3.x = distance;
                this.camera.transform.translate(this._tempVector3);
            }
        }
        moveVertical(distance) {
            if (this.camera) {
                this._tempVector3.x = this._tempVector3.z = 0;
                this._tempVector3.y = distance;
                this.camera.transform.translate(this._tempVector3, false);
            }
        }
    }

    class DirectionLight extends Laya.Script {
        constructor() {
            super(...arguments);
            this._quaternion = new Laya.Quaternion();
            this._direction = new Laya.Vector3();
        }
        onStart() {
            let scene = Laya.stage.addChild(new Laya.Scene3D());
            let camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMove);
            let directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            let matrix = directionLight.transform.worldMatrix;
            matrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = matrix;
            Laya.MeshSprite3D.load("res/d3/staticModel/grid/plane.lh", Laya.Handler.create(this, (sprite) => {
                let grid = scene.addChild(sprite);
                Laya.MeshSprite3D.load("res/d3/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, (monkey) => {
                    let layaMonkey = scene.addChild(monkey);
                    let aniSp = layaMonkey.getChildAt(0);
                    let animator = aniSp.getComponent(Laya.Animator);
                    let state = new Laya.AnimatorState();
                    state.name = "run";
                    state.clipStart = 40 / 150;
                    state.clipEnd = 70 / 150;
                    state.clip = animator.getDefaultState().clip;
                    animator.addState(state);
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

    class DemoScene extends Laya.Script {
        onEnable() {
            this.owner.removeChildren();
            this.owner.addComponent(DirectionLight);
        }
        onDisable() {
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/scenes/DemoScene.ts", DemoScene);
        }
    }
    GameConfig.width = 1334;
    GameConfig.height = 750;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "res/scenes/Demo.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
//# sourceMappingURL=bundle.js.map
