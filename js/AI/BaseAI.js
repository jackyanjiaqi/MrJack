/**
 * 模拟BaseHeroAction的输入部分 完成决策
 * Created by jackyanjiaqi on 15-6-20.
 */
function BaseAI(action,startIndex){
    this.action = action;
    this.startIndex = startIndex;
    this.next = null;
    this.timeFlag = -1;
}

_p = BaseAI.prototype;

_p.onStratagyStart = function(){
    this.performStart(this);
    //if(!this.performStart(this)){
    //    this.examinNextStrategy(this);
    //}
}

_p.performStart = function (self) {
    //首先判断是否是可用的角色 是否被限制 被网住 被冻结
    if(HeroActionManager.postActionBegin(self.action)){
        self.action.onActionStart(self._i2e(self.startIndex));
        //起始要判断是否被堵死 无路可走 否则陷入死循环
        if(!ObjectPool.isEmpty(self.action.availableSelection)){
            self._act(self.performRandomStartUp);
            return;
        }
    }
    //结束当前Action 跳到下一个
    if(self.next === null){
        HeroActionManager.informUserEnd('ai');
    }else{
        self.next.onStratagyStart();
    }
}

_p._i2e = function(index){
    var coorodonate = ObjectPool.give();
    coorodonate.index = index;
    //coorodonate.x = Math.round(BGGridManager.data[index].cx);
    //coorodonate.y = Math.round(BGGridManager.data[index].cy);
    return coorodonate;
}

_p.performRandomStartUp = function(self){
    if(!ObjectPool.isEmpty(self.action.availableSelection)){
        var temp = [];
        for(var p in self.action.availableSelection){
            temp.push(p);
        }
        var i = Math.floor(Math.random()*temp.length);
        var upindex = self.action.availableSelection[temp[i]];
        Logger.dlog('performActionUp index='+upindex);
        if(upindex === -1){
            var cc = 1;
        }
        self.action.onActionEnd(self._i2e(upindex));
    }
    self.examinNextStrategy(self);
}

_p.performClick = function(index){
    this.action.onActionStart(this._i2e(index));
    this.action.onActionEnd(this._i2e(index));
}

_p.performClickRandomInAvailableSelection = function(self){
    if(!ObjectPool.isEmpty(self.action.availableSelection)){
        var temp = [];
        for(var p in self.action.availableSelection){
            temp.push(p);
        }
        var i = Math.floor(Math.random()*temp.length);
        var upindex = self.action.availableSelection[temp[i]];
        //this.action.onActionEnd(this._i2e(upindex));
        Logger.dlog('performClick index='+upindex);
        if(upindex === -1){
            var cc = 1;
        }
        self.performClick(upindex);
    }
    self.examinNextStrategy(self);
}

_p.performCancel = function(){
    this.performClick(-1);
}

_p._act = function (func,args) {
    var self = this;
    clearTimeout(this.timeFlag);
    this.timeFlag = setTimeout(function(){
        func(self,args);
    },1000);
}

_p.examinNextStrategy = function(self){
    //结束执行后不为空
    if(self.action.state && !ObjectPool.isEmpty(self.action.availableSelection)){
        //继续执行
        self._act(self.performClickRandomInAvailableSelection);
    }else
    if(self.action.postTimes) {
        //继续执行下一回合
        self.onStratagyStart();
    }else{
        //结束当前Action 跳到下一个
        if(self.next === null){
            HeroActionManager.informUserEnd('ai');
        }else{
            self.next.onStratagyStart();
        }
    }
}