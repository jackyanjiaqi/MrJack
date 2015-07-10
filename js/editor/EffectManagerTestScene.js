/**
 * Created by jackyanjiaqi on 15-6-11.
 */
function EffectManagerTestScene(){
    BaseSceneConfig.apply(this,arguments);
}

extend(EffectManagerTestScene,BaseSceneConfig);

_p = EffectManagerTestScene.prototype;

_p.onResume = function(){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);
    testEffectManager();
}

function testEffectManager(){
    Stage.theme.bgStyle = 'orange';
    EffectManager.updateEffectInfo("AimEffect",{id:0,index:11});
    EffectManager.updateEffectInfo("AimEffect",{id:1,index:25});
    EffectManager.updateEffectInfo("ShieldEffect",{id:-1,index:10});
    EffectManager.updateEffectInfo("WebEffect",{id:1,index:30});
    RenderLayerManager
        .selectLayer("Effect");
    EffectManager.renderEffects();
    RenderLayerManager
        .renderLayers(Stage.ctx,null);
}
