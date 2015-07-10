/**
 * Created by jackyanjiaqi on 15-6-2.
 */
function BaseHeroAction(id){
    if(id){
        this.id = id;
    }else{
        this.id = -1;
    }
    this.hangups = [];//被挂起的函数
    this.mouseStartIndex = -1;
    this.availableSelection = ObjectPool.give();
    this.postMaxTime = 1;//默认一回合行动一次
    this.postTimes = this.postMaxTime;
    //以下为AI专用
    this.rolePic = "AimEffect";
    this.isActionPersumed = false;
    this.ai = null;
    this.state = 0;
    this.rangeShowWidth = 5;
    this.strategy = ObjectPool.give();
}

_p = BaseHeroAction.prototype;

_p.onActionStart = function(e){
    this.mouseStartIndex = BGGridManager.touchDelegate.getIndex(e);
    Logger.dlog('mouseStartIndex:'+this.mouseStartIndex);

    RenderLayerManager
        .selectLayer("RouteShow").clear();
    this.performShowAction(e);
    RenderLayerManager
        .renderLayers(Stage.ctx,"RouteShow");

    //}
}
/**
 * 默认展示动作
 * @param e
 */
_p.performShowAction = function (e) {
    //this.showOneDirectionLineRouteAction(
    //    null,e,3,this.availableSelection,true,false,5,'rgb(0,255,0)');
    this.show1stRangeRouteAction(
        null,e,
        this.availableSelection,
        true,
        false,
        'green'
    );
    //this.show2ndRangeRouteAction(
    //    null,
    //    e,
    //    this.availableSelection,
    //    false,false,false,false,false,false,'rgb(0,143,0)');
}


_p.onActionMove = function(e){
    //Logger.dlog('BaseHeroAction:Move');
}

_p.onActionEnd = function(e){
    //Logger.dlog('BaseHeroAction:End');
    RenderLayerManager.selectLayer("RouteShow").clear();
    for(var p in this.availableSelection){
        if(this.availableSelection[p] == BGGridManager.touchDelegate.getIndex(e)){
            this.performExecuteAction(p);
            return;
        }
    }
   this.postActionEnd(this.isActionPersumed);
}

/**
 *
 * @param killerIndex
 * @param killer
 * @returns {boolean} 返回值表示是否中断当前的结算
 */
_p.onKillingIntent = function(killerIndex,killer){
    return false;
}

_p.onKilled = function(beKilledIndex){

}

/**
 * 任意在结算中的技能未完成前都有可能被挂起
 * 执行挂起前的数据保存
 * 被挂起的行为必须postActionEnd以保证一次执行行为的完整性
 */
_p.hangUp = function(funcName,args){
    this.hangups.push({nam:funcName,args:args});
    this.postActionEnd();
}

_p.recover = function(){
   if(this.hangups.length!=0){
       this.hangups.forEach(function(item){
           item.nam.call(this,item.args);
       });
   }
}

/**
 * 默认执行动作
 * @param e
 */
_p.performExecuteAction = function (availableSelectionIndex) {
    //执行动作
    this.goToTargetIndex(
        this.mouseStartIndex,
        this.availableSelection[availableSelectionIndex]);
    this.postActionEnd();
}

_p.postActionBegin = function(){
    this.state = 1;
}

_p.postActionEnd = function(isUserEnd){
    this.reset();
    //默认为true
    if(isUserEnd === undefined || isUserEnd === null){
        isUserEnd = true;
    }
    //
    if(isUserEnd){
        this.postTimes --;
    }
    HeroActionManager.postActionEnd(isUserEnd);
}

_p.reset = function(){
    this.state = 0;
    this.mouseStartIndex = -1;
    ObjectPool.collect(this.availableSelection);
    this.availableSelection = ObjectPool.give();
    this.isActionPersumed = false;
}

