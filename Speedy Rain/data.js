
let currentLevel;

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

    zoom : 1
}

let ControlSchemes = {
    "Player1" : {
        "up" : "KeyW",
        "down" : "KeyS",
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

const TileAtlas = {
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
    }
}

const ParticleAtlas = {
    "terminalParticles" : {
        "blue" : new Region(131, 17, 2, 2, -1, -1)
    },

    "effects" : {
        "green" : new Region(129, 17, 2, 2, -1, -1)
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
                new Terminal(19 * 10, 19 * 1, TileAtlas.terminal.term1, 2, "#fff", "#000", 95, 95)
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
        }
    }
} 