/**
 * Created by jackyanjiaqi on 15-7-2.
 */
function AttackFirstAI(){
    BaseAI.apply(this,arguments);
}

extend(AttackFirstAI,BaseAI);

_p = AttackFirstAI.prototype;

 /**
 * AI评价函数(机器人的价值观)
 * 计算攻击收益
 * 算法基础:若当前深度收益不为0,则下一个深度的攻击收益不得大于上一级的攻击收益
 *             (深度1)          (深度2)
 * 收益总和 ＝ 当前攻击收益 ＋ 下一个位置的攻击收益
 * 选择攻击收益最大的位置进行移动
 */

_p.evaluate = function(){
    var res = ObjectPool.give();
    res.out = ArrayPool.give();

    var attackSelection = null;
    if(this.action.attackSelection){
        attackSelection = this.action.attackSelection;
    }else{
        attackSelection = ObjectPool.give();
        if(this.action.strategy && 'attack' in this.action.strategy){
            this.action.strategy.attack(this.startIndex,attackSelection,null);
        }
    }
    if(attackSelection && !ObjectPool.isEmpty(attackSelection)){
        //不杀自己人
        for(var p in attackSelection){
            var index = attackSelection[p];
            var targetRole = GameRoleManager.roles[index];

            if(targetRole && targetRole.action) {
                if(targetRole.action.user !== 'ai') {
                    res.in = index;
                    return res;
                }else{
                    //防止random时候误杀自己人
                    res.out.push(index);
                }
            }
        }
    }
    //没有找到攻击者 则判断所有可走的步骤的下一步是否可以攻击
    return this._evaluate(this.action.availableSelection,res);
}

_p._evaluate = function(selection,res) {
    for(var p in selection){
        var index = selection[p];
        var tempSelection = ObjectPool.give();
        if(this.action.strategy && 'attack' in this.action.strategy){
            this.action.strategy.attack.call(this.action,index,tempSelection,null);
        }
        if(!ObjectPool.isEmpty(tempSelection)){
            //判断没有自己人
            for(var p in tempSelection){
                var i = tempSelection[p];
                var targetRole = GameRoleManager.roles[i];
                if(targetRole && targetRole.action && targetRole.action.user !== 'ai'){
                    res.in = index;
                    return res;
                }
            }
        }
    }
    return res;
}

_p.performRandomStartUp = function(self){
    var res = self.evaluate();
    if('in' in res){
        self.action.onActionEnd(self._i2e(res.in));
        self.examinNextStrategy(self);
        return;
    }else
    if('out' in res){
        //过滤
        for(var p in self.action.availableSelection){
            var index = self.action.availableSelection[p];
            if(res.out.indexOf(index)!==-1){
                delete self.action.availableSelection[p];
            }
        }
    }
    BaseAI.prototype.performRandomStartUp.apply(self,arguments);
}