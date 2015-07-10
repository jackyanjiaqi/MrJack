/**
 * Created by jackyanjiaqi on 15-6-8.
 */
function AimEffect(){
    BaseEffect.apply(this,arguments);
    this.effectMap["AimEffect"] = true;
    this.renderPic = "AimEffect";
}

extend(AimEffect,BaseEffect);

_p = AimEffect.prototype;

