/**
 * Created by jackyanjiaqi on 15-6-23.
 */
function MissionSelectScene(){
    BGGridTouchableScene.apply(this,arguments);
    this.levelItems = ObjectPool.give();
    this.lastClicked = -1;
}

extend(MissionSelectScene,BGGridTouchableScene);

_p = MissionSelectScene.prototype;

_p.onResume = function(scene){
    BaseSceneConfig.prototype.onResume.apply(this,arguments);

    //BGGridTouchableScene.prototype.onResume.apply(this,arguments);
    if(!scene){
        if(this.needPreLoadLevelResource()){
            return;
        }
    }
    var name = null;
    var validStr = null;
    //确定任务和任务图标 用于显示
    ObjectPool.collect(this.levelItems);
    this.levelItems = ObjectPool.give();
    for(var row = 0;row<this.grid_yi;row++){
        for(var column = 0;column<this.grid_xi;column++){
            var index = row*this.grid_xi + column;
            var keyname = 'levelSelect' + index;
            if(localStorage[keyname]){
                //开始解析
                var levelItem = ObjectPool.give();
                levelItem.index = index;
                levelItem['name'] = localStorage[keyname + 'name'];
                levelItem['launch'] = ObjectPool.give();
                levelItem['launch']['name'] = localStorage[keyname +'launch' + 'name'];
                levelItem['launch']['index'] = parseInt(localStorage[keyname + 'launch' + 'index']);
                levelItem['pic'] = localStorage[keyname+'pic'].split('|');
                levelItem['des'] = localStorage[keyname+'des'].split(';');
                this.levelItems[index] = levelItem;
                validStr += localStorage[keyname];
            }
        }
    }
    if(ObjectPool.isEmpty(this.levelItems)){
        //nextLevel 返回一个Map
        var nextMap = Stage.currentLevel.nextLevel;
        for(var p in nextMap){
            var index = indexTransfer(nextMap[p]['coordinate'][0],nextMap[p]['coordinate'][1],this.grid_xi);

            nextMap[p].index = index;
            this.levelItems[index] = nextMap[p];

            //逐一提供入口并写入本地数据
            var base = 'levelSelect'+index;
            localStorage[base] = true;
            var picparam = '';
            nextMap[p]['pic'].forEach(function(item,i){
               if(i !== 0){
                    picparam += '|'+item;
               }else{
                    picparam += item;
                }
            });
            localStorage[base+'pic'] = picparam;
            localStorage[base+'name'] = p;
            localStorage[base+'launch'+'name'] = nextMap[p]['launch']['name'];
            localStorage[base+'launch'+'index'] = nextMap[p]['launch']['index'];
            var desparam = '';
            nextMap[p]['des'].forEach(function(item,i){
                if(i !== 0){
                    desparam += ';'+item;
                }else{
                    desparam += item;
                }
            });
            localStorage[base+'des'] = desparam;
        }
    }else
    if(this.isValid(validStr)){
        //校验失败提示用户
    }
    //全局设置
    Stage.theme.bgStyle = '#0c6b79';
    this.maplength = 80;
    RenderProxy._maplinewidth = 1;

    this.initBGManager();
    this.drawBG();
    this.drawItems();
    this.setActions();
    this.refresh();
}

_p.drawItems = function(){
    RenderLayerManager.selectLayer('LevelItem').clear();
    for(var index in this.levelItems) {
        var levelItem = this.levelItems[index];
        RenderLayerManager
            .paintMapInit(0,
            BGGridManager.data[index]['0'].x,
            BGGridManager.data[index]['0'].y,
            RenderProxy._maplength,RenderProxy._maplinewidth,null,'rgb(255,255,255,127)',null,
            ImageManager.get.apply(ImageManager,levelItem['pic'])
        )
    }
}

