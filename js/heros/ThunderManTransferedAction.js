/**
 * Created by jackyanjiaqi on 15-6-19.
 */
function ThunderManTransferedAction(){
    MultipleStepBaseAction.apply(this,arguments);
    this.rolePic = "ThunderMan";
    this.moveSelection = ObjectPool.give();
    this.attackSelection = ObjectPool.give();
    this.transferAimSelection = ObjectPool.give();
    this.transferTargetSelection = ObjectPool.give();
    this.transferConsume = 0;
    this.transferMax = 1;
    this.transferMode = 0;//0随机传送 1定点传送
}

extend(ThunderManTransferedAction,MultipleStepBaseAction);

_p.performStepExecuteAction = function(isEnd,availableSelectionIndex){
    //预处理
    if(this.stepLastIndex == -1){
        this.stepLastIndex = this.stepFirstIndex;
    }
    var isMoveAttack = false;
    if(availableSelectionIndex in this.attackSelection){
        this.killAndGoTo(this.stepLastIndex,this.attackSelection[availableSelectionIndex]);
        isMoveAttack = true;
    }else
    if(availableSelectionIndex in this.moveSelection){
        this.goToTargetIndex(this.stepLastIndex,this.moveSelection[availableSelectionIndex]);
        isMoveAttack = true;
    }
    if(availableSelectionIndex in this.transferAimSelection){
        for(var p in GameRoleManager.roleKindMap[this.getRolePic()]){
            if(p !== this.stepLastIndex){
                this.transferTargetSelection[p] = p;
            }
        }
        this.mergeInAvailableSelection(this.transferTargetSelection);

        RenderLayerManager
            .selectLayer('RouteShow')
            .clear();
        this.showAvailableSelection(null,'rgba(255,133,0,133)','传送');
        RenderLayerManager
            .renderLayers(Stage.ctx,null);

        isMoveAttack = false;
    }else
    if(availableSelectionIndex in this.transferTargetSelection){
        var random = ObjectPool.give();
        this.show1stRangeRouteAction(
            this.transferTargetSelection[availableSelectionIndex]
            ,random
            ,false//isBlankOnly
            ,true//isBlockOnly
            ,'rgba(0,0,0,0)'
            ,'thunderman transfer'
        );

        isMoveAttack = false;
    }

    if(isMoveAttack){
        this.currentStep ++;
        var currentIndex = this.availableSelection[availableSelectionIndex];

        ObjectPool.collect(this.attackSelection);
        ObjectPool.collect(this.moveSelection);
        ObjectPool.collect(this.availableSelection);
        this.attackSelection = ObjectPool.give();
        this.moveSelection = ObjectPool.give();
        this.availableSelection = ObjectPool.give();

        if(this.transferConsume < this.transferMax){
            this.show1stRangeRouteAction(
                null,
                null,
                this.transferAimSelection,
                false,//isBlankOnly
                true,//isBlockOnly
                'blue',
                'thunderman transferaim'
            );
        }
    }else{

    }
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