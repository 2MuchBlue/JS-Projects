
// ===== Canvas Constants =====
    const canvasElement = document.getElementById('mainCanvas');
    const ctx = canvasElement.getContext('2d');
    const canvasHalfWidth = canvasElement.width * 0.5;
    const canvasHalfHeight = canvasElement.height * 0.5;

    const symolSheet = new Image();
    symolSheet.src = "monogram-bitmap.png";

// ===== Input =====
    canvasElement.addEventListener('mousemove', function(e){
        mouse.x = (e.offsetX / canvasElement.clientWidth) * 128;
        mouse.y = (e.offsetY / canvasElement.clientHeight) * 128;

        mouse.movementX = e.movementX;
        mouse.movementY = e.movementY;
    });

    canvasElement.addEventListener('mousedown', function(e){
        mouse[e.button] = true;
    });

    document.addEventListener('mouseup', function(e){
        mouse[e.button] = false;
    });
        
    let paused = true;
    let keys = {};
    let mouse = {
        0: false,
        1: false,
        2: false,

        x: 0,
        y: 0,

        movementX : 0,
        movementY : 0
    };

    document.addEventListener('keydown', function(e){
        keys[e.key] = true;
        if(btn('q') || btn('e')){
            Camera.zoom += (btn('q') + -btn('e')) * 0.2;
            Camera.zoom = clamp(Camera.zoom, 1, 5);
        }
    });

    document.addEventListener('keyup', function(e){
        keys[e.key] = false;
    });

    const planetMassSlider = document.getElementById("planetMassSlider");
    const massDisplay = document.getElementById("massDisplay");

    planetMassSlider.addEventListener('input', function(e){
        massDisplay.innerText = Math.round(planetMassSlider.value * 10) * 0.1;    
    });

    const playerCountElement = document.getElementById('playerCount');
    playerCountElement.value = 1;
    const playerDisplay = document.getElementById('playerDisplay');

    playerCountElement.addEventListener('input', function(e){
        playerDisplay.innerText = playerCountElement.value;
    })

    function btn(key){
        return (keys[key] === true ? 1 : 0);
    }

// ===== Global Consts =====
    let Camera = {
        realX : 0,
        realY : 0,
        x : 0,
        y : 0,
        zoom: 0.5
    };
    
    const teamColors = {
        1 : '#ff4f38',
        2 : "#38bdff",
        3 : "#fcba03",
        4 : "#ea29ff"
    }

    const stepSize = 50;

    let currentPlayer = 0;
    let showingPlayerNum = false;
    let showPlayerStartTime = 0;

    const deg2rad = Math.PI / 180;

    let clickedYet = false;

    let turn = 0;

    let Time = {
        deltaTime : 0,
        epoch: 0,
        current: 0,
        launchTime : new Date().getTime(),
        startGameTime: 0,
    };    

    


// ===== Extra Math Functions =====
    function distance(x1, y1, x2, y2){
        let a = x2 - x1;
        let b = y2 - y1;

        return Math.sqrt((a * a) + (b * b));
    }

    /* Used From https://stackoverflow.com/a/8831937 */
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    function rot(a, b, angle){ // Degrees!!!!
        return {
            x: a * Math.cos(angle * deg2rad) + b * Math.sin(angle * deg2rad),
            y: a * -Math.sin(angle * deg2rad) + b * Math.cos(angle * deg2rad)
        };
    }

    function clamp(val, min, max){
        return Math.min(Math.max(val, min), max);
    }

// ===== Basic Drawing Functions =====
    function lineComp(x1, y1, x2, y2, size = 1){
        for(let t = 0; t < 1; t += 1 / distance(x1, y1, x2, y2)){
            ctx.fillRect((Math.round((1-t) * x1 + t * x2) - Math.round(size * 0.5)), (Math.round((1-t) * y1 + t * y2) - Math.round(size * 0.5)), size, size)
        }
    }

    function drawChar(x, y, charactor){
        charactor = Letters.Chars[charactor];
        ctx.drawImage(symolSheet, charactor.startX, charactor.startY, 6, 12, Math.round(x), Math.round(y), 6, 12);
        if(charactor === undefined){
            console.log(`error! charactor ${charactor} is undefined`)
        }
    }

    function drawText(x, y, text, justify = 'left'){
        let offset = 0;
        if(justify === 'center'){
            offset = Math.floor(text.length * 3);
        }
        for(let i = 0; i < text.length; i++){
            drawChar((x - offset) + (i * 6), y, text[i]);
            //console.log(text[i]);
        }
    }

    function drawSprite(x, y, startX, startY, width, height){
        ctx.drawImage(symolSheet, startX, startY, width, height, Math.round(x), Math.round(y), width, height);
    }

    function drawStation(x, y, color, dir){
        let state = hashCode(((Math.abs(x) + 1) * (Math.abs(y) + 1)).toString(16));
        let displayState = state % 3;

        let p1 = rot(-5, 0, Time.current * 0.01 + state);
        let p2 = rot( 5, 0, Time.current * 0.01 + state);

        ctx.fillStyle = '#ffffff';
        lineComp((p1.x + x) - Camera.x, (p1.y + y) - Camera.y, (p2.x + x) - Camera.x, (p2.y + y) - Camera.y);

        switch (1){
            case 0 :
                break;
            case 1:
                p1 = rot(-5, 2, Time.current * 0.01 + state);
                p2 = rot(-5,-2, Time.current * 0.01 + state);
                lineComp((p1.x + x) - Camera.x, (p1.y + y) - Camera.y, (p2.x + x) - Camera.x, (p2.y + y) - Camera.y);
                break;
            case 2 :
                break;
        }

        ctx.fillStyle = color;
        ctx.fillRect((x - 1) - Camera.x, (y - 2) - Camera.y, 2, 4);
        ctx.fillRect((x - 2) - Camera.x, (y - 1) - Camera.y, 4, 2);
    }

