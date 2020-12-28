import CameraMoveScript from "../common/CameraMove";

export default class Load3DAssetDemo extends Laya.Script {

    onAwake() {
        //加载场景
        Laya.Scene3D.load("res/d3/TerrainScene/XunLongShi.ls", Laya.Handler.create(null, (scene:any) => {
            Laya.stage.addChild(scene);

            let camera: Laya.Camera = scene.getChildByName("Main Camera") as Laya.Camera;
            camera.clearFlag = Laya.CameraClearFlags.Sky;
            camera.addComponent(CameraMoveScript);

            let directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

            //加载材质
            Laya.Material.load("res/d3/skyBox/skyBox2/skyBox2.lmat", Laya.Handler.create(null, (mat:any) => {
                let skyRender: Laya.SkyRenderer = camera.skyRenderer;
                skyRender.mesh = Laya.SkyBox.instance;
                skyRender.material = mat;
            }));

            //加载纹理
            Laya.Texture2D.load("res/d3/textures/earth.png", Laya.Handler.create(null, (texture:any) => {
                let earth: Laya.MeshSprite3D = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32)));
                earth.transform.translate(new Laya.Vector3(-10, 10, 0));

                let earthMaterail = new Laya.BlinnPhongMaterial();
                earthMaterail.albedoTexture = texture;
                earthMaterail.albedoIntensity = 1;

                earth.meshRenderer.material = earthMaterail;
            }));

            //加载网格
            /* Laya.Mesh.load("res/d3/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(null, (mesh) => {
                let monkey: Laya.MeshSprite3D = new Laya.MeshSprite3D(mesh);
                scene.addChild(monkey);

                monkey.transform.localScale = new Laya.Vector3(2, 2, 2);
                monkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                monkey.transform.translate(new Laya.Vector3(0, 0, 7));

            })); */

            //加载预设
            /* Laya.Sprite3D.load("res/d3/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(null, (prefab) => {
                let monkey: Laya.Sprite3D = scene.addChild(prefab);
                monkey.transform.localScale = new Laya.Vector3(2, 2, 2);
                monkey.transform.translate(new Laya.Vector3(0, 8, -10));
                monkey.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);
            })); */


            //加载动画
            Laya.Sprite3D.load("res/d3/skinModel/BoneLinkScene/PangZiNoAni.lh", Laya.Handler.create(null, (prefab:any) => {
                let panzi: Laya.Sprite3D = scene.addChild(prefab);
                panzi.transform.localScale = new Laya.Vector3(2, 2, 2);
                panzi.transform.translate(new Laya.Vector3(0, 8, -10));
                panzi.transform.rotate(new Laya.Vector3(0, 180, 0), true, false);

                //获取动画组件
                let animator: Laya.Animator = panzi.getChildAt(0).getComponent(Laya.Animator);

                //加载AnimationClip
                Laya.AnimationClip.load("res/d3/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani", Laya.Handler.create(null, (clip:any) => {
                    let state = new Laya.AnimatorState();
                    state.name = "Hello";
                    state.clipStart = 0 / 581;
                    state.clipEnd = 581 / 581;
                    state.clip = clip;
                    state.clip.islooping = true;

                    //为动画组件添加一个动作状态
                    animator.getControllerLayer(0).addState(state);

                    //播放动作
                    animator.play("Hello");
                }));

            }));

        }));
    }
}