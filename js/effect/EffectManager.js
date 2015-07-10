/**
 * Created by jackyanjiaqi on 15-6-8.
 */
var EffectManager = (function(){
    var singleton = new EffectManager();
    function EffectManager(){
        this.effectMap = {};
    }
    var _p = EffectManager.prototype;

    _p.clear = function(){
        ObjectPool.collect(this.effectMap);
        this.effectMap = ObjectPool.give();
    }

    _p.isEffectIn = function(effectName){
        if(effectName in this.effectMap){
            //rebuild
            this.rebuildEffectList(effectName);
        }
        return effectName in this.effectMap;
    };

    _p.rebuildEffectList = function(effectName){
        var temp_map  = ArrayPool.give();
        while(effectName in this.effectMap && this.effectMap[effectName].length>0){
            var popItem = this.effectMap[effectName].pop();
            if(!popItem.isDeleted){
                temp_map.push(popItem);
            }
        }
        if(ArrayPool.isEmpty(temp_map)){
            delete this.effectMap[effectName];
            ArrayPool.collect(temp_map);
        }else{
            this.effectMap[effectName] = temp_map;
        }
        return this;
    };

    _p.addEffect = function(effect){
        for(var p in effect.effectMap){
            if(!(p in this.effectMap)){
                this.effectMap[p] = [];
            }
            this.effectMap[p].push(effect);
        }
        return this;
    }

    //_p.getEffectById = function(effectName,id){
    //    if(this.isEffectIn(effectName)){
    //        for(var i=0;i<this.effectMap[effectName].length;i++){
    //            var item = this.effectMap[effectName][i];
    //            if(item.id === id){
    //                return
    //            }
    //        }
    //    }
    //    return this;
    //}

    _p.updateEffectInfo = function(effectName,wrapEffectInfo){
        //不存在已有的效果或无id值(强制新建)
        if(!this.isEffectIn(effectName) || wrapEffectInfo.id === undefined || wrapEffectInfo.id === null){
            var newEffectObj = this.createEffectByName(effectName);
            //属性赋值
            for(var p in wrapEffectInfo){
                newEffectObj[p] = wrapEffectInfo[p];
            }
            this.addEffect(newEffectObj);
        }else{
            //过滤出符合id值要求的效果
            var updateList = this.effectMap[effectName].filter(function(effectItem){
                //对满足id值条件的所有效果更新数据
                return effectItem.id === wrapEffectInfo.id;
            });
            if(updateList.length === 0){
                //没有符合id值的对象则新建并赋值
                var newEffectObj = this.createEffectByName(effectName);
                //属性赋值
                for(var p in wrapEffectInfo){
                    newEffectObj[p] = wrapEffectInfo[p];
                }
                this.addEffect(newEffectObj);
            }else{
                //对符合id要求的所有效果应用数据变更
                updateList.forEach(function(effectItem){
                    //属性赋值
                    for(var p in wrapEffectInfo){
                        effectItem[p] = wrapEffectInfo[p];
                    }
                });
            }
        }
            return this;
    }

    /**
     * 根据属性查询效果
     * @param effectName
     * @param wrapEffectInfo
     */
    _p.findEffectInfo = function(effectName,wrapEffectInfo){
        //有此效果
        if(this.isEffectIn(effectName)){
            var updateList = null;
            if(wrapEffectInfo!=null){
                 updateList = this.effectMap[effectName].filter(function(effectItem){
                    var res = true;
                    //对满足id值条件的所有效果更新数据
                    for(var p in wrapEffectInfo){
                        if(effectItem[p] != wrapEffectInfo[p]){
                            res = false;
                            break;
                        }
                    }
                    return res;
                });
            }
            return updateList;
        }else{
            return null;
        }
    }

    _p.createEffectByName = function createEffectByName(effectName){
        if(effectName == "ShieldEffect"){
            return new ShieldEffect();
        }else
        if(effectName == "AimEffect"){
            return new AimEffect();
        }else
        if(effectName == "WebEffect"){
            return new WebEffect();
        }else
        if(effectName == "ShieldEffect"){
            return new ShieldEffect();
        }else
        if(effectName == "BlockEffect"){
            return new BlockEffect();
        }else
        return null;
    }

    _p.renderEffects = function(){
        var self = this;
        for(var p in self.effectMap){
            var effectList = self.effectMap[p];
            effectList.forEach(function(effectItem){
                //绘制效果
                 if(effectItem.index >-1 && effectItem.index < BGGridManager.data.length && effectItem.renderPic!=null){
                    RenderLayerManager.paintMapInit(
                        0,
                        BGGridManager.data[effectItem.index][0].x,
                        BGGridManager.data[effectItem.index][0].y,
                        RenderProxy._maplength,
                        RenderProxy._maplinewidth,
                        null,null,null,ImageManager.get(effectItem.renderPic)
                    );
                }
            });
        }
    }

    //_p.onFalseReturned = function(func,args){
    //    var res = false;
    //    if(typeof func == "function"){
    //        for(var p in this.effectMap){
    //            var list = this.effectMap[p];
    //            for(var i=0;i<list.length;i++){
    //                var itemres = list[i].onFalseReturned(func,args);
    //                Logger.dlog(list[i].renderPic + ' index='+list[i].index +' itemres=' + itemres + ' arg='+args[0],'Effect');
    //                if(itemres){
    //                    res = true;
    //                    Logger.dlog('Finally res=' + res + ' arg='+args[0],'Effect');
    //                    return res;
    //                }
    //                //res = list.some(function(item){
    //                //    var res = item.onFalseReturned(func,args);
    //                //Logger.dlog(item.renderPic + ' index='+item.index +' res=' + res + ' arg='+args[0],'Effect');
    //            }
    //            //    return res;
    //            //});
    //            //if(res === true){
    //            //    return res;
    //            //}
    //        }
    //    }
    //    Logger.dlog('Finally res=' + res + ' arg='+args[0],'Effect');
    //    return res;
    //}

    _p.onBooleanReturned = function (res,func,args,effectTag) {
        var _res = null;
        for(var p in this.effectMap){
            var list = this.effectMap[p];
            if(res){
                //为真采用全称量词 所有为真才为真
                _res = list.every(function(item){
                    var _res_ = item.onBooleanReturned(res,func,args,effectTag);
                    Logger.dlog(item.renderPic + ' index='+item.index +' itemres=' + _res_ + ' arg='+args[0],'Effect');
                    return _res_;
                });
                Logger.dlog('Finally res=' + _res + ' arg='+args[0],'Effect');
                return _res;
            }else{
                //为假采用存在量词 有一个为真就为真
                _res = list.some(function(item){
                    var _res_ = item.onBooleanReturned(res,func,args,effectTag);
                    Logger.dlog(item.renderPic + ' index='+item.index +' itemres=' + _res_ + ' arg='+args[0],'Effect');
                    return _res_;
                });
                Logger.dlog('Finally res=' + _res + ' arg='+args[0],'Effect');
                return _res;
            }
        }
        Logger.dlog('Finally res=' + res + ' arg='+args[0],'Effect');
        return res;
    }

    _p.onEffectInvolved = function(func,args){
        if(typeof func == "function"){
            for(var p in this.effectMap){
                var list = this.effectMap[p];
                list.some(function(item){
                    return item.onEffectInvolved(func,args);
                });
            }
        }
    }

    return singleton;
})();