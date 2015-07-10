/**
 * 一个渲染层上Indicator的集合
 * 主要用于计算一个层上的脏域
 * 所有Indicator是平行关系 而Indicator自身具有垂直关系
 * Created by jackyanjiaqi on 15-7-10.
 */
function RenderLayerIndicatorsDelegate(startId,endId){
    this.startId = startId;
    this.endId = endId;

    this.group = ObjectPool.give();
}

_p = RenderLayerIndicatorsDelegate.prototype;

_p.addIndicator = function(indicator){
    var newId = -1;
    if(this.startId+1>this.endId){
        newId = IndicatorManager.addIndicator(indicator);
    }else{
        newId = this.startId+1;
        this.startId = newId;
    }
    this.group[newId] = indicator;
    indicator.id = newId;
}

_p.getDirtyRect = function() {
    var rect = null;
    for(var p in this.group){
        var itemRect = this.group[p].getDirtyRect();
        if(itemRect !== null){
            if(rect === null){
                rect = itemRect;
            }else{
                rect = rect.convexHull(itemRect.x,itemRect.y,itemRect.width,itemRect.height);
            }
        }
    }
    return rect;
}