/**
 * Created by jackyanjiaqi on 15-7-10.
 */
function IndicatorManagerTestScene(){
    BaseSceneConfig.apply(this,arguments);
}

extend(IndicatorManagerTestScene,BaseSceneConfig);

_p = IndicatorManagerTestScene.prototype;

_p.onResume = function(){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);
    for(var i = 0;i<15;i++){
        IndicatorManager.addIndicator(new Indicator());
    }
    var delegate = IndicatorManager.allocateIndicatorsDelegate();
    for(var i = 0;i<15;i++){
        delegate.addIndicator(new Indicator());
    }
    var end;
}