export default class SpriteDemo extends Laya.Script {

    private _textures = ["res/textures/apes/monkey0.png", "res/textures/apes/monkey1.png", "res/textures/apes/monkey2.png"];
    private _apeSp: Laya.Sprite | undefined;
    private _textureIndex: number = 0;

    onEnable(): void {
        Laya.loader.load(this._textures, Laya.Handler.create(this, this.onLoadComplete));
    }

    private onLoadComplete() {
        let sp: Laya.Sprite = new Laya.Sprite();
        this.owner.addChild(sp);
        sp.pivot(55, 72);
        sp.pos(500, 300);
        this._apeSp = sp;

        this._apeSp.on(Laya.Event.CLICK, this, this.onChangeTexture);

        this.onChangeTexture();
        this.makeMask();
        // this.makeColorFilter();
        // this.makeGlowFilter();
        this.makeBlurFilter();
    }

    private onChangeTexture() {
        let textureUrl = this._textures[this._textureIndex];
        if (textureUrl && this._apeSp) {

            this._apeSp.graphics.clear(true);

            let texture: Laya.Texture = Laya.loader.getRes(textureUrl);
            if (texture) {
                //方法一
                // this._apeSp.loadImage(textureUrl);

                //方法二
                this._apeSp.graphics.drawTexture(texture);


                this._apeSp.size(texture.width, texture.height);
                this._apeSp.pos((Laya.stage.width - texture.width * 3) / 2, (Laya.stage.height - texture.height) / 2);
            }

            if (++this._textureIndex == this._textures.length) {
                this._textureIndex = 0;
            }

        }
    }

    private makeMask() {
        let img = new Laya.Sprite();
        //获取图片资源，绘制到画布
        img.graphics.drawTexture(Laya.loader.getRes(this._textures[0]), 150, 50);
        //添加到舞台
        this.owner.addChild(img);
        //创建遮罩对象
        let cMask = new Laya.Sprite();
        //画一个圆形的遮罩区域
        cMask.graphics.drawCircle(80, 80, 50, "#ff0000");
        //圆形所在的位置坐标
        cMask.pos(120, 50);
        //实现img显示对象的遮罩效果
        img.mask = cMask;
    }

    //颜色滤镜
    private makeColorFilter() {
        //r,g,b,a
        let red = [
            1, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 1, 0
        ];

        let gray = [
            0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0.3086, 0.6094, 0.0820, 0, 0,
            0, 0, 0, 1, 0
        ]

        let redFilter: Laya.ColorFilter = new Laya.ColorFilter(red);
        let grayFilter: Laya.ColorFilter = new Laya.ColorFilter(gray);

        this._apeSp.filters = [grayFilter];
    }

    //发光滤镜
    private makeGlowFilter() {
        // 发光
        // let glowFilter:Laya.GlowFilter = new Laya.GlowFilter("#ffff00", 10,0,0);
        // this._apeSp.filters = [glowFilter];

        //阴影
        let shadowFilter = new Laya.GlowFilter("#ff0000", 8, 8, 8);
        this._apeSp.filters = [shadowFilter];
    }

    //模糊滤镜
    private makeBlurFilter() {
        let filter = new Laya.BlurFilter(5);
        this._apeSp.filters = [filter];
    }

    onDisable() {

    }
}