
let currentLevel;

const devToolsEnabled = true;

let Camera = {
    real : {
        x : 0,
        y : 0
    },

    get x(){
        return Math.round(Camera.real.x);
    },
    get y(){
        return Math.round(Camera.real.y);
    },

    zoom : 1,
}

let ControlSchemes = {
    "Player1" : {
        "up" : "KeyW",
        "down" : "KeyL",
        "left" : "KeyA",
        "right" : "KeyD",

        "interact" : "Space",
        "modifier" : "LeftShift"
    },
    
    "Player2" : {
        "up" : "ArrowUp",
        "down" : "ArrowDown",
        "left" : "ArrowLeft",
        "right" : "ArrowRight",

        "interact" : "Space",
        "modifier" : "LeftShift"
    }
}

const SpriteAtlas = {
    "player" : {
        "idle" : [
            new Region(0, 19 * 0),
            new Region(0, 19 * 1),
            new Region(0, 19 * 2),
            new Region(0, 19 * 3)
        ],

        "idle2" : [
            new Region(19, 0 * 19),
            new Region(19, 1 * 19),
            new Region(19, 2 * 19),
            new Region(19, 3 * 19),
            new Region(19, 4 * 19),
            new Region(19, 5 * 19),
            new Region(19, 4 * 19),
            new Region(19, 5 * 19),
            new Region(19, 4 * 19),
            new Region(19, 3 * 19),
            new Region(19, 2 * 19),
            new Region(19, 1 * 19),
            new Region(19, 0 * 19),
        ],

        "run" : [
            new Region(57, 19 * 0),
            new Region(57, 19 * 1),
            new Region(57, 19 * 2),
            new Region(57, 19 * 3)
        ]
    }
}

let TileAtlas = {
    "air" : {"region" : new Region(0, 0, 0, 0), "solid" : false},
    "hardAir" : {"region" : new Region(0, 0, 0, 0), "solid" : true},

    "lab" : {
        "other" : {
            "paleWood" : { "region" : new Region(76, 19), "solid" : true }
        },
        "wire" : {
            "red_wire" : { "region" : new Region(76, 38), "solid" : true }
        },
        "conveyor" : {
            "region" : [
                new Region(76, 57, 19, 19),
                new Region(76, 76, 19, 19),
                new Region(76, 95, 19, 19),
            ],

            "solid" : true,

            "speed" : 0.01
        },

        "purpleLabWindow" : new basic9Slice(95, 114, false, 19, 19, 209, 133),
        "purpleOvergrownthEdge" : new basic9Slice(152, 114, false, 19, 19, 209, 133),

        "purpleGrass" : {
            "topLeft" : {
                "region" : new Region(133, 0, 19, 19),
                "solid" : true
            },
            "top" : {
                "region" : new Region(152, 0, 19, 19),
                "solid" : true
            },
            "topRight" : {
                "region" : new Region(171, 0, 19, 19),
                "solid" : true
            },

            "left" : {
                "region" : new Region(133, 19, 19, 19),
                "solid" : true
            },
            "right" : {
                "region" : new Region(171, 19, 19, 19),
                "solid" : true
            },

            "bottomLeft" : {
                "region" : new Region(133, 38, 19, 19),
                "solid" : true
            },
            "bottom" : {
                "region" : new Region(152, 38, 19, 19),
                "solid" : true
            },
            "bottomRight" : {
                "region" : new Region(171, 38, 19, 19),
                "solid" : true
            },



            "innerTopLeft" : {
                "region" : new Region(133, 57, 19, 19),
                "solid" : true
            },
            "innerTopRight" : {
                "region" : new Region(152, 57, 19, 19),
                "solid" : true
            },
            "innerBottomLeft" : {
                "region" : new Region(133, 76, 19, 19),
                "solid" : true
            },
            "innerBottomRight" : {
                "region" : new Region(152, 76, 19, 19),
                "solid" : true
            }
        },

        "purple" : {
            "region" : [
                new Region(114, 76, 19, 19),
                new Region(114, 95, 19, 19),
                new Region(95, 95, 19, 19),
            ],

            "solid" : true,
            "speed" : 0.001
        },

        "circuitBoard" : {
            "region" : new Region(133, 95, 19, 19),
            "solid" : true
        },

        "overgrownCircuitBoard" : {
            "region" : new Region(171, 95, 19, 19),
            "solid" : true
        },

        "overgrownCircuitBoardMiddle" : {
            "region" : new Region(152, 95, 19, 19),
            "solid" : true
        },

        "grating" : {
            "region" : new Region(152, 171, 19, 19),
            "solid" : true
        },

        "labDesks" : {
            "empty" : {
                "region" : new Region( 95, 190 ),
                "solid" : false
            },
            "computer1" : {
                "region" : new Region( 114, 187, 19, 22, 0, -3 ),
                "solid" : false
            },
            "computer2" : {
                "region" : new Region( 133, 183, 19, 26, 0, -7 ),
                "solid" : false
            },
            "keyboard" : {
                "region" : new Region( 152, 190 ),
            }
        }
    },

    "background": {
        "leakyConcrete" : { 
            "region" : [
                new Region(95, 0, 19, 19),
                new Region(95, 19 * 1, 19, 19),
                new Region(95, 19 * 2, 19, 19),
                new Region(95, 19 * 3, 19, 19),
                new Region(95, 19 * 4, 19, 19)
            ],

            "solid" : false,
            "speed" : 0.00075,
        }
    },

    "terminal" : {
        "term1" : new Region(114, 19)
    },

    "pickups" : {
        "powerup" : {
            "region" : [
                new Region(209, 95, 19 * 2, 19 * 2, -19,  0 -19),
                new Region(209, 95, 19 * 2, 19 * 2, -19, -2 -19),
                new Region(209, 95, 19 * 2, 19 * 2, -19, -3 -19),
                new Region(209, 95, 19 * 2, 19 * 2, -19, -4 -19),
                new Region(209, 95, 19 * 2, 19 * 2, -19, -3 -19),
                new Region(209, 95, 19 * 2, 19 * 2, -19, -2 -19),
            ],

            "speed" : 0.003,
            "solid" : false
        }
    }
}

