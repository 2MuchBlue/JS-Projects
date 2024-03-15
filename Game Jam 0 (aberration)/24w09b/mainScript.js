
let gameStates = {
    placing: false,

    curentLvl : Levels.lvl2,
    selectedBlock : 'g'
};

let cursor = {
    state: 'default'
};

let tileRules = {
    'c' : {if : 'w', to: 'g' },
    'g' : {unless: 'w', to: 'c'},
}

function update(){ // called only if unpaused and after 'alwaysUpdate()'
    ctx.clearRect(0, 0, 128, 128);
    drawLevel(gameStates.curentLvl);

    
    drawButton(96,0);
    
    if(gameStates.placing){
        drawSprite(Math.floor(mouse.x / 8) * 8, Math.floor(mouse.y / 8) * 8, 'selection');
        cursor.state = 'hover';
    }

    if (mouse[0] === true && gameStates.placing) {placeBlockAtMouse(gameStates.selectedBlock, gameStates.curentLvl);}

    let cursorSprite = (cursor.state === 'default' ? 'cursorArrow' : 'cursorPoint');
    drawSprite(Math.round(mouse.x), Math.round(mouse.y), cursorSprite);
}


function alwaysUpdate(){ // called always and before 'update()'

    cursor.state = 'default';

    ctx.clearRect(0, 120, 128, 16);
    ctx.fillText(`Delta Time: ${Time.deltaTime}`, 0, 128);

    drawSprite(Math.round(mouse.x), Math.round(mouse.y), 'cursorArrow');

}

function drawLevel(lvl){
    for(let y = 0; y < lvl.data.height; y++){
        for(let x = 0; x < lvl.data.width; x++){
            drawSprite(x * 8, y * 8, lvl.key[lvl.layout[y][x]].sprite);
        }
    }
}

function getTile(x, y, lvl){
    return ( lvl.key[ lvl.layout[y][x]].sprite );
}

function mouseInArea(x1, y1, x2, y2){
    if( mouse.x >= x1 && mouse.x <= x2 && mouse.y >= y1 && mouse.y <= y2 ){
        cursor.state = 'hover';
        return true;
    }else{
        //ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        return false;
    }
}

function replaceAt(stringToEdit, index, replaceWith){
    return stringToEdit.substring(0, index) + replaceWith + stringToEdit.substring(index + 1);
}

function placeBlockAtMouse(block, lvl){
    lvl.layout[Math.floor(mouse.y / 8)] = replaceAt(lvl.layout[Math.floor(mouse.y / 8)], Math.floor(mouse.x / 8), block);
}

function togglePlacement(){
    gameStates.placing = !gameStates.placing;
}


// ===== Button Functions =====
    function click(){
        checkButton(96, 0, togglePlacement);
    }

    function checkButton(x, y, funct2Run){
        
        if(mouseInArea(x, y, x + 16, y + 16)){
            funct2Run();
        }

    }

    function drawButton(x, y){
        drawSprite(x, y, (mouseInArea(x, y, x + 16, y + 16) ? 'button': 'buttonHover'));
    }

// ===== Block Updates =====
    function updateBlocks(lvl){ /// Doesn't Work :(
        let holdArray = lvl.layout;

        for(let y = 0; y < lvl.data.height; y++){
            for(let x = 0; x < lvl.data.width; x++){
                
                // the rules of this tile

                if(checkForSurrounding(x, y, 'g', gameStates.curentLvl)){
                    holdArray[y] = replaceAt(lvl.layout[y], x, 'c');
                }else if(checkForSurrounding(x, y, 'c', gameStates.curentLvl)){
                    holdArray[y] = replaceAt(lvl.layout[y], x, 'g');
                }

            }
        }

        lvl.layout = holdArray;

    }

    function checkForSurrounding(x, y, blockToSearchFor, lvl){
        if( getTile(x + 1, y, lvl) === blockToSearchFor ||
            getTile(x - 1, y, lvl) === blockToSearchFor ||
            getTile(x, y + 1, lvl) === blockToSearchFor ||
            getTile(x, y - 1, lvl) === blockToSearchFor
        ){
            return true;
        }else{
            return false;
        }
    }