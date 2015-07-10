/**
 * Created by jackyanjiaqi on 15-6-11.
 */
function IndicatorTestScene(){
    BaseSceneConfig.apply(this,arguments);
    this.mainTest = null;
}

extend(IndicatorTestScene,BaseSceneConfig);

_p = IndicatorTestScene.prototype;

_p.onResume = function(){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);

    if(arguments.length ==0){
        createRandomIndicators(this);
    }
}

function createRandomIndicators(self){
    self.mainTest = new Indicator(function(wrap){
        Stage.ctx.fillStyle = 'rgb(255,0,0)';
        Stage.ctx.fillRect(wrap.rawX,wrap.rawY,400,400);
    });

    Logger.dlog(self.mainTest.toString(),'test');

    for(var i = 0;i<4;i++){
        var child = new Indicator(function(wrap){
            Stage.ctx.fillStyle = 'rgb(0,0,255)';
            Stage.ctx.fillRect(wrap.rawX,wrap.rawY,40,140);
        },15,15);
        child.x = i*60 + 20;
        child.y = 20;
        self.mainTest.addChild(child);
        Logger.log(child.toString(),'test');
    }

    IndicatorManager.setCanvas(Stage.canvas).addIndicator(self.mainTest).paint();
    Logger.tagAll();
}

_p.onTouchOrMouseMove = function(ev){
    BaseSceneConfig.prototype.onTouchOrMouseMove.apply(this,arguments);
    if(this.mainTest){
        this.mainTest.x = ev.x;
        this.mainTest.y = ev.y;
        Stage.ctx.clearRect(0,0,Stage.width,Stage.height);
        IndicatorManager.paint();
    }
    ev.e.stopPropagation();
    ev.e.preventDefault();
}

_p.onTouchOrMouseEnd = function(ev){
    BaseSceneConfig.prototype.onTouchOrMouseEnd.apply(this,arguments);
    RenderLayerManager
        .switchScene()
        .nameScene('Main');

    ev.e.stopPropagation();
    ev.e.preventDefault();
}