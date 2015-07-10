/**
 * Created by jackyanjiaqi on 15-6-11.
 */
function BaseSceneConfig(){
    Object.defineProperties(this,{
        STATE_NOCREATE:{value:0x01,writable:false,enumerable:true,configurable:false},
        STATE_CREATED:{value:0x02,writable:false,enumerable:true,configurable:false},
        STATE_WORKING:{value:0x03,writable:false,enumerable:true,configurable:false},
        STATE_SLEEP:{value:0x04,writable:false,enumerable:true,configurable:false},
        STATE_DIRTY:{value:0xF0,writable:false,enumerable:true,configurable:false}
    });
    this.scene = null;
    this.state = this.STATE_NOCREATE;
}

_p = BaseSceneConfig.prototype;

_p.wrapScene = function (scene) {
    scene.config = this;
    this.scene = scene;
}

_p.createNew = function(){
    if(this.STATE_NOCREATE === this.state){
        if(this.onCreate.apply(this,arguments) === undefined){
            this.state = this.STATE_CREATED;
        }else{
            this.state = this.STATE_CREATED | this.STATE_DIRTY;
        }
    }else{
        this.onError('INVALID STATE,ALREADY CREATED OR SINGLETON EXPECTED');
    }
    return this;
}
/**
 * 开始条件
 * 正常执行完createNew或者stop以及非正常执行完start后
 * @returns {BaseSceneConfig}
 */
_p.start = function(){
    if((this.STATE_CREATED || this.STATE_SLEEP) === this.state ||
        this.STATE_WORKING === this.state ^ this.STATE_DIRTY){
        if(this.onResume.apply(this,arguments) === undefined){
            this.state = this.STATE_WORKING;
        }else{
            this.state = this.STATE_WORKING | this.STATE_DIRTY;
        }
    }else{
        this.onError('INVALID STATE,STATE_WORKING_DIRTY NOT INCLUDED;');
    }
    return this;
}

_p.stop = function(){
    if(this.STATE_WORKING === this.state ||
        this.STATE_SLEEP === this.state ^ this.STATE_DIRTY){
        if(this.onStop.apply(this,arguments) === undefined){
            this.state = this.STATE_SLEEP;
        }else{
            this.state = this.STATE_SLEEP | this.STATE_DIRTY;
        }
    }else{
        this.onError('INVALID STATE,STATE_SLEEP_DIRTY NOT INCLUDED');
    }
    return this;
}

_p.onCreate = function(){
    Logger.dlog(this.constructor.name+"-onCreate("+arguments[0]+")",'SceneConfig');
}

_p.onResume = function(){
    Logger.dlog(this.constructor.name+"-onResume("+arguments[0]+")",'SceneConfig');
}

_p.onStop = function(){
    Logger.dlog(this.constructor.name+"-onStop("+arguments[0]+")",'SceneConfig');
}

_p.onError = function(errorMessage){
    Logger.dlog(this.constructor.name+"-onDirty("+errorMessage+")",'SceneConfig');
}

_p.onTouchOrMouseStart = function(ev){

}

_p.onTouchOrMouseMove = function(ev){

}

_p.onTouchOrMouseEnd = function(ev){

}

_p.refresh = function(){
    RenderLayerManager.renderLayers(Stage.ctx,null);
}