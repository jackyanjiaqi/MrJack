/**
 * Created by jackyanjiaqi on 15-6-17.
 */
function TextView(){
    this.number = 0;
    this.numLength = 2;
    this.libConfg = {
        large:'NUMBER_300x200',
        medium:'NUMBER_120x80',
        low:'NUMBER_36x24'
    };
    this.renderTask = [];
    this.txtSize = this.libConfg.large;
    this.ctx = null;
    this.renderFunc = function(){
        var self = this;
        var number = null;
        do{
            number = this.renderTask.pop();
            if(number!==null){
                var rawImg = ImageManager.get(self.txtSize+'_'+number);
                if(rawImg !== undefined || rawImg !== null) {
                    //rawImg = getColoredImg(rawImg,111,233,111);
                    rawImg = asGradientMapAlpha(rawImg,[0,233,0],[255,255,255],true);
                    self.getRenderContext().drawImage(rawImg,self.textStartX,self.textStartY);
                    self.textStartX += rawImg.width;
                }
            }
        }while(this.renderTask.length!==0);
    }
    Indicator.call(this,this.renderFunc,this.x,this.y);
    this.textStartX = 0;
    this.textStartY = 0;
    this.textWidth = 0;
    this.textHeight = 0;
}

extend(TextView,Indicator);

_p = TextView.prototype;

_p.drawImg = function(){
    var ctx = this.getRenderContext();
    RenderLayerManager
        .selectLayer()
}

_p.giveResourceMap = function(){
    var res = ObjectPool.give();
    for(var i =0;i<10;i++){
        res[this.txtSize+'_'+i] = 'img/libimg/'+this.txtSize+'/NUMBER'+i+'.png';
    }
    return res;
}

_p._measure_ = function () {
    var self = this;
    var rawImg = ImageManager.get(self.txtSize+'_0');
    this.textWidth = this.renderTask.length * rawImg.width;
    this.textHeight = rawImg.height;
    switch((self.pivotParam & self.FLAG_X)>>2){
        case this.START:
            self.textStartX = self.x;
            break;
        case self.CENTER:
            self.textStartX = self.x - self.textWidth/2;
            break;
        case this.END:
            self.textStartX = self.x - self.textWidth;
            break;
    }
    switch(self.pivotParam & self.FLAG_Y){
        case self.START:
            self.textStartY = self.y;
            break;
        case self.CENTER:
            self.textStartY = self.y - self.textHeight/2;
            break;
        case this.END:
            self.textStartY = self.y - self.textHeight;
            break;
    }
}

_p.setNumber = function (number,length) {
    this.number = number;
    this.numLength = length;

    var value = this.number;
    if(this.number!==undefined && this.number!==null){
        if(this.numLength === undefined || this.numLength===null){
            do{
                this.renderTask.push(value%10);
                value = Math.floor(value/10);
            }while(value !== 0);
        }else
        {
            for(var i =0;i<this.numLength;i++){
                this.renderTask.push(value%10);
                value = Math.floor(value/10);
            }
        }
    }
    this._measure_();
    this.paint();
}