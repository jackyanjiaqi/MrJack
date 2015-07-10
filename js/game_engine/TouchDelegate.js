/**
 * Created by jackyanjiaqi on 15-5-29.
 */
function TouchDelegate(){
    this.tchCanvas = null;
    this.tchCanvasCtx = null;
}

_p = TouchDelegate.prototype;

_p.setCanvasMask =function setCanvasMask(maskCanvas){
    this.tchCanvas = maskCanvas;
    this.tchCanvasCtx = maskCanvas.getContext('2d');
    return this;
}

_p.reset = function reset(){
    if(this.tchCanvas){
        this.tchCanvasCtx.clearRect(0,0,this.tchCanvas.width,this.tchCanvas.height);
    }
    return this;
}

_p.tracePaint = function tracePaint(indexColor){
    if(this.tchCanvas){
        RenderProxy.rePaint(this.tchCanvasCtx,indexColor);
    }
    return this;
}
/**
 * 添加AI支持 直接返回index
 * @param e
 * @returns {*}
 */
_p.getIndex = function (e){
    if(this.tchCanvas && e){
        if('index' in e){
            return e['index'];
        }
        var imagedata = this.tchCanvasCtx.getImageData(e.x, e.y, 1, 1);
        var index = (imagedata.data[0]<<16 | imagedata.data[1]<<8 | imagedata.data[2]) - 1;
        return index;
    }
    return null;
}