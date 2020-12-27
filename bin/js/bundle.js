(function () {
    'use strict';

    class CameraMoveScript extends Laya.Script3D {
        constructor() {
            super();
            this._tempVector3 = new Laya.Vector3();
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.rotaionSpeed = 0.00006;
        }
        _updateRotation() {
            if (Math.abs(this.yawPitchRoll.y) < 1.50) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
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
        onDestroy() {
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        }
        mouseDown(e) {
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
            this._tempVector3.x = this._tempVector3.y = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveRight(distance) {
            this._tempVector3.y = this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveVertical(distance) {
            this._tempVector3.x = this._tempVector3.z = 0;
            this._tempVector3.y = distance;
            this.camera.transform.translate(this._tempVector3, false);
        }
    }

    class Load3DAssetDemo extends Laya.Script {
        onAwake() {
            Laya.Scene3D.load("res/d3/TerrainScene/XunLongShi.ls", Laya.Handler.create(null, (scene) => {
                Laya.stage.addChild(scene);
                let camera = scene.getChildByName("Main Camera");
                camera.clearFlag = Laya.CameraClearFlags.Sky;
                camera.addComponent(CameraMoveScript);
                let directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1, 1, 1);
                directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
                Laya.Material.load("res/d3/skyBox/skyBox2/skyBox2.lmat", Laya.Handler.create(null, (mat) => {
                    let skyRender = camera.skyRenderer;
                    skyRender.mesh = Laya.SkyBox.instance;
                    skyRender.material = mat;
                }));
                Laya.Texture2D.load("res/d3/textures/earth.png", Laya.Handler.create(null, (texture) => {
                    let earth = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32)));
                    earth.transform.translate(new Laya.Vector3(-10, 10, 0));
                    let earthMaterail = new Laya.BlinnPhongMaterial();
                    earthMaterail.albedoTexture = texture;
                    earthMaterail.albedoIntensity = 1;
                    earth.meshRenderer.material = earthMaterail;
                }));
                Laya.Sprite3D.load("res/d3/skinModel/BoneLinkScene/PangZiNoAni.lh", Laya.Handler.create(null, (prefab) => {
                    let panzi = scene.addChild(prefab);
                    panzi.transform.localScale = new Laya.Vector3(2, 2, 2);
                    panzi.transform.translate(new Laya.Vector3(0, 8, -10));
                    panzi.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
                    let animator = panzi.getChildAt(0).getComponent(Laya.Animator);
                    Laya.AnimationClip.load("res/d3/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani", Laya.Handler.create(null, (clip) => {
                        let state = new Laya.AnimatorState();
                        state.name = "Hello";
                        state.clipStart = 0 / 581;
                        state.clipEnd = 581 / 581;
                        state.clip = clip;
                        state.clip.islooping = true;
                        animator.getControllerLayer(0).addState(state);
                        animator.play("Hello");
                    }));
                }));
            }));
        }
    }

    class DemoScene extends Laya.Script {
        onEnable() {
            this.owner.removeChildren();
            this.owner.addComponent(Load3DAssetDemo);
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
    GameConfig.width = 750;
    GameConfig.height = 1334;
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
