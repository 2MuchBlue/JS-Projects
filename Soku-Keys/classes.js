class Region {
    constructor( x, y, w=19, h=19, offsetX = 0, offsetY = 0){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}

class Player {
    constructor( name, controlScheme, horSpeed, jumpPower, gainingSpeed = 0.001, slowingSpeed = 0.025 ){
        this.name = name;
        this.controlScheme = controlScheme;
        this.real = { // in world space
            x : 19,
            y : 19
        }

        this.tags = {
            "player" : true
        };

        this.movementInputEnabled = true;

        this.animationState = "idle";

        this.drawPos = {
            x : 0,
            y : 0
        }
    }

    get hitbox() { // semi-hardcoded hitbox thing
        let w = 8;
        let h = 8;
        return(
            getTile(Math.round((this.real.x) / 19), Math.round((this.real.y) / 19)) ||

            getTile(Math.round((this.real.x) / 19), Math.round((this.real.y - h) / 19)) || //  '
            getTile(Math.round((this.real.x) / 19), Math.round((this.real.y + h) / 19)) || //  .

            getTile(Math.round((this.real.x - w) / 19), Math.round((this.real.y) / 19)) || // -  
            getTile(Math.round((this.real.x + w) / 19), Math.round((this.real.y) / 19)) || //   -

            getTile(Math.round((this.real.x - w) / 19), Math.round((this.real.y - h) / 19)) || // fix :(
            getTile(Math.round((this.real.x + w) / 19), Math.round((this.real.y - h) / 19)) ||

            getTile(Math.round((this.real.x - w) / 19), Math.round((this.real.y + h) / 19)) ||
            getTile(Math.round((this.real.x + w) / 19), Math.round((this.real.y + h) / 19))
        );
    }

    get x(){
        return Math.round(this.real.x);
    }
    get y(){
        return Math.round(this.real.y);
    }

    draw(state, flipped = false){
        function drawCall(state, _this) {
            switch (state) {
                case "run":
                    drawImg(SpriteAtlas.player.run[Math.round((Time.now - Time.launchTime) * 0.0075) % SpriteAtlas.player.run.length], _this.x - Camera.x, _this.y - Camera.y - 1);
                    break;
                case "idle2":
                    drawImg(SpriteAtlas.player.idle2[Math.round((Time.now - Time.launchTime) * 0.0075) % SpriteAtlas.player.idle2.length], _this.x - Camera.x, _this.y - Camera.y - 1);
                    break;
                default:
                    drawImg(SpriteAtlas.player.idle[Math.round((Time.now - Time.launchTime) * 0.0075) % SpriteAtlas.player.idle.length], _this.x - Camera.x, _this.y - Camera.y - 1);
                    break;
            }
        }
        
        if(flipped){
            ctx.save();
            ctx.translate((this.x - Camera.x + 9.5) * 2, 0);
            ctx.scale(-1, 1);
            drawCall(state, this);
            ctx.restore();
        }else{
            drawCall(state, this);
        }
    }

    tick(){
        this.draw("idle");
    }
}

class BulletPattern {
    constructor(...bulletArray){ // an array that is offset by [ bullet (class), spawnPos (vec 2), shootDir ( vec2, more magnatude = faster)... ]
        this.bulletArray = bulletArray;
    }

    shootIndexBullet(index){
        let pos = this.bulletArray[index * 3 + 1]; // in a set, [bullet, pos ( +1 )]
        activeBullets.push ( new this.bulletArray[index * 3](Math2.subtract(pos, Players[0].real), dir) );
    }
}

class Powerup {
    constructor(bind, x, y, region, onBindPressed = () => { console.log("this bind was pressed") }, player = Players[0]){
        this.bind = bind;
        this.onBindPressed = onBindPressed;
        this.x = x;
        this.y = y;

        this.region = region;

        this.collected = false;
    }

    tick() {
        if( this.collected === false ){
            this.draw();
        }
    }

    draw(){
        drawTileRegion(this.x, this.y, this.region);
    }
}

class ShootOnBindPressed extends Powerup{
    constructor(bind, x, y, region, bulletPattern){
        this.activeIndex = 0;
        super(bind, x, y, region, () => {
            bulletPattern.shootIndexBullet(this.activeIndex);
        });
    }
}

class BasicBullet {
    constructor(pos, dir, damage = 10){}
}

class BasicParticle {
    constructor(x, y, motionX, motionY, lifetime, texture = ParticleAtlas.terminalParticles.blue){
        this.startX = x;
        this.startY = y;
        this.real = {
            x : x,
            y : y
        }

        this.texture = texture;

        this.motion = {
            x : motionX,
            y : motionY
        }

        this.lifetime = lifetime;
        this.spawnTime = Time.now;
        this.age = 0;

        this.physObject = true;
    }

    get x(){
        return Math.round(this.real.x);
    }
    get y(){
        return Math.round(this.real.y);
    }

    hitbox(){
        return getTile(Math.floor((this.real.x) / 19), Math.floor((this.real.y) / 19));
    }

    tick(){
        this.age = Time.now - this.spawnTime;
        this.real.x += this.motion.x * 0.02 * Time.deltaTime;
        if(this.hitbox()){
            let oFartCount = 0;
            while(this.hitbox() && oFartCount < 38){
                this.real.x -= Math.abs(this.motion.x) / this.motion.x;
                oFartCount++;
            }
            this.motion.x *= -0.85;
        }
        //this.motion.x = this.motion.x;
        this.real.x += this.motion.x * 0.02 * Time.deltaTime;
        if(this.hitbox()){
            let oFartCount = 0;
            while(this.hitbox() && oFartCount < 38){
                this.real.x -= Math.abs(this.motion.x) / this.motion.x;
                oFartCount++;
            }
            this.motion.x *= -0.85;
        }

        this.draw();
    }

    draw(){
        drawImg(this.texture, this.x - Camera.x, this.y - Camera.y);
        //ctx.fillRect(this.x - Camera.x, this.y - Camera.y, 10, 10);
    }
}

class DustParticle {
    constructor(x, y, motionX, motionY, lifetime, texture = ParticleAtlas.terminalParticles.blue){
        this.startX = x;
        this.startY = y;
        this.real = {
            x : x,
            y : y
        }

        this.texture = texture;

        this.motion = {
            x : motionX,
            y : motionY
        }

        this.lifetime = lifetime;
        this.spawnTime = Time.now;
        this.age = 0;

        this.physObject = true;
    }

    get x(){
        return Math.round(this.real.x);
    }
    get y(){
        return Math.round(this.real.y);
    }

    hitbox(){
        return getTile(Math.floor((this.real.x) / 19), Math.floor((this.real.y) / 19));
    }

    tick(){
        this.age = Time.now - this.spawnTime;

        //this.motion.x = this.motion.x * Time.deltaTime * 0.2;
        this.real.x += this.motion.x * Time.deltaTime;
        
        //this.motion.x = this.motion.x;
        //this.motion.y = this.motion.y - Time.deltaTime * 0.02;
        //this.real.y += this.motion.y * 0.02 * Time.deltaTime;
        

        this.draw();
    }

    draw(){
        drawImg(this.texture, this.x - Camera.x, this.y - Camera.y);
        //ctx.fillRect(this.x - Camera.x, this.y - Camera.y, 10, 10);
    }
}

class ImpulseVolume { // sets velocity to a set value
    constructor(centerX, centerY, motionX = 0, motionY = 0, checkAreaFunction = (gameObjectToTest) => {return (Math2.distance(gameObjectToTest, new vec2(centerX, centerY)) < 19 ); }, playerCanMoveInVolume = true){
        this.x = centerX;
        this.y = centerY;

        this.checkAreaFunction = checkAreaFunction;

        this.motion = {
            x : motionX,
            y : motionY
        };

        this.playerCanMoveInVolume = playerCanMoveInVolume; // true: player can influence movement while in volume, false: player has no movement input control.
    }

    draw(){
        ctx.fillStyle = "#00000022";
        //ctx.fillRect(this.x - 4 - Camera.x, this.y - 4 - Camera.y, 8, 8);
    }

    tick(){
        for(let i = 0; i < Players.length; i++){
            let element = Players[i];
            if(element.physObject !== undefined){
                if(this.checkAreaFunction(element)){
                    if(this.motion.x !== 0){
                        element.motion.x = this.motion.x;
                    }
                    if(this.motion.y !== 0){
                        element.motion.y = this.motion.y;
                    }
                }
            }
        }
        //this.draw();
    }
}

class AccelerationVolume { // adds momentum to an object
    constructor(centerX, centerY, motionX = 0, motionY = 0, checkAreaFunction = (gameObjectToTest) => {return (Math2.distance(gameObjectToTest, new vec2(centerX, centerY)) < 19 ); }, playerCanMoveInVolume = true){
        this.x = centerX;
        this.y = centerY;

        this.checkAreaFunction = checkAreaFunction;

        this.motion = {
            x : motionX,
            y : motionY
        };

        this.playerCanMoveInVolume = playerCanMoveInVolume; // true: player can influence movement while in volume, false: player has no movement input control.
    }

    draw(){
        ctx.fillStyle = "#ffffff22";
        ctx.fillRect(this.x - 4 - Camera.x, this.y - 4 - Camera.y, 8, 8);
    }

    tick(){
        this.checkAllOfArray(Players, 9.5, 9.5);
        //this.checkAllOfArray(particleList);
        this.draw();
    }

    checkAllOfArray(array, offsetX = 0, offsetY = 0){
        for(let i = 0; i < array.length; i++){
            let element = array[i];
            if(element.physObject !== undefined){
                if(this.checkAreaFunction(new vec2(element.x + offsetX, element.y + offsetY))){
                    if(this.motion.x !== 0){
                        element.motion.x += this.motion.x * Time.deltaTime;
                    }
                    if(this.motion.y !== 0){
                        element.motion.y += this.motion.y * Time.deltaTime;
                    }
                }
            }
        }
    }
}

class PlayerModifier {
    constructor( x, y, pathArrayToChange, value, checkAreaFunction = (gameObjectToTest) => { return BasicAreaChecks.inRect(x, y, 19, 19, gameObjectToTest.x, gameObjectToTest.y);} ){
        this.x = x;
        this.y = y;

        this.path = pathArrayToChange;

        this.value = value;

        this.checkAreaFunction = checkAreaFunction;

    }

    tick(){
        this.checkAllOfArray(Players, 9.5, 9.5);
    }

    checkAllOfArray(array, offsetX = 0, offsetY = 0){
        for(let i = 0; i < array.length; i++){
            let element = array[i];
            if(element.physObject !== undefined){
                if(this.checkAreaFunction(new vec2(element.x + offsetX, element.y + offsetY))){
                    let localObjectRef = element;
                    for(let i = 0; i < this.path.length - 1; i++){
                        localObjectRef = localObjectRef[this.path[i]];
                    }
                    localObjectRef[this.path[this.path.length - 1]] = this.value;
                    console.log(this.value);
                }
            }
        }
    }
}

class SuspendedWireEntity{
    constructor(x1, y1, x2, y2, droop, swaySpeed = 0.5, color = "#334b66", lineWidth = 4, segments = 10){
        this.pointA = new vec2(x1, y1);
        this.pointB = new vec2(x2, y2);

        this.droop = droop;
        this.swaySpeed = swaySpeed;
        this.seed = (Math.random() - 0.5) * 180;
        this.segments = segments;

        this.color = color;
        this.lineWidth = lineWidth;
    }

    tick(){
        this.draw();
    }

    draw(){

        let sumOfSins = (t) => {
            let amplatudes = [0.07, 0.01, 0.04, 0.03, 0.01];
            let waveLengths = [2, 3, 4, 0.5, 0.21];
            let phases = [1, 0.5, 3, 2, 0.41];

            let sum = 0;
            for(let i = 0; i < amplatudes.length; i++){
                sum += amplatudes[i] * Math.sin( t * ( phases[i] * (0.5 * waveLengths[i]) ) );
            }
            return sum;
        }


        let windTime = Time.now * 0.001 * this.swaySpeed;
        let swayDist = 19 * 5;
        let droopVariance = 0.5 * Math.abs(this.pointA.y - this.pointB.y);
        ctx.beginPath();
        ctx.moveTo(this.pointA.x - Camera.x, this.pointA.y - Camera.y);
        for (let i = 0; i < this.segments + 1; i++ ){
            ctx.lineTo(
                BezierCurveFunctions.QuadraticLerp(
                    this.pointA.x,
                    ((this.pointA.x + this.pointB.x) * 0.5) + swayDist * (
                        sumOfSins(windTime + this.seed)
                    ),
                    this.pointB.x,

                    i / this.segments
                ) - Camera.x,
                BezierCurveFunctions.QuadraticLerp(
                    this.pointA.y,
                    Math.max(this.pointA.y, this.pointB.y) + this.droop + droopVariance/* * Math.sin(windTime + this.seed * Math.PI * 2)*/,
                    this.pointB.y,
                    
                    i / this.segments
                ) - Camera.y
            );
        }

        let savedStrokeStuff = {
            color : ctx.strokeStyle,
            lineWidth : ctx.lineWidth
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.strokeStyle = savedStrokeStuff.color;
        ctx.lineWidth = savedStrokeStuff.lineWidth;
    }

    
}

class HangingWireEntity{
    constructor(x1, y1, droop, swaySpeed = 0.5, color = "#334b66", lineWidth = 4, segments = 10){
        this.point = new vec2(x1, y1);

        this.droop = droop;
        this.swaySpeed = swaySpeed;
        this.seed = (Math.random() - 0.5) * 15;
        this.segments = segments;

        this.color = color;
        this.lineWidth = lineWidth;
    }

    tick(){
        this.draw();
    }

    draw(){

        let sumOfSins = (t) => {
            let amplatudes = [0.07, 0.01, 0.04, 0.03, 0.01];
            let waveLengths = [2, 3, 4, 0.5, 0.21];
            let phases = [1, 0.5, 3, 2, 0.41];

            let sum = 0;
            for(let i = 0; i < amplatudes.length; i++){
                sum += amplatudes[i] * Math.sin( t * ( phases[i] * (0.5 * waveLengths[i]) ) );
            }
            return sum;
        }


        let windTime = Time.now * 0.001 * this.swaySpeed;
        let swayDist = 19 * 5;
        let droopVariance = 0.3;
        ctx.beginPath();
        ctx.moveTo(this.point.x - Camera.x, this.point.y - Camera.y);
        
        let sOsPoint = new vec2( // Sum Of Sins Point
            swayDist * (
                sumOfSins(windTime + this.seed)
            ),
            this.point.y + this.droop + droopVariance * Math.sin(windTime * Math.PI * 0.2),
        );

        for (let i = 0; i < this.segments + 1; i++ ){
            ctx.lineTo(
                BezierCurveFunctions.QuadraticLerp( // X
                    this.point.x,
                    this.point.x + (sOsPoint.x * 0.25),
                    sOsPoint.x + this.point.x,

                    i / this.segments
                ) - Camera.x,

                BezierCurveFunctions.QuadraticLerp( // Y
                    this.point.y,
                    ((this.point.y + sOsPoint.y) * 0.5),
                    this.point.y + this.droop,
                    
                    i / this.segments
                ) - Camera.y
            );
        }

        let savedStrokeStuff = {
            color : ctx.strokeStyle,
            lineWidth : ctx.lineWidth
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.strokeStyle = savedStrokeStuff.color;
        ctx.lineWidth = savedStrokeStuff.lineWidth;
    }
}

class LevelTransitionTrigger {
    constructor( x, y, w, h, playerX, playerY, level, cutscene = undefined ){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.playerX = playerX;
        this.playerY = playerY;
        this.stringLevel = level;
        this.targetLevel;

        this.cutscene = cutscene;
    }

    start(){
        this.targetLevel = findInObjectFromString(AreaAtlas, this.stringLevel);
    }

    tick(){
        if(BasicAreaChecks.inRect(this.x, this.y, this.w, this.h, Players[0].real.x + 9.5, Players[0].real.y + 9.5)){
            Players[0].real.x = this.playerX;
            Players[0].real.y = this.playerY;
            changeArea(this.targetLevel);
            if(this.cutscene !== undefined){
                this.cutscene();
            }
        }
        if(devToolsEnabled){
            ctx.fillRect(this.x - Camera.x, this.y - Camera.y, this.w, this.h);
        }
    }
}

class ItemPickup {
    constructor(x, y, region, OnCollected = () => {console.log("collected!")}, AreaCheck = (thing2check) => {return BasicAreaChecks.inCircle(x, y, 19, thing2check.x, thing2check.y)}){
        this.x = x;
        this.y = y;
        this.region = region;

        this.OnCollected = OnCollected;
        this.areaCheck = AreaCheck;

        this.collected = false;

        this.enabled = true;
    }

    tick(){
        if(this.enabled){
            drawTileRegion(this.x,this.y,this.region);
            if(this.areaCheck(Players[0], this)){
                this.collected = true;
                this.enabled = false;

                this.OnCollected();
            }
        }
    }
}

class basic9Slice {
    constructor(topCornerX, topCornerY, solid = false, tileWidth = 19, tileHeight = 19, innerSectionX = -1, innerSectionY = -1){
        this.x = topCornerX;
        this.y = topCornerY;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.topLeft = {
            "region" : new Region( topCornerX + (0 * tileWidth), topCornerY + (0 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };
        this.top = {
            "region" : new Region( topCornerX + (1 * tileWidth), topCornerY + (0 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };
        this.topRight = {
            "region" : new Region( topCornerX + (2 * tileWidth), topCornerY + (0 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };

        this.left = {
            "region" : new Region( topCornerX + (0 * tileWidth), topCornerY + (1 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };
        this.center = {
            "region" : new Region( topCornerX + (1 * tileWidth), topCornerY + (1 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };
        this.right = {
            "region" : new Region( topCornerX + (2 * tileWidth), topCornerY + (1 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };

        this.bottomLeft = {
            "region" : new Region( topCornerX + (0 * tileWidth), topCornerY + (2 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };
        this.bottom = {
            "region" : new Region( topCornerX + (1 * tileWidth), topCornerY + (2 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };
        this.bottomRight = {
            "region" : new Region( topCornerX + (2 * tileWidth), topCornerY + (2 * tileHeight), tileWidth, tileHeight),
            "solid" : solid
        };

        if(innerSectionX !== -1){
            this.innerTopLeft = {
                "region" : new Region( innerSectionX + (0 * tileWidth), innerSectionY + (0 * tileHeight), tileWidth, tileHeight),
                "solid" : solid
            },
            this.innerTopRight = {
                "region" : new Region( innerSectionX + (1 * tileWidth), innerSectionY + (0 * tileHeight), tileWidth, tileHeight),
                "solid" : solid
            },
            this.innerBottomLeft = {
                "region" : new Region( innerSectionX + (0 * tileWidth), innerSectionY + (1 * tileHeight), tileWidth, tileHeight),
                "solid" : solid
            },
            this.innerBottomRight = {
                "region" : new Region( innerSectionX + (1 * tileWidth), innerSectionY + (1 * tileHeight), tileWidth, tileHeight),
                "solid" : solid
            }
        }
    }
}

class DrawShape {
    constructor(drawFunc = () => { ctx.fillRect(0, 0, 19, 19); }){
        this.draw = drawFunc;
    }

    moveInWorldTo(x, y){
        ctx.moveTo(x - Camera.x, y - Camera.y);
    }

    lineInWorldTo(x, y){
        ctx.lineTo(x - Camera.x, y - Camera.y);
    }

    tick(){
        this.draw();
    }
}

class PlayerSwitch {
    constructor(x, y, activationRadius, triggerOnce = false, Ontrigger = () => {console.log("switch triggered!!!!")}){
        this.x = x;
        this.y = y;
        this.activationRadius = activationRadius;

        this.flags = {
            "triggered" : false,
            "triggerOnce" : triggerOnce,

            "stillInRadius" : false,
        }

        this.OnTrigger = Ontrigger;
    }

    tick(){
        if(BasicAreaChecks.inCircle(this.x, this.y, this.activationRadius, Players[0].real.x + 9.5, Players[0].real.y + 19) && !this.flags.triggered){
            if(this.flags.triggerOnce){
                this.flags.triggered = true;
                this.OnTrigger();
            }
        }
        this.draw();
    }

    draw(){
        if(this.flags.triggered){
            drawTileRegion(this.x, this.y-19, {"region" : new Region(171, 171, 19, 19, -9, 0)});
        }else{
            drawTileRegion(this.x, this.y-19, {"region" : new Region(190, 171, 19, 19, -9, 0)});
        }
    }
}