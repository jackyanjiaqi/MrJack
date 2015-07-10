/**
 * Created by jackyanjiaqi on 15-6-2.
 */
function SpiderManActionDeleted(){
    BaseHeroAction.apply(this,arguments);
    this.actionStep = 0;
    this.jumpRange = ObjectPool.give();
    this.attackSelectionStep1 = null;
    //this.attackSelectionStep2 = ObjectPool.give();
    this.firstStart = -1;
    this.rolePic = "SpiderMan";
    //this.isAttackConsumed = false;
}
var webEffectNum = {num:0};
extend(SpiderManActionDeleted,BaseHeroAction);

_p = SpiderManActionDeleted.prototype;

_p.performShowAction = function (e) {
    switch(this.actionStep){
        case 0:
            if(this.attackSelectionStep1 === null){
                Logger.dlog('show step0 isAttackConsumed = false','STEP');
                Logger.dlog(Logger.object(this.availableSelection),'availableSelection');
                this.attackSelectionStep1 = ObjectPool.give();
                Logger.dlog(Logger.object(this.attackSelectionStep1),'attackSelectionStep1');
                //未被消耗 第一步可以选择施放蜘蛛网
                this.show1stRangeRouteAction(
                    null,
                    e,
                    this.availableSelection,
                    true,//isBlankOnly
                    false,//isBlockOnly
                    'green',
                    'spiderman'
                );
                this.show1stRangeRouteAction(
                    null,
                    e,
                    this.attackSelectionStep1,
                    false,
                    true,
                    'blue',
                    'spiderman attack'
                );
                Logger.dlog(Logger.object(this.availableSelection),'availableSelection');
                Logger.dlog(Logger.object(this.attackSelectionStep1),'attackSelectionStep1');

                this.firstStart = this.mouseStartIndex;
            }else{
                //已经消耗了蜘蛛网
                Logger.dlog('show step0 isAttackConsumed = true','STEP');

                //this.availableSelection = this.availableSelection;

                //this.show1stRangeRouteAction(
                //    null,
                //    e,
                //    this.availableSelection,
                //    true,//isBlankOnly
                //    false,//isBlockOnly
                //    'green'
                //);
            }
            break;
        case 1:
            //提交可选范围
            Logger.dlog('show step1','STEP');

            this.availableSelection = this.jumpRange;
            break;
        case 2:
            Logger.dlog('show step2','STEP');
            //this.availableSelection = this.attackSelectionStep1;
            break;
    }
}

_p.performExecuteAction = function(availableSelectionIndex){
    Logger.dlog('p='+availableSelectionIndex+' roleIndex='+this.availableSelection[availableSelectionIndex],'EXE_ENTER');

    switch(this.actionStep){
        case 0:
            //第一次施放蜘蛛网
            if(this.attackSelectionStep1 !== null &&
                availableSelectionIndex in this.attackSelectionStep1){

                //处理网
                RenderLayerManager
                    .selectLayer('Effect')
                    .clear();
                EffectManager.updateEffectInfo(
                    'WebEffect',{
                        id:webEffectNum.num++,
                        index:this.attackSelectionStep1[availableSelectionIndex]
                    })
                    .renderEffects();
                Logger.dlog('SET A NET INDEX '+this.attackSelectionStep1[availableSelectionIndex],'EXE0');

                ObjectPool.collect(this.attackSelectionStep1);
                this.attackSelectionStep1 = null;
                //处理行动点（还可以继续行动）
                //this.isAttackConsumed = true;

                RenderLayerManager
                    .selectLayer('RouteShow')
                    .clear();

                ObjectPool.collect(this.availableSelection);
                this.availableSelection = ObjectPool.give();
                Logger.dlog(Logger.object(this.availableSelection),'availableSelection');

                this.show1stRangeRouteAction(
                    this.firstStart,
                    null,
                    this.availableSelection,
                    true,//isBlankOnly
                    false,//isBlockOnly
                    'green',
                    'spiderman '
                );
                Logger.dlog(Logger.object(this.availableSelection),'availableSelection');
                RenderLayerManager
                    .renderLayers(Stage.ctx,null);
            }
            //显示行动路径并进入下一阶段
            else{
                Logger.dlog('SHOWLINE ROUTE FROM '+this.firstStart+' DIRCT '+availableSelectionIndex,'EXE0');
                Logger.dlog(Logger.object(this.availableSelection),'availableSelection');
                this.showOneDirectionLineRouteAction(
                    this.firstStart,
                    null,
                    availableSelectionIndex,
                    this.jumpRange,
                    true,
                    false,
                    5,'green','spiderman jump'
                );
                Logger.dlog(Logger.object(this.availableSelection),'availableSelection');
                RenderLayerManager
                    .renderLayers(Stage.ctx,null);
                this.actionStep = 1;
            }
            ObjectPool.collect(this.attackSelectionStep1);
            this.attackSelectionStep1 = ObjectPool.give();
            break;
        case 1:
            var last = 0;
            var isIn = false;
            for(var p in this.jumpRange){
                //Logger.dlog(p+" : "+this.jumpRange[p]);
                if(this.jumpRange[p] == this.mouseStartIndex){
                    isIn = true;
                }
                last = p;
            }
            if(isIn){
                this.goToTargetIndex(this.firstStart,this.jumpRange[last]);
                Logger.dlog('FROM '+this.firstStart+' TO '+this.jumpRange[last],'EXE1');

                if(!this.isAttackConsumed){
                    ObjectPool.collect(this.availableSelection);
                    this.availableSelection = ObjectPool.give();
                    RenderLayerManager
                        .selectLayer('RouteShow')
                        .clear();

                    this.show1stRangeRouteAction(
                        this.jumpRange[last],
                        null,
                        this.availableSelection,
                        false,//isBlankOnly
                        true,//isBlockOnly
                        'blue',
                        'spiderman attack'
                    );
                    RenderLayerManager
                        .renderLayers(Stage.ctx,null);
                    Logger.dlog('JUMP RANGE FROM '+this.jumpRange[last],'EXE1');
                    this.actionStep = 2;
                }else{
                    Logger.dlog('POST ACTION END','EXE1');
                    this.postActionEnd();
                }
            }else{
                Logger.dlog('NEVER WORK','EXE1');
                this.postActionEnd();
            }
            break;
        case 2:
            Logger.dlog('INDEX:'+this.availableSelection[availableSelectionIndex],'EXE2');
            //处理网
            RenderLayerManager
                .selectLayer('Effect')
                .clear();
            EffectManager.updateEffectInfo(
                'WebEffect', {
                    id: webEffectNum.num++,
                    index: this.availableSelection[availableSelectionIndex]
                })
                .renderEffects();
            this.postActionEnd();
            break;
    }
}

_p.reset = function(){
    Logger.dlog('-------------','ALL END');

    BaseHeroAction.prototype.reset.apply(this,arguments);
    if(this.actionStep != 0){
        this.actionStep = 0;
    }
    //ObjectPool.collect(this.attackSelectionStep1);
    ObjectPool.collect(this.jumpRange);
    //this.attackSelectionStep1 = ObjectPool.give();
    this.attackSelectionStep1 = null;
    this.jumpRange = ObjectPool.give();

    this.isAttackConsumed = false;
    this.firstStart = -1;
}