/**
 * Created by jackyanjiaqi on 15-5-25.
 */
BGGridManager = {
    data:[],
    row_count:3,
    column_count:4,
    xoffset:140,
    yoffset:140,
    strokeStyle:'rgb(133,133,133)',
    canvasWidth:0,
    canvasHeight:0,
    gridWidth:0,
    gridHeight:0,
    touchDelegate:null,

    paintItem:function paintItem(ctx,itemindex,strokeStyle,length){
        if(this.data){
            var target = this.data[itemindex];
            Logger.log('onMove:'+target.toString());
            RenderProxy.strokeMapInit(strokeStyle || this.strokeStyle, ctx,
                0, target[0].x, target[0].y, length || RenderProxy._maplength);
        }
        return this;
    },

    paint:function paint(ctxWrapper){
        if(this.data){
            this.initPaint(ctxWrapper,false);
        }
    },

    initPaint:function initPaint(ctxWrapper,isInit,row_max,column_max,length,xoffset,yoffset) {
        if(isInit) {
            if (this.touchDelegate && this.touchDelegate.reset) {
                this.touchDelegate.reset();
            }
            this.data.length = 0;
        }
        var draw_length = length || RenderProxy._maplength;
        this.xoffset = xoffset || this.xoffset;
        this.yoffset = yoffset || this.yoffset;
        this.row_count = row_max || this.row_count;
        this.column_count = column_max || this.column_count;

        for (var row = 0; row < this.row_count; row++) {
            //var bggridRowObj = [];
            var index = 2;
            for (var column = 0; column < this.column_count; column++) {
                if(column == 0){
                    ctxWrapperHandler(
                        this,
                        RenderProxy.strokeMapInit,
                        ctxWrapper
                    );
                }else{
                    index = 3 - index;
                    ctxWrapperHandler(
                        this,
                        RenderProxy.growStroke,
                        ctxWrapper,
                        index
                    );
                }
                if(isInit){
                    bggridPushColumn(this.data,row,column);
                }
            }
        }
        /**
         * ctxWrapper 将具体的绘制行为与单位解耦并接受两种类型
         * 1.覆盖函数 接受参数并覆盖默认行为
         * 2.绘图上下文 直接绘图
         */
        function ctxWrapperHandler(self,callFunc,ctxWrapper,index){
            if(typeof callFunc == 'function'){
                if(ctxWrapper){
                    if(typeof ctxWrapper == 'function'){
                        switch (callFunc.name){
                            case 'strokeMapInit':
                                ctxWrapper(callFunc,[0,BGGridManager.xoffset,BGGridManager.yoffset + row * draw_length * Math.tan(Math.PI/3),draw_length]);
                                break;
                            case 'growStroke':
                                ctxWrapper(callFunc,index);
                                break;
                        }
                    }else
                    if(ctxWrapper instanceof CanvasRenderingContext2D){
                        switch (callFunc.name){
                            case 'strokeMapInit':
                               RenderProxy.strokeMapInit(self.strokeStyle, ctxWrapper, 0, self.xoffset, self.yoffset + row * draw_length * Math.tan(Math.PI/3), draw_length);
                                break;
                            case 'growStroke':
                                RenderProxy.growStroke(self.strokeStyle, ctxWrapper, index);
                                break;
                        }
                    }
                }else
                if(ctxWrapper === null){
                    switch (callFunc.name){
                        case 'strokeMapInit':
                            RenderLayerManager.strokeMapInit(
                                RenderProxy._strokeColor,0,self.xoffset,self.yoffset + row * draw_length * Math.tan(Math.PI/3),draw_length
                            );
                            break;
                        case 'growStroke':
                            RenderLayerManager.growStroke(
                                RenderProxy._strokeColor,index
                            );
                            break;
                    }
                }
            }
        }
        //if(isDataChanged) {
        //    this.data.
        //        x_max_length = this.data[this.row_count - 1][this.column_count - 1][2].x;
        //    this.data.
        //        y_max_length = this.data[this.row_count - 1][this.column_count - 1][4].y;
        //
        //    Logger.log('row_length:' + this.data.length +
        //    '\ncolumn_length:' + this.data[0].length +
        //    '\nx_max_length:' + this.data.x_max_length +
        //    '\ny_max_length:' + this.data.y_max_length,'bggrid');
        //}

        //插入列元素
        function bggridPushColumn(rowArray,row,column){
            //鸭式辩形的一个应用
            if(rowArray && rowArray.push){
                var obj = new Object();
                for(var i=0;i<6;i++){
                    obj[i] = new Object();
                    obj[i].x = RenderProxy._maptile[i].x;
                    obj[i].y = RenderProxy._maptile[i].y;
                }
                obj.cx = RenderProxy._maptile[5].x + draw_length;
                obj.cy = RenderProxy._maptile[5].y;
                rowArray.push(obj);

                var num_total = indexTransfer(row,column,BGGridManager.column_count) + 1;
                if(BGGridManager.touchDelegate && BGGridManager.touchDelegate.tracePaint){
                    BGGridManager.touchDelegate.tracePaint(numberToColor(num_total));
                }
                Logger.log("count:"+rowArray.length+
                    "\nindex:"+index+
                    "\nrow:"+row+
                    "\nrow_max:"+this.row_count+
                    "\ncolumn:"+column+
                    "\ncolumn_max:"+this.column_count,'bggrid'
                );
            }
        }
        return this;
    },
    neighborGridIndex:function neighborGridIndex(di,isIndexTransfer,/*可选的*/target_row,/*可选的*/target_column,row_max,column_max){
        var row_max = row_max || this.row_count;
        var column_max = column_max || this.column_count;
        var direction = parseInt(di);
        if(target_column%2 == 1){
            switch(direction){
                case 0:return isSafeIndex(target_row-1,target_column);
                case 1:return isSafeIndex(target_row-1,target_column+1);
                case 2:return isSafeIndex(target_row,target_column+1);
                case 3:return isSafeIndex(target_row+1,target_column);
                case 4:return isSafeIndex(target_row,target_column-1);
                case 5:return isSafeIndex(target_row-1,target_column-1);
            }
        }else{
            switch(direction){
                case 0:return isSafeIndex(target_row-1,target_column);
                case 1:return isSafeIndex(target_row,target_column+1);
                case 2:return isSafeIndex(target_row+1,target_column+1);
                case 3:return isSafeIndex(target_row+1,target_column);
                case 4:return isSafeIndex(target_row+1,target_column-1);
                case 5:return isSafeIndex(target_row,target_column-1);
            }
        }
        function isSafeIndex(xi,yi){
            if(xi<0 || xi>=row_max){
                return null;
            }else
            if(yi<0 || yi>=column_max){
                return null;
            }else{
                if(isIndexTransfer){
                    return indexTransfer(xi,yi,column_max);
                }else{
                    return [xi,yi];
                }
            }
        }
    },
    /*计算相邻单位的算法*/
    neighborGridIndexes:function(target_row,target_column,row_max,column_max){
        var neighbor = {up:null,rup:null,rdown:null,down:null,ldown:null,lup:null};


        if( target_column%2 ==1 ){
            //上
            if(isSafeIndex(target_row-1,target_column)){
                neighbor.push([target_row-1,target_column]);
            }
            //上右
            if(isSafeIndex(target_row-1,target_column+1)){
                neighbor.push([target_row-1,target_column+1]);
            }
            //自右
            if(isSafeIndex(target_row,target_column+1)){
                neighbor.push([target_row,target_column+1]);
            }
            //下
            if(isSafeIndex(target_row+1,target_column)){
                neighbor.push([target_row+1,target_column]);
            }
            //自左
            if(isSafeIndex(target_row,target_column-1)){
                neighbor.push([target_row,target_column-1]);
            }
            //上左
            if(isSafeIndex(target_row-1,target_column-1)){
                neighbor.push([target_row-1,target_column-1]);
            }
        }else {
            //上
            if(isSafeIndex(target_row-1,target_column)){
                neighbor.push([target_row-1,target_column]);
            }
            //自右
            if(isSafeIndex(target_row,target_column+1)){
                neighbor.push([target_row,target_column+1]);
            }
            //下右
            if(isSafeIndex(target_row+1,target_column+1)){
                neighbor.push([target_row+1,target_column+1]);
            }
            //下
            if(isSafeIndex(target_row+1,target_column)){
                neighbor.push([target_row+1,target_column]);
            }
            //下左
            if(isSafeIndex(target_row+1,target_column-1)){
                neighbor.push([target_row+1,target_column-1]);
            }
            //自左
            if(isSafeIndex(target_row,target_column-1)){
                neighbor.push([target_row,target_column-1]);
            }
        }
        return neighbor;

        function isSafeIndex(xi,yi){
            if(xi<0 || xi>=row_max){
                neighbor.push(null);
                return false;
            }else
            if(yi<0 || yi>=column_max){
                neighbor.push(null);
                return false;
            }else
                return true;
        }
    },
    getDataByXY:function getDataByXY(e){
        if(this.touchDelegate){
            var index = this.touchDelegate.getIndex(e);
            if(index >=0 && index < this.data.length){
                return this.data[index];
            }
        }
    },
    /**
     * 使用此方法需要准备一个层用来预绘并获得所有定点获得值
     */
    measure:function measure(row_count,column_count){
        var cX = this.canvasWidth / 2;
        var cY = this.canvasHeight / 2;

        var temp_length = 0;
        if(this.canvasWidth && this.canvasHeight){
            temp_length = Math.round((this.canvasHeight*4)/(row_count*5))*3/5;
            var another = Math.round((this.canvasWidth*4)/(column_count*5))*3/5;
            if(another < temp_length){
                temp_length = another;
            }
        }
        if(temp_length){
            this.initPaint(null,true,row_count,column_count,temp_length,0,0);
            this.gridWidth = this.data[this.data.length-1][2].x - this.data[0][5].x;
            this.gridHeight = this.data[this.data.length-1][3].y - this.data[0][0].y;
            //计算偏移量
            this.xoffset = cX - this.gridWidth/2;
            this.yoffset = cY - this.gridHeight/2;
        }
        return temp_length;
    }
}



