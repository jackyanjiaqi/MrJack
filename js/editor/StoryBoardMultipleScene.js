/**
 * Created by jackyanjiaqi on 15-6-11.
 */
function StoryBoardMultipleScene(){
    BaseSceneConfig.apply(this,arguments);
    this.bgstyle = ['#1f1f1f','#0131f1','#adaafb'];
    this._stop = false;
    this.scenes = [];
    this.spriteAnimator = null;
    this.frames = 0;
}

extend(StoryBoardMultipleScene,BaseSceneConfig);

_p = StoryBoardMultipleScene.prototype;

_p.onCreate = function(){
    var self = this;
    BaseSceneConfig.prototype.onCreate.apply(this,arguments);
    //加载所需资源
    ImageManager.load(
        {
            ArrowMan : "img/arrow.png",
            AmericanCaptain : "img/captain.png",
            SpiderMan : "img/spider.png",
            ThunderMan : "img/thunder.png",
            AimEffect : "img/target_mask.png",
            WebEffect : "img/spidernet_mask.png",
            ShieldEffect : "img/shield.png",
            bg : "img/bg_landscape.jpg",
            sheet : "img/sheet.png"
        },
        function (){
            invokeResume(self);
        },null);
}

function invokeResume(self){
    //BaseSceneConfig.prototype.onResume.apply(self,arguments);
    self.spriteAnimator = new SpriteSheet(
        ImageManager.get('sheet'),[
            [0, 0, 94, 76, 44, 67],
            [94, 0, 94, 76, 44, 68],
            [188, 0, 91, 76, 42, 68],
            [279, 0, 88, 76, 39, 68],
            [367, 0, 83, 77, 34, 69],
            [0, 77, 81, 75, 34, 67],
            [81, 77, 80, 73, 34, 66],
            [161, 77, 78, 72, 33, 65],
            [239, 77, 77, 72, 33, 65],
            [316, 77, 77, 72, 32, 65],
            [393, 77, 79, 73, 33, 66],
            [0, 152, 80, 75, 34, 67],
            [80, 152, 81, 77, 34, 69],
            [161, 152, 84, 77, 36, 69],
            [245, 152, 89, 76, 41, 68],
            [334, 152, 93, 75, 44, 67]]
    );
    animationSceneStart(self,350,450);
}

function animationSceneStart(self,startx,starty){
    if(!startx){
        startx = 0;
        starty = 0;
    }
    var testx = startx;
    var testy = starty;
    var xaddon = 1;
    var yaddon = 1;

    if(RenderLayerManager.sceneCount < 5){
        //设置舞台的全局属性
        Stage.theme.bgStyle = self.bgstyle[RenderLayerManager.sceneCount%3];
        //初始化场景和层
        RenderLayerManager
            .switchScene()
            .createLayer("mouse");

        var handle = window.requestAnimationFrame(function(){
            if(testx + xaddon > BGGridManager.canvasWidth || testx + xaddon < 0){
                xaddon = -xaddon;
            }
            if(testy + yaddon >BGGridManager.canvasHeight || testy + yaddon < 0){
                yaddon = -yaddon;
            }
            testx += xaddon;
            testy += yaddon;
            //画图
            RenderLayerManager
                .selectLayer("mouse")
                .clear()
                .strokeMapInit('red',0, testx, testy, 45, 3);
                //.renderLayers(Stage.ctx,null);
            var ctx = RenderLayerManager
                .selectLayer('animator')
                .clear()
                ._getRenderCtx();

            self.spriteAnimator.drawFrame(ctx,self.frames%(self.spriteAnimator._frames.length),testx+45,testy+45);
            RenderLayerManager
                .renderLayers(Stage.ctx,null);

            self.frames++;
            if(!self._stop){
                handle = window.requestAnimationFrame(arguments.callee);
            }
        });

        setTimeout(function(){
            window.cancelRequestAnimFrame(handle);
            //停止动画
            //clearInterval(handle);
            //animationSceneStart(self,testx,testy);
            self.stop();
        },100000);

    }else{
        self._stop = true;
        Stage.ctx.clearRect(0,0,Stage.canvas.width,Stage.canvas.height);
        self.scenes.forEach(function(playedScene){
            var cacheCanvas = playedScene.content.raw["mouse"];
            Stage.ctx.drawImage(cacheCanvas,0,0);
        });
    }
}

_p.onStop = function(scene){
    BaseSceneConfig.prototype.onStop.apply(this,arguments);
    this.scenes.push(scene);
    this._stop = false;
}