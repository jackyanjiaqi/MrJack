/**
 * Created by jackyanjiaqi on 15-6-2.
 */
GameRoleManager = {
    roles:ArrayPool.give(),//角色
    roleCountMap:{total:0},//对应角色数量的映射
    roleKindMap:ObjectPool.give(),//对应角色种类的映射
    roleUserMap:ObjectPool.give()//对应角色使用者的映射
}

_grm = GameRoleManager;

_grm.clear = function(){
    _grm.roles.length = 0;
    ObjectPool.collect(_grm.roleCountMap);
    _grm.roleCountMap = ObjectPool.give();
    _grm.roleCountMap.total = 0;
    ObjectPool.collect(_grm.roleKindMap);
    ObjectPool.collect(_grm.roleUserMap);
    _grm.roleKindMap = ObjectPool.give();
    _grm.roleUserMap = ObjectPool.give();
}

_grm.createFromConfigMap = function (configMap) {
    //清空
    _grm.clear();

    var createFrom = null;
    if('keepOrientation' in Stage.currentLevel && Stage.currentLevel.keepOrientation){
        createFrom = configMap.sceneMap;
    }else{
        //如果是竖屏需要矩阵转制
        if(Stage.screen.orientation === 'portrait'){
            createFrom = ArrayPool.give();
            for(var i = 0;i<configMap.columnNum;i++){
                for(var j = 0;j<configMap.sceneMap.length/configMap.columnNum;j++){
                    createFrom.push(configMap.sceneMap[configMap.columnNum - i - 1 + j*configMap.columnNum]);
                }
            }
        }else{
            createFrom = configMap.sceneMap;
        }
    }

    createFrom.forEach(function (roleConfig,i) {
        _grm.roles[i] = ObjectPool.give();
        if(typeof roleConfig === 'object') {
            _grm.createNew(false, roleConfig.n, i, null, roleConfig.u);
            if('id' in roleConfig){
                _grm.roles[i].action.goalid = roleConfig.id;
            }
            _grm.roles[i].goalid = 'goalid' in roleConfig?roleConfig['goalid']:0;
        }else{
            _grm.roles[i].goalid = roleConfig;
        }
    });
}

_grm.getRolesByUser = function (userId,indexMap) {
    var res = ArrayPool.give();
    for(var kindMap in _grm.roleKindMap){
        for(var key in _grm.roleKindMap[kindMap]){
            if(_grm.roleKindMap[kindMap][key]){
                if(_grm.roles[key].action.user === userId){
                    res.push(_grm.roles[key]);
                    if(indexMap && indexMap instanceof Object){
                        indexMap[key] = _grm.roles[key];
                    }
                }
            }
        }
    }
    return res;
}

_grm.getRolesByKind = function(roleKeynamesArray){
    var res = ArrayPool.give();
    roleKeynamesArray.forEach(function (key) {
        for(var index in _grm.roleKindMap[key]){
            res.push(_grm.roles[index]);
        }
    });
    return res;
}

_grm.getRoleConfigBy = function(key,value){
    if(key == 'roleNum' && Stage.roles.detail[value]){
        return Stage.roles.detail[value];
    }else{
        for(var p in Stage.roles.detail){
            var item = Stage.roles.detail[p];
            if(item[key] === value){
                return item;
            }
        }
    }
    return null;
}

_grm.createNew = function createNew(isCoverOld,createFromRoleNums,arg0,arg1,user,effectTag){
    var newBornIndex = -1;
    if(arg0 !== undefined && arg0 !== null){
        if(arg1 !== undefined && arg1 !== null){
            newBornIndex = indexTransfer(arg0,arg1,BGGridManager.column_count);
        }else{
            newBornIndex = arg0;
        }
    }else{
        //产生新元素得编号
        newBornIndex = Math.floor(Math.random()*BGGridManager.column_count*BGGridManager.row_count);
    }
    var createOrNot = isCoverOld?true:_grm.isUnitBlank(newBornIndex);
    if(_grm.roles[newBornIndex] && createOrNot && EffectManager.onBooleanReturned(true,createNew,arguments,effectTag)){
        var roleNum = -1;
        if(typeof createFromRoleNums == 'number'){
            roleNum = createFromRoleNums;
        }else{
            //选择生成的角色范围
            var selectRange = null;
            if(createFromRoleNums === undefined || createFromRoleNums === null){
                selectRange = Object.keys(Stage.roles.detail);
            }else{
                selectRange = createFromRoleNums;
            }
            //生成的角色编号
            roleNum = selectRange[Math.floor(Math.random()*selectRange.length)];
        }
        //判断是否已经有角色存在
        if(_grm.roles[newBornIndex].action != null && createOrNot){
            //消灭已有的角色
            //相当于体力流逝 只触发onKilled不触发onKillingIntent
            _grm.killRole(newBornIndex);
        }
        _grm.roles[newBornIndex].roleNum = roleNum;
        if(!_grm.roleCountMap[roleNum]){
            _grm.roleCountMap[roleNum] = 0;
        }
        _grm.roleCountMap[roleNum] ++;
        _grm.roleCountMap.total ++;

        var action = _grm.roles[newBornIndex].action = HeroActionManager.getAction(roleNum);
        //配置action
        var rangeItem = _grm.getRoleConfigBy('roleNum',roleNum);
        //注入action属性
        if(rangeItem && 'actionParams' in rangeItem){
            for(var p in rangeItem.actionParams){
                //配置AI属性
                if(p === 'ai'){
                    action.ai = new rangeItem.actionParams['ai'](action,newBornIndex);
                }else
                //注入函数
                if(p.indexOf('set')!==-1){
                    action[p].call(action,rangeItem.actionParams[p]);
                }else{
                    action[p] = rangeItem.actionParams[p];
                }
            }
        }
        //设置user
        if(!user){
            action.user = 'me';
        }else{
            action.user = user;
        }
        //判断user和AI的关系 不能矛盾
        if(action.user === 'me'){
            delete action.ai;
        }else
        if(action.user === 'ai' && !action.ai){
            action.ai = new BaseAI(action,newBornIndex);
        }

        if(!(action.rolePic in _grm.roleKindMap)){
            _grm.roleKindMap[action.rolePic] = ObjectPool.give();
        }
        _grm.roleKindMap[action.rolePic][newBornIndex] = true;
    }
}

