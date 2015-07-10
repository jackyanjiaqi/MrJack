/**
 * Created by jackyanjiaqi on 15-6-23.
 */
function BGGridTouchableScene(){
    LevelResourcePreloadScene.apply(this,arguments);
    this.isMouseDown = false;
    this.isClick = false;
    this.mask_canvas = null;
    this.mouseStartIndex = -1;
    this.grid_xi = null;
    this.grid_yi = null;
    //doubleClick相关
    this._clickTimeStamp = 0;
    this._doubleClick1stMark = -1;
}

extend(BGGridTouchableScene,LevelResourcePreloadScene);

_p.onResume = function(scene){
    if(!scene){
        if(this.needPreLoadLevelResource()){
            return;
        }
    }
    BaseSceneConfig.prototype.onResume.apply(this,arguments);

    this.initBGManager();
    this.drawBG();
    this.refresh();
}

_p = BGGridTouchableScene.prototype;

_p.initBGManager = function(){
    //if(!this.mask_canvas){
    this.mask_canvas = document.createElement("canvas");
    this.mask_canvas.width = Stage.canvas.width;
    this.mask_canvas.height = Stage.canvas.height;
    //}
    //if(!BGGridManager.touchDelegate){
    BGGridManager.touchDelegate = new TouchDelegate();
    //}
    BGGridManager.touchDelegate.setCanvasMask(this.mask_canvas).reset();
    BGGridManager.canvasWidth = Stage.canvas.width;
    BGGridManager.canvasHeight = Stage.canvas.height;
    //默认横屏模式
    this.grid_xi = Stage.currentLevel.columnNum;
    this.grid_yi = Math.round(Stage.currentLevel.sceneMap.length/this.grid_xi);
    if('keepOrientation' in Stage.currentLevel && Stage.currentLevel.keepOrientation){

    }else{
        //竖屏模式
        if(Stage.screen.orientation === 'portrait'){
            var temp = this.grid_xi;
            this.grid_xi = this.grid_yi;
            this.grid_yi = temp;
        }
    }
    RenderLayerManager.selectLayer('BGGrid');
    this.maplength = BGGridManager.measure(this.grid_yi,this.grid_xi);
    RenderLayerManager.clear();
}

_p.drawBG = function(){
    RenderLayerManager.selectLayer('BGGrid').clear();
    BGGridManager.initPaint(
        null,
        true,
        this.grid_yi,//行
        this.grid_xi,//列
        this.maplength
        );
}

_p.getBGGridParams = function(){
    var xi = 3;
    var yi = 4;
    var size = 120;
    return {column:xi,row:yi,size:size};
}

_p.onTouchOrMouseStart = function(ev) {
    //Logger.dlog('onTouchOrMouseStart-Begin-','tchmouse');
    this.isMouseDown = true;
    this.isClick = true;

    this.init_x = ev.x;
    this.init_y = ev.y;
    this.init_xoffset = BGGridManager.xoffset;
    this.init_yoffset = BGGridManager.yoffset;
    //重要
    //遍历LayerManager获取能够接收onTouchOrMouseStart事件的对象并进行分派
    //判断是否是UI元素 UILayer
    //判断是否是游戏元素 GameRoleLayer
    //判断棋盘元素 BoardGameLayer
    this.mouseStartIndex = BGGridManager.touchDelegate.getIndex(ev);
    ev.e.stopPropagation();
    ev.e.preventDefault();
    if(this.mouseStartIndex !== -1){
        RenderLayerManager
            .selectLayer('TouchEffect')
            .clear()
            .paintMapInit(0,
            BGGridManager.data[this.mouseStartIndex]['0'].x,
            BGGridManager.data[this.mouseStartIndex]['0'].y,
            null,null,'rgba(255,255,255,0.2)');
        this.refresh();
    }
}

_p.onTouchOrMouseEnd = function(ev){
    this.isMouseDown = false;
    if(this.isClick && this.mouseStartIndex === BGGridManager.touchDelegate.getIndex(ev)){
        var isDoubleClick = false;
        if(Date.now() - this._clickTimeStamp < 200 && this.mouseStartIndex === this._doubleClick1stMark){
            isDoubleClick = true;
        }
        this._clickTimeStamp = Date.now();
        this._doubleClick1stMark = this.mouseStartIndex;
        if(isDoubleClick){
            this.onDoubleClick(this.mouseStartIndex);
        }else{
            this.onClicked(this.mouseStartIndex);
        }
    }
    this.mouseStartIndex = -1;
    ev.e.stopPropagation();
    ev.e.preventDefault();
}

_p.onTouchOrMouseMove = function(ev){
    if(this.isMouseDown && this.isClick && BGGridManager.touchDelegate.getIndex(ev) !== this.mouseStartIndex){
        this.isClick = false;
        this.onCancelClick(this.mouseStartIndex);
    }
    ev.e.stopPropagation();
    ev.e.preventDefault();
}

_p.onClicked = function (bggridIndex) {
    Logger.dlog('Index'+bggridIndex+' onClicked','touchScene');
    RenderLayerManager
        .selectLayer('TouchEffect')
        .clear();
    this.refresh();
}

_p.onCancelClick = function (cancelIndex){
    Logger.dlog('Index'+cancelIndex+' onCancelClick','touchScene');
    RenderLayerManager
        .selectLayer('TouchEffect')
        .clear();
    this.refresh();
}

_p.onDoubleClick = function(index){
    Logger.dlog('Index'+index+' onDoubleClick','touchScene');
    RenderLayerManager
        .selectLayer('TouchEffect')
        .clear();
    this.refresh();
}