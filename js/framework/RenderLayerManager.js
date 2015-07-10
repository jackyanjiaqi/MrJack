/**
 * RenderLayerManager是对RenderProxy的基本封装
 * 并以层的方式管理,避免重复绘图
 * 根据层的级别 当最上一层发生绘图变化时下层的所有元素不需要重绘 并根据层级顺序直接绘制其canvas的cache获得值
 * Created by jackyanjiaqi on 15-6-6.
 */
var RenderLayerManager = (function(){
    var singleton = new RenderLayerManager();
    function RenderLayerManager(){
        this.redoStack = {};//存放一次绘图的重做动作栈
        this.paramCache = {};//存放每一个层级的参数

        //CacheLayer相关 Scene生命周期内
        this.renderCache = {};//存放每一个层级的缓存cache
        this.currentLayer = null;
        this.layerOrderMap = {};//层级名称和顺序映射
        this.renderOrderList = [];//渲染顺序列表

        //全局属性
        this.canvasWidth = 100;
        this.canvasHeight = 100;
        this.preViewCanvas = null;
        this.isPreviewMode = false;

        //Scene场景相关
        this.sceneCount = 0;
        this.sceneName = null;

        //Indicator相关
        //脏域
    }

    var _p = RenderLayerManager.prototype;

    _p.resetLayerCache  = function(){
        this.sceneName = null;
        this.renderCache = ObjectPool.give();//存放每一个层级的缓存cache
        this.currentLayer = null;
        this.layerOrderMap = ObjectPool.give();//层级名称和顺序映射
        this.renderOrderList = ArrayPool.give();//渲染顺序列表
    }

    _p.setPreviewCanvas = function (prevCanvas) {
        this.preViewCanvas = prevCanvas;
        return this;
    }

    _p.preview = function (){
        if(this.preViewCanvas != null){
            this.isPreviewMode = true;
        }
        return this;
    }

    _p.previewEnd = function(){
        this.isPreviewMode = false;
        return this;
    }

    _p.createLayer = function (layername,layerorder){
        if(!this.layerOrderMap[layername]){
            var canvas = document.createElement("canvas");
            canvas.width = this.canvasWidth;
            canvas.height = this.canvasHeight;
            canvas.isBlank = true;
            this.renderCache[layername] = canvas;
            this.layerOrderMap[layername] = layerorder;
            this.renderOrderList.push(layername);
            this.currentLayer = layername;
            this.reOrder();
        }
        return this;
    }

    _p.reOrder = function (){
        this.renderOrderList.sort(function (layer1,layer2){
            var res = singleton.layerOrderMap[layer1] - singleton.layerOrderMap[layer2];
            if(res != 0){
                return res;
            }else{
                if(layer1 > layer2){
                    return -1;
                }
                else
                if(layer1 < layer2){
                    return 1;
                }
                else
                    return 0;
            }
        });
        return this;
    }

    _p.selectLayer = function (layername){
        if(layername in this.renderCache){
            this.currentLayer = layername;
        }else{
            this.createLayer(layername,this.renderOrderList.length);
        }
        return this;
    }

    _p.clear = function(){
        if(this.currentLayer != null && this.renderCache[this.currentLayer]){
            this.renderCache[this.currentLayer].getContext('2d').clearRect(0,0,this.canvasWidth,this.canvasHeight);
            this.renderCache[this.currentLayer].isBlank = true;
        }
        return this;
    }

    _p.cancelSelect = function (){
        this.currentLayer = null;
        return this;
    }

    _p._getRenderCtx = function(){
        var ctx = null;
        if(this.isPreviewMode){
            ctx = this.preViewCanvas.getContext('2d');
        }else
        if(this.currentLayer != null){
            ctx = this.renderCache[this.currentLayer].getContext('2d');
            this.renderCache[this.currentLayer].isBlank = false;
        }
        return ctx;
    }

    _p.growPaint = function (from,fillColor,strokeColor,text,img,sourceCutObj) {
        var ctx;
        if(ctx = this._getRenderCtx()){
            RenderProxy.growPaint(ctx,from,fillColor,strokeColor,text,img,sourceCutObj);
        }
        return this;
    }

    _p.rePaint = function (fillColor,strokeColor,text,img){
        var ctx;
        if(ctx = this._getRenderCtx()){
            RenderProxy.rePaint(ctx,fillColor,strokeColor,text,img);
        }
        return this;
    }

    _p.growStroke = function (strokeStyle,from) {
        var ctx;
        if(ctx = this._getRenderCtx()){
            RenderProxy.growStroke(strokeStyle,ctx,from);
        }
        return this;
    }

    _p.paintMapInit = function (from,initx,inity,length,lineWidth,fillColor,strokeColor,text,img,srcCutObj){
        var ctx;
        if(ctx = this._getRenderCtx()) {
            RenderProxy.paintMapInit(ctx, from, initx, inity, length, lineWidth, fillColor, strokeColor, text, img, srcCutObj);
        }
        return this;
    }

    _p.strokeMapInit = function (strokeStyle,from,initx,inity,length,lineWidth){
        var ctx;
        if(ctx = this._getRenderCtx()){
            RenderProxy.strokeMapInit(strokeStyle,ctx,from,initx,inity,length,lineWidth);
        }
        return this;
    }

    _p.addIndicator = function(indicator){
        var canvas;
        if(this.currentLayer != null) {
            canvas = this.renderCache[this.currentLayer];
            if('indicators' in canvas === false){
                canvas.indicators = IndicatorManager.allocateIndicatorsDelegate();
            }
            canvas.indicators.addIndicator(indicator);
        }
        return this;
    }

    /**
     * 绘制对应的缓存Canvas到画布上
     * @param ctx
     * @param layername
     */
    _p.renderSingleLayer = function (ctx,layername){
        if(this.renderCache[layername] && !this.renderCache[layername].isBlank){
            ctx.drawImage(this.renderCache[layername],0,0);
        }
        return this;
    }

    _p.renderSingleLayerRect = function (rect,ctx,layername){
        if(this.renderCache[layername] && !this.renderCache[layername].isBlank){
            ctx.clearRect(rect.x,rect.y,rect.width,rect.height);
            ctx.drawImage(this.renderCache[layername],rect.x,rect.y,rect.width,rect.height,rect.x,rect.y,rect.width,rect.height);
        }
    }

    _p.renderLayersRect = function (rect,ctx,tillEndLayerName){
        this.printLayers();
        for(var i = 0;i<this.renderOrderList.length;i++){
            if(tillEndLayerName && this.renderOrderList[i] == tillEndLayerName){
                this.renderSingleLayerRect(rect,ctx,this.renderOrderList[i]);
                break;
            }else{
                this.renderSingleLayerRect(rect,ctx,this.renderOrderList[i]);
            }
        }
    }

    /**
     * 按层绘制所有缓存Canvas到画布上 直到tillEndLayerName层为止不向上继续绘制
     * @param ctx
     * @param tillEndLayerName
     * @returns {RenderLayerManager}
     */
    _p.renderLayers = function (ctx,tillEndLayerName){
        this.printLayers();
        if(Stage.theme && Stage.theme.bgStyle){
            //图片还是颜色
            var imageBG = null;
            if(imageBG = ImageManager.get(Stage.theme.bgStyle)){
                ctx.drawImage(
                    imageBG,
                    0,0,imageBG.width,imageBG.height,
                    0,0,this.canvasWidth,this.canvasHeight);
            }else{
                ctx.fillStyle = Stage.theme.bgStyle;
                ctx.fillRect(0,0,this.canvasWidth,this.canvasHeight);
            }
        }else{
            ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        }
        for(var i = 0;i<this.renderOrderList.length;i++){
            if(tillEndLayerName && this.renderOrderList[i] == tillEndLayerName){
                this.renderSingleLayer(ctx,this.renderOrderList[i]);
                break;
            }else{
                this.renderSingleLayer(ctx,this.renderOrderList[i]);
            }
        }
        return this;
    }

    _p.switchScene = function (sceneName) {
        this.sceneCount ++;
        //把当前层数据写入Scene并添加到舞台Stage
        if(this.sceneName == null){
            this.sceneName = 'Scene'+this.sceneCount;
        }
        var scene = new Scene(this.sceneName);
        scene.content = {
            raw:this.renderCache,
            map:this.layerOrderMap,
            list:this.renderOrderList};
        Stage._saveScene(scene);
        //转换至场景
        if(sceneName && Stage.hasScene(sceneName)){
            var scene = Stage.getScene(sceneName);
            this.sceneName = scene.getName();
            this.renderCache = scene.content['raw'];
            this.layerOrderMap = scene.content['map'];
            this.renderOrderList = scene.content['list'];
            this.currentLayer = null;
            Stage._recoverFromScene(sceneName);
        }else{
            this.resetLayerCache();
        }
        //Stage.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight);
        //Stage.printAllScenes();
        return this;
    }

    /**
     * 给场景命名
     * @returns {RenderLayerManager}
     */
    _p.nameScene = function(name){
        if(name){
            this.sceneName = name;
            Stage._configAccordingName(name);
        }
        return this;
    }

    _p.printLayers = function(){
        var out = "RenderLayerCache{";
        for(var p in this.renderCache){
            out += " "+p+" ";
        }
        out += "}"
        Logger.dlog(out,"Stage");
        return this;
    }

    return singleton;
})();
