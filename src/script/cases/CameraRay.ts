import CameraMove from "../common/CameraMove";

export default class CameraRay extends Laya.Script {

    private _scene: Laya.Scene3D | null = null;
    private _camera: Laya.Camera | null = null;
    private _ray: Laya.Ray | null = null;
    private _tempV3: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private _point: Laya.Vector2 = new Laya.Vector2();
    private _outs: Laya.HitResult[] = [];

    onStart() {
        this._scene = new Laya.Scene3D();
        Laya.stage.addChild(this._scene!);

        this._camera = new Laya.Camera(0, 0.1, 100);
        this._scene.addChild(this._camera);
        this._camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        this._camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        this._camera.addComponent(CameraMove);

        let directionLight: Laya.DirectionLight = new Laya.DirectionLight();
        this._scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        let matrix = directionLight.transform.worldMatrix;
        matrix.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = matrix;

        let plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10));
        this._scene.addChild(plane);
        let planeMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/textures/grass.png", Laya.Handler.create(this, (texture: Laya.Texture2D) => {
            planeMaterial.albedoTexture = texture;
        }));

        planeMaterial.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
        plane.meshRenderer.material = planeMaterial;

        let planeStaticCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        let planeShape = new Laya.BoxColliderShape(10, 0, 10);
        planeStaticCollider.colliderShape = planeShape;
        planeStaticCollider.friction = 2;
        planeStaticCollider.restitution = 0.3;

        this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
    }

    onMouseDown() {
        this._point.x = Laya.MouseManager.instance.mouseX;
        this._point.y = Laya.MouseManager.instance.mouseY;

        if (this._ray) {
            this._camera!.viewportPointToRay(this._point, this._ray);
            this._scene!.physicsSimulation.rayCastAll(this._ray, this._outs);
        }

        if (this._outs.length > 0) {
            for (let i = 0, len = this._outs.length; i < len; i++) {
                const hit: Laya.HitResult = this._outs[i];
                this.addBox(hit.point.x, hit.point.y, hit.point.z);
            }
        }

    }

    private addBox(x: number, y: number, z: number) {
        let materail = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load("res/d3/textures/rock.png", Laya.Handler.create(this, (texture: Laya.Texture2D) => {
            materail.albedoTexture = texture;
        }));

        let _x = Math.random() * 0.75 + 0.25;
        let _y = Math.random() * 0.75 + 0.25;
        let _z = Math.random() * 0.75 + 0.25;

        let box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(_x, _y, _z));
        this._scene?.addChild(box);
        box.meshRenderer.material = materail;

        this._tempV3.setValue(x, y, z);
        box.transform.position = this._tempV3;

        this._tempV3.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = this._tempV3;

        let rigidBody = box.addComponent(Laya.Rigidbody3D) as Laya.Rigidbody3D;
        let boxShape = new Laya.BoxColliderShape(_x, _y, _z);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }
}