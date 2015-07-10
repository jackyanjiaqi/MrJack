/**
 * Created by jackyanjiaqi on 15-5-21.
 */
;(function(){
    var canvas;
    var ctx;
    var img;

    //记录用于生长的grow点坐标
    var resource = {0:[0,0,151,170],1:[151,0,151,170],2:[302,0,151,170],
                    3:[0,170,151,170],4:[151,170,151,170],5:[302,170,151,170]};

    window.onload = init;

    //function preInit(){
    //    var img = new Image();
    //    img.onload = function(){
    //        //document.body.appendChild(img);
    //        //img.setAttribute("class","loadingTest");
    //        var textNode = document.createTextNode("wo shi da sha gua");
    //        textNode.setAttribute("class","loadingText");
    //        document.body.appendChild(textNode);
    //    }
    //    img.src = "img/title.jpg";
    //}

    function init(){
        Logger.log('init','main');
        canvas = document.getElementById("mainCanvas");
        ctx = canvas.getContext("2d");
        //初始化
        initFullScreenCanvas(canvas);
    }

    function initFullScreenCanvas(canvas){
        resizeCanvas(canvas);
        window.addEventListener("resize",function(){
            resizeCanvas(canvas);
        });
    }

    function resizeCanvas(canvas){
        Logger.log('resizeCanvas','main');
        //获得canvas
        canvas.width = BGGridManager.canvasWidth = document.width || document.body.clientWidth;
        canvas.height = BGGridManager.canvasHeight = document.height || document.body.clientHeight;
        //配置横竖屏
        if(canvas.width < canvas.height){
            Stage.screen.orientation = 'portrait';
        }else{
            Stage.screen.orientation = 'landscape';
        }
        RenderLayerManager.canvasWidth = canvas.width;
        RenderLayerManager.canvasHeight = canvas.height;
        RenderProxy._ctx = ctx;
        Stage.width = canvas.width;
        Stage.height = canvas.height;

        Stage.canvas = canvas;
        Stage.ctx = ctx;

        gameLoop();
        gameConfig();

        //添加性能测试工具
        //var stats = new xStats(
        //    {"height":100,"width":200});
        //document.body.appendChild(stats.element);
        //配置log
        Logger.debugSwitch(false).
            tagOff('action');
    }

    function gameConfig(){
        //从LevelEditor载入场景信息并从Stage启动场景 载入是有顺序的
        Stage.configMap = LevelEditor.scene;
        //从编辑器第一个加载
        Stage.loadLevel(LevelEditor.level[0]);
        //当以配置列表中的名称作为场景名称时将启用相应的编辑器预设运行场景
        //角色配置
        //Stage.roles = {
        //    detail:{
        //        1:{
        //            roleNum:1,
        //            name:'绿箭侠',
        //            action:ArrowManAction,//配置行动
        //            effect:[AimEffect]//配置效果
        //        },
        //        2:{
        //            roleNum:2,
        //            name:'美国队长',
        //            action:AmericanCaptainAction,
        //            effect:[ShieldEffect]
        //        },
        //        3:{
        //            roleNum:3,
        //            name:'蜘蛛侠',
        //            action:SpiderManAction,
        //            actionParams:{
        //                attackMax:3,
        //                jumpMax:3
        //            },
        //            effect:[WebEffect]
        //        },
        //        4:{
        //            roleNum:4,
        //            name:'雷神',
        //            action:ThunderManAction,
        //            effect:[HammerEffect]
        //        },
        //        5:{
        //            roleNum:5,
        //            name:'测试1',
        //            action:MultipleStepBaseAction,
        //            actionParams:{
        //                setMaxStep:2
        //            }
        //        },
        //        6:{
        //            roleNum:6,
        //            name:'测试2',
        //            action:BaseHeroAction,
        //            actionParams:{
        //                postMaxTime:3
        //            }
        //        },
        //        103:{
        //            roleNum:103,
        //            name:'敌方蜘蛛侠',
        //            action:SpiderManAction,
        //            actionParams:{
        //                attackMax:3,
        //                jumpMax:3,
        //                rolePic:'spiderman_angry_bg',
        //                ai:BaseAI
        //            }
        //        },
        //        104:{
        //            roleNum:104,
        //            name:'敌方雷神',
        //            action:ThunderManTransferedAction,
        //            actionParams:{
        //                setMaxStep:2,
        //                transferMax:2,
        //                rolePic:'thunderman_angry_bg',
        //                ai:BaseAI
        //            }
        //        },
        //        102:{
        //            roleNum:102,
        //            name:'敌方队长',
        //            action:AmericanCaptainAction,
        //            actionParams:{
        //                rolePic:'captain_angry_bg'
        //            }
        //        },
        //        101:{
        //            roleNum:101,
        //            name:'敌方绿箭侠',
        //            action:ArrowManAction,
        //            actionParams:{
        //                rolePic:'arrowman_angry_bg'
        //            }
        //        }
        //
        //    }
        //};
        //开启StoryBoardMultipleSceneConfig的生命周期
        //RenderLayerManager
        //    .nameScene('Loading');



            //.switchScene()
            //.nameScene("Indicator");

        ////40s后开启GameBoardInteractScene的生命周期
        //setTimeout(function(){
        //    RenderLayerManager
        //        .switchScene()
        //        .nameScene('Main');
        //},2000);
        //
        ////300s后重新开启StoryBoardMultipleSceneConfig
        //setTimeout(function(){
        //    RenderLayerManager
        //        .switchScene('Story');
        //},3000);
    }
        function initGame(){
            Logger.log('initGame','main');

            //配置基本绘图参数
            RenderProxy._maplinewidth = 5;
            RenderProxy._strokeColor = 'white';

            //动画场景测试
            animationSceneStart();

            //bgClear();

            //测试EffectManager的渲染功能
            //testEffectManager();

            //RenderLayerManager
            //    .renderSingleLayer(ctx,"BGGrid")
            //    .renderSingleLayer(ctx,"GameRole");
                //.renderSingleLayer(ctx,"Effect");

            //BGGridManager.initPaint(ctx,[],arguments[1],arguments[0],_maplength);
            //createRandomIndicators();
            //游戏循环
            //gameLoop();

        //BGGridManager.xoffset = Math.round(canvas.width/2) - bggridObj.cx;
        //BGGridManager.yoffset = Math.round(canvas.height/2) - bggridObj.cy;
        //BGGridManager.paint();
        //var x = Math.ceil(bggridObj.length/2)-3;
        //var y = Math.ceil(bggridObj[0].length/2)+1;
        //
        //var neighbor = BGGridManager.neighborGridIndexes(
        //    x,
        //    y,
        //    bggridObj.length,bggridObj[0].length);
        //
        //for(var i=0;i<6;i++){
        //    var obj = neighbor[i];
        //    if(obj){
        //        alert("x:"+obj[0]+" y:"+obj[1]);
        //        RenderProxy.strokeMapInit(
        //            'rgba(143,143,143,1)',ctx,0,
        //            bggridObj[obj[0]][obj[1]][0].x,
        //            bggridObj[obj[0]][obj[1]][0].y
        //        )
        //    }
        //}
        //RenderProxy.paintMapInit(img,
        //    'rgb(143,143,0)',ctx,0,
        //    bggridObj[x][y][0].x,
        //    bggridObj[x][y][0].y
        //)
    }

    function gameLoop(){
        if(isTouchDevice()){
            canvas.addEventListener('touchstart',onTouchOrMouseStart,false);
            canvas.addEventListener('touchcancel',onTouchOrMouseEnd,false);
            canvas.addEventListener('touchend',onTouchOrMouseEnd,false);
            canvas.addEventListener('touchmove',onTouchOrMouseMove,false);
        }else{
            canvas.addEventListener('mousedown',onTouchOrMouseStart,false);
            canvas.addEventListener('mouseup',onTouchOrMouseEnd,false);
            canvas.addEventListener('mousemove',onTouchOrMouseMove,false);
        }

        //canvas.addEventListener('mousemove',function(e){
        //    if(isMouseDown){
        //        //moveBG(init_xoffset + e.x - init_x,init_yoffset + e.y - init_y);
        //        bgClear();
        //        BGGridManager.paint(paintFunc);
        //    }else{
        //        bgClear();
        //        BGGridManager.paint(paintFunc);
        //        //UserInterface.obtainMove(e);
        //        //if(IndicatorManager.indicators.length!=0){
        //        //    var indicator = IndicatorManager.indicators[0];
        //        //    indicator.x = e.x;
        //        //    indicator.y = e.y;
        //        //    indicator.paint();
        //        //}
        //    }
        //});
        //
        //canvas.addEventListener('mousedown',function (e){
        //    isMouseDown = true;
        //    init_x = e.x;
        //    init_y = e.y;
        //    init_xoffset = BGGridManager.xoffset;
        //    init_yoffset = BGGridManager.yoffset;
        //
        //    //IndicatorManager.indicators[0].vision = Indicator.VISION_INVISIBLE;
        //    //UserInterface.obtainUp()
        //});
        //
        //canvas.addEventListener('mouseup',function (e){
        //    isMouseDown = false;
        //    bgClear();
        //    BGGridManager.initPaint(ctx,BGGridManager.data);
        //
        //    //IndicatorManager.indicators[0].vision = Indicator.VISION_VISIBLE;
        //    //UserInterface.obtainUp(e);
        //});
    }

    function envelop(e){
        var x = e.targetTouches && e.targetTouches[0] ? e.targetTouches[0].pageX: (e.changedTouches && e.changedTouches[0]? e.changedTouches[0].pageX: e.x);
        var y = e.targetTouches && e.targetTouches[0] ? e.targetTouches[0].pageY: (e.changedTouches && e.changedTouches[0]? e.changedTouches[0].pageY: e.y);
        return {x:x, y:y, e:e}
    }

    function onTouchOrMouseStart(e){
        var ev = envelop(e);
        if(Stage.currentConfig){
            Stage.currentConfig.onTouchOrMouseStart(ev);
        }
    }

    function onTouchOrMouseEnd(e){
        var ev = envelop(e);
        if(Stage.currentConfig){
            Stage.currentConfig.onTouchOrMouseEnd(ev);
        }
    }

    function onTouchOrMouseMove(e){
        var ev = envelop(e);
        if(Stage.currentConfig){
            Stage.currentConfig.onTouchOrMouseMove(ev);
        }
    }

    function setScenes(){
        RenderLayerManager.createLayer()
    }

    /**
     * 清屏
     */
    function bgClear(){
        ctx.fillStyle = Stage.theme.bgStyle;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    function moveBG(offsetx,offsety){
        Logger.log('xoff:'+BGGridManager.xoffset+"\nyoff:"+BGGridManager.yoffset);
        BGGridManager.xoffset = offsetx;
        BGGridManager.yoffset = offsety;
    }

    function zoomIn(){
        _maplength += 5;
        initGame();
    }

    function zoomOut(){
        _maplength -= 5;
        initGame();
    }

    function turnOnce(){
        var imagedata = mask_ctx.getImageData(e.x, e.y, 1, 1);
        var index = (imagedata.data[0]<<16 | imagedata.data[1]<<8 | imagedata.data[2]) - 1;
    }

    function testPics(){
        //测试图片效果
        RenderLayerManager.createLayer("test_pics",0)
            .paintMapInit(
                0,100,100,_maplength,5,null,null,null,imageManager.get("hero0"))
            .paintMapInit(
                0,400,100,_maplength,5,null,null,null,imageManager.get("hero1"))
            .paintMapInit(
                0,100,300,_maplength,5,null,null,null,imageManager.get("hero2"))
            .paintMapInit(
                0,400,300,_maplength,5,null,null,null,imageManager.get("hero3"))
            .paintMapInit(
                0,100,500,_maplength,5,null,null,null,imageManager.get("hero4"))
            .paintMapInit(
                0,400,500,_maplength,5,null,null,null,imageManager.get("hero5"))
            .renderLayers(ctx,null).cancelSelect();
    }


})();

