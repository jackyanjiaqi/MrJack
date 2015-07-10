/**
 * Created by jackyanjiaqi on 15-6-4.
 * Image manager is responsible for loading multiple images and
 * notifying about load progress, errors and the end of current
 * download queue.
 */
var ImageManager = (function(){
    var singleton = new ImageManager();
    function ImageManager(placeholderDataUri) {
        this._images = {};
        this._groups = {};
        if (placeholderDataUri) {
            this._placeholder = new Image();
            this._placeholder.src = placeholderDataUri;
        }
    }

    var _p = ImageManager.prototype;

    _p.filterExits = function (imageBatch1st) {
        if(arguments.length>1){
            for(var i= 1;i<arguments.length;i++){
                for(var p in arguments[i]){
                    imageBatch1st[p] = arguments[i][p];
                }
            }
        }
        var keys = Object.keys(imageBatch1st);
        var loadImages = keys.filter(function(key){
            return !singleton.get(key);
        });
        var resObj = ObjectPool.give();
        loadImages.forEach(function (key) {
            resObj[key] = imageBatch1st[key];
        });
        return resObj;
    }

    _p.loadBatch = function(onDone,onProgress,imageBatch1st){
        if(arguments.length>3){
            for(var i= 3;i<arguments.length;i++){
                for(var p in arguments[i]){
                    imageBatch1st[p] = arguments[i][p];
                }
            }
        }
        this.load(imageBatch1st,onDone,onProgress);
    }

    _p.load = function(images, onDone, onProgress) {
        // The images queue
        var queue = [];
        for (var im in images) {
            if(typeof images[im] === 'string'){
                queue.push({
                    key: im,
                    path: images[im]
                });
            }else{
                this.genGroupItem(im,images[im],queue);
            }
        }

        if (queue.length == 0) {
            onProgress && onProgress(0, 0, null, null, true);
            onDone && onDone();
            return;
        }

        var itemCounter = {
            loaded: 0,
            total: queue.length
        };

        for (var i = 0; i < queue.length; i++) {
            this._loadItem(queue[i], itemCounter, onDone, onProgress);
        }
    };

    _p._loadItem = function(queueItem, itemCounter, onDone, onProgress) {
        var self = this;
        var img = new Image();
        img.onload = function() {
            self._images[queueItem.key] = img;
            self._onItemLoaded(queueItem, itemCounter, onDone, onProgress, true);
        };

        img.onerror = function() {
            self._images[queueItem.key] = self._placeholder ? self._placeholder : null;
            self._onItemLoaded(queueItem, itemCounter, onDone, onProgress, false);
        };
        img.src = queueItem.path;
    };

    _p._onItemLoaded = function(queueItem, itemCounter, onDone, onProgress, success) {
        itemCounter.loaded++;
        onProgress && onProgress(itemCounter.loaded, itemCounter.total, queueItem.key, queueItem.path, success);
        if (itemCounter.loaded == itemCounter.total) {
            onDone && onDone();
        }
    };

    /**
     * Returms the loaded image by the given value
     * @param key image alias
     */
    _p.get = function(key,type,index){
        if(this._images[key]){
            return this._images[key];
        }else
        if(this._groups[key]){
            //默认是random
            if(type === 'random' || type === undefined || type === null){
                var keylist = Object.keys(this._groups[key]);
                var keymap = keylist[Math.floor(Math.random()*keylist.length)];
                return this._images[this._groups[key][keymap]];
            }else
            if(type === 'key'){
                return this._images[this._groups[key][index]];
            }else
            if(type === 'index'){
                var keylist = Object.keys(this._groups[key]);
                return this._images[this._groups[key][keylist[index]]];
            }
        }
        return null;
    };

    _p.genGroupItem = function(groupKey,groupObj,queue){
        var path = 'img/';
        //自动装配
        if('autoJoin' in groupObj && groupObj['autoJoin']){
            if('configPrefix' in groupObj && groupObj['configPrefix']) {
                path += Stage.screen.toString();
            }else
            if('prefix' in groupObj && groupObj['prefix']){
                path += groupObj['prefix'];
            }
            var suffix = groupObj['suffix'];
            singleton._groups[groupKey] = ObjectPool.give();
            groupObj['data'].forEach(function (item,i) {
                queue.push({key:groupKey+'_'+item,path:path+'/'+groupKey+'_'+item+suffix});
                singleton._groups[groupKey][item] = groupKey+'_'+item;
            });
        }
    }

    return singleton;
})();
