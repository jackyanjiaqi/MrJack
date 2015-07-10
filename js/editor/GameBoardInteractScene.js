/**
 * Created by jackyanjiaqi on 15-6-11.
 */
function GameBoardInteractScene(){
    BaseSceneConfig.apply(this,arguments);
    this.isMouseDown = false;
    this.mouseStartIndex = -1;
    this.init_x = 0;
    this.init_y = 0;
    this.init_xoffset = 0;
    this.init_yoffset = 0;

    this.paintFunc = null;//用于绘制背景和初始人物的的函数
    this.grid_xi = null;
    this.grid_yi = null;
    this.mask_canvas = null;
    this.maplength = 120;
}

extend(GameBoardInteractScene,BaseSceneConfig);

_p = GameBoardInteractScene.prototype;

_p.onCreate = function(){
    BaseSceneConfig.prototype.onCreate.apply(this,arguments);
    //配置触摸代理
    this.mask_canvas = document.createElement("canvas");
    this.mask_canvas.width = Stage.canvas.width;
    this.mask_canvas.height = Stage.canvas.height;
    BGGridManager.touchDelegate = new TouchDelegate();
    BGGridManager.touchDelegate.setCanvasMask(this.mask_canvas).reset();
    BGGridManager.canvasWidth = Stage.canvas.width;
    BGGridManager.canvasHeight = Stage.canvas.height;

    //计算网格
    //this.grid_xi = Math.ceil((Stage.canvas.width - 200)/(this.maplength*Math.tan(Math.PI/3)));
    //this.grid_yi = Math.ceil((Stage.canvas.height - 200)/(this.maplength*Math.tan(Math.PI/3)));
    this.grid_xi = 6;
    this.grid_yi = 3;
}

_p.onResume = function(){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);
    if(arguments.length == 0){
        //第一次运行先到加载界面加载资源文件
        var loading = Stage.getScene('Loading');
        loading.pkg = {
            ArrowMan : "img/arrow.png",
            AmericanCaptain : "img/captain.png",
            SpiderMan : "img/spider.png",
            ThunderMan : "img/thunder.png",
            BaozouShen:"img/arrowman_angry.png",
            AimEffect : "img/target_mask.png",
            WebEffect : "img/spidernet_mask.png",
            ShieldEffect : "img/shield.png",
            bg : "img/bg_landscape.jpg",
            sheet : "img/sheet.png"
        };
        loading.back = 'Main';
        RenderLayerManager
            .switchScene('Loading');
        return;
    }

    Stage.theme.bgStyle = 'grey';
    //配置基本绘图参数
    RenderProxy._maplinewidth = 5;
    RenderProxy._strokeColor = 'white';
    RenderProxy._maplength = 120;

    //绘图回调函数
    var i = 0;
    this.paintFunc =
        function(callFunc){
            //创建角色
            if(!GameRoleManager.roles[i]){
                GameRoleManager.roles[i] = ObjectPool.give();
                var roleNum = Math.floor(Math.random()*15);
                GameRoleManager.roles[i].roleNum = roleNum;
                if(roleNum < Stage.roles.detail.length){
                    GameRoleManager.createNew(false,null,i);
                }
                //GameRoleManager.roles[i].action = HeroActionManager.getAction(roleNum);
                //GameRoleManager.roles[i].effect = null;
                GameRoleManager.roles[i].id = i;//建立反向索引
            }
            //执行绘图
            if(callFunc == RenderProxy.strokeMapInit){
                var args = arguments[1];
                if(GameRoleManager.isGameRole(i)){
                    RenderLayerManager.selectLayer("GameRole")
                        .paintMapInit(
                        0,args[1],args[2],this.maplength,RenderProxy._maplinewidth,null,null,null,
                        GameRoleManager.getRolePic(i)
                    );
                    RenderLayerManager.selectLayer("BGGrid")
                        .rePaint(null,BGGridManager._strokeColor,null,null);
                }else{
                    RenderLayerManager.selectLayer("BGGrid")
                        .strokeMapInit(
                        RenderProxy._strokeColor,0,args[1],args[2],this.maplength,RenderProxy._maplinewidth
                    );
                }
            }else
            if(callFunc == RenderProxy.growStroke){
                if(GameRoleManager.isGameRole(i)){
                    RenderLayerManager.selectLayer("GameRole")
                        .growPaint(arguments[1],null,null,null,
                        asGradientMapAlpha(
                        GameRoleManager.getRolePic(i),[255,255,255],[124,124,255],false)
                    );
                    RenderLayerManager.selectLayer("BGGrid")
                        .rePaint(null,BGGridManager._strokeColor,null,null);
                }else{
                    RenderLayerManager.selectLayer("BGGrid")
                        .growStroke(RenderProxy._strokeColor,arguments[1]);
                }
            }
            if(i+1>BGGridManager.column_count * BGGridManager.row_count - 1){
                i = 0;
            }else{
                i ++ ;
            }
        };
    createLayers(this);
}