// ===== Gameplay Functions =====
    function nextPlayer(){
        clickedYet = false
        showingPlayerNum = true;
        showPlayerStartTime = Time.current;
        //console.log(`${showingPlayerNum}\n${showPlayerStartTime}`)
        currentPlayer += 1;
        if(currentPlayer > playerCountElement.value - 1){
            showingPlayerNum = false;
            currentPlayer = 0;
            turn += 1;
            step();
        }
    }
    function step(){
        for (let i = 0; i < asteroids.length; i++){
            let asteroid = asteroids[i];
            if(i === currentPlayer){
                asteroid.planetMass = planetMassSlider.value;
                if(mouse[0]){
                    asteroid.target.x = Math.floor(mouse.x + Camera.x);
                    asteroid.target.y = Math.floor(mouse.y + Camera.y);
                }
            }
            asteroid.step(stepSize);
        }
    }

class Asteroid{
    constructor(x, y, startDirX, startDirY, targetX, targetY, planetMass, team){
        this.x = x;
        this.y = y;

        this.dir = {
            x : startDirX,
            y : startDirY
        };

        this.target = {
            x : targetX,
            y : targetY
        };

        this.planetMass = planetMass;

        this.team = team;
    }

    drawLine(distanceForward){
        ctx.fillStyle = teamColors[this.team];
        ctx.fillRect(Math.round((this.x - 4) - Camera.x), Math.round((this.y - 4) - Camera.y), 8, 8);
        ctx.fillRect(Math.round((this.target.x - 2) - Camera.x), Math.round((this.target.y - 2) - Camera.y), 4, 4);

        let itX = this.x;
        let itY = this.y;
        let lastX = itX;
        let lastY = itY;
        let itDx = this.dir.x;
        let itDy = this.dir.y;

        for (let i = 0; (i > distanceForward) === false;){
            let a = (this.target.x - itX) * this.planetMass;
            let b = (this.target.y - itY) * this.planetMass;
            let dist = 0;
            itDx += a;
            itDy += b;

            lastX = itX;
            lastY = itY;

            itX += itDx;
            itY += itDy;

            dist = distance(lastX, lastY, itX, itY);

            /*
            ctx.fillStyle = '#ffffff';
            lineComp(itX - Camera.x, itY - Camera.y, lastX - Camera.x, lastY - Camera.y, 3);
            */
           ctx.fillStyle = teamColors[this.team];
            lineComp(itX - Camera.x, itY - Camera.y, lastX - Camera.x, lastY - Camera.y);
            i += dist;
        }
    }

    step(distanceForward){
        let itX = this.x;
        let itY = this.y;
        let lastX = itX;
        let lastY = itY;
        let itDx = this.dir.x;
        let itDy = this.dir.y;

        for (let i = 0; (i > distanceForward) === false;){
            let a = (this.target.x - itX) * this.planetMass;
            let b = (this.target.y - itY) * this.planetMass;
            let dist = 0;
            itDx += a;
            itDy += b;

            lastX = itX;
            lastY = itY;

            itX += itDx;
            itY += itDy;

            dist = distance(lastX, lastY, itX, itY);

            lineComp(itX - Camera.x, itY - Camera.y, lastX - Camera.x, lastY - Camera.y);
            i += dist;
        }

        this.x = itX;
        this.y = itY;
        this.dir.x = itDx;
        this.dir.y = itDy;
    }
}

    let asteroids = [
        new Asteroid(32, 64, 0, 10, 64, 64, 1, 1),
        new Asteroid(32 + 8, 64 - 4, 0, 10, 64 + 8, 64 - 4, 1, 2),
        new Asteroid(32 - 8, 64 - 8, 0, 10, 64 + 8, 64 - 4, 1, 3),
        new Asteroid(32 + 8, 64 - 12, 0, 10, 64 + 8, 64 - 4, 1, 4)
    ];