const ParticleAtlas = {
    "terminalParticles" : {
        "blue" : new Region(131, 17, 2, 2, -1, -1)
    },

    "effects" : {
        "green" : new Region(129, 17, 2, 2, -1, -1),
        "purple" : new Region(127, 17, 2, 2, -1, -1)
    }
}

const keySets = {
    "OvergrownLabSet" : { // For Purple Overgrown Lab Related Tiles and bindings
        " " : TileAtlas.air,
        "_" : TileAtlas.hardAir,

        "1" : TileAtlas.lab.purpleGrass.topLeft,
        "2" : TileAtlas.lab.purpleGrass.top,
        "3" : TileAtlas.lab.purpleGrass.topRight,
        "4" : TileAtlas.lab.purpleGrass.right,
        "5" : TileAtlas.lab.purpleGrass.bottomRight,
        "6" : TileAtlas.lab.purpleGrass.bottom,
        "7" : TileAtlas.lab.purpleGrass.bottomLeft,
        "8" : TileAtlas.lab.purpleGrass.left,
        "!" : TileAtlas.lab.purpleGrass.innerTopLeft,
        "#" : TileAtlas.lab.purpleGrass.innerTopRight,
        "&" : TileAtlas.lab.purpleGrass.innerBottomLeft,
        "%" : TileAtlas.lab.purpleGrass.innerBottomRight,
        "@" : TileAtlas.lab.overgrownCircuitBoard,
        "Q" : TileAtlas.lab.overgrownCircuitBoardMiddle,
        
        "0" : TileAtlas.lab.purple,

        "q" : TileAtlas.lab.purpleLabWindow.topLeft,
        "w" : TileAtlas.lab.purpleLabWindow.top,
        "e" : TileAtlas.lab.purpleLabWindow.topRight,
        "a" : TileAtlas.lab.purpleLabWindow.left,
        //just use air ( )
        "d" : TileAtlas.lab.purpleLabWindow.right,
        "z" : TileAtlas.lab.purpleLabWindow.bottomLeft,
        "x" : TileAtlas.lab.purpleLabWindow.bottom,
        "c" : TileAtlas.lab.purpleLabWindow.bottomRight,

        // background purple growth edge
        "y" : TileAtlas.lab.purpleOvergrownthEdge.topLeft,
        "u" : TileAtlas.lab.purpleOvergrownthEdge.top,
        "i" : TileAtlas.lab.purpleOvergrownthEdge.topRight,
        "h" : TileAtlas.lab.purpleOvergrownthEdge.left,
        "j" : { // center
            "region" : [
                new Region(114, 76, 19, 19),
                new Region(114, 95, 19, 19),
                new Region(95, 95, 19, 19),
            ],"solid" : false, "speed" : 0.001},
        "k" : TileAtlas.lab.purpleOvergrownthEdge.right,
        "n" : TileAtlas.lab.purpleOvergrownthEdge.bottomLeft,
        "m" : TileAtlas.lab.purpleOvergrownthEdge.bottom,
        "," : TileAtlas.lab.purpleOvergrownthEdge.bottomRight,

        "r" : TileAtlas.lab.purpleOvergrownthEdge.innerTopLeft,
        "t" : TileAtlas.lab.purpleOvergrownthEdge.innerTopRight,
        "f" : TileAtlas.lab.purpleOvergrownthEdge.innerBottomLeft,
        "g" : TileAtlas.lab.purpleOvergrownthEdge.innerBottomRight,

        "o" : TileAtlas.lab.labDesks.empty,
        "p" : TileAtlas.lab.labDesks.computer1,
        "[" : TileAtlas.lab.labDesks.computer2,
        "]" : TileAtlas.lab.labDesks.keyboard,
        "+" : TileAtlas.lab.grating
    }
}

