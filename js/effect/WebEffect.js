/**
 * Created by jackyanjiaqi on 15-6-8.
 */
function WebEffect(){
    BaseEffect.apply(this,arguments);
    this.effectMap["WebEffect"] = true;
    delete this.effectMap['BaseEffect'];
    this.renderPic = "WebEffect";
    this.stopTurn = 0;
    this.maxStopTurn = 3;
    this.stopStep = 1;//处于该效果下减少的行动力
    this.stopRound = 1;//处于该效果下减少回合的数量
}

extend(WebEffect,BaseEffect);

_p = WebEffect.prototype;

_p.onUserTurnBegin = function(){
    this.stopTurn++;
    if(this.stopTurn >= this.maxStopTurn){
        this.isDeleted = true;
    }else{
        //如果有角色 减少该角色本回合的回合数;减少该角色本回合的行动力
        if(GameRoleManager.roles[this.index] && GameRoleManager.roles[this.index].action){
            if('currentStep' in GameRoleManager.roles[this.index].action){
                GameRoleManager.roles[this.index].action['currentStep'] += this.stopStep;
            }
            GameRoleManager.roles[this.index].action.postTimes -= this.stopRound;
        }
    }
    //if(this.startTurn === undefined){
    //    this.startTurn = 1;
    //    if(GameRoleManager.roles[this.index].stopturn === undefined){
    //        GameRoleManager.roles[this.index].stopturn = 1;
    //    }
    //}else{
    //    if(this.startTurn >= this.maxStopTurn){
    //        delete GameRoleManager.roles[this.index].stopturn;
    //        this.isDeleted = true;
    //    }else{
    //        this.startTurn++;
    //    }
    //}
}

//_p.onTrueReturned = function(func,args){
//    //有stoprun标记则屏蔽该角色的行动
//    if(func.name && func.name == "isGameRole"){
//        var searchIndex = args[0];
//        return !GameRoleManager.roles[searchIndex].stopturn;
//    }
//    return true;
//}

//_p.onFalseReturned = function(func,args){
//    //有stoprun标记则屏蔽该角色的行动
//    if(func.name && func.name == "isGameRole"){
//        var searchIndex = args[0];
//        return GameRoleManager.roles[searchIndex].stopturn;
//    }
//    return false;
//}

//_p.onBooleanReturned = function(res,func,args){
//    //有stopturn标记则屏蔽该角色的行动
//    if(func.name && func.name === 'isGameRole'){
//        if(this.index === args[0]){
//            return false;
//        }
//    }
//    return res;
//}