function update(){
    ctx.clearRect(0,0,128, 128);

    if(showingPlayerNum === false){
        Camera.realX += (-btn('a') + btn('d')) * Time.deltaTime * 0.1;
        Camera.realY += (-btn('w') + btn('s')) * Time.deltaTime * 0.1;

        Camera.x = Math.round(Camera.realX);
        Camera.y = Math.round(Camera.realY);

        //drawText(64, 64, `${Math.round((Camera.x + 64) / 32) * 32} ${Math.round((Camera.y + 64) / 32) * 32}`);
        //drawStation(Math.round((Camera.x + 64) / 32) * 32, Math.round((Camera.y + 64) / 32) * 32, '#ff00ff');
        //ctx.fillRect(Math.round((mouse.x) / 32) * 32, Math.round((mouse.y) / 32) * 32, 1, 1);

        ctx.fillStyle = '#ffffff';
        lineComp( 0 - Camera.x, 96 - Camera.y, 64 - Camera.x, 96 - Camera.y);
        for(let i = 0, len = Levels["lvl1"]["line1"].length; i < len; i++){
            //console.log(len)
            let item = Levels["lvl1"]["line1"][i];
            let nextItem = Levels["lvl1"]["line1"][(i + 1) % len];
            ctx.fillStyle = "#444444";
            lineComp(item.x - Camera.x, item.y - Camera.y, nextItem.x - Camera.x, nextItem.y - Camera.y);
            drawStation(item.x, item.y, (Math.round(Time.current * 0.005) % 5 === i % 5 ? '#ffffff': '#444444'));
        }

        for(let i = 0, len = Levels["lvl1"]["line2"].length; i < len; i++){
            //console.log(len)
            let item = Levels["lvl1"]["line2"][i];
            let nextItem = Levels["lvl1"]["line2"][(i + 1) % len];
            ctx.fillStyle = "#444444";
            lineComp(item.x - Camera.x, item.y - Camera.y, nextItem.x - Camera.x, nextItem.y - Camera.y);
            drawStation(item.x, item.y, (Math.round(Time.current * 0.005) % 5 === i % 5 ? '#ffffff': '#444444'));
        }

        for (let i = 0; i < playerCountElement.value; i++){
            let asteroid = asteroids[i];
            ctx.fillStyle = teamColors[asteroid.team];
            ctx.fillRect(Math.round((asteroid.x - 2) - Camera.x), Math.round((asteroid.y - 2) - Camera.y), 4, 4);
        
            if(i === currentPlayer){
                asteroid.planetMass = planetMassSlider.value;

                if(clickedYet === false && turn === 0){
                    asteroid.target.x = Math.floor(asteroid.x + (Math.cos(Time.current * 0.003) * 8));
                    asteroid.target.y = Math.floor(asteroid.y + 16);

                    if(Time.current > Time.startGameTime + 4000){
                        ctx.fillStyle = "#264373df";
                        ctx.fillRect(64 - 12, 64 - 7, 29, 16);
                        drawSprite(64 - 12, 64 - 4, 0, 96, 7, 12); // left click
                        drawChar(60, 64 - 5, '+');
                        drawSprite(68, 64 - 5, 16, 96, 11, 12); // move mouse

                        drawText(64, 58 + 12, 'WASD To Move Camera', 'center');
                    }
                }
                if(mouse[0]){
                    clickedYet = true;
                    asteroid.target.x = Math.floor(mouse.x + Camera.x);
                    asteroid.target.y = Math.floor(mouse.y + Camera.y);
                }
                asteroid.drawLine(stepSize);
                lineComp(asteroid.x - Camera.x, asteroid.y - Camera.y, (asteroid.x + asteroid.dir.x) - Camera.x, (asteroid.y + asteroid.dir.y)  - Camera.y );

            }

            drawText(0, 0, `Player ${currentPlayer + 1}'s Turn`);
        }
    }else if(showPlayerStartTime + 1000 < Time.current){
        showingPlayerNum = false;
    }else{
        drawText(0, 117, `Player ${currentPlayer + 1}'s Turn`);
    }
}




// ===== Engine Game Loop =====
let now = new Date();
now = now.getTime();
let lastTime = now;

function engineUpdate(){
    let now = new Date();
    now = now.getTime();
    Time.current = now;

    Time.deltaTime = now - lastTime;
    lastTime = now;

    update();
    mouseLastFrame = mouse;

    requestAnimationFrame(engineUpdate);
}

function init(){
    Time.startGameTime = new Date().getTime();
    engineUpdate();
}

/*
window.addEventListener('load', function(){
    ctx.fillStyle = '#0d0126';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#f5f5dc';
    ctx.font = '16px monogram';
    ctx.fillText('Click To Play!', 0, 64);
    document.addEventListener('click', startEventListener);
})

function startEventListener(){
    engineUpdate();
    console.log("Started!");
    document.removeEventListener('click', startEventListener);
}
*/