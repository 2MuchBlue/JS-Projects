
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

    "lab" : {
        "other" : {
            "paleWood" : { "region" : new Region(76, 19), "solid" : true }
        },
        "wire" : {
            "red_wire" : { "region" : new Region(76, 38), "solid" : true }
        }
    }
}

const AreaAtlas = {
    "LabArea" : {
        "WakeUp" : {
            "key" : {
                "#" : TileAtlas.lab.wire.red_wire,
                "@" : TileAtlas.lab.other.paleWood,
                " " : TileAtlas.air
            },
            "layout" : [
                '################',
                '#              #',
                '#              #',
                '#        ####  #',
                '#    #   #@@#  #',
                '#   ##         #',
                '#       #   ####',
                '@@@     #   @@@#',
                '@@@  ##### #####',
                '@@@#     #    ##',
                '@@@##   ##### ##',
                '@@@#          ##',
                '@@@#############',
            ],

            "entities" : {
                "ENTER" : new Door
            }
        },

        "ParcoreDarcore" : {
            "key" : {
                "#" : TileAtlas.lab.wire.red_wire,
                "@" : TileAtlas.lab.other.paleWood,
                " " : TileAtlas.air
            },
            "layout" : [
                '################',
                '#          #   #',
                '######     #   #',
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

            "entities" : {
                "ENTER" : new Door
            }
        }
    }
} 