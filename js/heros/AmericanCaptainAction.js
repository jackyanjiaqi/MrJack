/**
 * Created by jackyanjiaqi on 15-6-2.
 */
function AmericanCaptainAction(){
    BaseHeroAction.apply(this,arguments);
    this.rolePic = "captain";
    this.actionstep = 0;
    this.shieldSelection = {};
}

extend(AmericanCaptainAction,BaseHeroAction);

_p = AmericanCaptainAction.prototype;

_p.performExecuteAction = function (availableSelectionIndex) {
    if(this.actionstep == 0){
        this.shieldSelection = {};

        //执行跳跃动作
        this.goToTargetIndex(
            this.mouseStartIndex,
            this.availableSelection[availableSelectionIndex]);

        //显示放置盾牌的范围
        RenderLayerManager
            .selectLayer("RouteShow")
            .clear();

        this.show1stRangeRouteAction(
            this.availableSelection[availableSelectionIndex],
            this.shieldSelection,
            true,
            false,
            "blue",
            'captain'
        );
        RenderLayerManager
            .renderLayers(Stage.ctx,null);
        //已经移动了 就必须计入行动值
        this.isActionPersumed = true;
        this.actionstep = 1;
    }else
    if(this.actionstep == 1){
        //显示盾牌
        RenderLayerManager
            .selectLayer("Effect")
            .clear();
        EffectManager
            .updateEffectInfo(
                "ShieldEffect",
                {   id:-1,
                    index:this.availableSelection[availableSelectionIndex]})
            .renderEffects();
        this.postActionEnd();
    }
}

_p.performShowAction = function (e) {
    if(this.actionstep == 0){
        //行动范围
        this.show1stRangeRouteAction(
            this.mouseStartIndex,
            this.availableSelection,
            true,
            false,
            'green',
            'captain'
        )
        this.show2ndRangeRouteAction(
            this.mouseStartIndex,
            this.availableSelection,
            false,//isStraightIgnore
            true,//isObliqueIgnore
            false,//is1stRangeBlankOnly
            true,//is1stRangeBlockOnly
            true,//is2ndRangeBlankOnly
            false,//is2ndRangeBlockOnly
            'green',
            'captain'
        );
    }else
    if(this.actionstep == 1){
        this.availableSelection = this.shieldSelection;
    }
    //this.show1stRangeRouteAction(
    //    null,
    //    e,
    //    this.availableSelection,
    //    true,
    //    false,
    //    'rgb(0,143,0)'
    //);
}

_p.reset = function(){
    BaseHeroAction.prototype.reset.apply(this,arguments);
    this.actionstep = 0;
}