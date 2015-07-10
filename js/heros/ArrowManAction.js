/**
 * Created by jackyanjiaqi on 15-6-2.
 */
function ArrowManAction(){
    BaseHeroAction.apply(this,arguments);
    this.attackSelection = ObjectPool.give();
    this.rolePic = "arrowman";
    this.strategy.attack = this.attackStrategy;
}

extend(ArrowManAction,BaseHeroAction);

_p = ArrowManAction.prototype;

//覆写onActionEnd方法处理移动和射击的逻辑
//_p.onActionEnd = function (e) {
//    Logger.dlog('ArrowManAction:End');
//    for(var p in this.attackSelection){
//        if(this.attackSelection[p] == BGGridManager.touchDelegate.getIndex(e)){
//            //执行射杀动作
//            this.killAndGoTo(this.mouseStartIndex,this.attackSelection[p]);
//            this.postActionEnd();
//            break;
//        }
//    }
//    var res = BaseHeroAction.prototype.onActionEnd.call(this,e);
//    this.attackSelection = {};
//    this.mouseStartIndex = -1;
//    return res;
//}

_p.attackStrategy = function(index,selection,strokeStyle){
    this.show2ndRangeRouteAction(
        index,
        selection,
        false,//isStraightIgnore
        true,//isObliqueIgnore
        true,//is1stRoundBlankOnly
        false,//is1stRoundBlockOnly
        false,//is2ndRoundBlankOnly
        true,//is2ndRoundBlockOnly
        strokeStyle,
        'arrowman attack'
    );
}

_p.performShowAction = function (e) {
    ObjectPool.collect(this.availableSelection);
    this.availableSelection = ObjectPool.give();
    ObjectPool.collect(this.attackSelection);
    this.attackSelection = ObjectPool.give();
    this.show1stRangeRouteAction(
        this.mouseStartIndex,
        this.availableSelection,
        true,//isBlankOnly
        false,//isBlockOnly
        'green',
        'arrowman'
    );
    this.show2ndRangeRouteAction(
        this.mouseStartIndex,
        this.attackSelection,
        false,//isStraightIgnore
        true,//isObliqueIgnore
        true,//is1stRoundBlankOnly
        false,//is1stRoundBlockOnly
        false,//is2ndRoundBlankOnly
        true,//is2ndRoundBlockOnly
        'red',
        'arrowman attack'
    );
    this.mergeInAvailableSelection(this.attackSelection);
}

_p.performExecuteAction = function(availableSelectionIndex){
    if(availableSelectionIndex in this.attackSelection){
        //执行射杀动作
        this.killAndGoTo(this.mouseStartIndex,this.attackSelection[availableSelectionIndex]);
        this.postActionEnd();
        return;
    }
    this.goToTargetIndex(this.mouseStartIndex,this.availableSelection[availableSelectionIndex]);
    this.postActionEnd();
}

_p.reset = function(){
    BaseHeroAction.prototype.reset.apply(this,arguments);
    ObjectPool.collect(this.attackSelection);
    this.attackSelection = ObjectPool.give();
}
