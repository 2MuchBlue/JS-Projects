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

        this.extraData = {};

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
                    drawImg(SpriteAtlas.player.run[Math.round((Time.now - Time.launchTime) * 0.0075) % 4], _this.x - Camera.x, _this.y - Camera.y);
                    break;
                default:
                    drawImg(SpriteAtlas.player.idle[Math.round((Time.now - Time.launchTime) * 0.0075) % 4], _this.x - Camera.x, _this.y - Camera.y);
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
            this.velocity.y = 0;
            this.extraData.lastOnGroundTime = Time.now;
            this.extraData.canCoyoteTime = true;
        }

        // checks if 1) has pressed the jump button recently, 2) making sure you haven't already jumped, 3) tests if you were on the ground in the last 150 milisecs.
        if(btnPressedWithin(this.controlScheme, "up", 150) === 1 && this.extraData.canCoyoteTime && this.extraData.lastOnGroundTime + 150 > Time.now){
            this.velocity.y = -this.jumpPower;
            this.extraData.canCoyoteTime = false;
        }

        let rawHorz = ( -btn(this.controlScheme, "left") + btn(this.controlScheme, "right"));
        let horizontal = rawHorz * this.horizontalSpeed * Time.deltaTime;

        if(rawHorz > 0.2){
            this.extraData.flipped = true;
        }else if(rawHorz < -0.2){
            this.extraData.flipped = false;
        }

        this.real.x += horizontal;
        if(this.hitbox){
            while(this.hitbox){
                this.real.x -= Math.abs(horizontal) / horizontal;
            }
        }

        if(Math.abs( rawHorz ) > 0.2){
            this.draw("run", this.extraData.flipped);
        }else{
            this.draw("idle", this.extraData.flipped);
        }
    }
}