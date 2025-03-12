class keyCard{
    constructor(keyCode, displayName = keyCode){
        this.keyCode = keyCode;
        this.displayName = displayName;
    }

    draw(x, y){
        ctx.strokeRect(x - 16, y - 16, 32, 32);
        ctx.fillText(this.displayName, x - 8, y, 32);
    }
}