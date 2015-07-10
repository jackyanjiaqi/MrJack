/**
 * Created by jackyanjiaqi on 15-6-8.
 */
/**
 * Effect原则上接收一切能够产生效果的hook 所以这里有大多数onXXX函数,虽然不一定被触发
 * @constructor
 */
function BaseEffect(){
    this.effectMap = {BaseEffect:true};//包含一个继承关系的映射
    this.isDeleted = false;
    this.id = -1;//－1表示全局唯一,从0及以上表示多个所对应的id
    this.renderPic = null;
}

_p = BaseEffect.prototype;

_p.isEffect = function(effectName){
    return effectName in this.effectMap;
}

_p.onEffectInvolved = function(func,arguments){
    if(this.isDeleted){
        EffectManager.rebuildEffectList(this.constructor.name);
    }else
    if(func.name && func.name == 'onUserTurnBegin'){
        return this.onUserTurnBegin.apply(this,arguments);
    }else
    if(func.name && func.name == 'onUserTurnEnd'){
        return this.onUserTurnEnd.apply(this,arguments);
    }
}

_p.onBooleanReturned = function (res,func,args,effectTag){
    return res;
}

/**
 * 一个玩家的回合开始
 */
_p.onUserTurnBegin = function(){

}
/**
 * 一个玩家的回合结束
 */
_p.onUserTurnEnd = function(){

}

_p.onActionBegin = function(){

}

_p.onActionEnd = function (){

}

_p.addMark = function(mark){

}