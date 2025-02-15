
let GlobalState = "MainMenu";
let globalInterval;


const globalConsts = {
    "gravity" : 0.0625,
    "verticalTerminalVelocity" : 1,
    "coyoteTime" : 100 // in millisecs
}

let Players = [
    new Player({"idle" : new StaticSprite("player>idle>0")}, 1, 0.1, 2, 2, 2, 1, 64, 64)
];

let controlScemes = {
}

let Camera = {
    real : {
        x : 0,
        y : 0
    },

    get x(){
        return Math.floor(this.real.x);
    },

    get y(){
        return Math.floor(this.real.y);
    }
}

let SheetData = {

    "air" : {
        "x" : 8,
        "y" : 24,
        "w" : 8,
        "h" : 8
    },

    "grass" : {
        "x" : 0,
        "y" : 0,
        "w" : 8,
        "h" : 8
    },

    "dirt" : {
        "x" : 8,
        "y" : 0,
        "w" : 8,
        "h" : 8
    },

    "stone" : {
        "x" : 8,
        "y" : 8,
        "w" : 8,
        "h" : 8
    },

    "player>idle>0" : {
        "x" : 0,
        "y" : 16,
        "w" : 8,
        "h" : 8
    },

    "pinkBrick" : {
        "x" : 16,
        "y" : 0,
        "w" : 8,
        "h" : 8
    },

    "pinkTop1" : {
        "x" : 40,
        "y" : 16,
        "w" : 8,
        "h" : 8
    },
    "pinkTop2" : {
        "x" : 40,
        "y" : 24,
        "w" : 8,
        "h" : 8
    },
    "pinkTop3" : {
        "x" : 40,
        "y" : 32,
        "w" : 8,
        "h" : 8
    },

    "blueTop" : {
        "x" : 16,
        "y" : 24,
        "w" : 8,
        "h" : 8
    },

    "blueBrick" : {
        "x" : 16,
        "y" : 8,
        "w" : 8,
        "h" : 8
    },

    "blackBlock" : {
        "x" : 16,
        "y" : 16,
        "w" : 8,
        "h" : 8
    },

    "scafoldY" : {
        "x" : 0,
        "y" : 40,
        "w" : 8,
        "h" : 8
    },
    "scafoldX" : {
        "x" : 8,
        "y" : 40,
        "w" : 8,
        "h" : 8
    },

    "scafoldYlarge" : {
        "x" : 0,
        "y" : 32,
        "w" : 8,
        "h" : 8
    },
    "scafoldXlarge" : {
        "x" : 8,
        "y" : 32,
        "w" : 8,
        "h" : 8
    },

    "sparkleBlue" : {
        "x" : 16,
        "y" : 40,
        "w" : 4,
        "h" : 4
    },
    "sparklePink" : {
        "x" : 20,
        "y" : 40,
        "w" : 4,
        "h" : 4
    },
    "sparkleWhite" : {
        "x" : 16,
        "y" : 44,
        "w" : 4,
        "h" : 4
    },
    "sparkleYellow" : {
        "x" : 20,
        "y" : 44,
        "w" : 4,
        "h" : 4
    },

    "background > brick > var1" : {
        "x" : 32,
        "y" : 0,
        "w" : 8,
        "h" : 8
    },
    "background > brick > var2" : {
        "x" : 40,
        "y" : 0,
        "w" : 8,
        "h" : 8
    },

    "blockVignette" : {
        "x" : 48,
        "y" : 0,
        "w" : 12,
        "h" : 12
    }
}

let TilePresets = {
    "air" : new Tile( new StaticSprite("air"), false , "air"),
    "pinkTop" : new Tile( new AnimatedSprite(500, "pinkTop1","pinkTop1", "pinkTop2", "pinkTop2", "pinkTop3", "pinkTop2"), true ),
    "scafoldY" : new Tile( new StaticSprite("scafoldY"), false, "scafold" ),
    "scafoldX" : new Tile( new StaticSprite("scafoldX"), false, "scafold" ),
    
    "backgroundBrickVar1" : new Tile( new StaticSprite( "background > brick > var1" ), false ),
    "backgroundBrickVar2" : new Tile( new StaticSprite( "background > brick > var2" ), false )
}

const Level = {
    "Area1" : {
        "5,5" : {
            "key" : {
                "@" : new Tile( new StaticSprite( "pinkBrick" ), true ),
                "O" : new Tile( new StaticSprite( "blackBlock" ), true ),
                "^" : TilePresets.pinkTop,
                " " : TilePresets.air,
                "y" : TilePresets.scafoldY,
                "x" : TilePresets.scafoldX,

                "-" : TilePresets.backgroundBrickVar1
            },

            "layout" : [
                "@@@@@@@@@@@@@@@@@@@@@@",
                "@         y          @",
                "@         y          @",
                "@         y          @",
                "@x@       y      y   @",
                "@----    ^^^     @xxx@",
                "@^^^^^-          y   @",
                "@-------         y  -@",
                "@- ---     ^^xxxx@---@",
                "@---            -----@",
                "@^-              ----@",
                "@--   ^^^       -----@",
                "@-     y       ---- -@",
                "@^^    y  ^^^@@@---^^@",
                "OO@^^^^^^^OOOOOOOOOOOO",
                "OOOOOOOOOOOOOOOOOOOOOO",
                "OOOOOOOOOOOOOOOOOOOOOO",
                "OOOOOOOOOOOOOOOOOOOOOO",
            ]
        }
    }
}
let currentLevel = Level.Area1["5,5"];


const NiceColors = [
    ["dab6c4","7b886f","b4dc7f","feffa5","ffa0ac"],
    ["ffffff","00a7e1","00171f","003459","007ea7"],
    ["818d92","586a6a","b9a394","d4c5c7","dad4ef"]
];