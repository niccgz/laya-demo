export default class EnvironmentalReflection extends Laya.Script {

    //FIXME:api已删除
    onStart(){
        let scene:Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        if (scene){
            scene.reflectionMode = Laya.Scene3D.REFLECTIONMODE_CUSTOM;

        }
    }
}