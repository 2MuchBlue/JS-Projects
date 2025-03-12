function start(){
    engineUpdate();
}

function MasterUpdate(){
    mainUpdate();
}

let localStick = {
    x : 0,
    y : 0,

    last : {
        x : 0,
        y : 0
    },

    delta : {
        x : 0,
        y : 0
    }
}

let angle = 0;

let revolutions = 0;

let keysInACircle = 15;

function mainUpdate(){
    ctx.clearRect(0, 0, 256, 256);
    
    localStick.last.x = localStick.x;
    localStick.last.y = localStick.y;

    let pastAngle = angleFromVec(localStick.last);
    
    localStick.x = gamepadAxis(0);
    localStick.y = gamepadAxis(1);

    localStickNormalized = Math2.normalizeVector(localStick);
    if(Math2.distance(localStick, new vec2(0, 0)) < 0.2){
        localStick.x = 0;
        localStick.y = 0;
    }

    angle += gamepadAxis(0) * Time.deltaTime * 0.01;

    localStick.delta.x = localStick.x - localStick.last.x;
    localStick.delta.y = localStick.y - localStick.last.y;
    

    ctx.fillText(angle, 8, 8);

    ctx.fillRect(Math.cos(angle) * 64 + 128, Math.sin(angle) * 64 + 128, 8, 8);

    let rawAngle = angleFromVec(localStick);
    let lastDot = Math2.dotProduct(localStick.last, new vec2(0, 1))

    if(Math2.dotProduct(localStick, new vec2(0, 1)) < 0 && lastDot > 0 && localStick.x > 0){
        revolutions++;
    }
    if(Math2.dotProduct(localStick, new vec2(0, 1)) > 0 && lastDot < 0 && localStick.x > 0){
        revolutions--;
    }

    let oneStepAround = (360 / keysInACircle) * deg2rad;

    //angle = angle % (oneStepAround * radialKeyCards.length);

    for(let j = 0, i = 0; j < radialKeyCards.length; j++, i += oneStepAround){
        let dir = new vec2(-Math.sin(i + angle), Math.cos(i + angle));
        let pos = new vec2(dir.x * (64 + (Math2.dotProduct(dir, new vec2(0, 1)) * 16)) + 128, dir.y * -(64 + (Math2.dotProduct(dir, new vec2(0, 1)) * 16)) + 128);
        
        let testAngle = (i + angle) % (oneStepAround * radialKeyCards.length);
        if(oneStepAround * 0.5 >= testAngle && -oneStepAround * 0.5 < testAngle){
            radialKeyCards[j].draw(pos.x, pos.y - 16);
        }else
        if(Math.PI > testAngle && -Math.PI < testAngle){
            radialKeyCards[j].draw(pos.x, pos.y);
            //ctx.fillText(i, pos.x, pos.y);
        }
    }
    /*
    for(let i = 0, j = 0; i < 2 * Math.PI - oneStepAround; /*360 / 15*//* i += oneStepAround, j++){
        let dir = new vec2(Math.cos(i + angle), Math.sin(i + angle));
        radialKeyCards[(j) % radialKeyCards.length].draw(dir.x * (64 + (Math2.dotProduct(dir, new vec2(0, -1)) * 16)) + 128, dir.y * (64 + (Math2.dotProduct(dir, new vec2(0, -1)) * 16)) + 128);
    }
    */
    ctx.fillRect(Math.cos(rawAngle) * 64 + 128, Math.sin(rawAngle) * 64 + 128, 8, 8);
}

function angleFromVec(vec){
    if(vec.x === 0){
        return 0;
    }
    localAngle = Math.atan(vec.y/vec.x);
    if(vec.x < 0){
        localAngle += Math.PI; // adds 180 degs
    }
    return localAngle;
}