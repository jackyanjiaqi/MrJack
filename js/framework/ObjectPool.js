/**
 * Created by jackyanjiaqi on 15-6-16.
 */
var ObjectPool = (function(){
    var singleton = new ObjectPool();
    function ObjectPool(){
        this.objects = [];
    }
    var _p = ObjectPool.prototype;

    _p.collect = function(Obj){
        for(var p in Obj){
            delete Obj[p];
        }
        this.objects.push(Obj);
        Obj = null;
    }

    _p.give = function () {
        var res = this.objects.pop();
        if(res!=null){
            return res;
        }else{
            return {};
        }
    }

    _p.isEmpty = function(obj){
        for(var p in obj){
            return false;
        }
        return true;
    }

    _p.size = function(){
        return this.objects.length;
    }
    return singleton;
})();