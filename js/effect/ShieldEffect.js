/**
 * Created by jackyanjiaqi on 15-6-8.
 */
function ShieldEffect(){
    BlockEffect.apply(this,arguments);
    this.effectMap["ShieldEffect"] = true;
    this.renderPic = "ShieldEffect";
}

extend(ShieldEffect,BlockEffect);

_p = ShieldEffect.prototype;

_p.onFalseReturned = function(func,args){
    //if(HeroActionManager.currentAction!==null){
    //    //盾牌不能当作蜘蛛侠织网、雷神和绿箭侠的消灭目标
    //    if(func.name && args[0] === this.index){
    //        if(func.name === 'isUnitBlank'){
    //            //绿箭侠 第二圈的判定 不能被射杀
    //            if(args.indexOf('arrowman')!== -1 && args.indexOf('attack')!==-1 && args.indexOf('2ndRange')!==-1){
    //                return true;
    //            }
    //            //雷神 第一圈的判定 不能被杀
    //            if(args.indexOf('thunderman')!==-1 && args.indexOf('attack')!==-1){
    //                return true;
    //            }
    //            //蜘蛛侠 喷网 屏蔽block效果
    //            if(args.indexOf('spiderman')!==-1 && args.indexOf('attack')!==-1){
    //                return true;
    //            }
    //        }else
    //        if(func.name === 'isUnitBlock'){
    //            //绿箭侠 第二圈的判定 不能被射杀
    //            if(args.indexOf('arrowman')!== -1 && args.indexOf('attack')!==-1 && args.indexOf('2ndRange')!==-1){
    //                return false;
    //            }
    //            //雷神 第一圈的判定 不能被杀
    //            if(args.indexOf('thunderman')!==-1 && args.indexOf('attack')!==-1){
    //                return false;
    //            }
    //            //蜘蛛侠 喷网
    //            if(args.indexOf('spiderman')!==-1 && args.indexOf('attack')!==-1){
    //                return false;
    //            }
    //        }
    //    }
    //}
    if(this.index == args[0] && func.name === 'isUnitBlank'){
        return true;
    }
    return BlockEffect.prototype.onFalseReturned.call(this,func,args);
}

_p.onBooleanReturned = function (res,func,args,effectTag) {
    if(this.index === args[0] && func.name){
        if(func.name === 'isUnitBlock'||func.name === 'isUnitBlank'){
            //绿箭侠 第二圈的判定 不能被射杀 屏蔽BlockEffect效果
            if(effectTag.indexOf('arrowman')!== -1 && effectTag.indexOf('attack')!==-1 && effectTag.indexOf('2ndRange')!==-1){
                return res;
            }
            //雷神 第一圈的判定 不能被杀 不能移动
            if(effectTag.indexOf('thunderman')!==-1){
                return false;
            }
            //蜘蛛侠 喷网 屏蔽block效果
            //if(effectTag.indexOf('spiderman')!==-1){
            //    return false;
            //}
        }
    }
    return BlockEffect.prototype.onBooleanReturned.call(this,res,func,args,effectTag);
}
//_p.onTrueReturned = function(func,args){
//    //屏蔽绿箭侠的isBlock函数的
//    if(HeroActionManager.currentAction!==null){
//        if(func.name && args[0] === this.index){
//            if(func.name === 'isUnitBlock'){
//                //绿箭侠 第二圈的判定 不能被射杀
//                if(args.indexOf('arrowman')!== -1 && args.indexOf('attack')!==-1 && args.indexOf('2ndRange')!==-1){
//                    return false;
//                }
//                //雷神 第一圈的判定 不能被杀
//                if(args.indexOf('thunderman')!==-1 && args.indexOf('attack')!==-1){
//                    return false;
//                }
//                //蜘蛛侠 喷网
//                if(args.indexOf('spiderman')!==-1 && args.indexOf('attack')!==-1){
//                    return false;
//                }
//            }else
//            if(func.name === 'isUnitBlank'){
//                //绿箭侠 第二圈的判定 不能被射杀
//                if(args.indexOf('arrowman')!== -1 && args.indexOf('attack')!==-1 && args.indexOf('2ndRange')!==-1){
//                    return true;
//                }
//                //雷神 第一圈的判定 不能被杀
//                if(args.indexOf('thunderman')!==-1 && args.indexOf('attack')!==-1){
//                    return true;
//                }
//                //蜘蛛侠 喷网
//                if(args.indexOf('spiderman')!==-1 && args.indexOf('attack')!==-1){
//                    return true;
//                }
//            }
//        }
//    }
//    return BlockEffect.prototype.onTrueReturned(func,args);
//}