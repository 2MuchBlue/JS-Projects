// ===== Canvas Constants =====
const canvasElement = document.getElementById('mainCanvas');
const ctx = canvasElement.getContext('2d');
const canvasHalfWidth = canvasElement.width * 0.5;
const canvasHalfHeight = canvasElement.height * 0.5;

const deg2rad = Math.PI / 180;

// ===== Input =====
    canvasElement.addEventListener('mousemove', function(e){
        mouse.real.x = (e.offsetX / canvasElement.clientWidth) * canvasElement.width;
        mouse.real.y = (e.offsetY / canvasElement.clientHeight) * canvasElement.height;

        mouse.movementX = e.movementX;
        mouse.movementY = e.movementY;
    });

    document.addEventListener('mousedown', function(e){
        mouse[e.button] = true;
    });
    
    document.addEventListener('mouseup', function(e){
        mouse[e.button] = false;
    });

    let keys = {};
    let keyTimes = {
        lift : {},
        down : {}
    };
    let mouse = {
        0: false,
        1: false,
        2: false,

        real : {
          x: 0,
          y: 0,
        },

        get x() {
          return Math.floor(mouse.real.x);
        },

        get y() {
          return Math.floor(mouse.real.y);
        },

        movementX : 0,
        movementY : 0,

        inAreaCheck(x, y, w, h){
            return (mouse.x >= x && mouse.x <= x + w && mouse.y >= y && mouse.y <= y + h);
        }
    };

    let Time = {
        deltaTime : 0,
        now : 0,
        launchTime : new Date().getTime(),
        startGameTime: 0,
        frameCount : 0,
        engineCount : 0,
    };    

    document.addEventListener('keydown', function(e){
        if(keys[e.code] === false){
            keyTimes.down[e.code] = Time.now;
        }
        keys[e.code] = true;
    });

    document.addEventListener('keyup', function(e){
        if(keys[e.code] === true){
            keyTimes.down[e.code] = Time.now;
        }
        keys[e.code] = false;
    });

    function btn(button){
        return (keys[button] === true ? 1 : 0);
    }

    function lenientBtn(button, millisecsBack){
        if(keys[button] === true){
            return 1;
        }
        return (Time.now - keyTimes.down[button] <= millisecsBack ? 1 : 0);
    }

    let now = new Date();
    now = now.getTime();
    let lastTime = now;

    function engineUpdate(){
        let now = new Date();
        now = now.getTime();
        Time.now = now;

        Time.deltaTime = now - lastTime;
        lastTime = now;

        if(Time.deltaTime < 100){
            gameUpdate();
            Time.frameCount++;
        }else{
            console.log("You've Left!");
        }

        Time.engineCount++;
        requestAnimationFrame(engineUpdate);
    }

    