function createLayers(self){
    RenderLayerManager
        .createLayer("BGGrid",1)//背景网格
        .createLayer("GameUI",2)//背景字
        .createLayer("GameRole",3)//游戏角色绘制
        .createLayer("Effect",4)//效果层
        //.createLayer("MouseOnly",4)//桌面端鼠标操作独有的显示层
        .createLayer("RouteShow",5)//路径展示层
        .setPreviewCanvas(Stage.canvas)
        .previewEnd();//关闭演示模式

    //为游戏编写插件在每个回合结束时打印回合数
    var effectPlugin = new BaseEffect();
    var tv_show = new TextView();
    tv_show.setRenderContext(RenderLayerManager.selectLayer('GameUI').clear()._getRenderCtx());
    tv_show.setNumber(0,2);
    effectPlugin.onUserTurnBegin = function(){
        tv_show.setRenderContext(RenderLayerManager.selectLayer('GameUI').clear()._getRenderCtx());
        tv_show.setNumber(HeroActionManager.currentTurn,2);
        RenderLayerManager.renderLayers(Stage.ctx,null);
    };
    EffectManager.addEffect(effectPlugin);

    //绘制网格和角色
    BGGridManager.initPaint(
        self.paintFunc,
        true,
        self.grid_yi,
        self.grid_xi,
        self.maplength);

    RenderLayerManager
        .renderLayers(Stage.ctx,null);
    //游戏循环
    setGameCycler();
}

function setGameCycler(){
    //配置AI的角色范围
    HeroActionManager
        .setUserActionFunc('ai',function(){
            return GameRoleManager.getRolesByKind(['AngrySpiderMan','AngryThunderMan']);
        });
    HeroActionManager
        .userPrepared('me');
}

_p.onTouchOrMouseStart = function(ev){
    //Logger.dlog('onTouchOrMouseStart-Begin-','tchmouse');
    this.isMouseDown = true;
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
    Logger.dlog(
        'index:' + this.mouseStartIndex+
        " roleNum:" + GameRoleManager.roles[this.mouseStartIndex].roleNum +
        " action:" + GameRoleManager.roles[this.mouseStartIndex].action,'tchmouse');
    if(HeroActionManager.isInteractAvailable//交互可用
        && this.mouseStartIndex !=-1//输入范围可用
        && GameRoleManager.isGameRole(this.mouseStartIndex)//是游戏角色
        && GameRoleManager.roles[this.mouseStartIndex].action['user'] === 'me'//是玩家自己的角色而不是AI的
        ){
        if(HeroActionManager.currentAction == null){
            //提交一个新的动作
            HeroActionManager.postActionBegin(
                GameRoleManager.roles[this.mouseStartIndex].action
            );
        }
    }
    HeroActionManager.onActionStart(ev);
    ev.e.stopPropagation();
    ev.e.preventDefault();
    //Logger.dlog('onTouchOrMouseStart-End-','tchmouse');
}

_p.onTouchOrMouseEnd = function(ev){
    this.isMouseDown = false;
    if(!HeroActionManager.onActionEnd(ev)){
        //默认行为：重绘
        //bgClear();
        //RenderLayerManager.renderLayers(ctx,null);
        //BGGridManager.paint(paintFunc);
    }
    this.mouseStartIndex = -1;

    ev.e.stopPropagation();
    ev.e.preventDefault();
}

_p.onTouchOrMouseMove = function(ev){
    if(this.isMouseDown){
        HeroActionManager.onActionMove(ev);
    }else{
        if(HeroActionManager.currentAction!=null){
            HeroActionManager.onActionMove(ev);
        }else{
            //绘制适用于浏览器的默认行为
            //bgClear();
            //ctx.clearRect(0,0,canvas.width,canvas.height);
            //RenderLayerManager
            //    .previewEnd()
            //    .selectLayer("MouseOnly")
            //    .clear()
            //    .strokeMapInit('red',0,
            //        BGGridManager.getDataByXY(ev)[0].x,
            //        BGGridManager.getDataByXY(ev)[0].y)
            //    //.renderSingleLayer(ctx,"MouseOnly");
            //    .renderLayers(ctx,"MouseOnly");

            //BGGridManager.paint(paintFunc);
            //
            //RenderProxy.strokeMapInit('rgb(255,0,0)',ctx,0,
            //    BGGridManager.getDataByXY(ev)[0].x,
            //    BGGridManager.getDataByXY(ev)[0].y
            //)
        }
    }
    ev.e.stopPropagation();
    ev.e.preventDefault();
}