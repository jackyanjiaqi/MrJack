/**
 * 英雄技能管理器 负责分配玩家和AI对英雄的操控
 * Created by jackyanjiaqi on 15-6-2.
 */
HeroActionManager = {
    currentAction:null,//当前执行的动作
    currentActionStack:ArrayPool.give(),//用于多重动作的动作栈
    hangingActions:ArrayPool.give(),//跨回合的挂起动作（绿巨人蓄力）
    currentTurn:0,//一个回合结束后currentTurn+1
    currentRound:{me:0,ai:0},//所有玩家当前回合
    //AI专用
    isInteractAvailable:false,//是否可以交互
    currentUser:null,
    userTurnStrategy:['me'],//玩家先手
    userActions:null,//玩家控制单元集合
    userActionFuncs:ObjectPool.give(),//
    timeoutFlag:-1
}

_b = HeroActionManager;

_b.setUserTurnStrategy = function(strategy){
    _b.userTurnStrategy = strategy;
}

_b.setUserActionFunc = function(userId,func){
    _b.userActionFuncs[userId] = func;
}

_b.updateActions = function(userId){
    if(userId in _b.userActionFuncs){
        _b.userActions = _b.userActionFuncs[userId]();
    }else{
        _b.userActions = null;
    }
}

_b.userPrepared = function(userId){
    _b.updateActions(userId);
    if(userId === 'ai'){
        //配置行动链
        if(_b.userActions){
            for(var i=0;i<_b.userActions.length;i++){
                if(i+1<_b.userActions.length){
                    _b.userActions[i].action.ai.next = _b.userActions[i+1].action.ai;
                }else{
                    _b.userActions[i].action.ai.next = null;
                }
            }
        }
    }

    //配置一回合数行动数
    if(_b.userActions){
        for(var i=0;i<_b.userActions.length;i++){
            _b.userActions[i].action.postTimes = _b.userActions[i].action.postMaxTime;
        }
    }

    //打开玩家的交互界面
    if(userId === 'me'){
        _b.isInteractAvailable = true;
    }else{
        _b.isInteractAvailable = false;
    }
    _b.currentUser = userId;
    //该User开始
    _b.onUserTurnBegin(userId);
}

_b.informUserEnd = function(userId){
    this.currentRound[userId]++;
    //结束未完成的动作
    if(_b.currentAction != null) {
        _b.currentAction.postActionEnd();
    }
    //关闭玩家的交互
    if(userId === 'me'){
        _b.isInteractAvailable = false;
    }
    //回调 游戏循环结束判断在此处写
    if(!_b.onUserTurnEnd(userId)){
        //准备下一个user
        var n_i = (_b.userTurnStrategy.indexOf(userId)+1)%_b.userTurnStrategy.length;
        _b.userPrepared(_b.userTurnStrategy[n_i]);
    }

}

/**
 * 根据配置生成相应的action
 * @param index
 * @returns {*}
 */
_b.getAction = function getAction(roleNum){
    if(Stage.roles && Stage.roles.detail && roleNum in Stage.roles.detail){
        var cnstrctFunc = Stage.roles.detail[roleNum].action;
        return new cnstrctFunc();
    }
    //if(Stage.roles && Stage.roles.detail && index < Stage.roles.detail.length){
    //    var cnstrctFunc = Stage.roles.detail[index].action;
    //    return new cnstrctFunc();
    //}
    return null;
}
//
_b.postActionBegin = function(action){
    //能提交的次数不为0或以下
    if(action && action.postTimes>0){
        //结束当前未完成的动作
        if(_b.currentAction != null) {
            if(_b.currentAction.state != 0){
                _b.currentAction.postActionEnd(false);
            }
        }
        //执行新的动作
        _b.currentAction = action;
        _b.currentAction.postActionBegin();
        return true;
    }else{
        return false;
    }
}

_b.postActionEnd = function(isActionTurnEnd){
    //当前行动结束
    _b.currentAction = null;
    if(isActionTurnEnd){
        _b.currentTurn ++ ;
    }
    //整体刷新
    RenderLayerManager
        .selectLayer("RouteShow")
        .clear()
        .renderLayers(Stage.ctx,null);

    //检查是否还有剩余的回合数
    if(isActionTurnEnd){
        this.userTurnEndCheck();
    }
}

