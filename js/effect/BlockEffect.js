/**
 * Created by jackyanjiaqi on 15-6-8.
 */
function BlockEffect(){
    BaseEffect.apply(this,arguments);
    this.effectMap["BlockEffect"] = true;
}

extend(BlockEffect,BaseEffect);

_p = BlockEffect.prototype;

//_p.onFalseReturned = function(func,args){
//    //翻转blank和block
//    //if(this.index && this.index === args[0]){
//    //    if(func.name && (func.name == "isUnitBlock" || func.name == 'isUnitBlank')){
//    //        return true;
//    //    }
//    //}
//    if(this.index == args[0]){
//        return true;
//    }
//    return false;
//}

_p.onBooleanReturned = function(res,func,args,effectTag){
    if(this.index === args[0] && func.name){
        if(func.name === 'isUnitBlank'){
            return false;
        }else
        if(func.name === 'isUnitBlock'){
            return true;
        }
    }
    return res;
}
//_p.onTrueReturned = function(func,args){
//    if(func.name && func.name == "isUnitBlank"){
//        return !(this.index !== undefined && this.index === args[0]);
//    }
//    return true;
//}