function start(){
    engineUpdate();

    currentLevel = AreaAtlas.LabArea.WakeUp;
}

function drawImg( region, x, y, w = -1, h = -1 ){
    if(w = -1) {
        w = region.w;
    }

    if(h = -1) {
        h = region.h;
    }

    ctx.drawImage(Sheet, region.x, region.y, region.w, region.h, x + region.offsetX, y + region.offsetY, w, h);
}

let player = new Player("player1", ControlSchemes.Player1, 0.15, 1.5);
let player2 = new Player("player2", ControlSchemes.Player2, 0.15, 1.5);

function gameUpdate(){
    ctx.clearRect(0,0,canvasElement.width, canvasElement.height);
    //player.real.x += ( -btn(ControlSchemes.Player1, "left") + btn(ControlSchemes.Player1, "right")) * Time.deltaTime * 0.1;
    //player.real.y += ( -btn(ControlSchemes.Player1, "up") + btn(ControlSchemes.Player1, "down")) * Time.deltaTime * 0.1;
    
    player.tick();
    player2.tick();
    //player.draw((key("Space") === 1 ? "run" : "idle"));

    Camera.real.x -= (Camera.real.x - (player.real.x - canvasHalfWidth)) * 0.025 * Time.deltaTime;
    Camera.real.y -= (Camera.real.y - (player.real.y - canvasHalfHeight)) * 0.025 * Time.deltaTime;

    drawLevel(true);
}

function drawLevel(useCamera = false, level = currentLevel){
    for(let y = 0; y < level.layout.length; y++){
        for(let x = 0; x < level.layout[y].length; x++){
            let region = level.key[level.layout[y][x]].region;
            drawImg(region, (x * 19) - Camera.x, (y * 19) - Camera.y);
        }
    }
}

function getTile(x, y, level = currentLevel){
    return level.key[level.layout[y][x]].solid;
}