_grm.killRole = function(index){
    if(_grm.isGameRole(index)){
        var killed_type = _grm.roles[index].roleNum;
        _grm.roles[index].action.onKilled(index);
        delete _grm.roleKindMap[_grm.roles[index].action.rolePic][index];
        if(ObjectPool.isEmpty(_grm.roleKindMap[_grm.roles[index].action.rolePic])){
            delete _grm.roleKindMap[_grm.roles[index].action.rolePic];
        }

        _grm.roles[index].action = null;
        delete _grm.roles[index].action;
        delete _grm.roles[index].roleNum;

        _grm.roleCountMap[killed_type] --;
        _grm.roleCountMap.total --;
    }
}

_grm.getRolePic = function (index){
    if(_grm.isGameRole(index)){
        return _grm.roles[index].action.getRolePic();
    }else{
        return null;
    }
}

_grm.isGameRole = function isGameRole(index,effectTag){
    if('roleNum' in _grm.roles[index]
        && 'action' in _grm.roles[index]
        && _grm.roles[index].action){
        return EffectManager.onBooleanReturned(true,isGameRole,arguments,effectTag);
    }else{
        return EffectManager.onBooleanReturned(false,isGameRole,arguments,effectTag);
    }
}

_grm.isUnitBlock = function isUnitBlock(index,effectTag){
    var res = null;
    if(_grm.roles[index].action){
        res = EffectManager.onBooleanReturned(true,isUnitBlock,arguments,effectTag);
        Logger.dlog(index+'isUnitBlock = '+res,'GameRoleManager');
        return res;
    }else{
        res = EffectManager.onBooleanReturned(false,isUnitBlock,arguments,effectTag);
        Logger.dlog(index+'isUnitBlock = '+res,'GameRoleManager');
        return res;
    }
}

_grm.isUnitBlank = function isUnitBlank(index,effectTag){
    if(_grm.roles[index].action){
        Logger.dlog(index+'isUnitBlank = false','GameRoleManager');
        return EffectManager.onBooleanReturned(false,isUnitBlank,arguments,effectTag);
    }else{
        Logger.dlog(index+'isUnitBlank = true','GameRoleManager');
        return EffectManager.onBooleanReturned(true,isUnitBlank,arguments,effectTag);
    }
}

_grm.transverseUnit = function(gameRoleIndex,targetRoleIndex){
    if(_grm.isGameRole(gameRoleIndex)){
        var temp_num = _grm.roles[gameRoleIndex].roleNum;
        var temp_action = _grm.roles[gameRoleIndex].action;

        _grm.roles[gameRoleIndex].roleNum = _grm.roles[targetRoleIndex].roleNum;
        _grm.roles[gameRoleIndex].action = _grm.roles[targetRoleIndex].action;

        _grm.roles[targetRoleIndex].roleNum = temp_num;
        _grm.roles[targetRoleIndex].action = temp_action;
    }

    //调换序号
    if(_grm.isGameRole(gameRoleIndex)){
        delete _grm.roleKindMap[_grm.roles[gameRoleIndex].action.rolePic][targetRoleIndex];
        _grm.roleKindMap[_grm.roles[gameRoleIndex].action.rolePic][gameRoleIndex] = true;
    }
    if(_grm.isGameRole(targetRoleIndex)){
        delete _grm.roleKindMap[_grm.roles[targetRoleIndex].action.rolePic][gameRoleIndex];
        _grm.roleKindMap[_grm.roles[targetRoleIndex].action.rolePic][targetRoleIndex] = true;
    }
}

_grm.renderRoles = function(){
    var self = this;
    self.roles.forEach(function(roleItem,i){
        //绘制对象自身
        if(roleItem.action){
            RenderLayerManager.paintMapInit(
                0,
                BGGridManager.data[i][0].x,
                BGGridManager.data[i][0].y,
                RenderProxy._maplength,
                RenderProxy._maplinewidth,
                null,null,null,roleItem.action.getRolePic()
            );
        }
        //绘制效果(效果的绘制由EffectManager在效果层绘制)
        //if(roleItem.effect){
        //    RenderLayerManager.paintMapInit(
        //        0,
        //        BGGridManager.data[roleItem.id][0].x,
        //        BGGridManager.data[roleItem.id][0].y,
        //        RenderProxy._maplength,
        //        RenderProxy._maplinewidth,
        //        null,null,null,ImageManager.get(roleItem.effect)
        //    );
        //}

    });
}