_p.showOneDirectionLineRouteAction = function(
    targetIndex,di,availableSection,isBlankOnly,isBlockOnly,maxStep,strokeStyle,effectTag){
    Logger.dlog('showOneDirectionLineRouteAction','action');
    Logger.dlog('targetIndex:'+targetIndex+" di:"+di,'action');
    var ti = targetIndex;
    //此句有问题 若targetIndex ＝＝ 0则表示false继续执行下一句；
    //var ti = targetIndex || BGGridManager.touchDelegate.getIndex(e);
    var rowcolumn = indexTransfer(ti,BGGridManager.column_count);
    for(var i=0;i<maxStep;i++){
        var neighbori = BGGridManager.neighborGridIndex(
            di,true,rowcolumn[0],rowcolumn[1]);
        if(neighbori!=null){
            var isAvailable = isBlankOnly?GameRoleManager.isUnitBlank(neighbori,effectTag + ' drctshow'):
                isBlockOnly?GameRoleManager.isUnitBlock(neighbori,effectTag + ' drctshow'):true;
            if(isAvailable){
                if(availableSection!=null){
                    availableSection[i] = neighbori;
                }
                if(strokeStyle){
                    RenderLayerManager
                        .strokeMapInit(
                        strokeStyle,
                        0,
                        BGGridManager.data[neighbori][0].x,
                        BGGridManager.data[neighbori][0].y,null,this.rangeShowWidth);
                }

                ti = neighbori;
                rowcolumn = indexTransfer(ti,BGGridManager.column_count);
            }else{
                if(isBlankOnly)
                    break;
            }
        }else{
            break;
        }
    }
}

_p.show1stRangeRouteAction = function (targetIndex,
                                       availableSelection,
                                       isBlankOnly,
                                       isBlockOnly,
                                       strokeStyle,
                                       effectTag){
    Logger.dlog('show1stRangeRouteAction','action');
    var ti = targetIndex;
    var rowcolumn = indexTransfer(ti,BGGridManager.column_count);
    for(var i=0;i<6;i++){
        var neighbori = BGGridManager.neighborGridIndex(
            i,true,rowcolumn[0],rowcolumn[1]);
            if(neighbori!=null){
            var isAvailable =
                isBlankOnly?GameRoleManager.isUnitBlank(neighbori,effectTag + '1stRange'):
                    isBlockOnly?GameRoleManager.isUnitBlock(neighbori,effectTag + '1stRange'):true;
            //不是障碍物
            if(isAvailable){
                if(availableSelection != null){
                    availableSelection[i] = neighbori;
                }
                if(strokeStyle){
                    RenderLayerManager
                        .strokeMapInit(
                        strokeStyle,
                        0,
                        BGGridManager.data[neighbori][0].x,
                        BGGridManager.data[neighbori][0].y,null,this.rangeShowWidth);
                }
            }
        }
    }
}

_p.show2ndRangeRouteAction = function (targetIndex,
                                          availableSelection,
                                          isStraightIgnore,
                                          isObliqueIgnore,
                                          is1stRangeBlankOnly,
                                          is1stRangeBlockOnly,
                                          is2ndRangeBlankOnly,
                                          is2ndRangeBlockOnly,
                                          strokeColor,
                                          effectTag){
    Logger.dlog('show2ndRangeRouteAction','action');
    var ti = targetIndex;
    var rowcolumn = indexTransfer(ti,BGGridManager.column_count);
    for(var i=0;i<6;i++){
        var neighbori = BGGridManager.neighborGridIndex(
            i,true,rowcolumn[0],rowcolumn[1]);
        if(neighbori!=null){
            var is1stRangeStraightAvailable =
                !isStraightIgnore &&
                (is1stRangeBlankOnly?GameRoleManager.isUnitBlank(neighbori,effectTag + ' 1stRange'):
                is1stRangeBlockOnly?GameRoleManager.isUnitBlock(neighbori,effectTag + ' 1stRange'):true);
            //第一圈是否有阻碍物
            if(is1stRangeStraightAvailable){
                //6个正方向上
                //i方向上的单位
                var _first_rc = indexTransfer(neighbori,BGGridManager.column_count);
                var _first = BGGridManager.neighborGridIndex(
                    i,true,_first_rc[0],_first_rc[1]);
                if(_first!=null){
                    var is2ndRangeStraightAvailable =
                        is2ndRangeBlankOnly?GameRoleManager.isUnitBlank(_first,effectTag + ' 2ndRange'):
                        is2ndRangeBlockOnly?GameRoleManager.isUnitBlock(_first,effectTag + ' 2ndRange'):true;
                    if(is2ndRangeStraightAvailable){
                        if(availableSelection!=null){
                            availableSelection[2*i+6] = _first;
                        }
                        if(strokeColor){
                            RenderLayerManager
                                .strokeMapInit(
                                strokeColor,
                                0,
                                BGGridManager.data[_first][0].x,
                                BGGridManager.data[_first][0].y,null,this.rangeShowWidth)
                        }
                    }
                }
            }

            //斜方向
            if(!isObliqueIgnore){
                //i+1方向的孩子
                var _second_rc = indexTransfer(neighbori,BGGridManager.column_count);
                var _second = BGGridManager.neighborGridIndex(
                    (i+1)%6,true,_second_rc[0],_second_rc[1]);
                if(_second!=null){
                    var is2ndRangeObliqueAvailable =
                        is2ndRangeBlankOnly?GameRoleManager.isUnitBlank(_second,effectTag + ' 2ndRange'):
                        is2ndRangeBlockOnly?GameRoleManager.isUnitBlock(_second,effectTag + ' 2ndRange'):true;
                    if(is2ndRangeObliqueAvailable){
                        if(availableSelection!=null){
                            availableSelection[2*i+7] = _second;
                        }
                        if(strokeColor){
                            RenderLayerManager
                                .strokeMapInit(
                                strokeColor,
                                0,
                                BGGridManager.data[_second][0].x,
                                BGGridManager.data[_second][0].y,null,this.rangeShowWidth)
                        }
                    }
                }
            }
        }
    }
}
/**
 * 拥有回调函数和中断处理的方法
 * @param startIndex
 * @param targetIndex
 */
