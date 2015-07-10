/**
 * Created by jackyanjiaqi on 15-6-10.
 */
var Stage = (function(){
    var singleton = new Stage();
    var _rl = RenderLayerManager;
    var _rp = RenderProxy;

    function Stage(){
        //链表结构存储场景
        this.startScene = null;
        this.prevScene = null;//当前场景的上一个场景
        this.sceneMap = ObjectPool.give();
        this.theme =
        {
            bgStyle:'#0c6b79',
            lineWidth:5,
            textColor:"white"
        };
        this.screen = {
            orientation:'landscape',
            density:'high',
            toString : function(){
                return this.orientation + '/' + this.density;
            }
        };
        //场景相关
        this.configMap = null;//场景配置文件
        this.ctx = null;
        this.canvas = null;
        this.width = 100;
        this.height = 100;
        this.currentConfig = null;
        //编辑器相关
        this.currentLevel = null;
        this._tempSwitchSceneLevel = null;
        this._tempIsNewLevel = false;
        this._tempIsNewLevelUpdated = false;
    }

    var _p = Stage.prototype;

    /**
     * 生命周期相关
     * @param scene
     * @returns {Stage}
     */
    _p._saveScene = function(scene){
        if(this.prevScene != null && this.prevScene.next!=null){
            this.prevScene.next = scene;
        }
        this.prevScene = scene;
        this.sceneMap[scene.getName()] = scene;
        if(this.startScene == null){
            this.startScene = scene;
        }
        //if(this._tempSwitchSceneLevel){
        //    scene.level = this._tempSwitchSceneLevel;
        //    this._tempSwitchSceneLevel = null;
        //}else{
        //scene.level = this.currentLevel;
        scene.level = this._tempIsNewLevel?this._tempSwitchSceneLevel:this.currentLevel;
        this._tempIsNewLevel = false;
        //}
        scene.config = this.currentConfig;
        scene.theme = this.theme;
        if(this.currentConfig){
            this.currentConfig.stop(scene);
        }
        return this;
    }

    /**
     * 生命周期相关
     * @param sceneName
     * @returns {*}
     */
    _p._recoverFromScene = function(sceneName){
        var currentScene = this.sceneMap[sceneName];

        this.theme = currentScene.theme;

        this._tempSwitchSceneLevel = this.currentLevel;

        if(this._tempIsNewLevelUpdated){
            this._tempIsNewLevelUpdated = false;
        }else{
            this.currentLevel = currentScene.level;
        }
        if(this.currentLevel){
            Logger.dlog('name: '+this.currentLevel.name,'Stage.currentLevel');
        }

        this.currentConfig = currentScene.config;
        this.currentConfig.start(currentScene);
        return currentScene;
    }

    _p.hasScene = function(sceneName){
        if(sceneName in this.sceneMap){
            return true;
        }
        return false;
    }

    _p.getScene = function(sceneName){
        return this.sceneMap[sceneName];
    }

    _p.setStartScene = function(sceneName){
        this.startScene = this.sceneMap[sceneName];
    }

    _p.printAllScenes = function(){
        var out = "";
        for(var p in this.sceneMap){
            out += " "+this.sceneMap[p].getName()+" ";
        }
        Logger.dlog(out,"Stage");
    }

    _p._configAccordingName = function(name){
        //存在于配置文件中尚且未被任何场景配置的
        if(this.configMap && name in this.configMap && !(name in this.sceneMap)){
            this.currentConfig = new this.configMap[name]();
            this.currentConfig.createNew();
            this.currentConfig.start();
        }
    }

    //以下为Level相关
    _p.findLevelBy = function(charactorObj){
        var res = null
        for(var i =0;i<LevelEditor.level.length;i++){
            var lvlItm = LevelEditor.level[i];
            var isTrue = true;
            for(var p in charactorObj){
                if(lvlItm[p] !== charactorObj[p]){
                    isTrue = false;
                    break;
                }
            }
            if(isTrue){
                return lvlItm;
            }
        }
        return res
    }

    _p.loadLevelBy = function(charactorObj){
        //先判断是否是当前的level避免重复载入
        if(this.currentLevel){
            var isTrue = true;
            for(var p in charactorObj){
                if(this.currentLevel[p] !== charactorObj[p]){
                    isTrue = false;
                    break;
                }
            }
            if(!isTrue){
                this.loadLevel(this.findLevelBy(charactorObj));
            }
        }else{
            this.loadLevel(this.findLevelBy(charactorObj));
        }
    }
    /**
     * 载入场景编辑器的配置并据此创建场景和场景配置
     * @param levelItem
     */
    _p.loadLevel = function(levelItem){
        if(levelItem){
            this._tempSwitchSceneLevel = this.currentLevel;
            this.currentLevel = levelItem;
            this._tempIsNewLevel = true;
            Logger.dlog('name: '+this.currentLevel.name,'Stage.currentLevel');
            if(levelItem.stage){
                //stage的预处理
                if(levelItem.stage.link){
                    levelItem.stage = this.findLevelBy(levelItem.stage.link);
                }
                updateObj1FromObj2(this,levelItem.stage);
            }
            //将要转换到的场景
            var sceneName = levelItem['name'];
            if(this.hasScene(sceneName)){
                this._tempIsNewLevelUpdated = true;
                RenderLayerManager.
                    switchScene(sceneName);
            }else{
                RenderLayerManager
                    .switchScene()
                    .nameScene(sceneName);
            }
        }
    }

    function updateObj1FromObj2(obj1,obj2){
        for(var p in obj2){
            if(p in obj1){
                if(typeof obj1[p] === 'object' &&
                typeof obj2[p] === 'object'){
                    //递归更新子对象
                    updateObj1FromObj2(obj1[p],obj2[p]);
                }else{
                    //更新数据
                    obj1[p] = obj2[p];
                }
            }else{
                //直接赋值新属性
                obj1[p] = obj2[p];
            }
        }
    }

    return singleton;
})();