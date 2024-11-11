
let playPhase = 0;
const instructionElement = document.getElementById("instructions");
const stepCountElement = document.getElementById("stepCount");

let internalCounters = {
    "paintingCount" : 0,
    "cameraCount" : 0,

    "motionCount" : 0,
    "camerasAlive" : {
        1 : true,
        2 : true,
        3 : true,
        4 : true,
        5 : true,
        6 : true,
    },
    "paintingPositions" : {},
    "cameraPositions" : {},

    "playerPos" :{
        "lastPos" :{
            x : 0,
            y : 0
        },

        "currentPos": {
            x : 0,
            y : 0
        }
    },

    "stepCount" : 0,
    "currentStepShown" : -1
}

let playerSteps = [];

let paintingChar = "X";
let playerChar = "O";
let emptyTile = " ";

let world = [];
let codes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];
function letterToInt(letter){
    let apple = {
        "a" : 0,
        "b" : 1,
        "c" : 2,
        "d" : 3,
        "e" : 4,
        "f" : 5,
        "g" : 6,
        "h" : 7,
        "i" : 8,
        "j" : 9,
        "k" : 10,
        "l" : 11,
        "m" : 12
    }

    return apple[letter];
}
window.onload = () => {
    for (let y = 0; y < 11; y++){
        world.push([]);
        for (let x = 0; x < 12; x++){
            world[y].push(emptyTile);
            if(
                indexCheck(0, 0, x, y) ||
                indexCheck(1, 0, x, y) ||
                indexCheck(2, 0, x, y) ||
                indexCheck(0, 1, x, y) ||
                indexCheck(1, 1, x, y) ||
                indexCheck(2, 1, x, y) ||

                indexCheck(9,  0, x, y) ||
                indexCheck(10, 0, x, y) ||
                indexCheck(11, 0, x, y) ||
                indexCheck(9,  1, x, y) ||
                indexCheck(10, 1, x, y) ||
                indexCheck(11, 1, x, y) ||

                indexCheck(9,  10, x, y) ||
                indexCheck(10, 10, x, y) ||
                indexCheck(11, 10, x, y) ||
                indexCheck(9,  9, x, y) ||
                indexCheck(10, 9, x, y) ||
                indexCheck(11, 9, x, y) ||

                indexCheck(0, 10, x, y) ||
                indexCheck(1, 10, x, y) ||
                indexCheck(2, 10, x, y) ||
                indexCheck(0, 9, x, y) ||
                indexCheck(1, 9, x, y) ||
                indexCheck(2, 9, x, y) ||

                indexCheck(0, 5, x, y) ||
                indexCheck(11, 4, x, y) ||

                indexCheck(5, 10, x, y) ||
                indexCheck(6, 10, x, y)
            ){ continue; }

            let button = document.createElement("button");
            button.style.gridArea = `${codes[y]}${codes[x]}`;
            button.classList = `tile button_${codes[y]}${codes[x]}`;
            button.id = `button_${codes[y]}${codes[x]}`;
            button.onclick = function() {buttonFunction(button.id)};
            
            if(indexInRange(3, 0, 6, 2, x, y)){
                button.classList = button.classList + " red";
            }
            if(indexInRange(0, 2, 3, 3, x, y)){
                button.classList = button.classList + " purple";
            }

            if(indexInRange(0, 6, 3, 3, x, y)){
                button.classList = button.classList + " gold";
            }

            if(indexInRange(4, 3, 4, 5, x, y)){
                button.classList = button.classList + " white";
            }

            if(indexInRange(9, 2, 3, 2, x, y)){
                button.classList = button.classList + " blue";
            }

            if(indexInRange(9, 5, 3, 4, x, y)){
                button.classList = button.classList + " green";
            }

            if(indexInRange(3, 9, 2, 2, x, y)){
                button.classList = button.classList + " utility";
            }
            if(indexInRange(7, 9, 2, 2, x, y)){
                button.classList = button.classList + " utility";
            }

            
            document.body.appendChild(button);
        }
    }
}

