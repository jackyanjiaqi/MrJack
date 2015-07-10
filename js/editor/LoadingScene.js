/**
 * Created by jackyanjiaqi on 15-6-11.
 */
function LoadingScene(){
    BaseSceneConfig.apply(this,arguments);
    this.loading = 0;
    this.frameFlag = -1;
    this.divider = 1;
    this.loadingTextView = null;
}

extend(LoadingScene,BaseSceneConfig);

_p = LoadingScene.prototype;

_p.onCreate = function(){
    BaseSceneConfig.prototype.onCreate.apply(this,arguments);
    var self = this;
    //预先加载背景和文字用于显示
    ImageManager
        .loadBatch(function(){
            //绘制背景
            RenderLayerManager
                .selectLayer("loading_bg")
                ._getRenderCtx().drawImage(ImageManager.get('title'),0,0,Stage.width,Stage.height);

            //self.loadingTextView = new TextView();
            //self.loadingTextView.setRenderContext(RenderLayerManager.selectLayer('loadingtxt')._getRenderCtx());
            //self.loadingTextView.setNumber(self.loading,2);
            //RenderLayerManager.renderLayers(Stage.ctx,null);
            //RenderLayerManager
            //    .selectLayer("loading")
            //    .strokeMapInit('white',5,Math.round(Stage.width/2) - 35,Math.round(Stage.height/2),35,2);

            startLoading(self);

        },null,{title:{
            autoJoin:true,
            configPrefix:true,
            suffix:'.jpg',
            data:['title']
        }},new TextView().giveResourceMap());
}

_p.onResume = function(scene){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);
    if(scene && scene.pkg){
        this.loading = 0;
        //资源加载界面
        ImageManager
            .load(
            scene.pkg,
            function(){
                cancelRequestAnimFrame(this.frameFlag);
                RenderLayerManager
                    .switchScene(scene.back);
            },
            function(currentItem,totalItem){
                this.loading = Math.round(currentItem*100/totalItem);
                updateUIChange(this);
            });
        delete scene.pkg;
    }
}

_p.onStop = function(scene){
    BaseSceneConfig.prototype.onStop.apply(this,arguments);
    cancelRequestAnimFrame(this.frameFlag);
}

function startLoading(self){
    self.frameFlag = requestAnimationFrame(function(){
        if(self.loading <100){
            //self.loadingTextView.setRenderContext(RenderLayerManager.selectLayer('loadingtxt').clear()._getRenderCtx());
            //self.loadingTextView.setNumber(self.loading,2);
            //var context = RenderLayerManager.selectLayer('loadingtxt').clear()._getRenderCtx();
            //绘制背景
            Stage.ctx.drawImage(ImageManager.get('title'),0,0,Stage.width,Stage.height);
            var context = Stage.ctx;
            //context.fillStyle = 'rgba(255,255,255,255)';

            context.save();
            context.font = "italic bold 88px serif";
            context.fillStyle = 'white';
            var textMetrix = context.measureText(self.loading + '%');
            context.fillText(self.loading + '%',Stage.width/2 - textMetrix.width/2 ,Stage.height*4/5);
            context.restore();

            //RenderLayerManager.renderLayers(Stage.ctx,null);
            //if(self.loading == function(n){
            //        var res = 0;
            //        for(var i=1;i<=n;i++){
            //            res += i;
            //        }
            //   return res;
            //}(self.divider) * 6){
            //    self.divider++;
            //}
            //RenderLayerManager
            //    .selectLayer("loading")
            //    //.clear()
            //    //.paintMapInit(5,Math.round(Stage.width/2) - 145,Math.round(Stage.height/2),145,2,'rgba(255,255,255,0.5)','white',self.loading+"%")
            //    .growStroke('white',Math.floor(self.loading/self.divider)%6)
            //    .renderLayers(Stage.ctx,null);

            self.loading ++;
            cancelRequestAnimFrame(self.frameFlag);
            self.frameFlag = requestAnimationFrame(arguments.callee)
        }else{
            cancelRequestAnimFrame(self.frameFlag);
            Stage.loadLevel(LevelEditor.level[1]);
            //RenderLayerManager
            //    .switchScene()
            //    .nameScene('GameMain');
        }
    });
}

function updateUIChange(self){
    self.frameFlag = requestAnimationFrame(function(){
        if(self.loading <100){
            Stage.ctx.drawImage(ImageManager.get('title'),0,0,Stage.width,Stage.height);
            var context = Stage.ctx;
            //context.fillStyle = 'rgba(255,255,255,255)';

            context.save();
            context.font = "italic bold 88px serif";
            context.fillStyle = 'white';
            var textMetrix = context.measureText(self.loading + '%');
            context.fillText(self.loading + '%',Stage.width/2 - textMetrix.width/2 ,Stage.height*4/5);
            context.restore();
            //RenderLayerManager
            //    .selectLayer("loading")
            //    .clear()
            //    .paintMapInit(5,Math.round(Stage.width/2) - 35,Math.round(Stage.height/2),35,2,'rgba(255,255,255,0.2)','white',self.loading+"%")
            //    .renderLayers(Stage.ctx,null);
            cancelRequestAnimFrame(self.frameFlag);
            self.frameFlag = requestAnimationFrame(arguments.callee);
        }else{
            cancelRequestAnimFrame(self.frameFlag);
        }
    });
}