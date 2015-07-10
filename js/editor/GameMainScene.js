/**
 * Created by jackyanjiaqi on 15-6-20.
 */
function GameMainScene(){
    BGGridTouchableScene.apply(this,arguments);
    this.gameEndPlugin = null;
}

extend(GameMainScene,BGGridTouchableScene);

_p = GameMainScene.prototype;

_p.onResume = function(scene){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);
    if(!scene){
        HeroActionManager.clear();
        if(this.needPreLoadLevelResource()){
            return;
        }
    }
    Stage.theme.bgStyle = 'bg_'+['arrowman','captain','spiderman','thunderman'][Math.floor(Math.random()*4)];
    RenderProxy._strokeColor = 'white';

    RenderLayerManager
        .selectLayer('BGGrid').clear()
        .selectLayer('GameUI').clear()
        .selectLayer('GameRole').clear()
        .selectLayer('Effect').clear()
        .selectLayer('RouteShow').clear()
        .cancelSelect()
        .setPreviewCanvas(Stage.canvas)
        .previewEnd();

    //配置网格
    this.initBGManager();
    this.drawBG();
    ////BGGrid层展示游戏板
    //gameBoardShow(this);
    //GameUI层展示一部分游戏参数
    gameNumberShow(this);
    //GameRole层配置并展示游戏角色
    gameRoleConfigAndShow(this);
    //渲染输出
    RenderLayerManager
        .renderLayers(Stage.ctx,null);
    //配置结束条件
    setGameEndConditions(this);
    //配置游戏循环
    setGameCycler(this);
}

function gameBoardShow(self){
    RenderLayerManager.selectLayer('BGGrid');
    BGGridManager.initPaint(
        null,
        true,
        self.grid_yi,//行
        self.grid_xi,//列
        self.maplength);
}

function gameNumberShow(){
    //为游戏编写插件在每个回合结束时打印步数和回合数
    EffectManager.clear();
    var gameUIPlugin = new BaseEffect();
    //右上角
    var tv_actionstep = new TextView();
    tv_actionstep.setPivot(Indicator.FLAG_TOP | Indicator.FLAG_RIGHT);
    tv_actionstep.x = Stage.width;
    tv_actionstep.y = 0;
    //左下角
    var tv_userturnstep = new TextView();
    tv_userturnstep.setPivot(Indicator.FLAG_BOTTOM | Indicator.FLAG_LEFT);
    tv_userturnstep.x = 0;
    tv_userturnstep.y = Stage.height;
    tv_actionstep.setRenderContext(RenderLayerManager.selectLayer('GameUI')._getRenderCtx());
    tv_userturnstep.setRenderContext(RenderLayerManager.selectLayer('GameUI')._getRenderCtx());
    tv_actionstep.setNumber(0,2);
    tv_userturnstep.setNumber(0,2);
    var userturn = 0;
    gameUIPlugin.onUserTurnBegin = function(){
        RenderLayerManager.selectLayer('GameUI').clear();
        tv_actionstep.setNumber(HeroActionManager.currentTurn,2);
        tv_actionstep.setNumber(++userturn,2);
        RenderLayerManager.renderLayers(Stage.ctx,null);
    };
    EffectManager.addEffect(gameUIPlugin);
}

function gameRoleConfigAndShow(){
    GameRoleManager.createFromConfigMap(Stage.currentLevel);
    RenderLayerManager.selectLayer('GameRole').clear();
    GameRoleManager.renderRoles();
}

function setGameEndConditions(self){
    self.gameEndPlugin = new TestEndGameEffect();
    self.gameEndPlugin.onGameEnd = function(isGameWin){
        //清楚游戏结算
        HeroActionManager.clear();
        GameRoleManager.clear();
        EffectManager.clear();

        //BGGridManager.clear();
        Stage.ctx.clearRect(0,0,Stage.width,Stage.height);
        if(isGameWin){
            self.unlockNextLevelAndBackToSelectScene();
        }
        var flag = window.setTimeout(function(){
            clearTimeout(flag);
            RenderLayerManager.switchScene('MissionSelect');
            //Stage.loadLevelBy({name:'MissionSelect'});
        },10);

    }
    //self.gameEndPlugin.onUserTurnEnd = function(){
    //
    //    //Logger.dlog('userTurnEnd '+HeroActionManager.currentRound['me'],'gameendcondition');
    //}
    EffectManager.addEffect(self.gameEndPlugin);
}

function setGameCycler(self){
    //配置AI的角色范围
    HeroActionManager.setUserTurnStrategy(['ai','me']);
    HeroActionManager.setUserActionFunc('ai',
        //返回AI的角色选择范围
        function(){
            return GameRoleManager.getRolesByUser('ai');
        });
    HeroActionManager.setUserActionFunc('me',
        //返回玩家默认控制的角色范围
        function(){
            return GameRoleManager.getRolesByUser('me');
        });
    HeroActionManager
        .userPrepared('me');
}

_p.unlockNextLevelAndBackToSelectScene = function(){
    var nextMap = Stage.currentLevel.nextLevel;
    for(var p in nextMap){
        var index = indexTransfer(nextMap[p]['coordinate'][0],nextMap[p]['coordinate'][1],this.grid_xi);

        //逐一提供入口并写入本地数据
        var base = 'levelSelect'+index;
        localStorage[base] = true;
        var picparam = '';
        nextMap[p]['pic'].forEach(function(item,i){
            if(i !== 0){
                picparam += '|'+item;
            }else{
                picparam += item;
            }
        });
        localStorage[base+'pic'] = picparam;
        localStorage[base+'name'] = p;
        localStorage[base+'launch'+'name'] = nextMap[p]['launch']['name'];
        localStorage[base+'launch'+'index'] = nextMap[p]['launch']['index'];
        var desparam = '';
        nextMap[p]['des'].forEach(function(item,i){
            if(i !== 0){
                desparam += ';'+item;
            }else{
                desparam += item;
            }
        });
        localStorage[base+'des'] = desparam;
    }
}

_p.onTouchOrMouseStart = function(ev){
    BGGridTouchableScene.prototype.onTouchOrMouseStart.apply(this,arguments);
    if(GameRoleManager.roles[this.mouseStartIndex] && GameRoleManager.roles[this.mouseStartIndex].action){
        Logger.dlog(
            'index:' + this.mouseStartIndex+
            " action:" + GameRoleManager.roles[this.mouseStartIndex].action,'tchmouse');
    }else{
        Logger.dlog(
            'index:' + this.mouseStartIndex,'tchmouse');
    }
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
}

_p.onTouchOrMouseEnd = function(ev){
    HeroActionManager.onActionEnd(ev);
    BGGridTouchableScene.prototype.onTouchOrMouseEnd.apply(this,arguments);
}

_p.onTouchOrMouseMove = function(ev){
    HeroActionManager.onActionMove(ev);
    BGGridTouchableScene.prototype.onTouchOrMouseMove.apply(this,arguments);
}

_p.onDoubleClick = function(){
    if(HeroActionManager.currentUser === 'me'){
        HeroActionManager.informUserEnd('me');
    }
}