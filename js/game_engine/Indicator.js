/**
 * Created by jackyanjiaqi on 15-5-26.
 */
function Indicator(drawFunc,x,y){
    Object.defineProperties(this,
        {
            VISION_VISIBLE:{value:'visible',writable:false,enumerable:true,configurable:false},
            VISION_INVISIBLE:{value:'invisible',writable:false,enumerable:true,configurable:false},
            VISION_GONE:{value:'gone',writable:false,enumerable:true,configurable:false},

            FLAG_LEFT:{value:this.FLAG_X&this.FLAG_START,writable:false,enumerable:true,configurable:false},
            FLAG_RIGHT:{value:this.FLAG_X&this.FLAG_END,writable:false,enumerable:true,configurable:false},
            FLAG_BOTTOM:{value:this.FLAG_Y&this.FLAG_END,writable:false,enumerable:true,configurable:false},
            FLAG_TOP:{value:this.FLAG_Y&this.FLAG_START,writable:false,enumerable:true,configurable:false},

            START:{value:0x10,writable:false,enumerable:true,configurable:false},
            CENTER:{value:0x11,writable:false,enumerable:true,configurable:false},
            END:{value:0x01,writable:false,enumerable:true,configurable:false},

            FLAG_START:{value:this.START|this.START<<2,writable:false,enumerable:true,configurable:false},
            FLAG_CENTER:{value:this.CENTER|this.CENTER<<2,writable:false,enumerable:true,configurable:false},
            FLAG_END:{value:this.END|this.END<<2,writable:false,enumerable:true,configurable:false},

            FLAG_WEIGHT:{value:4,writable:false,enumerable:true,configurable:false},
            FLAG_VALUE:{value:4,writable:false,enumerable:true,configurable:false},
            FLAG_X:{value:0xFF00,writable:false,enumerable:true,configurable:false},
            FLAG_Y:{value:0x00FF,writable:false,enumerable:true,configurable:false},
            WRAP_CONTENT:{value:8,writable:false,enumerable:true,configurable:false},
            MATCH_PARENT:{value:9,writable:false,enumerable:true,configurable:false},
            PARM_MARGIN:{value:9,writable:false,enumerable:true,configurable:false},
            PARM_PADDING:{value:9,writable:false,enumerable:true,configurable:false},
            vision:{
                set:function(value){
                    if(this._vision_ != value){
                        this._vision_ = value;
                        this.paint();
                    }},
                get:function(){
                    return this._vision_;
                }
            }
        });

    if(drawFunc){
        this.drawfunc = drawFunc;
    }

    this.id = 'Indicator1';
    this.ctx = null;
    this.touchElement = null;
    this.eventHandler = null;
    this.father = null;
    this._childs = new Array();
    this.x = x || 0;
    this.y = y || 0;
    this.rawx = 0;
    this.rawy = 0;
    this._vision_ = this.VISION_VISIBLE;
    this.__params__config__ = 0x0;
    this.boundRect = null;
    this.src = null;

    //pivot
    this.pivotParam = this.FLAG_TOP | this.FLAG_LEFT;
}

_p = Indicator.prototype;

_p.addChild = function(indicator){
    this._childs.push(indicator);
    indicator.father = this;
}

_p.removeChild = function(indexOrIndicator){
    if(typeof indexOrIndicator == 'Number'){
        var position = indexOrIndicator;
        this._childs.splice(position,1);
    }else
    if(typeof indexOrIndicator == 'Object'){
        var position = this._childs.indexOf(indexOrIndicator);
        this._childs.splice(position,1);
    }
}

_p.paint = function(ctx) {
    var self = this;
    if(this.ctx == null){
        this.setRenderContext(ctx);
    }
    Logger.log('paint() vision='+this._vision_,'indicator');
    if(this._vision_ == this.VISION_GONE)
        return;
    // 绘制自身
    if(!this.father){
        this.rawx = this.x;
        this.rawy = this.y;
    }else{
        this.rawx = this.father.rawx + this.x;
        this.rawy = this.father.rawy + this.y;
    }
    //调用绘图函数
    if(this.drawfunc && this._vision_ == this.VISION_VISIBLE){
        Logger.log(this.drawfunc.toString(),'indicator');
        this.drawfunc({rawX:this.rawx,rawY:this.rawy});
    }
    //绘制孩子节点
    this._childs.forEach(
        function(indicator){
            indicator.paint(this.ctx);
        }
    );
}

_p.setRenderContext = function(ctx){
    this.ctx = ctx;
}

_p.getRenderContext = function(){
    return this.ctx;
}

_p.setMargin = function (flag,value) {

}

_p.setPadding = function (flag,value) {

}

_p.setPivot = function(flag){
    this.pivotParam = flag;
}

_p.setAlgin = function(){

}

_p.setWidth = function(flag){

}

_p.measure = function(fatherMeasureObj){
    //绘制孩子节点
    //var width = 1000;
    //var height = 1000;
    //var pivotStrategy;
    //var startCoordinate = 0x23409320490;
    //switch(pivot){
    //    case this.FLAG_START:
    //        startCoordinate & this.FLAG_X << 4
    //        break;
    //    case this.FLAG_END:
    //        break;
    //    case this.FLAG_CENTER:
    //        break;
    //}
    //if(pivot == this.FLAG_CENTER)
    //var pivotx =
    //this._childs.forEach(
    //    function(indicator){
    //        fatherMeasureObj.nextStartPoint = fatherMeasureObj.next
    //        var
    //        indicator.measure(fatherMeasureObj);
    //    }
    //);
    //if(measure(fatherMeasureObj)){
    //
    //}
}