/**
 * Created by jackyanjiaqi on 15-6-22.
 */
var ArrayPool = (function(){
    var singleton = new ArrayPool();
    function ArrayPool(){
        this.objects = [];
    }
    var _p = ArrayPool.prototype;

    _p.collect = function(array){
        if(array){
            array.length = 0;
            this.objects.push(array);
        }
        array = null;
    }

    _p.give = function () {
        var res = this.objects.pop();
        if(res!=null){
            return res;
        }else{
            return [];
        }
    }

    _p.isEmpty = function(array){
        return array.length === 0;
    }

    _p.size = function(){
        return this.objects.length;
    }
    return singleton;
})();