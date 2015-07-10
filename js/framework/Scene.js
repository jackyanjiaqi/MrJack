/**
 *
 * Created by jackyanjiaqi on 15-6-10.
 */
function Scene(name){
    this._mark = name;
    this.playControll = Scene.SINGLE_END;//默认播放策略
    this.next = null;
}

Scene.SINGLE_END = 0;//播放完一个场景就静止等待接下来的操作
Scene.SINGLE_BACK = 1;//播放完一个场景循环播放
Scene.NEXT_END = 2;//播放完一个场景顺序播放下一个
Scene.NEXT_RETURN = 3;//播放完一个场景顺序播放下一个 到结尾处从头播放

_p = Scene.prototype;

_p.setName = function(name){
    this._mark = name;
}

_p.getName = function(){
    if(!this._mark){
        var i = 1;
    }
    return this._mark;
}

_p.onScenePlayedEnd = function(){
    if(this.playBack){
        this.play();
    }else
    if(this.hasNext()){
        Stage.nex
        this.next()
    }
}

_p.play = function(){

}

_p.hasNext = function(){
    if(this.next && this.next instanceof Scene){
        return true;
    }
    return false;
}

_p.next = function () {
    return this.next;
}

_p.onCreate = function(){

}

_p.onResume = function(){

}

_p.onStop = function(){

}