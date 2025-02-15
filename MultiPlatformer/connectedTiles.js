

class ConnectedRule {
    constructor ( topGroup, bottomGroup, leftGroup, rightGroup, spriteToDrawIfSuccess ){
        this.top    = topGroup;
        this.bottom = bottomGroup;
        this.left   = leftGroup;
        this.right  = rightGroup;
        this.sprite = spriteToDrawIfSuccess;
    }

    test(topVal, bottomVal, leftVal, rightVal){
        return (
            topVal === this.top && bottomVal === this.bottom && leftVal === this.left && rightVal === this.right
        );
    }

    drawTry(topVal, bottomVal, leftVal, rightVal, x, y, w, h, useCamera = false){
        if(this.test(topVal, bottomVal, leftVal, rightVal)){
            this.sprite.draw(x, y, w, h, useCamera);
        }
    }
}

class ConnectedSprite {
    constructor (sprites, tileSize, 
        rules = [
            new ConnectedRule("general", "general", "general", "general")
        ]
    ){
        this.sprites = sprites;
            /*
             * Expected : {
             *      up : {
             *          left : ...,
             *          center : ...,
             *          right : ...
             *      },
             *      middle : {
             *          left : ...,
             *          center : ...,
             *          right : ...
             *      },
             *      down : {
             *          left : ...,
             *          center : ...,
             *          right : ...
             *      },
             * }
            */

        this.tileSize = tileSize;
        this.group = group;

    }

    draw(lx, ly, lw = 8, lh = 8, useCamera = false, worldX, worldY) {
        let left  = getDataOfTileAtPos(worldX - 1, worldY).group;
        let right = getDataOfTileAtPos(worldX + 1, worldY).group;
        let up    = getDataOfTileAtPos(worldX, worldY + 1).group;
        let down  = getDataOfTileAtPos(worldX, worldY - 1).group;
    }
}