// ===== Canvas Constants =====
const canvasElement = document.getElementById('mainCanvas');
const ctx = canvasElement.getContext('2d');
const canvasHalfWidth = canvasElement.width * 0.5;
const canvasHalfHeight = canvasElement.height * 0.5;


let Camera = {
    x : 0,
    y : 0,
    realX : 0,
    realY : 0
};

// ===== Input =====
    canvasElement.addEventListener('mousemove', function(e){
        mouse.x = (e.offsetX / canvasElement.clientWidth) * 128;
        mouse.y = (e.offsetY / canvasElement.clientHeight) * 128;

        mouse.movementX = e.movementX;
        mouse.movementY = e.movementY;
    });

    document.addEventListener('mousedown', function(e){
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

    let mouseLastFrame = mouse;


    document.addEventListener('keydown', function(e){
        keys[e.key] = true;
        //console.log(e.key + " down");
    });

    document.addEventListener('keyup', function(e){
        keys[e.key] = false;

        //console.log(e.key + " up");   
    });

    function btn(key){
        return (keys[key] === true ? 1 : 0);
    }

// ===== Extra Math Functions =====
    function distance(x1, y1, x2, y2){
        let a = x1 - x2;
        let b = y1 - y2;
    
        return Math.sqrt((a * a) + (b * b));
    }

    function isOdd(num){
        if(num & 1 === 1){
            return true;
        }else{
            return false;
        }
    }

    function randomHash(input){
        //     00000000 00000000 00000000 00000001
        // << 00000000 00000000 00000000 00000001
        //
    }

// ===== Engine Game Loop =====
    let Time = {
        deltaTime : 0,
        epoch: 0
    };

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

// ===== Rendering =====
    function drawCirc(x, y, radius, color, res){
        ctx.fillStyle = color;
        for(let i = 0; i < 2 * Math.PI; i += (2 * Math.PI) / res){
            ctx.fillRect(x + Math.round(Math.cos(i) * radius), y + Math.round(Math.sin(i) * radius), 1, 1);
        }
    }

    function rot(a, b, angle){ // Radians!!!!
        return {
            x: a * Math.cos(angle) + b * Math.sin(angle),
            y: a * -Math.sin(angle) + b * Math.cos(angle)
        };
    }

    /*
    function BresenhamLine(x1, y1, x2, y2){
        let slope = (y2 - y1) / (x2 - x1);
        let error = 0;

        let y = y1;
        for (let i = x1; i < x2;i++){
            error += slope;
            if( error >= 0.5 ){
                error -= 1;
                y += 1;
            }
            ctx.drawRect(i, y, 1, 1);
        }
    }
    */

    function lineComp(x1, y1, x2, y2){
        for(let t = 0; t < 1; t += 1 / distance(x1, y1, x2, y2)){
            ctx.fillRect(Math.round((1-t) * x1 + t * x2), Math.round((1-t) * y1 + t * y2), 1, 1)
        }
    }

    function scaledBox(x, y, w, h, angle){
        let pt1 = rot( 1,  1, angle);
        let pt2 = rot( 1, -1, angle);
        let pt3 = rot(-1, -1, angle);
        let pt4 = rot(-1,  1, angle);

        lineComp((pt1.x * w) + x, (pt1.y * h) + y, (pt2.x * w) + x, (pt2.y * h) + y);
        lineComp((pt2.x * w) + x, (pt2.y * h) + y, (pt3.x * w) + x, (pt3.y * h) + y);
        lineComp((pt3.x * w) + x, (pt3.y * h) + y, (pt4.x * w) + x, (pt4.y * h) + y);
        lineComp((pt4.x * w) + x, (pt4.y * h) + y, (pt1.x * w) + x, (pt1.y * h) + y);
    }

    function moneyStack(x, y, height){
        height = Math.floor(height);
        let startStyle = ctx.fillStyle;
        ctx.fillStyle = "#000";
        ctx.fillRect(x-2, y+2, 5, 1);
        ctx.fillRect(x-3, y+2, 1, -height - 1);
        ctx.fillRect(x+3, y+2, 1, -height - 1);
        ctx.fillRect(x-2, y+1, 5, -height - 1);

        for(let i = -1; i < height; i++){
            if(isOdd(i)){
                ctx.fillStyle = "#448c23";
            }else{
                ctx.fillStyle = "#6ca63a";
            }
            lineComp(x - 2, y - i, x + 3, y - i);
        }
        ctx.fillStyle = startStyle;
    }

    function removeIndex(list, index2remove){
        return list.splice(index2remove, 1);
    }

// ===== Classes =====
    class city{
        constructor(x, y, startCash, color, acumulationSpeed, connections, data){
            this.x = x;
            this.y = y;
            this.money = startCash;
            this.color = color;
            this.acumulationSpeed = acumulationSpeed;
            this.startTime = new Date().getTime();

            this.connections = connections;
            this.data = data;

            this.scale = Math.ceil(startCash / 1000.0);
        }

        draw(){
            let timeEpoc = new Date().getTime();
            let startStyle = ctx.fillStyle;
            ctx.fillStyle = this.color;
            scaledBox(this.x - Camera.x, this.y - Camera.y, (10 * this.scale) + 3, (5 * this.scale) + 3, timeEpoc * 0.00001 * this.acumulationSpeed);
            scaledBox(this.x - Camera.x, this.y - Camera.y, (15 * this.scale) + 3, (7.5 * this.scale) + 3, timeEpoc * -0.00002 * this.acumulationSpeed);
            moneyStack(this.x - Camera.x, this.y - Camera.y, Math.floor(this.money * 0.01));
            ctx.fillStyle = startStyle;
        }
    }

    class rocket{
        constructor(x, y){
            this.x = x;
            this.y = y;
            this.startX = x;
            this.startY = y;
        }

        draw() {
            let angle = Math.sin(this.y * 0.3) * 0.125 * Math.PI;
            this.x = this.startX + (Math.cos((-this.y + 10) * 0.3) * 4);
            let topPoint = rot(0, -5, angle);
            let left = rot( -3, 2, angle);
            let right = rot( 3, 2, angle);

            topPoint.x += this.x;
            topPoint.y += this.y;

            right.x += this.x;
            right.y += this.y;

            left.x += this.x;
            left.y += this.y;

            lineComp(right.x - Camera.x, right.y - Camera.y, topPoint.x - Camera.x, topPoint.y - Camera.y);
            lineComp(left.x - Camera.x, left.y - Camera.y, topPoint.x - Camera.x, topPoint.y - Camera.y);
            lineComp(left.x - Camera.x, left.y - Camera.y, right.x - Camera.x, right.y - Camera.y);

            this.y -= Time.deltaTime * 0.03;
            
            let r = ((new Date().getTime() * 0.01) | 0).toString(2);
            if(r[r.length - 2] === '1' && r[r.length - 1] === '0'){
                particals.push(new Partical(this.x, this.y, 'flame', 1000, {color: '#ff0f00'}));
            }

            ctx.fillRect(this.x - Camera.x, this.y - Camera.y, 1, 1);
        }
    }

    class Partical{
        constructor(x, y, type, duration, data){
            this.x = x;
            this.y = y;
            this.type = type;
            this.data = data;
            this.age = 0;
            this.duration = duration;
        }

        draw(){
            let startStyle = ctx.fillStyle;
            switch (this.type) {
                case 'dust':
                    ctx.fillStyle = this.data.color;
                    scaledBox(this.x - Camera.x, this.y - Camera.y, 4, 4, new Date().getTime() * 0.0001);
                    scaledBox(this.x - Camera.x, this.y - Camera.y, 3, 3, new Date().getTime() * 0.0001);
                    scaledBox(this.x - Camera.x, this.y - Camera.y, 2, 2, new Date().getTime() * 0.0001);
                    ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
                    this.y -= 0.01 * Time.deltaTime;
                    break;

                case 'flame':
                    ctx.fillStyle = this.data.color;
                    let percentage = (this.age / this.duration);
                    scaledBox(this.x - Camera.x, this.y - Camera.y, 2 * percentage, 2 * percentage, new Date().getTime() * 0.001 + this.y * 0.1);
                    this.y += 0.01 * Time.deltaTime;
                    break;

                default:
                    break;
            }

            ctx.fillStyle = startStyle;
            this.age += 1 * Time.deltaTime;
        }
    }
    
// ===== Game Call =====
    let t = 0;
    let citys = [
        new city(64, 64, 5, "#000", 100, [1, 2]),
        new city(32, 0, 5, "#000", 10, [0]),
        new city(0, 70, 5, "#000", 110, [0, 1]),
        new city(128, 32, 45, '#a000ff', 200, [1, 2])
    ];

    let rockets = [];
    let particals = [];

    function update(){
        t += (-btn('a') + btn('d')) * 0.001 * Time.deltaTime;
        ctx.clearRect(0,0,128,128);

        Camera.realX += (-btn('a') + btn('d')) * Time.deltaTime * 0.1;
        Camera.realY += (-btn('w') + btn('s')) * Time.deltaTime * 0.1;

        Camera.x = Math.floor(Camera.realX);
        Camera.y = Math.floor(Camera.realY);

        // ===== Connection Drawing =====
        for( let bI = 0; bI < citys.length; bI++){
            for(let i = 0; i < citys[bI].connections.length; i++){
                let connection = citys[citys[bI].connections[i]];
                lineComp(citys[bI].x - Camera.x, citys[bI].y - Camera.y, connection.x - Camera.x, connection.y - Camera.y);
            }
        }


        // ===== Main City Drawing =====
        for( let bI = 0; bI < citys.length; bI++){

            if(distance(Camera.x + 64, Camera.y + 64, citys[bI].x, citys[bI].y) < 16){
                ctx.fillRect((citys[bI].x - Camera.x) - 16, (citys[bI].y - Camera.y) - 16, 30, 30)
            }

            //citys[bI].scale = Math.min(citys[bI].money / 2000.0, 10);
            citys[bI].draw();

            if(citys[bI].money > 500){
                citys[bI].money -= 500;
                rockets.push(new rocket(citys[bI].x, citys[bI].y));
            }
            citys[bI].money += citys[bI].acumulationSpeed * (Time.deltaTime * 0.001) * citys[bI].connections.length;
        }

        for (let i = 0; i < rockets.length; i++){
            rockets[i].draw();
            if(rockets[i].y < rockets[i].startY - 300){
                removeIndex(rockets, i);
            }
        }

        for( let i = 0; i < particals.length; i++){
            particals[i].draw();
            if(particals[i].age > particals[i].duration){
                removeIndex(particals, i);
            }
        }


        ctx.fillRect(64, 64, 1, 1);
        ctx.fillRect(0, Camera.y - 100, 1, 1);
    }


    window.addEventListener('load', function(){
        this.document.addEventListener('click', function(){
            engineUpdate();
        })
    })



// ===== Defunct =====


    /*
    function lineComp(x1, y1, x2, y2){
        
        x1 = Math.round(x1);
        x2 = Math.round(x2);
        y1 = Math.round(y1);
        y2 = Math.round(y2);
        
        
        if(x1 > x2){
            let storeX = x1;
            x1 = x2;
            x2 = storeX;

            let storeY = y1;
            y1 = y2;
            y2 = storeY;
        }
        
        let slope = (y2 - y1) / (x2 - x1);
        
        if (slope === Infinity){
            ctx.fillRect(x1, y1, 1, y2 - y1);
            return slope;
        }

        let yPix = Math.min(y1, y2);
        for(let i = Math.min(x1, x2); i < Math.max(x2, x1); i++){
            let y = slope * (i - x1) + y1;
            ctx.fillRect(i, Math.round(yPix), 1, 1);
            for(let startY = yPix; startY < y; startY++){
                ctx.fillRect(i, Math.round(startY), 1, 1);
            }
            yPix = Math.round(y);
        }

        return slope;
    }*/