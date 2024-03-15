/* standered setup
    <lvlName> : {
        key : {
            <keyString> : {solid : <solidityBool>, sprite: <spriteString> }
        },

        layout: [
            <layerString>
        ],

        data: {
            width: <widthInt>
            height: <heightInt>
        }
    }
*/

const spriteNames = {
    'grass' : {
        sx: 8,
        sy: 0,
        width: 8,
        height: 8
    },

    'dirt' : {
        sx: 0,
        sy: 0,
        width: 8,
        height: 8
    },

    'stone' : {
        sx: 0,
        sy: 8,
        width: 8,
        height: 8
    },

    'cursorArrow': {
        sx: 16,
        sy: 0,
        width: 8,
        height: 8
    },

    'cursorPoint': {
        sx: 24,
        sy: 0,
        width: 8,
        height: 8
    },

    'skyscraper1': {
        sx: 24,
        sy: 8,
        width: 8,
        height: 16,

        offsetX: 0,
        offsetY: -8
    },

    'water': {
        sx: 8,
        sy: 8,
        width: 8,
        height: 8
    },

    'selection': {
        sx: 16,
        sy: 16,
        width: 8,
        height: 8
    },

    'button': {
        sx: 16,
        sy: 24,
        width: 16,
        height: 16
    },
    
    'buttonHover': {
        sx: 0,
        sy: 24,
        width: 16,
        height: 16
    }
}

function drawSprite(x, y, sprite){
    if(spriteNames[sprite].offsetX !== undefined){
        x += spriteNames[sprite].offsetX;
    }

    if(spriteNames[sprite].offsetY !== undefined){
        y += spriteNames[sprite].offsetY;
    }

    ctx.drawImage(blockSpriteSheet, spriteNames[sprite].sx, spriteNames[sprite].sy, spriteNames[sprite].width, spriteNames[sprite].height, x, y, spriteNames[sprite].width, spriteNames[sprite].height );
}

let Levels = {
    lvl1: {
        key : {
            '#' : {sprite: 'dirt' },
            'g' : {sprite: 'grass'},
            's' : {sprite: 'stone'},
            'b' : {sprite: 'skyscraper1'},
            'w' : {sprite: 'water'}
        },

        layout: [
            '#g#####ww#',
            '#g##ggg###',
            '#ggggbg###',
            '#wwwggg#s#',
            '####sss###',
            '#sssssss##',
            '##########'
        ],

        data: {
            width: 10,
            height: 7
        }
    },

    lvl2: {
        key: {
            '#': {sprite: 'stone'},
            'w': {sprite: 'water'},
            '1': {sprite: 'skyscraper1'},
            'g': {sprite: 'grass'}
        },

        layout: [
            'wwwwwwwwwwww',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'w##########w',
            'wwwwwwwwwwww'
        ],

        data: {
            height:12,
            width: 12
        }
    }
};