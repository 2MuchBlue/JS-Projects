const Levels = {
    "lvl1" : {
        "line1" : [
            { "x": 0, "y":   0 },
            { "x": 0, "y":  32 },
            { "x": 0, "y":  64 },
            { "x": 0, "y":  96 },
            { "x": 0, "y": 128 },
            { "x": 0, "y": 160 },
            { "x": 0, "y": 192 },
            { "x": 0, "y":  224},
            { "x": 32, "y": 256},
            { "x": 64, "y": 256},
            { "x": 96, "y": 256},
            { "x": 128, "y": 256},
            { "x": 160, "y": 224},
            { "x": 192, "y": 192},
            { "x": 224, "y": 160},
            { "x": 224, "y": 128},
            { "x": 224, "y":  96},
            { "x": 224, "y":  64},
            { "x": 224, "y":  32},
            { "x": 224, "y":   0},
            { "x": 224, "y": -32},
            { "x": 192, "y": -64},
            { "x": 160, "y": -64},
            { "x": 128, "y": -64},
            { "x":  96, "y": -64},
            { "x":  64, "y": -64},
            { "x":  32, "y": -64},
            { "x":   0, "y": -32},
        ],

        "line2" : [
            { "x": 64, "y":0 },
            { "x": 64, "y":32 },
            { "x": 64, "y":64 },
            { "x": 64, "y":96 },
            { "x": 64, "y":128 },
            { "x": 64, "y":160 },
            { "x": 64, "y": 192},
            { "x": 64, "y": 192},
            { "x": 96, "y": 192},
            { "x": 128, "y": 160},
            { "x": 160, "y": 128},
            { "x": 160, "y": 96},
            { "x": 160, "y": 64},
            { "x": 160, "y": 32},
            { "x": 160, "y": 0},
            { "x": 128, "y": 0},
            { "x": 96, "y":  0},
        ],

        "others": [

        ]
    }
}

const Letters = {
    "Chars" : {
        // Upper Case Letters A-Z
        "A" : { "startX" : 6  , "startY" : 24 },
        "B" : { "startX" : 12 , "startY" : 24 },
        "C" : { "startX" : 18 , "startY" : 24 },
        "D" : { "startX" : 24 , "startY" : 24 },
        "E" : { "startX" : 30 , "startY" : 24 },
        "F" : { "startX" : 36 , "startY" : 24 },
        "G" : { "startX" : 42 , "startY" : 24 },
        "H" : { "startX" : 48 , "startY" : 24 },
        "I" : { "startX" : 54 , "startY" : 24 },
        "J" : { "startX" : 60 , "startY" : 24 },
        "K" : { "startX" : 66 , "startY" : 24 },
        "L" : { "startX" : 72 , "startY" : 24 },
        "M" : { "startX" : 78 , "startY" : 24 },
        "N" : { "startX" : 84 , "startY" : 24 },
        "O" : { "startX" : 90 , "startY" : 24 },
        "P" : { "startX" : 0  , "startY" : 36 },
        "Q" : { "startX" : 6  , "startY" : 36 },
        "R" : { "startX" : 12 , "startY" : 36 },
        "S" : { "startX" : 18 , "startY" : 36 },
        "T" : { "startX" : 24 , "startY" : 36 },
        "U" : { "startX" : 30 , "startY" : 36 },
        "V" : { "startX" : 36 , "startY" : 36 },
        "W" : { "startX" : 42 , "startY" : 36 },
        "X" : { "startX" : 48 , "startY" : 36 },
        "Y" : { "startX" : 54 , "startY" : 36 },
        "Z" : { "startX" : 60 , "startY" : 36 },

        // Lower Case Letters a-z
        "a" : { "startX" : 6  , "startY" : 48 },
        "b" : { "startX" : 12 , "startY" : 48 },
        "c" : { "startX" : 18 , "startY" : 48 },
        "d" : { "startX" : 24 , "startY" : 48 },
        "e" : { "startX" : 30 , "startY" : 48 },
        "f" : { "startX" : 36 , "startY" : 48 },
        "g" : { "startX" : 42 , "startY" : 48 },
        "h" : { "startX" : 48 , "startY" : 48 },
        "i" : { "startX" : 54 , "startY" : 48 },
        "j" : { "startX" : 60 , "startY" : 48 },
        "k" : { "startX" : 66 , "startY" : 48 },
        "l" : { "startX" : 72 , "startY" : 48 },
        "m" : { "startX" : 78 , "startY" : 48 },
        "n" : { "startX" : 84 , "startY" : 48 },
        "o" : { "startX" : 90 , "startY" : 48 },

        "p" : { "startX" : 0  , "startY" : 60 },
        "q" : { "startX" : 6  , "startY" : 60 },
        "r" : { "startX" : 12 , "startY" : 60 },
        "s" : { "startX" : 18 , "startY" : 60 },
        "t" : { "startX" : 24 , "startY" : 60 },
        "u" : { "startX" : 30 , "startY" : 60 },
        "v" : { "startX" : 36 , "startY" : 60 },
        "w" : { "startX" : 42 , "startY" : 60 },
        "x" : { "startX" : 48 , "startY" : 60 },
        "y" : { "startX" : 54 , "startY" : 60 },
        "z" : { "startX" : 60 , "startY" : 60 },

        // Special Charactors
        // 0 - 9
        "0" : { "startX" :  0 , "startY" : 12 },
        "1" : { "startX" :  6 , "startY" : 12 },
        "2" : { "startX" : 12 , "startY" : 12 },
        "3" : { "startX" : 18 , "startY" : 12 },
        "4" : { "startX" : 24 , "startY" : 12 },
        "5" : { "startX" : 30 , "startY" : 12 },
        "6" : { "startX" : 36 , "startY" : 12 },
        "7" : { "startX" : 42 , "startY" : 12 },
        "8" : { "startX" : 48 , "startY" : 12 },
        "9" : { "startX" : 54 , "startY" : 12 },

        // Symbols (),./? etc
        " " : { "startX" :  0 , "startY" :  0 },
        "." : { "startX" : 84 , "startY" :  0 }, // Period
        "!" : { "startX" :  6 , "startY" :  0 },
        "'" : { "startX" :  0 , "startY" : 48 }, // Apostrophy
        "+" : { "startX" :  66 , "startY" :  0 },
        "-" : { "startX" :  78 , "startY" :  0 },
        

        "up": { "startX" : 18, "startY" : 72},
        "down": { "startX" : 30, "startY" : 72},
        "left": { "startX" : 12, "startY" : 72},
        "right": { "startX" : 24, "startY" : 72},
    }
}