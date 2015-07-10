/**
 * Created by jackyanjiaqi on 15-6-24.
 */
function TestEndGameEffect(){
    BaseEffect.apply(this,arguments);
    //游戏结束查看插件的目标是建立游戏盘的统计模型并实时查看
    this.onGameEnd = null;
    this.ALL_DIED = false;
    this.USER_TURN_MAX = false;//到达最大值
    this.USER_MAX = false;
    this.ENEMY_OUT = false;
    this.GOAL_ENEMY_OUT = false;
    this.USER_TOUCH = false;//玩家抵达
    this.GOAL_USER_TOUCH = false;
    this.GOAL_USER_KILL_GOAL_ENEMY = false;//单杀
    this.GOAL_KEEP_ALIVE = false;//回合内幸存
    this.GOALS = [
        'ALL_DIED',//玩家全部阵亡
        'GOAL_KEEP_ALIVE',//指定角色存活
        'USER_TURN_MAX',//最大回合数
        'USER_MAX',//玩家人数优势
        'ENEMY_OUT',//敌人全部死亡
        'GOAL_OUT',//指定角色死亡
        'USER_TOUCH',//所有玩家到达指定地点
        'GOAL_USER_TOUCH',//指定玩家到达指定地点
        'GOAL_USER_KILL_GOAL_ENEMY'
    ]
}

extend(TestEndGameEffect,BaseEffect);

_p = TestEndGameEffect.prototype;

_p.onUserTurnEnd = function(){
    //优先检查胜利条件
    if(this.checkIsWin() && this.onGameEnd){
        this.onGameEnd(true);
        return true;
    }
    if(this.checkIsLost() && this.onGameEnd){
        this.onGameEnd(false);
        return true;
    }
}

_p._g = function(goalName,args){
    var a = _p._g;
    switch(goalName){
        case 'ALL_DIED':
            return GameRoleManager.getRolesByUser('me').length;
        case 'ENEMY_OUT':
            return GameRoleManager.getRolesByUser('ai').length;
        case 'USER_TURN_MAX':
            return HeroActionManager.currentRound['me'] >= args;
        case 'GOAL_KEEP_ALIVE':
            return this.getGoalRole(args);
        case 'GOAL_DIED':
            return !this.getGoalRole(args);
        case 'GOAL_USER_TOUCH':
            var goalRole = this.getGoalRole(args);
            return goalRole && goalRole['role']['action']['goalid'] === GameRoleManager.roles[goalRole['goal']]['goalid'];
        case 'UNITED':
            var res = true;
            for(var key in args){
                if(!this._g(key,args[key])){
                    res = false;
                    break;
                }
            }
            return res;
    }
}
//对所有胜利条件使用存在量词
_p.checkIsWin =function(){
    for(var goalName in Stage.currentLevel.goals.victory){
        var args = Stage.currentLevel.goals.victory[goalName];
        var res = null;
        if(typeof args === 'boolean'){
            res = this._g(goalName) === args;
        }else{
            res = this._g(goalName,args);
        }
        if(res){
            return true;
        }
    }
    return false;
}

_p.checkIsLost = function(){
    for(var goalName in Stage.currentLevel.goals.fail){
        var args = Stage.currentLevel.goals.fail[goalName];
        var res = null;
        if(typeof args === 'boolean'){
            res = this._g(goalName) === args;
        }else{
            res = this._g(goalName,args);
        }
        if(res){
            return true;
        }
    }
    return false;
}

_p.getGoalRoleIndexByUser = function(userId,goalid){
    var keymap = ObjectPool.give();
    GameRoleManager.getRolesByUser(userId,keymap);
    for(var key in keymap){
        if('goalid' in keymap[key].action && keymap[key].action['goalid'] === goalid){
            return {goal:key,role:keymap[key]};
        }
    }
    return null;
}

_p.getGoalRole = function(goalId){
    var searchlist = HeroActionManager.userTurnStrategy;
    var res = null;
    for(var i=0;i<searchlist.length;i++){
        if(res = this.getGoalRoleIndexByUser(searchlist[i],goalId)){
            return res;
        }
    }
    return null;
}
