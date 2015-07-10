/**
 * Created by jackyanjiaqi on 15-6-19.
 */
function SpiderManAction(){
    MultipleStepBaseAction.apply(this,arguments);
    this.jumpRange = ObjectPool.give();
    this.attackSelection = ObjectPool.give();
    this.rolePic = "spiderman";
    this.attackPersumed = 0;
    this.attackMax = 1;
    this.jumpPersumed = 0;
    this.jumpMax = 1;
}

var webEffectNum = {num:0};

extend(SpiderManAction,MultipleStepBaseAction);

_p = SpiderManAction.prototype;

_p.setJumpMax = function(jumpMax){
    this.jumpMax = jumpMax;
}

_p.setAttackMax = function (attackMax) {
    this.attackMax = attackMax;
}

_p.onStepClick = function(clickIndex){
    return false;
}

_p.performStepExecuteAction = function(isEnd,availableSelectionIndex){
    //预处理
    if(this.stepLastIndex == -1){
        this.stepLastIndex = this.stepFirstIndex;
    }
    var clickIndex = this.availableSelection[availableSelectionIndex];

    var isAttackClicked = false;

    if(availableSelectionIndex in this.attackSelection){
        //处理网
        //执行蜘蛛喷网操作
        RenderLayerManager
            .selectLayer('Effect')
            .clear();
        EffectManager.updateEffectInfo(
            'WebEffect',{
                id:webEffectNum.num++,
                index:this.attackSelection[availableSelectionIndex]
            })
            .renderEffects();
        RenderLayerManager
            .renderLayers(Stage.ctx,null);

        this.attackPersumed++;
        isAttackClicked = true;
    }

    if(availableSelectionIndex in this.jumpRange){

        ObjectPool.collect(this.availableSelection);
        this.availableSelection = ObjectPool.give();

        RenderLayerManager
            .selectLayer('RouteShow')
            .clear();
        this.showOneDirectionLineRouteAction(
            this.stepLastIndex,
            availableSelectionIndex,
            this.availableSelection,
            true,
            false,
            5,'green','spiderman confirm'
        );
        RenderLayerManager
            .renderLayers(Stage.ctx,null);

        ObjectPool.collect(this.attackSelection);
        this.attackSelection = ObjectPool.give();
        ObjectPool.collect(this.jumpRange);
        this.jumpRange = ObjectPool.give();

    }else{
        if(!isAttackClicked) {
            var last =  0;
            //执行跳跃确认
            for(var p in this.availableSelection){
                //Logger.dlog(p+" : "+this.jumpRange[p]);
                last = p;
            }
            this.goToTargetIndex(this.stepLastIndex,this.availableSelection[last]);
            this.jumpPersumed++;
            this.stepLastIndex = this.availableSelection[last];
        }

        ObjectPool.collect(this.attackSelection);
        this.attackSelection = ObjectPool.give();
        ObjectPool.collect(this.jumpRange);
        this.jumpRange = ObjectPool.give();
        ObjectPool.collect(this.availableSelection);
        this.availableSelection = ObjectPool.give();

        RenderLayerManager
            .selectLayer('RouteShow')
            .clear();
        //判断是否还可以跳跃
        if(this.jumpPersumed < this.jumpMax){
            this.show1stRangeRouteAction(
                this.stepLastIndex,
                this.jumpRange,
                true,//isBlankOnly
                false,//isBlockOnly
                'green',//
                'spiderman jump'
            );
        }
        //判断是否还可以施放蜘蛛网
        if(this.attackPersumed < this.attackMax) {
            this.show1stRangeRouteAction(
                this.stepLastIndex,
                this.attackSelection,
                false,//isBlankOnly
                true,//isBlockOnly
                'blue',
                'spiderman attack'
            );
        }

        RenderLayerManager
            .renderLayers(Stage.ctx,null);

        this.mergeInAvailableSelection(this.jumpRange);
        this.mergeInAvailableSelection(this.attackSelection);
        //
        if(this.jumpPersumed >= this.jumpMax && this.attackPersumed >= this.attackMax){
            this.postActionEnd();
        }
    }
}

_p.performShowAction = function(e){
    if(this.currentStep === 0){
        this.show1stRangeRouteAction(
            this.mouseStartIndex,
            this.jumpRange,
            true,//isBlankOnly
            false,//isBlockOnly
            'green',
            'spiderman jump'
        );
        this.show1stRangeRouteAction(
            this.mouseStartIndex,
            this.attackSelection,
            false,//isBlankOnly
            true,//isBlockOnly
            'blue',
            'spiderman attack'
        );
        this.mergeInAvailableSelection(this.jumpRange);
        this.mergeInAvailableSelection(this.attackSelection);
    }
}

_p.reset = function(){
    MultipleStepBaseAction.prototype.reset.apply(this,arguments);
    ObjectPool.collect(this.jumpRange);
    ObjectPool.collect(this.attackSelection);
    this.jumpRange = ObjectPool.give();
    this.attackSelection = ObjectPool.give();
    this.attackPersumed = 0;
    this.jumpPersumed = 0;
}