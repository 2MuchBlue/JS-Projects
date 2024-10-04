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

class KeyEvent {
    constructor(pressTime, releaseTime){
        this.pressTime = pressTime;
        this.releaseTime = releaseTime;
    }
}

class Door {
    constructor (x, y, sprite, name, linkFromLevel, linkFromDoor, linkToLevel, linkToDoor){
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.name = name;
        this.linkTo = { "door" : linkToDoor, "level" : linkToLevel };
        this.linkFrom = { "door" : linkFromDoor, "level" : linkFromLevel }
    }

    draw(){
        drawImg(this.sprite, this.x, this.y);
    }

    enterDoor(){

    }
}

class Player {
    constructor( name, controlScheme, horSpeed, jumpPower ){
        this.name = name;
        this.controlScheme = controlScheme;
        this.horizontalSpeed = horSpeed;
        this.jumpPower = jumpPower;
        this.real = {
            x : 19,
            y : 19
        }

        this.velocity = {
            x : 0,
            y : 0
        }

        this.extraData = {
            "lastFrameOnGround" : 0
        };

        this.coyoteValues = {
            "timeOffTheLedge" : 100
        }
    }

    get hitbox() { // semi-hardcoded hitbox thing
        let w = 4;
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

        //let vertical = ( -btn(this.controlScheme, "up") + btn(this.controlScheme, "down")) * this.horizontalSpeed * Time.deltaTime;

        this.velocity.y += Time.deltaTime * 0.005;
        this.real.y += this.velocity.y * Time.deltaTime * 0.2;
        if(this.hitbox){ // if on ground...
            while(this.hitbox){ // while on ground...
                this.real.y -= Math.abs(this.velocity.y) / this.velocity.y; // get out of the ground in the oppesite direction you went in
            }
            if((Math.abs(this.velocity.y) / this.velocity.y) === 1){
                this.extraData.canCoyoteTime = true;
            }
            this.velocity.y = 0;
            this.extraData.lastOnGroundTime = Time.now;
        }

        

        // checks if 1) has pressed the jump button recently, 2) making sure you haven't already jumped, 3) tests if you were on the ground in the last 150 milisecs.
        if(btnPressedWithin(this.controlScheme, "up", 150) === 1 && this.extraData.canCoyoteTime && this.extraData.lastOnGroundTime + 150 > Time.now){
            this.velocity.y = -this.jumpPower;
            this.extraData.canCoyoteTime = false;
            this.extraData.hasJumped = true;
        }

        let rawHorz = ( -btn(this.controlScheme, "left") + btn(this.controlScheme, "right"));
        this.velocity.x = rawHorz * this.horizontalSpeed * Time.deltaTime;

        if(rawHorz > 0.2){
            this.extraData.flipped = true;
        }else if(rawHorz < -0.2){
            this.extraData.flipped = false;
        }

        this.real.x += this.velocity.x;
        if(this.hitbox){
            while(this.hitbox){
                this.real.x -= Math.abs(this.velocity.x) / this.velocity.x;
            }
            this.extraData.canWallJump = true;
            this.extraData.lastWallTouchTime = Time.now;
        }

        // checks if 1) has pressed the jump button recently, 2) making sure you haven't already jumped, 3) tests if you were on the ground in the last 150 milisecs.
        /*if(btn(this.controlScheme, "up") === 1 && !this.extraData.hasWallJumped && this.extraData.canWallJump && this.extraData.lastWallTouchTime + 150 > Time.now){
            this.velocity.y = -this.jumpPower;
            this.extraData.canWallJump = false;
            this.extraData.hasWallJumped = true;
        }*/

        if(Math.abs( rawHorz ) > 0.2){
            this.draw("run", this.extraData.flipped);
        }else{
            if(key("Space") === 1){
                this.draw("idle2", this.extraData.flipped);
            }else{
                this.draw("idle", this.extraData.flipped);
            }
        }
    }

    hitGroundParticle() {
        for(let i = 0; i < 10; i++){
            particleList.push(new BasicParticle(this.x + 9.5, this.y + 9.5, (Math.random() - 0.5) * 0.2 , Math.random() * 3, 100));
        }
    }
}

class Terminal {
    constructor(x, y, tile, height, arrowColorPrimary, arrowColorSecondary, arrowDrawPosX, arrowDrawPosY){
        this.x = x;
        this.y = y;
        this.tile = tile;
        this.arrowColorPrimary = arrowColorPrimary;
        this.arrowColorSecondary = arrowColorSecondary;

        this.height = height;

        this.arrow = {
            x : arrowDrawPosX,
            y : arrowDrawPosY
        }

        this.collectted = false;
    }

    draw(){
        if(!this.collectted){
            worldArrow(this.x + 9.5, this.y + 9.5, this.arrow.x, this.arrow.y, this.arrowColorPrimary, this.arrowColorSecondary);
            for(let i = 0; i < this.height; i++){
                drawImg(this.tile, this.x - Camera.x, (this.y + i * 19) - Camera.y);
            }
        }

    }

    tick(){
        if(inAreaCheck(Players[0].x, Players[0].y, this.x, this.y, 19, 19 * this.height)){
            //ParticlePresets.spark(this.x + 9.5, this.y + 9.5, 6, 3, 5);

            if(!this.collectted){
                for(let i = 0; i < 20 * this.height; i++){
                    particleList.push(new BasicParticle(this.x + 9.5, this.y + 9.5, (Math.random() + 3) * 2 , Math.random() * 10, 4000));
                }
            }
            this.collectted = true;
        }

        this.draw();
    }
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
        this.motion.y = this.motion.y + Time.deltaTime * 0.02;
        this.real.y += this.motion.y * 0.02 * Time.deltaTime;
        if(this.hitbox()){
            let oFartCount = 0;
            while(this.hitbox() && oFartCount < 38){
                this.real.y -= Math.abs(this.motion.y) / this.motion.y;
                oFartCount++;
            }
            this.motion.y *= -0.75;
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

class BasicTile {
    constructor(){}
}