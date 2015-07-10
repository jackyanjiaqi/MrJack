/**
 * Created by jackyanjiaqi on 15-6-20.
 */
LevelEditor = {};

_l = LevelEditor;

//场景配置 此为全局设置 在载入场景之前完成
_l.scene = {
    TextView:TextViewTestScene,
    Effect:EffectManagerTestScene,
    Indicator:IndicatorTestScene,
    Loading:LoadingScene,
    Story:StoryBoardMultipleScene,
    Main:GameBoardInteractScene,
    GameMain:GameMainScene,
    LevelResourceTest:LevelResourcePreloadScene,
    BGGridTest:BGGridTouchableScene,
    MissionSelect:MissionSelectScene,
    IndicatorManagerTest:IndicatorManagerTestScene
};

_l.level = [
    {
        name:'IndicatorManagerTest'
    },
    {
        //第一个场景是开始界面
        name:'Loading'
    },
    {
        //任务选择界面
        name:'MissionSelect',
        resources: {
            img: {
                spiderman : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                captain : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                thunderman : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                arrowman : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                }
            }
        },
        columnNum:5,
        keepOrientation:true,
        sceneMap://关卡选择界面
            [
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0
            ],
        //此界面建立GameMain界面的入口
        //初始化只有一个英雄哦
        nextLevel:{
            thunderman1:{
                name:'thunderman1',
                coordinate:[0,0],
                pic:['thunderman'],
                launch:{name:'GameMain',index:0},//该处是一个查询条件对象
                des:['[教学第一关]:雷神不雷人 ^o^Y','双击空白区域结束自己的回合','将雷神安全送到对岸的任一方块','并结束本方回合即可获胜']
            }
        }
    },
    {
        name:'BGGridTest',
        columnNum:5,
        keepOrientation:true,
        sceneMap://关卡选择界面
            [
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0,
                0,0,0,0,0
            ]
    },
    {
        name:'TextView'
    },
    {
        name:'LevelResourceTest',
        resources:{
            img:{
                test:'img/loadingtest.jpg'
            }
        }
    },
    {
        //跳转界面 用于显示游戏结果和提供跳转到其他界面
        name:'JumpScene'
    },
    {
        name:'GameMain',//启用的场景配置
        index:0,
        //这里配置资源文件
        resources:{
            js:{},
            img:{
                //敌人图片
                arrowman_angry_bg : 'img/face/arrowman_angry_bg.png',
                captain_angry_bg : 'img/face/captain_angry_bg.png',
                spiderman_angry_bg : 'img/face/spiderman_angry_bg.png',
                thunderman_angry_bg : 'img/face/thunderman_angry_bg.png',
                //角色图片
                bg : {
                    autoJoin:true,//自动组装
                    configPrefix:true,//配置前缀 形如/landscape/high
                    suffix:'.jpg',
                    data:['arrowman','captain','spiderman','thunderman']
                },
                spiderman : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                captain : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                thunderman : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                arrowman : {
                    autoJoin:true,
                    prefix:'face',
                    suffix:'.png',
                    data:['glad','angry','sad','normal','confused']
                },
                //效果图片
                AimEffect : "img/target_mask.png",
                WebEffect : "img/spidernet_mask.png",
                ShieldEffect : "img/shield.png"
            }
        },
        columnNum:7,
        sceneMap://关卡1
            [
                0           ,{n:3,u:'me'},{n:101,u:'ai'},{n:101,u:'ai'},0,0,1,
                {n:1,u:'me'},0           ,{n:101,u:'ai'},0             ,0,0,1,
                {n:4,u:'me',id:1},{n:2,u:'me'},0             ,{n:103,u:'ai'},{n:102,u:'ai'},0,1
            ],
            //[
            //    0           ,{n:3,u:'me'},{n:3,u:'me'},{n:3,u:'me'},0,0,0,
            //    {n:1,u:'me'},0           ,{n:101,u:'ai'},0             ,{n:3,u:'me'},0,1,
            //    0,{n:2,u:'me'},{n:1,u:'me'},{n:3,u:'me'},0,0,{n:4,u:'me',id:1}
            //],
            //[
            //    0           ,{n:101,u:'ai'},{n:3,u:'me'},0,{n:101,u:'ai'},0,{n:101,u:'ai'},
            //    {n:101,u:'ai'},0           ,{n:1,u:'me',id:1},{n:2,u:'me'},0,{n:101,u:'ai'},{n:101,u:'ai'},
            //    {n:101,u:'ai'},{n:101,u:'ai'},{n:4,u:'me'},0,0,{n:101,u:'ai'},0
            //],
        goals:{
            //指定回合内到达
            fail:{
                USER_TURN_MAX:10,
                GOAL_DIED:1
            },
            victory:{
                GOAL_USER_TOUCH:1
            }
        },
        //第一关解锁的关卡
        nextLevel:{
            spiderman2:{
                name:'spiderman2',//关卡名称
                coordinate:[0,1],//关卡坐标
                pic:['spiderman','key','confused'],
                launch:{name:'GameMain',index:1},//该处是一个查询条件对象
                des:['[教学第二关]:限制大于消灭','双击空白区域结束自己的回合','蜘蛛侠初始位置不被敌人占领','坚持5个回合并在本方回合结束时即可获胜']
            },
            arrowman1:{
                name:'arrowman1',
                coordinate:[1,0],
                pic:['arrowman','key','sad'],
                launch:{name:'GameMain',index:2},
                des:['[教学第三关]:以少胜多靠走位','双击空白区域结束自己的回合','绿箭侠不死且坚持10个回合','全歼对手也可以赢的哦']
            }
        },
        //这里配置舞台场景 和 Stage的配置相同
        stage:{
            //角色配置文件
            roles:{
                detail:{
                    1:{
                        roleNum:1,
                        name:'绿箭侠',
                        action:ArrowManAction,//配置行动
                        effect:[AimEffect]//配置效果
                    },
                    2:{
                        roleNum:2,
                        name:'美国队长',
                        action:AmericanCaptainAction,
                        effect:[ShieldEffect]
                    },
                    3:{
                        roleNum:3,
                        name:'蜘蛛侠',
                        action:SpiderManAction,
                        actionParams:{
                            attackMax:2,
                            jumpMax:2
                        },
                        effect:[WebEffect]
                    },
                    4:{
                        roleNum:4,
                        name:'雷神',
                        action:ThunderManAction,
                        effect:[HammerEffect]
                    },
                    5:{
                        roleNum:5,
                        name:'测试1',
                        action:MultipleStepBaseAction,
                        actionParams:{
                            setMaxStep:2
                        }
                    },
                    6:{
                        roleNum:6,
                        name:'测试2',
                        action:BaseHeroAction,
                        actionParams:{
                            postMaxTime:3
                        }
                    },
                    103:{
                        roleNum:103,
                        name:'敌方蜘蛛侠',
                        action:SpiderManAction,
                        actionParams:{
                            attackMax:1,
                            jumpMax:2,
                            rolePic:'spiderman_angry_bg',
                            ai:BaseAI
                        }
                    },
                    104:{
                        roleNum:104,
                        name:'敌方雷神',
                        action:ThunderManAction,
                        actionParams:{
                            postMaxStep:2,
                            rolePic:'thunderman_angry_bg',
                            ai:AttackFirstAI
                        }
                    },
                    102:{
                        roleNum:102,
                        name:'敌方队长',
                        action:AmericanCaptainAction,
                        actionParams:{
                            rolePic:'captain_angry_bg'
                        }
                    },
                    101:{
                        roleNum:101,
                        name:'敌方绿箭侠',
                        action:ArrowManAction,
                        actionParams:{
                            rolePic:'arrowman_angry_bg',
                            ai:AttackFirstAI
                        }
                    }
                }
            }
        }
    },
    {
        name:'GameMain',//启用的场景配置
        index:1,
        //这里配置资源文件
        resources:{
            link:{name:'GameMain',index:0}
        },
        columnNum:7,
        sceneMap://关卡1
            [
                {n:104,u:'ai',id:4},0,0,0,0,0,{n:104,u:'ai',id:4},
                0                  ,0,0,{n:3,u:'me',id:1,goalid:4},0,0,0,
                {n:104,u:'ai',id:4},0,0,0,0,0,{n:104,u:'ai',id:4}
            ],
        goals:{
            //5回合不让敌人到达你的起始置
            fail:{
                GOAL_DIED:1,
                GOAL_USER_TOUCH:4
            },
            victory:{
                USER_TURN_MAX:5//测试
            }
        },
        //第二关解锁的关卡
        nextLevel:{
            captain1:{
                name:'captain1',//关卡名称
                coordinate:[2,0],//关卡坐标
                pic:['captain','key','glad'],
                launch:{name:'GameMain',index:3},//该处是一个查询条件对象
                des:['关卡尚在开放中...']
            },
            arrowman2:{
                name:'arrowman2',
                coordinate:[1,1],
                pic:['arrowman','key','angry'],
                launch:{name:'GameMain',index:4},
                des:['关卡尚在开发中...']
            }
        },
        stage:{
            link:{name:'GameMain',index:0}
        }
    },
    {
        name:'GameMain',//启用的场景配置
        index:2,
        //这里配置资源文件
        resources:{
            link:{name:'GameMain',index:0}
        },
        columnNum:7,
        sceneMap://关卡1
            [
                0           ,{n:101,u:'ai'},{n:3,u:'me'},{n:2,u:'me'},{n:101,u:'ai'},0,{n:101,u:'ai'},
                {n:101,u:'ai'},0           ,{n:1,u:'me',id:1},{n:101,u:'ai'},{n:101,u:'ai'},0,0,
                {n:101,u:'ai'},{n:101,u:'ai'},{n:4,u:'me'},{n:101,u:'ai'},0,0,0
            ],
        goals:{
            //5回合内生存 或消灭所有敌方
            fail:{
                USER_TURN_MAX:5,
                GOAL_DIED:1
            },
            victory:{
                UNITED:{
                    USER_TURN_MAX:10,//测试用
                    GOAL_KEEP_ALIVE:1
                },
                ENEMY_OUT:true
            }
        },
        //第三关解锁的关卡
        nextLevel:{
            captain1:{
                name:'captain1',//关卡名称
                coordinate:[2,1],//关卡坐标
                pic:['captain','key','sad'],
                launch:{name:'GameMain',index:5},//该处是一个查询条件对象
                des:['关卡尚在开发中...']
            },
            thunderman1:{
                name:'thunderman1',
                coordinate:[3,0],
                pic:['thunderman','key','normal'],
                launch:{name:'GameMain',index:6},
                des:['关卡尚在开发中...']
            }
        },
        stage:{
            link:{name:'GameMain',index:0}
        }
    }
]