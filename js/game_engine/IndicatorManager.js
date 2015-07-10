/**
 * 包含所有Indicator的引用 为所有Indicator分配唯一标识 该标识用于事件的分发
 * Created by jackyanjiaqi on 15-5-26.
 */
var IndicatorManager = (function(){
    var singleton;

    function getInstance(){
        if(singleton === undefined){
            singleton = new IndicatorManager();
        }
        return singleton;
    }

    function IndicatorManager(){
        this.maxId = 0;
        this._idRange = 10;//一次分配的id个数
        this.singleMaxId = 0;
        this.map = ObjectPool.give();
        //this.indicators = ArrayPool.give();
    }

    var _p = IndicatorManager.prototype;

    _p.setNewlyAllocatingDelegateIdRange = function(newlyAllocatingDelegateIdRange){
        this._idRange = newlyAllocatingDelegateIdRange;
    }

    _p.allocateIndicatorsDelegate = function(){
        //计算当前maxId
        var index = Math.floor(this.maxId / this._idRange);
        var delegate = new RenderLayerIndicatorsDelegate(
            (index+1)*this._idRange,(index+1)*this._idRange - 1);
        this.maxId = (index + 1)*this._idRange - 1;
        this.map[index + 1] = delegate;
        return delegate;
    }

    _p.addIndicator = function (indicator) {
        var newId = -1;
        var oldIndex = Math.floor(this.singleMaxId / this._idRange);
        var newIndex = Math.floor((this.singleMaxId + 1) / this._idRange);
        if(newIndex > oldIndex){
            //需要分配新的区域
            var index = Math.floor(this.maxId / this._idRange);
            if(!this.map[index + 1]){
                this.map[index + 1] = ObjectPool.give();
            }
            newId = (index + 1)*this._idRange;
            this.map[index + 1][newId] = indicator;
        }else{
            newId = this.singleMaxId + 1;
            this.map[oldIndex][newId] = indicator;
        }

        this.singleMaxId = newId;
        if(this.maxId < this.singleMaxId) {
            this.maxId = this.singleMaxId;
        }
        indicator.id = newId;
        return this;
    }

    /**
     * 二分查找
     * @param target
     * @param start
     * @param middle
     * @param end
     * @returns {*}
     * @private
     */
    // _p._divideSearch = function (target,startNum,endNum){
    //
    //    if(target>=start && target<=end){
    //        if(target === start || target === middle || target === end){
    //            return target;
    //        }
    //    }
    //    if(middle === start || middle === end){
    //        if(target === start || target === end){
    //            return
    //        }
    //        return {start:start,end:end};
    //    }else{
    //
    //    }
    //}

    _p.findIndicatorById = function(id){
        var index = Math.floor(id/this._idRange);
        if(index in this.map){
            if(this.map[index] instanceof IndicatorsDelegate) {
                return this.map[index].group[id];
            }else
            if(typeof this.map[index] === 'object') {
                return this.map[index][id];
            }
        }
    }

    _p.setCanvas = function (canvas){
        this.eventAttachElement = canvas;
        return this;
    }

    _p.paint = function (){
        this.indicators.forEach(
            function (indicator) {
                indicator.paint();
            }
        );
        return this;
    }

    return getInstance();
})();


