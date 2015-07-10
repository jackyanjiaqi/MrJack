/**
 * Created by jackyanjiaqi on 15-6-2.
 */
function ThunderManAction(){
    BaseHeroAction.apply(this,arguments);
    this.rolePic = "thunderman";
    this.attackSelection = ObjectPool.give();
    this.moveSelection = ObjectPool.give();
    this.strategy.attack = this.attackStrategy;
}

extend(ThunderManAction,BaseHeroAction);

_p = ThunderManAction.prototype;

_p.attackStrategy = function(index,selection,strokeStyle){
    this.show1stRangeRouteAction(
        index,
        selection,
        false,//isBlankOnly
        true,//isBlockOnly
        strokeStyle,
        'thunderman attack strategy'
    );
}

_p.performShowAction = function (e) {
    this.show1stRangeRouteAction(
        this.mouseStartIndex,
        this.moveSelection,
        true,//isBlankOnly
        false,//isBlockOnly
        'green',
        'thunderman'
    );
    this.show1stRangeRouteAction(
        this.mouseStartIndex,
        this.attackSelection,
        false,//isBlankOnly
        true,//isBlockOnly
        'red',
        'thunderman attack'
    );
    this.mergeInAvailableSelection(this.moveSelection);
    this.mergeInAvailableSelection(this.attackSelection);
}

_p.performExecuteAction = function(availableSelectionIndex){
    if(availableSelectionIndex in this.attackSelection){
        this.killAndGoTo(this.mouseStartIndex,this.attackSelection[availableSelectionIndex]);
    }else{
        this.goToTargetIndex(this.mouseStartIndex,this.availableSelection[availableSelectionIndex]);
    }
    this.postActionEnd();
}

_p.reset = function(){
    BaseHeroAction.prototype.reset.apply(this,arguments);
    ObjectPool.collect(this.attackSelection);
    ObjectPool.collect(this.moveSelection);
    this.moveSelection = ObjectPool.give();
    this.attackSelection = ObjectPool.give();
}