_p.setActions = function(){
    var self = this;
    //处理levelItem
    for(var index in this.levelItems){
        var levelItem = this.levelItems[index];

        //点击图片变黄
        levelItem.onItemStart = function (i,item) {
            RenderLayerManager
                .selectLayer('TouchEffect')
                .clear()
                .paintMapInit(0,
                    BGGridManager.data[i]['0'].x,
                    BGGridManager.data[i]['0'].y,
                    RenderProxy._maplength,RenderProxy._maplinewidth,'rgba(133,133,0,0.5)'
            ).renderLayers(Stage.ctx,null);

        };
        levelItem.onClicked = function (i,item) {
            if(self.lastClicked === -1 && i !== -1){
                //添加关卡说明
                paintDescription(self,item,
                    RenderLayerManager.selectLayer('Description')._getRenderCtx());
                self.lastClicked = i;
            }else
            if(i !== -1 && i === self.lastClicked){
                //进入关卡并取消关卡说明
                RenderLayerManager.selectLayer('Description').clear();
                self.lastClicked = -1;
                Stage.loadLevelBy(self.levelItems[i].launch);
            }
            self.onCancelClick();
        };
        levelItem.onCancelClick = function(i){
            RenderLayerManager
                .selectLayer('TouchEffect')
                .clear()
                .renderLayers(Stage.ctx,null);
        }
    }
}
//var descriptions = {
//    0:['双击空白区域结束自己的回合','将雷神安全送到对岸的任一方块','并结束本方回合即可获胜'],
//    1:['双击空白区域结束自己的回合','蜘蛛侠初始位置不被敌人占领','坚持5个回合并在奔放回合结束时即可获胜'],
//    7:['双击空白区域结束自己的回合','绿箭侠不死且坚持10个回合','全歼对手也可以赢的哦']
//}

function paintDescription(self,item,ctx){
    if(item['des']){
        var maxstr = null;
        item['des'].forEach(function(str){
            if(maxstr === null){
                maxstr = str;
            }else
            if(str.length > maxstr.length){
                maxstr = str;
            }
        });
        var maxWidth = ctx.measureText(maxstr).width;
        var singleWidth = maxWidth/maxstr.length;
        var height = item['des'].length * 10 * singleWidth ;

        ctx.save();
        //ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 38px serif';
        //ctx.fillRect(
        //    BGGridManager.data[index].cx,
        //    BGGridManager.data[index].cy,
        //    maxWidth*4,
        //    height);
        //var startX = BGGridManager.data[index][2].x;
        var startY = BGGridManager.data[item.index][3].y;
        var startX = Stage.width/2 - maxWidth;
        item['des'].forEach(function(item,i){
            ctx.fillText(item,startX,startY+= 5*singleWidth);
        });
            ctx.save();
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.font = 'bold 28px serif';
            ctx.fillText('再次点击萌宝头像进入关卡,点击其他区域取消',20,Stage.canvas.height - singleWidth);
            ctx.restore();
        ctx.restore();


    }
}

_p.isValid = function(string){
    return true;
}

_p.onTouchOrMouseStart = function(ev){
    BGGridTouchableScene.prototype.onTouchOrMouseStart.apply(this,arguments);
    var index = BGGridManager.touchDelegate.getIndex(ev);
    if(index in this.levelItems){
        this.levelItems[index].onItemStart(index,this.levelItems[index]);
    }
}

_p.onClicked = function (clickIndex) {
    var self = this;
    BGGridTouchableScene.prototype.onClicked.apply(this,arguments);
    if(clickIndex in this.levelItems){
        this.levelItems[clickIndex].onClicked(clickIndex,this.levelItems[clickIndex]);
    }

    if(clickIndex !== self.lastClicked && self.lastClicked !== -1){
        //取消关卡说明
        RenderLayerManager
            .selectLayer('Description')
            .clear()
            .renderLayers(Stage.ctx,null);
        self.lastClicked = -1;
    }
}

_p.onCancelClick = function (cancelClickIndex){
    BGGridTouchableScene.prototype.onCancelClick.apply(this,arguments);
    if(cancelClickIndex in this.levelItems){
        this.levelItems[cancelClickIndex].onCancelClick(cancelClickIndex);
    }
}