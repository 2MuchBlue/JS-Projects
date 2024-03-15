// ===== Canvas Constants =====
const canvasElement = document.getElementById('mainCanvas');
const ctx = canvasElement.getContext('2d');
const canvasHalfWidth = canvasElement.width * 0.5;
const canvasHalfHeight = canvasElement.height * 0.5;

// Input Gathering =====
let paused = true;
let keys = {};
let mouse = {
    0: false,
    1: false,
    2: false,

    x: 0,
    y: 0
};

document.addEventListener('keydown', function(e){
    keys[e.key] = true;
    //console.log(e.key + " down");

    if(e.key == 'p'){
        paused = !paused;

        if(paused){
            console.log('paused');
        }else{
            console.log('unpaused');
        }
    }
});

document.addEventListener('keyup', function(e){
    keys[e.key] = false;

    //console.log(e.key + " up");   
});

document.addEventListener('click', function(){
    click();
})

function btn(key){
    return (keys[key] === true ? 1 : 0);
}

let Time = {
    deltaTime : 0
};

let now = new Date();
now = now.getTime();
let lastTime = now;

function engineUpdate(){
    let now = new Date();
    now = now.getTime();

    Time.deltaTime = now - lastTime;
    lastTime = now;

    alwaysUpdate();
    if(!paused){
        update();
    }

    requestAnimationFrame(engineUpdate);
}

canvasElement.addEventListener('mousemove', function(e){
    mouse.x = (e.offsetX / canvasElement.clientWidth) * 128;
    mouse.y = (e.offsetY / canvasElement.clientHeight) * 128;
});

document.addEventListener('mousedown', function(e){
    mouse[e.button] = true;
});

document.addEventListener('mouseup', function(e){
    mouse[e.button] = false;
});

//engineUpdate();

let loaded = 0;
let maxToLoad = 2;

const blockSpriteSheet = new Image(); // Create new img element
blockSpriteSheet.addEventListener("load", () => {
  engineUpdate();
});
blockSpriteSheet.src = "../resources/sprites.png"; // Set source path