const AreaAtlas = {
    "LabArea" : {
        "WakeUp" : {
            "key" : {
                "1" : TileAtlas.lab.purpleGrass.topLeft,
                "2" : TileAtlas.lab.purpleGrass.top,
                "3" : TileAtlas.lab.purpleGrass.topRight,
                "4" : TileAtlas.lab.purpleGrass.right,
                "5" : TileAtlas.lab.purpleGrass.bottomRight,
                "6" : TileAtlas.lab.purpleGrass.bottom,
                "7" : TileAtlas.lab.purpleGrass.bottomLeft,
                "8" : TileAtlas.lab.purpleGrass.left,
                "#" : TileAtlas.lab.purple,
                "@" : TileAtlas.lab.other.paleWood,
                " " : TileAtlas.air,
                "^" : TileAtlas.lab.conveyor,
                "<" : TileAtlas.background.leakyConcrete
            },

            "apple" : [
                "123",
                "8_4",
                "765"
            ],

            "layout"  : [
                '#66666666666666#',
                '4              8',
                '4              8',
                '4        1223  8',
                '4    2   7665  8',
                '4   15         8',
                '4       2   122#',
                '@23     #   8@@#',
                '@@4  ^^^#^ 266##',
                '@@@3    <#    8#',
                '@@@#2   <#^^^ 8#',
                '@@@4          8#',
                '@@@#2222222222##',
            ],

            "entities" : {
                "ENTER" : new Door
            }
        },

        "home" : {
            "key" : {
                " " : TileAtlas.air,
                "_" : TileAtlas.hardAir,

                "1" : TileAtlas.lab.purpleGrass.topLeft,
                "2" : TileAtlas.lab.purpleGrass.top,
                "3" : TileAtlas.lab.purpleGrass.topRight,
                "4" : TileAtlas.lab.purpleGrass.right,
                "5" : TileAtlas.lab.purpleGrass.bottomRight,
                "6" : TileAtlas.lab.purpleGrass.bottom,
                "7" : TileAtlas.lab.purpleGrass.bottomLeft,
                "8" : TileAtlas.lab.purpleGrass.left,
                "!" : TileAtlas.lab.purpleGrass.innerTopLeft,
                "#" : TileAtlas.lab.purpleGrass.innerTopRight,
                "%" : TileAtlas.lab.purpleGrass.innerBottomRight,
                "&" : TileAtlas.lab.purpleGrass.innerBottomLeft,
                
                "0" : TileAtlas.lab.purple,
            },

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],

            "layout" : [
                "______________",
                '_            _',
                "_            8",
                "4            8",
                "4            8",
                "4      122222%",
                "&222222%000000"
            ],

            "entities" : [

            ]
        },

        "ParcoreDarcore" : {
            "key" : {
                "#" : TileAtlas.lab.wire.red_wire,
                "@" : TileAtlas.lab.other.paleWood,
                " " : TileAtlas.air
            },
            "layout" : [
                '################',
                '#              #',
                '#####          #',
                '#        ###   #',
                '#   #@         #',
                '#              #',
                '#        @@@   #',
                '#              #',
                '#######        #',
                '@@@@@@#        #',
                '@@@@@@#  ###   #',
                '@@@@@@##########',
            ],

            "entities" : [
                new Terminal(19 * 10, 19 * 1, TileAtlas.terminal.term1, 2, "#fff", "#000", 95, 95),
                //new AccelerationVolume(270, 90, 0, -0.01),
                new AccelerationVolume(0, 0, 0, -0.01, (thing2test) => { return BasicAreaChecks.inRect(266, 38, 19, 19 * 9, thing2test.x, thing2test.y, 10, 5 * 19); } ),
                new AccelerationVolume(0, 0, -0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(228, 19, 19 * 3, 19, thing2test.x, thing2test.y, 10, 5 * 19); } ),
                //new ImpulseVolume(180, 180, 10, 0)
            ]
        },

        "Room1" : {
            "key" : {
                "#" : TileAtlas.lab.wire.red_wire,
                "@" : TileAtlas.lab.other.paleWood,
                " " : TileAtlas.air
            },
            "layout" : [
                '######################',
                '#                    #',
                '#                    #',
                '#       ##  #        #',
                '#           #    #####',
                '#  ####              #',
                '#                    #',
                '#         #####      #',
                '########             #',
                '#               ######',
                '#               ######',
                '######################',
            ],

            "entities" : [
                new Terminal(19 * 12, 19 * 5, TileAtlas.terminal.term1, 2, "#fff", "#000", 95, 95)
            ]
        },

        "PipeDream" : {
            "key" : {
                " " : TileAtlas.air,
                "_" : TileAtlas.hardAir,

                "1" : TileAtlas.lab.purpleGrass.topLeft,
                "2" : TileAtlas.lab.purpleGrass.top,
                "3" : TileAtlas.lab.purpleGrass.topRight,
                "4" : TileAtlas.lab.purpleGrass.right,
                "5" : TileAtlas.lab.purpleGrass.bottomRight,
                "6" : TileAtlas.lab.purpleGrass.bottom,
                "7" : TileAtlas.lab.purpleGrass.bottomLeft,
                "8" : TileAtlas.lab.purpleGrass.left,
                "!" : TileAtlas.lab.purpleGrass.innerTopLeft,
                "#" : TileAtlas.lab.purpleGrass.innerTopRight,
                "%" : TileAtlas.lab.purpleGrass.innerBottomRight,
                "&" : TileAtlas.lab.purpleGrass.innerBottomLeft,
                
                "0" : TileAtlas.lab.purple,
            },

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],

            "layout" : [
                '!66666666666666#00!666#!666#',
                '4              7665   84   8',
                '02223               0 75 0 8',
                '4        123   1223        8',
                '4   13         800&23 000  8',
                '4              80!665 000  8',
                '4        123   804         8',
                '4              804 00 000 08',
                '&222223        804 00 0   08',
                '0000004        765 00 0 0008',
                '0000004  123            0008',
                '000000&22%0&222%00000000000%',
            ],

            "entities" : [
                new Terminal(19 * 10, 19 * 1, TileAtlas.terminal.term1, 2, "#fff", "#000", 95, 95),
                //new AccelerationVolume(270, 90, 0, -0.01),
                new AccelerationVolume(0, 0, 0, -0.01, (thing2test) => { return BasicAreaChecks.inRect(266, 38, 19, 19 * 5, thing2test.x, thing2test.y, 10, 5 * 19); } ),
                new AccelerationVolume(0, 0, -0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(228, 19, 19 * 3, 19, thing2test.x, thing2test.y, 10, 5 * 19); } ),


                new PlayerModifier(342, 152, ["movementInputEnabled"], false),
                new PlayerModifier(304, 38, ["movementInputEnabled"], true),

                new AccelerationVolume(0, 0, 0, -0.01, (thing2test) => { return BasicAreaChecks.inRect(342, 133, 19 * 1, 19 * 3, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, 0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(342, 114, 19 * 3, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, 0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(418, 114, 19 * 3, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, 0.01, -0.01, (thing2test) => { return BasicAreaChecks.inRect(494, 38, 19 * 1, 19 * 5, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, -0.1, 0, (thing2test) => { return BasicAreaChecks.inRect(456, 19, 19 * 3, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, -0.1, 0, (thing2test) => { return BasicAreaChecks.inRect(418, 57, 19 * 3, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, -0.01, -0.01, (thing2test) => { return BasicAreaChecks.inRect(399, 57, 19 * 1, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, -0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(380, 57, 19 * 1, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, -0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(361, 57, 19 * 1, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                new AccelerationVolume(0, 0, -0.1, -0.01, (thing2test) => { return BasicAreaChecks.inRect(285, 38, 19 * 5, 19 * 1, thing2test.x, thing2test.y, 10, 5 * 19); }, false ),
                //new ImpulseVolume(180, 180, 10, 0)

                new SuspendedWireEntity (0, 0, 200, 125, 5),
                new SuspendedWireEntity (35, 200, 200, 125, 5),
                new HangingWireEntity(132, 12, 19*3),
                new HangingWireEntity(135, 12, 19*2.6)
            ]
        },

        "WakeUp01" : {
            "key" : keySets.OvergrownLabSet,

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],

            "layout" : [
                "000000000000000000",
                "0               00",
                "00              00",
                "00              00",
                "00              00",
                "&3              1%",
                "04              80",
                "04              80",
                "04 13i          80",
                "04u84fui        80",
                "04m8&2@@@3      80",
                "04 7666665      80",
                "04    hjk       80",
                "04    ntk       80",
                "04     n1@@@23  80",
                "04      766665  80",
                "04              80",
                "04              80",
                "04u123    12@@@@%0",
                "04j765    76666666",
                "04jfi       ntjjjj",
                "04jjk       ygjjjj",
                "0&2@@22222@@@@2222",
                "000000000000000000",
                "000000000000000000",
                "000000000000000000",
                "000000000000000000"
            ],

            "backdropEntities" : [
                new SuspendedWireEntity(190, 209, 304, 247, 19, 0.4, "#5f1585"),
                new SuspendedWireEntity(152, 285, 114, 361, 10, 0.3, "#5f1585"),
                new HangingWireEntity(114, 209, 19*4, 0.5, "#5f1585"),
                new HangingWireEntity(114 + 5, 209, 19*4, 0.5, "#5f1585"),
                new HangingWireEntity(209, 285, 19*2, 0.5, "#5f1585"),
            ],

            "entities" : [
                new LevelTransitionTrigger(333, 380, 19, 19 * 2, 19, 95, "LabArea/1afterWakeUp" ),
            ],

            "backdrop" : { "image" : "backgrounds/PurpleBackground.png", "width" : 190, "height" : 190 }
        },

        "1afterWakeUp" : {
            "key" : keySets.OvergrownLabSet,

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],

            "layout" : [
                "0!666666666#00",
                "04         766",
                "04            ",
                "65            ",
                "       1222222",
                "       76666#0",
                "@@@23       80",
                "00004       76",
                "0000&2@3      ",
                "0000000&3     ",
                "00000000&22@@2"
            ],

            "apple2" : [
                "yui", "rt",
                "hjk", "fg",
                "nm,"
            ],

            "background": [
                "              ",
                "              ",
                "              ",
                "  uuuui  opo] ",
                "qwwwejjj      ",
                "zxxxcjjj      ",
                "     rm,  nt  ",
                "     k     n  ",
                "              ",
                "              ",
                "              "
            ],

            /*"forground" : [
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
                "              ",
            ],*/

            "entities" : [
                new LevelTransitionTrigger(-9, 76, 19, 19 * 2, 323, 399, "LabArea/WakeUp01" ),
                new LevelTransitionTrigger(247 + 8, 152, 19, 19 * 2, 19, 76, "LabArea/ToJumpGet" ),
                new LevelTransitionTrigger(247, 38, 19, 19 * 2, 19, 133, "LabArea/WallKickIntro/introRoom" ),

                new SuspendedWireEntity(152, 95, 19, 19)
            ]
        },

        "ToJumpGet" : {
            "key" : keySets.OvergrownLabSet,

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],

            "layout" : [
                "0!666#0000000000",
                "!5,  76#00000000",
                "5,    n800000000",
                "       800000000",
                "       800000000",
                "23     7#0000000",
                "04      7#000000",
                "0&23     76#0000",
                "000&3      766#0",
                "0000&3        76",
                "00000&3         ",
                "0000004         ",
                "000000&222222222",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
            ],
            "background" : [
                "0!666#0000000000",
                "!5,  76#00000000",
                "5,    n800000000",
                "       800000000",
                "       800000000",
                "23     7#0000000",
                "04     h7#000000",
                "0&23   nt76#0000",
                "000&3   hjr766#0",
                "0000&3uugr,   76",
                "00000&3mm,      ",
                "0000004         ",
                "000000&222222222",
                "0000000000000000",
                "0000000000000000",
                "0000000000000000",
            ],
            "entities": [
                new LevelTransitionTrigger(-9, 57, 19, 19 * 2, 228, 171, "LabArea/1afterWakeUp" ),
                new LevelTransitionTrigger(285, 190, 19, 19 * 2, 19, 190, "LabArea/JumpGet" ),
            ]
        },

        "JumpGet" : {
            "key" : keySets.OvergrownLabSet,

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],
            "window" : [
                "qwe",
                "asd",
                "zxc"
            ],

            "layout" : [
                "000000004  8000!6666#000000",
                "0!666#!65__76#!5    8000000",
                "65   75      75     80!66#0",
                "                    865  7#",
                "                  125     7",
                "222222223                  ",
                "0!6666665  123             ",
                "65         80&223       122",
                "           766665   13  800",
                "                    75  7#0",
                "                         7#",
                "222223                    7",
                "000!65                     ",
                "0004                       ",
                "0004                1222222",
                "000&2222222222222222%000000",
                "000000000000000000000000000"
            ],

            "apple2" : [
                "yui", "rt", "|", "qwe",
                "hjk", "fg", "|", "a d",
                "nm,",       "|", "zxc"
            ],

            "background" : [
                "000000000  0000!6666#000000",
                "0!666#!66__66#!5    8000000",
                "65   75      75     80!66#0",
                "                    865  7#",
                "                  125     7",
                "222222223                  ",
                "0!6666665  123             ",
                "65         80&223       122",
                "           766665   13  800",
                "     yuui           75  7#0",
                "    ygjjfuui             7#",
                "222223qwwwek              7",
                "000!65a   dfi              ",
                "0004jja   djfi             ",
                "0004jjzxxxcjjk op[o 1222222",
                "000&2222222222222222%000000",
                "000000000000000000000000000"
            ],

            "entities" : [
                new LevelTransitionTrigger(0, 152, 19, 19 * 3, 228, 171, "LabArea/1afterWakeUp" ),
                new LevelTransitionTrigger(494, 228, 19, 19 * 2, 19, 171, "LabArea/JumpGetP2" ),
                new LevelTransitionTrigger(494, 95, 19, 19 * 2, 19, 57, "LabArea/JumpGetP2" ),

                new LevelTransitionTrigger(0, 57, 19, 19 * 2, 323, 171, "LabArea/WallKickIntro/introRoom" ),
                
                new ItemPickup(152, 266 - 9, TileAtlas.pickups.powerup, () => {Players[0].wallKicksAllowed = 2; CutSceneAtlas.currentScene = CutSceneAtlas.kickPickup; /*alert("Try \"W\" To Jump!!!!")*/}, (thing2test, me) => { return BasicAreaChecks.inCircle(me.x, me.y, 19*1.5, thing2test.x, thing2test.y); } ),
            ],

            /*"backdropEntities" : [
                new DrawShape(() => {
                    function moveInWorldTo(x, y){
                        ctx.moveTo(x - Camera.x, y - Camera.y);
                    }
                
                    function lineInWorldTo(x, y){
                        ctx.lineTo(x - Camera.x, y - Camera.y);
                    }
                    ctx.beginPath();
                    moveInWorldTo(171, 0);
                    lineInWorldTo(209, 0);
                    lineInWorldTo(209, 285);
                    lineInWorldTo(152, 285);
                    lineInWorldTo(171, 133);
                    ctx.fill();

                } )
            ]*/
        },
        "JumpGetP2" : {
            "key" : keySets.OvergrownLabSet,

            "apple" : [
                "123", "!#",
                "8_4", "&%",
                "765"
            ],

            "layout" : [
                "!66666#00000000",
                "5     800000000",
                "      76666#000",
                "           76#0",
                "223          80",
                "665          7#",
                "    1223      8",
                "    7665      8",
                "          1222%",
                "          80000",
                "2222222222%0000",
                "000000000000000"
            ],
            "entities" : [
                new LevelTransitionTrigger(0, 38, 19, 19 * 2, 475, 114, "LabArea/JumpGet" ),

                new LevelTransitionTrigger(0, 114, 19, 19 * 4, 475, 247, "LabArea/JumpGet" ),
                new ItemPickup(152, 266 - 9, TileAtlas.pickups.powerup, () => { Players[0].jumpPower = 1.5; CutSceneAtlas.currentScene = CutSceneAtlas.jumpPickup}, (thing2test, me) => { return BasicAreaChecks.inCircle(me.x, me.y, 19*1.5, thing2test.x, thing2test.y); } )
            ]
        },

        "WallKickIntro" : {
            "introRoom" : {
                "key" : keySets.OvergrownLabSet,

                "apple" : [
                    "123", "!#",
                    "8_4", "&%",
                    "765"
                ],

                "layout" : [
                    "0000000000000000000",
                    "0000000000!66666#00",
                    "00000000!65     766",
                    "00000!665          ",
                    "!66#!5             ",
                    "5  75         12222",
                    "   +    123   7666#",
                    "   +   1%04       7",
                    "23 + 12%00&3       ",
                    "0&222%00000&3      ",
                    "000000000000&222222",
                    "0000000000000000000",
                    "0000000000000000000",
                ],

                "background" : [
                    "___________________",
                    "___________________",
                    "___________,  nm___",
                    "_________          ",
                    "______k       yi   ",
                    "_____gfui    y_j___",
                    "___ygjrm,__ ygj____",
                    "___hrm,____ hr,   _",
                    "___hf______ gk     ",
                    "____________j, yui ",
                    "___________________",
                    "___________________",
                    "___________________",
                ],

                "backdrop" : { "color" : "#fff", "width" : "100%", "height" : "100%" },

                "entities" : [
                    new LevelTransitionTrigger(342, 152, 19, 19 * 2, 19, 76, "LabArea/JumpGet" ),

                    new LevelTransitionTrigger(0, 114, 19, 19 * 2, 228, 57, "LabArea/1afterWakeUp" ),
                    new LevelTransitionTrigger(342, 57, 19, 19 * 2, 19, 95, "LabArea/WallKickIntro/longFall"),

                    //new LevelTransitionTrigger(342, 57, 19, 19 * 2, )

                    new SuspendedWireEntity(171, 57, 266, 114, 19 * 0.5, 0.3, "#5f1585"),
                    new HangingWireEntity(304, 133, 19 * 2, 0.4, "#5f1585"),
                    new HangingWireEntity(304 + 5, 133, 19 * 2.5, 0.4, "#5f1585"),

                    new PlayerSwitch(114, 152, 10, true, () => { console.log("apple"); setTile(3, 6, " "); setTile(3, 7, " "), setTile(3, 8, " ") })
                ]
            },

            "longFall" : {
                "key" : keySets.OvergrownLabSet,

                "apple" : [
                    "123", "!#",
                    "8_4", "&%",
                    "765"
                ],

                "layout": [
                    "00000000000000",
                    "00000!66#00000",
                    "0!6665  766#00",
                    "65         800",
                    "           800",
                    "    123    800",
                    "2222%!5    800",
                    "0000!5     800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                    "00004      800",
                ],

                "entities" : [
                    new LevelTransitionTrigger(0, 76, 9.5, 19 * 2, 323, 76, "LabArea/WallKickIntro/introRoom"),
                    new LevelTransitionTrigger(95, 437, 19*6, 19, 228 + 9, 0, "LabArea/WallKickIntro/longFallCatch")
                ]
            },

            "longFallCatch" : {
                "key" : keySets.OvergrownLabSet,

                "apple" : [
                    "123", "!#",
                    "8_4", "&%",
                    "765"
                ],

                "layout" : [
                    "0000000004      80000",
                    "0000000004      80000",
                    "0000000004      80000",
                    "00000000!5      80000",
                    "000000004       7#000",
                    "0000000!5        8000",
                    "000000!5         76#0",
                    "000!665            80",
                    "0!65               80",
                    "!5                 80",
                    "4                  80",
                    "4                  7#",
                    "4                   8",
                    "4        yuui       7",
                    "4      yugjjk        ",
                    "&3     nmtrm,        ",
                    "0&223    hk     12222",
                    "0000&22222222222%0000",
                    
                ],

                "entities" : [
                    new SuspendedWireEntity(171, 76, 323, 133, 19, 0.3, "#5f1585"),
                    new SuspendedWireEntity(361, 133, 95, 152, 19, 0.35, "#5f1585"),
                    new SuspendedWireEntity(361, 190, 190, 19, 19, 0.2, "#5f1585"),
                    new SuspendedWireEntity(361, 171, 228, 266, 0 - 19 * 2, 0.25, "#5f1585"),
                    new HangingWireEntity(152, 114, 19 * 5, 0.4, "#5f1585"),
                    new HangingWireEntity(57, 171, 19 * 5.3, 0.45, "#5f1585"),

                    //new LevelTransitionTrigger()
                ]
            },

            "WallKickGet" : {
                "key" : keySets.OvergrownLabSet,

                "apple" : [
                    "123", "!#",
                    "8_4", "&%",
                    "765"
                ],

                "layout" : [
                    "04      80",
                    "04      80",
                    "04      76",
                    "04        ",
                    "04        ",
                    "65      12",
                    "        80",
                    "        80",
                    "22222222%0",
                    "0000000000",
                ],

                "entities" : [
                    new LevelTransitionTrigger(0, 114, 9.5, 19 * 2, 361, 285, "LabArea/WallKickIntro/longFallCatch"),
                    new DrawShape(() => {
                        function moveInWorldTo(x, y){
                            ctx.moveTo(x - Camera.x, y - Camera.y);
                        }
                    
                        function lineInWorldTo(x, y){
                            ctx.lineTo(x - Camera.x, y - Camera.y);
                        }
                        ctx.beginPath();
                        let lightGrad = ctx.createLinearGradient(0, 0, 0, 19 * 7);
                        lightGrad.addColorStop(0, "#e1faf4ff");
                        lightGrad.addColorStop(0.5, "#e1faf433");
                        lightGrad.addColorStop(1, "#e1faf400");
                        ctx.fillStyle = lightGrad;
                        ctx.rect(38, 0, 19 * 6, 19 * 7);
                        ctx.fill();
                    })
                ]
            },

            "WallKickTutorial" : {
                "key" : keySets.OvergrownLabSet,

                "apple" : [
                    "123", "!#",
                    "8_4", "&%",
                    "765"
                ],

                "layout" : [
                    "000!66666#000000",
                    "00!5     76#0000",
                    "004        80000",
                    "004        80000",
                    "004        80000",
                    "00&223   12%0000",
                    "66665    8!6#000",
                    "         75 7#00",
                    "             76#",
                    "   123         8",
                    "222665         8",
                    "0!5     123    8",
                    "04      765  12%",
                    "04           800",
                    "0&23         800",
                    "00!5         800",
                    "665    122222%00",
                    "       800000000",
                    "       800000000",
                    "2222222%00000000",
                    "0000000000000000"
                ],

                "background" : [
                    "000!66666#000000",
                    "00!5     76#0000",
                    "004        80000",
                    "004        80000",
                    "004        80000",
                    "00&223yuu12%0000",
                    "66665fgjj8!6#000",
                    "   hjjjrm75j7#00",
                    "   hjjr, ygjj76#",
                    "   123,  hjjjk 8",
                    "222665   hjrm, 8",
                    "0!5     123,   8",
                    "04      765  12%",
                    "04      hjfi 800",
                    "0&23    hjjk 800",
                    "00!5    hjjk 800",
                    "665    122222%00",
                    "00fi   800000000",
                    "000k   800000000",
                    "2222222%00000000",
                    "0000000000000000"
                ],

                "entities" : [

                ]
            }
        },
    }
}

const GUIAtlas = {
    CreatePowerupCardWithContent(id, content){
        let element = document.createElement("div");
        element.classList = "powerUpCard";
        element.innerHTML = content;
        element.id = id;

        return document.getElementById("gameStuffHolder").appendChild(element);
    },

    Presets : {
        KickPowerUpCard(){
            let card = GUIAtlas.CreatePowerupCardWithContent("KickPowerUpCard", `
                <div>
                    <h3 style="text-align: center">Wall Kicking!!</h3>
                    <p style="text-align: center">Press [K] while hugging a wall to kick off of it!!!</p>
                    <p style="text-align: center">([K] to exit)</p>
                </div>
            `);

            card.style.position = "fixed";
            card.style.transform = "translate( 0px, 0px )";

            return card;
        }
    }
}

const CutSceneAtlas = {
    timeOfStart : -1,
    currentScene : () => {  },

    inDurration(start, end){ // <start> = millisecs offset from <timeOfStart>; same w/ end
        if(end === -1){
            return Time.now >= this.timeOfStart + start
        }
        return (Time.now <= this.timeOfStart + start + end && Time.now >= this.timeOfStart + start );
    },

    IntroCutScene(){
        if( this.timeOfStart === -1 ){
            this.timeOfStart = Time.now;
            Players[0].movementInputEnabled = false;
            Players[0].real.x = 38;
            Players[0].real.y = 95;
            Players[0].motion.x = 5;
            Players[0].extraData.flipped = true;

            ParticlePresets.directedSpark(48, 95, 0, 180, 10, 50, 3000);
        }

        if( this.inDurration(500, -1) ){
            Players[0].movementInputEnabled = true;
            this.currentScene = undefined;
            this.timeOfStart = -1;
        }
    },

    kickPickup() {
        let kickCard;
        if( this.timeOfStart === -1 ){
            this.timeOfStart = Time.now;
            Players[0].movementInputEnabled = false;
            console.log("Kick Pickup Cutscene");
            document.getElementById("kickControl").removeAttribute("hidden");
            kickCard = GUIAtlas.Presets.KickPowerUpCard();
        }
    
        if( keyPressedWithin("KeyK", 1000) ){
            Players[0].movementInputEnabled = true;
            this.currentScene = undefined;
            this.timeOfStart = -1;
            document.getElementById("KickPowerUpCard").remove();
        }
    }
}


let apple = {
    "key" : {
        "1" : {"x": 133, "y": 0, "w": 19, "h": 19},
        "2" : {"x": 152, "y": 0, "w": 19, "h": 19},
        "3" : {"x": 171, "y": 0, "w": 19, "h": 19},
        "4" : {"x": 171, "y":19, "w": 19, "h": 19},
        "5" : {"x": 171, "y":38, "w": 19, "h": 19},
        "6" : {"x": 152, "y":38, "w": 19, "h": 19},
        "7" : {"x": 133, "y":38, "w": 19, "h": 19},
        "8" : {"x": 133, "y":19, "w": 19, "h": 19},
        "#" : {"x": 114, "y":76, "w": 19, "h": 19},
        "@" : {"x": 76, "y":19, "w": 19, "h": 19},
        " " : {"x": 0, "y":0, "w": 0, "h": 0},
        "^" : {"x": 76, "y":57, "w": 19, "h": 19},
        "<" : {"x": 95, "y":0, "w": 19, "h": 19}
    },

    "layout"  : [
        '#66666666666666#',
        '4              8',
        '4              8',
        '4        1223  8',
        '4    2   7665  8',
        '4   15         8',
        '4       2   122#',
        '@23     #   8@@#',
        '@@4  ^^^#^ 266##',
        '@@@3    <#    8#',
        '@@@#2   <#^^^ 8#',
        '@@@4          8#',
        '@@@#2222222222##',
    ]
}