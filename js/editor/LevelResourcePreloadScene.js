/**
 * Created by jackyanjiaqi on 15-6-24.
 */
function LevelResourcePreloadScene(){
    BaseSceneConfig.apply(this,arguments);
}

extend(LevelResourcePreloadScene,BaseSceneConfig);

_p = LevelResourcePreloadScene.prototype;

_p.onResume = function(scene){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);
    if(!scene){
        if(this.needPreLoadLevelResource()){
            return;
        }
    }
    //forTest
    Stage.ctx.clearRect(0,0,Stage.width,Stage.height);
}

_p.needPreLoadLevelResource = function(){
    //预处理 带链接的
    if(Stage.currentLevel && Stage.currentLevel.resources && Stage.currentLevel.resources.link){
        Stage.currentLevel.resources = Stage.findLevelBy(Stage.currentLevel.resources.link).resources;
    }
    if(Stage.currentLevel && Stage.currentLevel.resources && Stage.currentLevel.resources.img){
        var loadImgs = ImageManager.filterExits(Stage.currentLevel.resources.img);
        if(!ArrayPool.isEmpty(loadImgs)){
            //除非配置文件定义载入场景 否则默认启用第一个场景作为载入场景
            var loadingScene = null;
            var sceneName = null;
            if(LevelEditor.loading){
                var loadingLevelItem  = Stage.findLevelBy(LevelEditor.loading);
                sceneName = loadingLevelItem['name'];
            }else{
                sceneName = LevelEditor.level[0]['name'];
            }
            loadingScene = Stage.getScene(sceneName);
            if(loadingScene){
                loadingScene.pkg = loadImgs;
                loadingScene.back = Stage.currentLevel['name'];
                RenderLayerManager
                    .switchScene(sceneName);
            }
            return true;
        }else{
            return false;
        }
    }
    return false;
}
