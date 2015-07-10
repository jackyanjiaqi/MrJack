/**
 * Created by jackyanjiaqi on 15-6-16.
 */
function MultipleStepBaseAction(){
    BaseHeroAction.apply(this,arguments);
    this.rolePic = "AngryCaptain";//暴走神
    this._maxStep = 2;
    this.currentStep = 0;
    this.stepFirstIndex = -1;
    this.stepLastIndex = -1;
}

extend(MultipleStepBaseAction,BaseHeroAction);

_p = MultipleStepBaseAction.prototype;

_p.setMaxStep = function(stepNum){
    this._maxStep = stepNum;
}

_p.onActionStart = function(e){
    this.mouseStartIndex = BGGridManager.touchDelegate.getIndex(e);
    if(this.currentStep === 0){
        this.stepFirstIndex = this.mouseStartIndex;
    }
    Logger.dlog('mouseStartIndex:'+this.mouseStartIndex);
    RenderLayerManager
        .selectLayer("RouteShow").clear();
    this.performShowAction(e);
    RenderLayerManager
        .renderLayers(Stage.ctx,"RouteShow");
}

_p.onActionEnd = function(e){
    //是点击事件
    if(BGGridManager.touchDelegate.getIndex(e) === this.mouseStartIndex){
        if(!this.onStepClick(this.mouseStartIndex)){
            for(var p in this.availableSelection){
                if(this.availableSelection[p] === this.mouseStartIndex){
                    //合理点击执行动作
                    this.performExecuteAction(p);
                    return;
                }
            }
            //非合理区域点击结束本次行动 只有第一次点击即取消不算消耗行动值
            this.postActionEnd(this.isActionPersumed);
        };
    }else{
        //非点击事件
        BaseHeroAction.prototype.onActionEnd.apply(this,arguments);
    }
}

_p.onStepClick = function(clickIndex){
    //if(this.currentStep >0){
    //    if(this.currentStep === this._maxStep){
    //        this.postActionEnd(false);
    //    }
    //    this.currentStep ++;
    //}
    return false;
}

_p.performShowAction = function(e){
    if(this.currentStep === 0){
        BaseHeroAction.prototype.performShowAction.apply(this,arguments);
    }
}

_p.performExecuteAction = function(availableSelectionIndex){
    if(this.currentStep >= this._maxStep){
        this.performStepExecuteAction(true,availableSelectionIndex);
    }else{
        this.performStepExecuteAction(false,availableSelectionIndex);
    }
    this.currentStep ++ ;
    //触发连击行为即将默认行动值消耗
    this.isActionPersumed = true;
}

_p.performStepExecuteAction = function(isEnd,availableSelectionIndex){
    if(this.stepLastIndex == -1){
        this.stepLastIndex = this.stepFirstIndex;
    }
    var targetIndex = this.availableSelection[availableSelectionIndex];
    this.goToTargetIndex(
        this.stepLastIndex,
        targetIndex);

    if(!isEnd){

        ObjectPool.collect(this.availableSelection);
        this.availableSelection = ObjectPool.give();

        RenderLayerManager
            .selectLayer('RouteShow')
            .clear();

        this.show1stRangeRouteAction(
            targetIndex,
            this.availableSelection,
            true,
            false,
            'green'
        );

        RenderLayerManager
            .renderLayers(Stage.ctx,null);

        this.stepLastIndex = targetIndex;
        this.currentStep ++;
    }else{
        this.postActionEnd();
    }
}

_p.reset = function(){
    this.currentStep = 0;
    this.stepFirstIndex = -1;
    this.stepLastIndex = -1;
    BaseHeroAction.prototype.reset.apply(this,arguments);
}