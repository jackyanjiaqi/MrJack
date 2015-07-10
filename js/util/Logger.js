/**
 * Created by jackyanjiaqi on 15-5-27.
 */
var Logger = (
    function (){
        var singleton = new Logger();

        function Logger(){
            this.taglocker = {};
            this.debug = false;
            this.dom_log = null;
        }

        var _p = Logger.prototype;

        _p.dlog = function (str,tag) {
            if(this.dom_log == null){
                this.dom_log = document.querySelector('.log');
                //this.dom_log.addEventListener('click',new function(){
                //    this.dom_log.style.visibility = 'hidden';
                //});
            }
            //this.dom_log.innerHTML = this.dom_log.innerHTML + '\n' + new Date().toLocaleTimeString() + ' - ' + str;
            var isLogShow = true;
            if(tag !== undefined && tag in this.taglocker){
                isLogShow = this.taglocker[tag];
            }
            if(isLogShow){
                this.dom_log.innerHTML = this.dom_log.innerHTML + '\n' + tag + ':[[' + str + "]]";
                this.dom_log.scrollTop = this.dom_log.scrollHeight;
            }
            return this;
        };

        _p.clog = function (ctx,str,tag) {
            //if(tag){
            //    if(!this.taglocker.hasOwnProperty(tag)){
            //        this.taglocker[tag] = true;
            //    }
            //    if(this.debug && this.taglocker[tag]){
            //        ctx.clearRect(0,0,1000,60);
            //        ctx.strokeStyle = 'rgb(0,0,0)';
            //        ctx.strokeText(str,10,50,1000);
            //    }
            //}else
            //if(this.debug){
                ctx.clearRect(0,0,1000,60);
                ctx.strokeStyle = 'rgb(0,0,0)';
                ctx.lineWidth = 1;
                ctx.strokeText(str,10,50,1000);
            //}
            return this;
        };

        _p.log = function (str,tag){
            if(tag){
                if(!this.taglocker.hasOwnProperty(tag)){
                   this.taglocker[tag] = true;
                }
                if(this.debug && this.taglocker[tag]){
                    alert(str);
                    //console.trace(str);
                }
            }else
            if(this.debug){
                alert(str);
            }
            return this;
        };

        _p.tagOn = function (tagNames){
            if(arguments.length>0){
                for(var i = 0;i<arguments.length;i++){
                    if(arguments[i] instanceof Array){
                        for(var arg in arguments[i]){
                            this.taglocker[arg] = true;
                        }
                    }else
                    if(arguments[i] instanceof String){
                        this.taglocker[arguments[i]] = true;
                    }
                }
            }
            return this;
        };

        _p.tagOff = function (){
            if(arguments.length>0){
                for(var i = 0;i<arguments.length;i++){
                    //if(arguments[i] instanceof Array){
                    //    for(var arg in arguments[i]){
                    //        this.taglocker[arg] = false;
                    //    }
                    //}else
                    //if(arguments[i] instanceof String){
                        this.taglocker[arguments[i]] = false;
                    //}
                }
            }
            return this;
        };

        _p.tagAll = function(isOpenOrClosed){
            if(!isOpenOrClosed){
                this.log(this.taglocker.toString());
            }else
            if(typeof isOpenOrClosed == 'boolean'){
                for(var p in this.taglocker){
                    p = isOpenOrClosed;
                }
            }
            return this;
        };

        _p.debugSwitch = function(isDebugOn){
            if(typeof isDebugOn == 'boolean'){
                this.debug = isDebugOn;
            }
            return this;
        };

        _p.object = function(obj){
            var out = "{";
            for(var p in obj){
                out += " " + p +":"+obj[p]+" ";
            }
            out += "}";
            return out;
        }

        return singleton;
    }
)();