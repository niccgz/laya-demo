/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import DemoScene from "./script/scenes/DemoScene"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=750;
    static height:number=1334;
    static scaleMode:string="fixedheight";
    static screenMode:string="horizontal";
    static alignV:string="middle";
    static alignH:string="center";
    static startScene:any="res/scenes/Demo.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=true;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/scenes/DemoScene.ts",DemoScene);
    }
}
GameConfig.init();