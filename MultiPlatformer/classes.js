
// ===== Player Class =====
    class Player {
        constructor (stateAnimations, timeToSpeedUp, topSpeed, timeToSlowDown, jumpUpSpeed, jumpHangTime, jumpHeight, spawnX = 0, spawnY = 0) {
            this.animationStates = stateAnimations;
            this.horizontalMovement  = {
                rise : timeToSpeedUp,
                maxSpeed : topSpeed,
                fall : timeToSlowDown
            };

            this.verticalMovement = {
                rise : jumpUpSpeed,
                maxHeight : jumpHeight,
                hang : jumpHangTime
            };

            this.real = {
                x : spawnX,
                y : spawnY
            };

            this.velocity = {
                y : 0
            }

            this.extraData = {
                lastTimeOnGound : 0,
                canCoyote : true,
                hasReleasedJump : true,

            }
        }

        get x(){
            return Math.floor(this.real.x);
        }

        get y(){
            return Math.floor(this.real.y);
        }

        checkBoundingBox(){
            return (
                getDataOfTileAtPos(this.real.x - 3.5, this.real.y, currentLevel, 0.125).solid ||
                getDataOfTileAtPos(this.real.x + 3.5, this.real.y, currentLevel, 0.125).solid ||
                getDataOfTileAtPos(this.real.x - 3.5, this.real.y + 3, currentLevel, 0.125).solid ||
                getDataOfTileAtPos(this.real.x + 3.5, this.real.y + 3, currentLevel, 0.125).solid ||
                getDataOfTileAtPos(this.real.x, this.real.y + 3, currentLevel, 0.125).solid ||
                getDataOfTileAtPos(this.real.x, this.real.y - 3, currentLevel, 0.125).solid
            )
        }

        tick() {
            let horz = (-btn("KeyA") + btn("KeyD")) * Time.deltaTime * this.horizontalMovement.maxSpeed;

            this.real.x += horz;
            if(this.checkBoundingBox()){ // check if something is in the box
                let ahhhhCount = 0;
                while (this.checkBoundingBox() || ahhhhCount > 200){
                    ahhhhCount++;
                    this.real.x -= Math.abs(horz) / horz;
                }
            }

            this.velocity.y += globalConsts.gravity;
            console.log(this.velocity.y);
            this.velocity.y = ExtraMath.clamp(this.velocity.y, -globalConsts.verticalTerminalVelocity, globalConsts.verticalTerminalVelocity);
            
            this.real.y += this.velocity.y * Time.deltaTime * 0.2;

            if(btn("Space") === 0){
                this.extraData.hasReleasedJump = true;
            }

            if(this.checkBoundingBox()){ // check if something is in the box
                let ahhhhCount = 0;
                while (this.checkBoundingBox() || ahhhhCount > 200){
                    ahhhhCount++;
                    this.real.y -= Math.abs(this.velocity.y) / this.velocity.y;
                }

                let yDirection = Math.abs(this.velocity.y) / this.velocity.y;
                if(yDirection === 1){
                    this.extraData.lastTimeOnGound = Time.now;
                    this.extraData.canCoyote = true;
                }

                if(lenientBtn("Space", 100) && yDirection === -1 && this.extraData.hasReleasedJump){
                    this.extraData.hasReleasedJump = false;
                    this.velocity.y = -this.verticalMovement.maxHeight;
                }else{
                    this.velocity.y = 0;
                }
            }else if(btn("Space") && Time.now - this.extraData.lastTimeOnGound <= globalConsts.coyoteTime && this.extraData.canCoyote && this.extraData.hasReleasedJump ) {
                this.velocity.y = -this.verticalMovement.maxHeight;
                this.extraData.canCoyote = false;
                this.extraData.hasReleasedJump = false;
            }

            this.draw("idle");
        }

        draw(state) {
            this.animationStates[state].draw(this.x - 4, this.y - 4, this.animationStates[state].sprite.w, this.animationStates[state].sprite.h, true);
        }

        get cameraDirection() {
            let x = (-btn("KeyA") + btn("KeyD")) * 10;
            let y = (-btn("KeyW") + btn("KeyS")) * 10;

            return {x : x, y : y};
        }
    }

class StaticSprite {
    constructor (sprite){
        this.sprite = sprite;
    }

    draw(lx, ly, lw = 8, lh = 8, useCamera = false){
        drawImg(this.sprite, lx - (useCamera ? Camera.x : 0 ), ly - (useCamera ? Camera.y : 0 ), lw, lh);
    }
}

class AnimatedSprite {
    constructor(animationTime, ...sprites ){
        this.animationTime = animationTime;
        this.sprites = sprites;
    }

    get sprite() {
        return this.sprites[0];
    }

    draw(lx, ly, lw = 8, lh = 8, useCamera = false){
        let frameNumber = Math.floor((Time.now - Time.launchTime) / this.animationTime) % this.sprites.length;
        drawImg(this.sprites[frameNumber], lx - (useCamera ? Camera.x : 0 ), ly - (useCamera ? Camera.y : 0 ), lw, lh);
    }
}

class Tile {
    constructor ( sprite, solid = true, group = "generic", destructible = false ){
        this.sprite = sprite;
        this.solid = solid;
        this.destructible = destructible;
        this.group = group;
    }

    draw(lx, ly, lw = 8, lh = 8, useCamera = false){
        this.sprite.draw(lx, ly, lw, lh, useCamera);
    }
}

// ===== UI =====
    class uiButton {
        constructor( x, y, w, h, functions, spriteClass, hoverSpriteClass = undefined, clickedSpriteClass = undefined){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;

            this.spriteClass = spriteClass;
            if(hoverSpriteClass === undefined){
                this.hoverSpriteClass = spriteClass;
            }else {
                this.hoverSpriteClass = hoverSpriteClass;
            }

            if(clickedSpriteClass === undefined){
                this.clickedSpriteClass = spriteClass;
            }else {
                this.clickedSpriteClass = clickedSpriteClass;
            }

            this.functions = functions;
        }

        draw() {
            this.spriteClass.draw(this.x, this.y, this.w, this.h);
            if(mouse.inAreaCheck( this.x, this.y, this.w, this.h ) === true){
                this.hoverSpriteClass.draw(this.x, this.y, this.w, this.h);
                
                if(mouse[0] === true){
                    this.clickedSpriteClass.draw(this.x, this.y, this.w, this.h);
                    try{
                        this.functions.click();
                    } catch {
                        console.warn("this button has no click function. This is not an issue just a note");
                    };
                }else{ // run if hovering but not clicking
                    try{
                        this.functions.hover();
                    } catch {
                        console.warn("this button has no hover function. This is not an issue just a note");
                    };
                }
            }
        }
    }

    class uiText {
        constructor ( x, y, text, color = "#fff", font = "24px sans-serif bold" ) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.font = font;
            this.color = color;
        }

        draw(){
            let startingFont = ctx.font;
            let startingColor = ctx.fillStyle;
            ctx.font = this.font;
            ctx.fillStyle = this.color;
            ctx.fillText(this.text, this.x, this.y);
            ctx.font = startingFont;
            ctx.fillStyle = startingColor;
        }
    }