_p.killAndGoTo = function(startIndex,targetIndex,invokeTag){
    Logger.dlog('killAndGoTo','action');
    var interupted = false;
    if(startIndex !== null && GameRoleManager.isGameRole(startIndex) && GameRoleManager.roles[targetIndex].action){
        interupted = GameRoleManager.roles[targetIndex].action.onKillingIntent(
            startIndex,GameRoleManager.roles[startIndex]);
    }
    if(interupted){
        //将函数名和参数名称注册 以便未来执行
        this.hangUp(this._killAndGoToStep2,arguments);
    }else{
        this._killAndGoToStep2(arguments);
    }
}

_p._killAndGoToStep2 = function(args){
    var startIndex = args[0];
    var targetIndex = args[1];
    var invokeTag = args[2];
    GameRoleManager.killRole(targetIndex);
    this.goToTargetIndex(startIndex,targetIndex,'killAndGoToStep2');
}

_p.goToTargetIndex = function (gameRoleIndex,targetIndex,tag){
    Logger.dlog(this.rolePic + 'goToTargetIndex from '+gameRoleIndex+' to '+targetIndex+tag,'ai');
    var interupted = EffectManager.onBooleanReturned(false,this.leaveIndex,gameRoleIndex);
    if(interupted){
        this.hangUp(this.goToTargetIndexStep2,arguments);
    }else{
        this.goToTargetIndexStep2(arguments);
    }
}

_p.goToTargetIndexStep2 = function(args){
    var gameRoleIndex = args[0];
    var targetIndex = args[1];
    GameRoleManager.transverseUnit(gameRoleIndex,targetIndex);
    if(this.ai){
        this.ai.startIndex = targetIndex;
    }
    RenderLayerManager.selectLayer("GameRole").clear();
    GameRoleManager.renderRoles();

    EffectManager.onEffectInvolved(this.enterIndex,targetIndex);
}

_p.leaveIndex = function leaveIndex(leavingIndex){
    return false;
}

_p.enterIndex = function enterIndex(enterIndex){
}

_p.getRolePic = function(){
    return ImageManager.get(this.rolePic);
}

_p.mergeInAvailableSelection = function(mergedMap){
    for(var p in mergedMap){
        this.availableSelection[p] = mergedMap[p];
    }
}

_p.showAvailableSelection = function(strokeStyle,fillColor,text,img,srcCutObj){
    for(var p in this.availableSelection){
        var index = this.availableSelection[p];
        RenderLayerManager
            .paintMapInit(
            0
            ,BGGridManager.data[index][0].x
            ,BGGridManager.data[index][0].y
            ,null,null,fillColor,strokeStyle,text,img,srcCutObj
        );
    }
}