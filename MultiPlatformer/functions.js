
document.addEventListener("click", clickToStartTrigger);

let Sheet = new Image();
Sheet.src = "Sheet.png";

function clickToStartTrigger(){
    document.removeEventListener("click", clickToStartTrigger);
    start();
}

function start() {
    engineUpdate();
    //globalInterval = window.setInterval(engineUpdate, 10);
}
function pause() {
    clearInterval(globalInterval);
}

function gameUpdate(){
    let mainStates = {
        get MainMenu() {
            MainMenu();
        },

        get GamePlay(){
            GamePlay();
        }
    }
    mainStates[GlobalState];
    
}

function GamePlay() {
    ctx.clearRect(0,0, canvasElement.width, canvasElement.height);
    //new AnimatedSprite(100, "grass", "dirt", "grass", "stone").draw(0, 0, 8, 8);
    Players[0].tick();
    
    Camera.real.x += ( (Players[0].real.x - 64) - Camera.real.x) * Time.deltaTime * 0.002;
    Camera.real.y += ( (Players[0].real.y - 64) - Camera.real.y) * Time.deltaTime * 0.002;

    Camera.real.x = ExtraMath.clamp(Camera.real.x, 0, Level.Area1["5,5"].layout[0].length * 8 - canvasElement.width);
    Camera.real.y = ExtraMath.clamp(Camera.real.y, 0, Level.Area1["5,5"].layout.length - 2);


    drawDustParalax(new StaticSprite("sparklePink") , 0.1, Time.launchTime, "#270670a1", 2.9);
    drawDustParalax(new StaticSprite( "sparkleBlue" ) , 0.4, Time.launchTime + 10 * 2.453, "none", 1.2);
    drawDustParalax(new StaticSprite( "sparkleYellow" ) , 0.4, Time.launchTime + 20 * 4.453, "#270670ca", 1.1);
    
    drawLevel(Level.Area1["5,5"], true);
    Players[0].draw("idle");
    
    ctx.fillStyle = "#f00";
    ctx.fillText( Math.round(1000 / Time.deltaTime), 32, 32);
}


function MainMenu() {
    new uiText(20, 20, "Main Menu XD", "#fff", "24px mono-space").draw();
    new uiButton (
        20, 20, 8, 8,
        {
            click() {
                GlobalState = "GamePlay";
            }
        },
    new StaticSprite("grass"), new StaticSprite("dirt")).draw();

    drawImg("blockVignette", 64, 64, 12, 12);
}

function drawImg(atlasCode, targetX, targetY, width = 8, height = 8){
    ctx.drawImage(Sheet, SheetData[atlasCode].x, SheetData[atlasCode].y, SheetData[atlasCode].w, SheetData[atlasCode].h, targetX, targetY, width, height);
}



function drawLevel(level){
    for(let y = 0; y < level.layout.length; y++ ){
        for(let x = 0; x < level.layout[y].length; x++ ){
            level.key[level.layout[y][x]].draw(x * 8, y * 8, 8, 8, true);
        }
    }
}

function drawDustParalax( sprite, paralaxStrength, seed = Time.launchTime, darken = "none", spread = 1, speeds = { x : -0.003, y : 0.007}){
    for(let y = 0; y < 8 * spread; y++ ){
        for(let x = 0; x < 8 * spread; x++ ){
            sprite.draw(
                ExtraMath.mod(Math.floor( ((Time.now - Time.launchTime) * speeds.x * paralaxStrength) - (x * 8 * spread + (ExtraMath.hashCode(y + x + seed.toString() + "[" + y) % 128)) - (Camera.real.x * paralaxStrength)), canvasElement.width), 
                ExtraMath.mod(Math.floor( ((Time.now - Time.launchTime) * speeds.y * paralaxStrength) - (y * 8 * spread + (ExtraMath.hashCode(x + seed.toString() + y) % 128)) - (Camera.real.y * paralaxStrength)), canvasElement.height), 
                SheetData[sprite.sprite].w, SheetData[sprite.sprite].h
            );
        }
    }

    if(darken !== "none"){
        let startingColor = ctx.fillStyle;
        ctx.fillStyle = darken;
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.fillStyle = startingColor;
    }
}

function getDataOfTileAtPos(x, y, level, scale = 1){ // if <alreadyScaled> is true, it is asumed that everything is already scaled to map size (one tile = one unit) instead of unscaled (one tile = <units> units)
    x = Math.floor(x * scale);
    y = Math.floor(y * scale);
    return level.key[level.layout[y][x]];
}

const ExtraMath = {
    clamp(val, min, max){
        if(val <= max && val >= min){
            return val;
        }else if(val < min){
            return min;
        }else if (val > max){
            return max;
        }
    },

    /* Used From https://stackoverflow.com/a/8831937 */
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },

    mod(a, b) { // returns the actuall modulo (thanks https://www.geeksforgeeks.org/how-to-get-negative-result-using-modulo-operator-in-javascript/)
        return ((a % b) + b) % b;
    }
}