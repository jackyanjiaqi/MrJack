
/**
 * Created by jackyanjiaqi on 15-5-21.
 */
RenderProxy = {
    _maptile:[null,null,null,null,null,null],
    _maplength: null,
    _maplinewidth: null,
    _fillColor : null,
    _strokeColor : 'rgb(255,255,255)',

    growPaint : function growPaint(ctx,from,fillColor,strokeColor,text,img,sourceCutObj){
        this.paintMapInit(ctx,(from+4)%6,this._maptile[from].x,this._maptile[from].y,
            this._maplength,
            this._maplinewidth,
            fillColor,strokeColor,text,img,sourceCutObj);
    },
    //重绘 用于canvas_mask的绘制
    rePaint : function rePaint(ctx,fillColor,strokeColor,text,img){
        this.paintMapInit(ctx,
            0,this._maptile[0].x,this._maptile[0].y,
            this._maplength,
            this._maplinewidth,
            fillColor,strokeColor,text,img);
    },

    growStroke : function growStroke(strokeStyle,ctx,from){
        this.strokeMapInit(strokeStyle,ctx,(from+4)%6,this._maptile[from].x,this._maptile[from].y,this._maplength);
    },

    paintMapInit : function paintMapInit(ctx,from,initx,inity,length,lineWidth,fillColor,strokeColor,text,img,srcCutObj){
        if(!ctx){
            return;
        }
        if(length){
            this._maplength = length;
        }
        if(lineWidth){
            this._maplinewidth = lineWidth;
        }
        //不需要缓存fillColor
        //if(fillColor){
        //    this._fillColor = fillColor;
        //}

        //ctx.fillStyle = this._fillColor;
        ctx.lineJoin = 'round';
        ctx.lineWidth = this._maplinewidth;

    //            ctx.arc(initx,inity,10,0,2*Math.PI,false);
        ctx.save();
        ctx.moveTo(initx,inity);
        ctx.beginPath();
        var cx = initx;
        var cy = inity;
        for(var i=from;i<from+6;i++){
            var dx = Math.cos(-Math.PI*(i%6)/3);
            var dy = Math.sin(Math.PI*(i%6)/3);
            cx = cx + dx * this._maplength;
            cy = cy + dy * this._maplength;
          //ctx.strokeText('map:' + (i+1)%6,cx-50,cy-10);
          //ctx.strokeText('x:'+cx,cx-50,cy+20);
          //ctx.strokeText('y:'+cy,cx-50,cy+50);
            ctx.lineTo(cx,cy);
            if(!this._maptile[(i+1)%6]){
                this._maptile[(i+1)%6] = new Object();
            }
            this._maptile[(i+1)%6].x = cx;
            this._maptile[(i+1)%6].y = cy;
        }
        ctx.closePath();

        //画图片
        if(img){
            //if(this._fillColor!=null){
            //    ctx.fillStyle = this._fillColor;
            //    ctx.fill();
            //}
            //画背景色
            if(fillColor){
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
            ctx.clip();

            if(srcCutObj){
                var cx = this._maptile[5].x+this._maplength;
                var cy = this._maptile[5].y;
                ctx.drawImage(img,
                    srcCutObj[0],srcCutObj[1],srcCutObj[2],srcCutObj[3],
                    cx - srcCutObj[2]/2,
                    cy - srcCutObj[3]/2,
                    srcCutObj[2],
                    srcCutObj[3]
                );
            }else{
                //this.ctxPaintImg(
                //    ctx,
                //    img,
                //    this._maptile[5].x,
                //    this._maptile[0].y,
                //    this._maptile[2].x - this._maptile[5].x,
                //    this._maptile[4].x - this._maptile[0].y);
                ctx.drawImage(img,
                    this._maptile[5].x,
                    this._maptile[0].y,
                    this._maptile[2].x - this._maptile[5].x,
                    this._maptile[4].y - this._maptile[0].y);
            }
        }else {
            //画纯色
            if(fillColor){
                ctx.fillStyle = fillColor;
                ctx.fill();
            }
        }
        //画边
        if(strokeColor){
            this._strokeColor = strokeColor;
            ctx.strokeStyle = this._strokeColor;
            ctx.stroke();
        }

        /*计算文字位置*/
        if(text){
            var tx = this._maptile[5].x + this._maplength;
            var ty = this._maptile[5].y;
            ctx.font = "48pt bold";
            ctx.textAlign = "center";
            ctx.textBaseline = 'middle';
            ctx.fillText(text,tx,ty);
        }
        ctx.restore();
    },

    strokeMapInit : function strokeMapInit(strokeStyle,ctx,from,initx,inity,length,lineWidth){
        if(!ctx){
            return;
        }
        if(length) {
            this._maplength = length;
        }
        if(lineWidth){
            this._maplinewidth = lineWidth;
        }
        ctx.lineJoin = 'round';
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = this._maplinewidth;

        ctx.save();
        ctx.moveTo(initx,inity);
        ctx.beginPath();
        var cx = initx;
        var cy = inity;
        for(var i=from;i<from+6;i++){
            var dx = Math.cos(-Math.PI*(i%6)/3);
            var dy = Math.sin(Math.PI*(i%6)/3);
            cx = cx + dx * this._maplength;
            cy = cy + dy * this._maplength;
    //                ctx.strokeText('map:' + (i+1)%6,cx-50,cy-10);
    //                ctx.strokeText('x:'+cx,cx-50,cy+20);
    //                ctx.strokeText('y:'+cy,cx-50,cy+50);
            ctx.lineTo(cx,cy);
            if(!this._maptile[(i+1)%6]){
                this._maptile[(i+1)%6] = new Object();
            }
            this._maptile[(i+1)%6].x = cx;
            this._maptile[(i+1)%6].y = cy;

        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    },

    ctxPaint : function (ctx,imgdata,x,y,w,h,channel){
        var output_data = ctx.getImageData(x,y,w,h);
        var output = output_data.data;
        var img_src = imgdata.data;
        for(var y = 1;y<h-1;y++){
            for(var x=1;x<w-1;x++){
                var pixil = (y*w + x)*4;
        //        //output[pixil] = output[pixil] + img_src[pixil+channel] - output[pixil]*img_src[pixil+channel]/255;
        //        //output[pixil+1] = output[pixil+1] + img_src[pixil+channel] - output[pixil+1]*img_src[pixil+channel]/255;
        //        //output[pixil+2] = output[pixil+2] + img_src[pixil+channel] - output[pixil+2]*img_src[pixil+channel]/255;
        //        output[pixil] = 255 - output[pixil];
        //        output[pixil+1] = 255 - output[pixil+1];
        //        output[pixil+2] = 255 - output[pixil+2];
                output[pixil] = 255;
                output[pixil+1] = 255;
                output[pixil+2] = 255;
            }
        }
        ctx.putImageData(output_data,x,y);
    },

    ctxPaintImg : function (ctx,img,x,y,xw,yh){
        var _canvas = document.createElement('canvas');
        _canvas.width = xw;
        _canvas.height = yh;
        var _ctx = _canvas.getContext('2d');
        _ctx.drawImage(img,0,0,_canvas.width,_canvas.height);
        var src_imagedata = _ctx.getImageData(0,0,_canvas.width,_canvas.height);
        this.ctxPaint(ctx,src_imagedata,x,y,xw,yh,1);
    },

    paintBG : function (ctx,img){
        var bg_pattern = ctx.createPattern(img,"repeat");
        ctx.fillStyle = bg_pattern;
        ctx.fillRect(0,0,BGGridManager.canvasWidth,BGGridManager.canvasHeight);
    }
};



