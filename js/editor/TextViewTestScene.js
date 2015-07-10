/**
 * Created by jackyanjiaqi on 15-6-18.
 */
function TextViewTestScene(){
    BaseSceneConfig.apply(this,arguments);
}

extend(TextViewTestScene,BaseSceneConfig);

_p = TextViewTestScene.prototype;

_p.onResume = function(){
    Stage.theme.bgStyle = 'darkyellow';
    ImageManager.load(new TextView().giveResourceMap(),textViewLoaded,null);
}

function textViewLoaded(){
    var tv_test = new TextView();
    tv_test.setRenderContext(RenderLayerManager
        .selectLayer('TV').clear()._getRenderCtx());
    tv_test.setNumber(15,4);
    RenderLayerManager
        .renderLayers(Stage.ctx,null);
}