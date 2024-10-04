function start(){
    engineUpdate();

    currentLevel = AreaAtlas.LabArea.home;
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

let Players = [
    new Player("player1", ControlSchemes.Player1, 0.15, 1.5),
    new Player("player2", ControlSchemes.Player2, 0.15, 1.5)
];

let particleList = [];

function gameUpdate(){
    ctx.clearRect(0,0,canvasElement.width, canvasElement.height);
    //player.real.x += ( -btn(ControlSchemes.Player1, "left") + btn(ControlSchemes.Player1, "right")) * Time.deltaTime * 0.1;
    //player.real.y += ( -btn(ControlSchemes.Player1, "up") + btn(ControlSchemes.Player1, "down")) * Time.deltaTime * 0.1;
    

    Camera.real.x -= (Camera.real.x - (Players[0].real.x - canvasHalfWidth + 8)) * 0.015 * Time.deltaTime;
    Camera.real.y -= (Camera.real.y - (Players[0].real.y - canvasHalfHeight + 8)) * 0.015 * Time.deltaTime;

    drawLevel(true);

    Players[0].tick();
    Players[1].tick();
    
    //player.draw((key("Space") === 1 ? "run" : "idle"));

    

    if(key("Space") === 1){
        particleList.push(new BasicParticle(Players[0].x + 9.5, Players[0].y + 9.5, (Math.random() - 0.5) * 6, Math.random() * 3, 1000, ParticleAtlas.effects.green));
    }

    for(let i = 0; i < currentLevel.entities.length; i++){
        currentLevel.entities[i].tick();
    }

    for(let i = 0; i < particleList.length; i++){ // TODO : Fix the particle deletion, perhaps look at the "missed beat" game
        particleList[i].tick();
        particleList[i].draw();
        if(particleList[i].age > particleList[i].lifetime){
            particleList.splice(i, 1);
        }
        console.log(particleList[i]);
    }

    //worldArrow(player2.x + 8, player2.y + 8, 95, 95, "#f0f", "#af2");
}

function drawLevel(useCamera = false, level = currentLevel){
    for(let y = 0; y < level.layout.length; y++){
        for(let x = 0; x < level.layout[y].length; x++){
            let levelKey = level.key[level.layout[y][x]];
            let region = levelKey.region;
            if(Array.isArray(region)){
                //console.log(Math.round((Time.now - Time.launchTime) * 0.01) % region.length);
                drawImg(region[Math.round((Time.now - Time.launchTime) * levelKey.speed) % region.length], (x * 19) - Camera.x, (y * 19) - Camera.y);
            }else{
                drawImg(region, (x * 19) - Camera.x, (y * 19) - Camera.y);
            }
        }
    }
}

function getTile(x, y, level = currentLevel){
    if(level.layout[y] === undefined || level.layout[y][x] === undefined){
        console.log("NULL!!!!!!!!!!!!!!!!!!!!!!");
        return true;
    }
    return level.key[level.layout[y][x]].solid;
}

function drawArrow(x, y, angle, primaryColor, secondaryColor, tail = 0){
    ctx.strokeStyle = secondaryColor;
    ctx.fillStyle = primaryColor;

    ctx.beginPath();
    ctx.moveTo( Math.cos(angle * deg2rad) * 19 + x, Math.sin(angle * deg2rad) * 19 + y );
    ctx.lineTo( Math.cos((angle + 120) * deg2rad) * 8.5 + x, Math.sin((angle + 120) * deg2rad) * 8.5 + y );
    ctx.lineTo( x, y );
    ctx.lineTo( Math.cos((angle + 240) * deg2rad) * 8.5 + x, Math.sin((angle + 240) * deg2rad) * 8.5 + y );
    ctx.fill();
    ctx.stroke();
}

function worldArrow(targetX, targetY, drawX, drawY, color1, color2){
    drawArrow(drawX, drawY, pointToAngle( targetX - drawX - Camera.x, targetY - drawY - Camera.y), color1, color2);
}

function pointToAngle(x, y){
    if(x >= 0){
        return Math.atan(( y ) / ( x )) * rad2deg;
    }else{
        return Math.atan(( y ) / ( x )) * rad2deg + 180;
    }
}

function inAreaCheck(pointX, pointY, x, y, w, h){
    return (pointX >= x && pointX <= x + w && pointY >= y &&pointY <= y + h);
}

const ParticlePresets = {
    spark(x, y, width, height, sparks = 10){
        for(let i = 0; i < sparks; i++){
            particleList.push(new BasicParticle(x, y, (Math.random() - 0.5) * width , Math.random() * height, 100));
        }
    }
}