window.onkeydown = (e) => {
    if(e.code === "ArrowLeft"){
        showPriorStep();
    }
    if(e.code === "ArrowRight"){
        showNextStep();
    }
}

function indexCheck(x, y, indexX, indexY){
    return (indexX === x && indexY === y);
}

function indexInRange(x1, y1, w, h, indexX, indexY){
    for(let yI = 0; yI < h; yI++ ){
        for(let xI = 0; xI < w; xI++ ){
            if(indexCheck(xI + x1, yI + y1, indexX, indexY)){
                return true;
            }
        }
    }
    return false;
}

function buttonFunction(buttonId){

    if(playPhase === 2){
        console.log(buttonId[7], buttonId[8]);
        internalCounters.playerPos.lastPos.x = internalCounters.playerPos.currentPos.x;
        internalCounters.playerPos.lastPos.y = internalCounters.playerPos.currentPos.y;

        internalCounters.playerPos.currentPos.x = letterToInt(buttonId[8]);
        internalCounters.playerPos.currentPos.y = letterToInt(buttonId[7]);
        
        internalCounters.stepCount++;

        document.getElementById(buttonId).innerText = playerChar;
        document.getElementById(`button_${codes[internalCounters.playerPos.lastPos.y]}${codes[internalCounters.playerPos.lastPos.x]}`).innerText = world[internalCounters.playerPos.lastPos.y][internalCounters.playerPos.lastPos.x];
        //internalCounters.cameraPositions[`${buttonId[7]}${buttonId[8]}`] = paintingChar;

        playerSteps.push(buttonId);
        updateStepDisplay();
    }

    if(playPhase === 1){ // camera placment phase
        console.log(buttonId[7], buttonId[8]);
        if(world[letterToInt(buttonId[7])][letterToInt(buttonId[8])] === emptyTile){
            internalCounters.cameraCount++;
        }
        world[letterToInt(buttonId[7])][letterToInt(buttonId[8])] = internalCounters.cameraCount;
        document.getElementById(buttonId).innerText = internalCounters.cameraCount;
        internalCounters.cameraPositions[`${buttonId[7]}${buttonId[8]}`] = paintingChar;

        if(internalCounters.cameraCount >= 6){
            console.log("Cameras Done!!!");
            playPhase = 2;
            instructionElement.innerText = "Now Pick A Starting Position!";
        }
    }

    if(playPhase === 0){ // painting placement phase
        console.log(buttonId[7], buttonId[8]);
        if(world[letterToInt(buttonId[7])][letterToInt(buttonId[8])] === emptyTile){
            internalCounters.paintingCount++;
        }
        world[letterToInt(buttonId[7])][letterToInt(buttonId[8])] = paintingChar;
        document.getElementById(buttonId).innerText = paintingChar;
        internalCounters.paintingPositions[`${buttonId[7]}${buttonId[8]}`] = paintingChar;

        if(internalCounters.paintingCount >= 9){
            console.log("Paintings Done!!!");
            playPhase = 1;
            instructionElement.innerText = "Now Click Positions Of All Cameras (starts at 1, then 2, thru 6)";
        }
    }

    updateStepDisplay();
}

function showPriorStep(){
    if(internalCounters.currentStepShown > -1){
        internalCounters.currentStepShown--;
        updateStepDisplay();
    }
}

function showNextStep(){
    if(internalCounters.currentStepShown < internalCounters.stepCount - 1){
        internalCounters.currentStepShown++;
        updateStepDisplay();
    }
}

function updateStepDisplay(){
    stepCountElement.innerText = `${Math.max(internalCounters.currentStepShown, 0)} / ${Math.max(internalCounters.stepCount - 1, 0)}`;

    for(let i = 0; i < internalCounters.stepCount - 1; i++){
        //console.log(playerSteps[i]);
        document.getElementById(playerSteps[i]).setAttribute("player_here", false);
    }
    if(internalCounters.currentStepShown === -1){
        return;
    }

    document.getElementById(playerSteps[internalCounters.currentStepShown]).setAttribute("player_here", true);
}