/**
 * 一个玩家的回合开始
 */

_b.onUserTurnBegin = function onUserTurnBegin(userId){
    //默认开启计时器 默认忽略挂起的
    //若计时器关闭则忽略所有事件 并执行自定义Action结果
    if(!EffectManager.onEffectInvolved(_b.onUserTurnBegin,arguments)){
        if(userId === 'me'){
            clearTimeout(_b.timeoutFlag);
            _b.timeoutFlag = setTimeout(
                function(){_b.informUserEnd(userId)},100000);
        }else
        if(userId === 'ai'){
            if(_b.userActions && _b.userActions.length>0){
                _b.userActions[0].action.ai.onStratagyStart();
            }else{
                _b.informUserEnd(userId);
            }
        }
    }
}

/**
 * 一个玩家的回合结束
 */
_b.onUserTurnEnd = function onUserTurnEnd(userId){
    //回合结束后以启用效果
    return EffectManager.onEffectInvolved(_b.onUserTurnEnd,arguments);
    //结算效果后计算是否赢了
    //首先结算回合数
    if(_b.currentRond > 10 || GameRoleManager.roleCountMap.total > GameRoleManager.roles.length/2){
        RenderLayerManager
            .switchScene()
            .nameScene('GameOver')
            .selectLayer('GameOver');

        Stage.theme.bgStyle = 'black';
        RenderLayerManager
            .paintMapInit(0,Stage.width/2,Stage.height/2,258,10,'rgba(133,0,0,133)','red','你输了')
            .renderLayers(Stage.ctx,null);

    }else
    if(GameRoleManager.roleCountMap.total >= 2){
        var lonely = 0;
        for(var p in GameRoleManager.roleCountMap){
            if(p!=='total'){
                if(GameRoleManager.roleCountMap[p]>0){
                    lonely ++;
                }
            }
        }
        var showLonely = new TextView();
        showLonely.setRenderContext(RenderLayerManager
            .selectLayer('GameUI')._getRenderCtx());
        showLonely.x = 700;
        showLonely.y = 400;
        showLonely.setNumber(lonely,2);
        RenderLayerManager
            .renderLayers(Stage.ctx,null);

        if(lonely === 1){
            RenderLayerManager
                .switchScene()
                .switchScene('Main');
        }
    }else{
        //if(Math.random()>0.7){
        //    GameRoleManager.createNew(true,null);
        //}
    }
}

_b.onActionStart = function(e){
    if(_b.isInteractAvailable && _b.currentAction != null){
        return _b.currentAction.onActionStart(e);
    }
}

_b.onActionMove = function(e){
    if(_b.isInteractAvailable && _b.currentAction != null){
        return _b.currentAction.onActionMove(e);
    }
}

_b.onActionEnd = function(e){
    if(_b.isInteractAvailable && _b.currentAction != null){
        return _b.currentAction.onActionEnd(e);
    }
}

_b.userTurnEndCheck = function(){
    if(_b.currentUser === 'me'){
        var isAllEnd = true;
        this.updateActions(_b.currentUser);
        for(var i = 0;i<this.userActions.length;i++){
            if(this.userActions[i].action.postTimes > 0){
                isAllEnd = false;
                break;
            }
        }
        if(isAllEnd){
            clearTimeout(this.timeoutFlag);
            this.informUserEnd(_b.currentUser);
        }
    }
}

_b.clear = function(){
    if(_b.currentAction){
        _b.currentAction.postActionEnd(false);
    }
    ArrayPool.collect(_b.currentActionStack);
    _b.currentActionStack = ArrayPool.give();
    ArrayPool.collect(_b.hangingActions);
    _b.hangingActions = ArrayPool.give();
    _b.currentTurn = 0;
    _b.currentRound = {me:0,ai:0};
    //AI专用
    _b.isInteractAvailable = false;
    _b.currentUser = null;
    _b.userTurnStrategy = ['me'];//默认玩家先手

    ArrayPool.collect(_b.userActions);
    _b.userActions = null;//玩家控制单元集合

    ObjectPool.collect(_b.userActionFuncs);
    _b.userActionFuncs = ObjectPool.give();

    clearTimeout(_b.timeoutFlag);
    _b.timeoutFlag = -1;
}