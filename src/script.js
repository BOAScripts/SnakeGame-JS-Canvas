// GLOBAL VARS
let height = document.querySelector('#height'); // input
let width = document.querySelector('#width'); // input

const grid = document.querySelector('#grid'); // canvas 
const ctx = grid.getContext("2d"); // canvas context

let scoreDisplay = document.querySelector('#score'); // text
const btnSection = document.querySelector('.btnSection'); // Section
const playBtn = document.querySelector('#play'); // button
const resetBtn = document.querySelector('#reset'); // button

const cell = 32; // cell size in px
const bgCell = new Image();
bgCell.src = "src/img/snakeBg.png" // Background cell image

const snakeBody = new Image();
snakeBody.src = "src/img/snakeBody.png" // Body of snake image

const goalImg = new Image();
goalImg.src = "src/img/goal.png" // Goal image

let maxX; // Grid boundaries
let maxY;
const gridArray = []; // Array of all pos in grid {x:..,y:..}

let snake = []; // array of objs{x:..,y:..}
let goal = {}; // obj {}{x:..,y:..}
let score = 0;
let d = "RIGHT"; // init direction is right

let game; // global access of the game
let canPress = true; // key press timing mitigation

// START ON PLAY
playBtn.addEventListener('click', () => {
    //btnSection.style.display = 'none';
    // Set init. grid and boundaries
    generateGrid(width.value,height.value);
    getGridArray(maxX,maxY);
    // set init. cells of the snake (middle of grid)
    generateStartSnake(maxX,maxY);
    // set init. goal
    const initGoalPos = getAvailablePos();
    goal = {
        x : initGoalPos.x,
        y : initGoalPos.y
    }
    // start the game
    game = setInterval(displayFrame,150);
    // get direction input
    document.addEventListener('keydown', setDirection);
    // reset game
    resetBtn.addEventListener('click', () => {
        gameOver();
    })
})

// FUNCS
// Draw frame on canvas
function displayFrame(){
    // redraw grid
    generateGrid(maxX,maxY);
    // display goal
    ctx.drawImage(goalImg,goal.x*cell,goal.y*cell);    
    // draw snake
    for (let body of snake){
        ctx.drawImage(snakeBody,body.x*cell,body.y*cell);
    }

    // Current head position
    let headX = snake[0].x;
    let headY = snake[0].y;

    // Set direction of new head
    if(d === "LEFT"){
        headX--;
    }
    if(d === "RIGHT"){
        headX++;
    }
    if(d === "UP"){
        headY--;
    }
    if(d === "DOWN"){
        headY++;
    }

    // when snake hits a goal
    if (headX === goal.x && headY === goal.y){
        score++;
        scoreDisplay.innerText = score;
        const newGoalPos = getAvailablePos();
        goal = {
            x : newGoalPos.x,
            y : newGoalPos.y
        }
        //console.log(`goalX:${goal.x/cell}`,`goalY:${goal.y/cell}`)
    }
    else {
        snake.pop();
    }

    // define following head
    let newHead = {
        x : headX,
        y : headY
    }

    // Check collisions (ded)
    if (headX < 0 || headX >= maxX || headY < 0 || headY >= maxY || isOuroboros(newHead,snake)){
        gameOver();
    }
    // add new head
    snake.unshift(newHead);
    // Allow again an input
    canPress = true;
    
}

// Draw grid
function generateGrid (width,height) {
    if (width<10 && height<10){
        width = 11;
        height = 11;
    }
    // define boundaries of canvas
    grid.width = width * cell;
    grid.height = height * cell;
    // draw each cell
    for (let i=0; i<width; i++){
        for (let j=0; j<height; j++){
            ctx.drawImage(bgCell,i*cell,j*cell);
        }
    }
    // set value of global vars
    maxX = width;
    maxY = height;
    //return `${width}-${height}`;
}

function getGridArray (gridMaxX,gridMaxY){
    for (let k=0; k<gridMaxX; k++){
        for (let l=0; l<gridMaxY; l++){
            gridArray.push({x : k, y : l})
        }
    }
}

// return a random position where snake isn't
function getAvailablePos(){
    const gridNotSnake = [].concat(gridArray);
    for (let n in snake){
        for (let m in gridNotSnake){
            // condition seems not OK :-(
            if (snake[n].x == gridNotSnake[m].x && snake[n].y == gridNotSnake[m].y){
                gridNotSnake.splice(m,1);
            }
        }
    }
    
    if (gridArray.length !== (gridNotSnake.length + snake.length)){
        console.log(gridNotSnake, snake, `grid =${gridArray.length}; grid-snake =${gridNotSnake.length + snake.length}`);
        gameOver();
        console.error ('DIF ERROR')
    }

    let availablePos = gridNotSnake[Math.floor(Math.random() * gridNotSnake.length)];
    return availablePos;
}

// Define init snake position in grid
function generateStartSnake(maxX,maxY){
    snake[0] = {
        x : Math.round(maxX/2),
        y : Math.round(maxY/2)
    }
    snake[1] = {
        x : Math.round(maxX/2)-1,
        y : Math.round(maxY/2)
    }

}

// Define direction on key press
function setDirection(event){
    let key = event.code;
    if ((key === "ArrowLeft" || key === "KeyA") && d != "RIGHT" && canPress){
        d = "LEFT";
    }
    else if((key === "ArrowUp" || key === "KeyW") && d != "DOWN" && canPress){
        d = "UP";
    }
    else if((key === "ArrowRight" || key === "KeyD") && d != "LEFT" && canPress){
        d = "RIGHT";
    }
    else if((key === "ArrowDown" || key === "KeyS") && d != "UP" && canPress){
        d = "DOWN";
    }
    // Only allow once per frame an input
    canPress = false;
}
// Return boolean if snake hits itself
function isOuroboros(head,snake){
    for (let body of snake){
        if (head.x === body.x && head.y === body.y){
            return true;
        }
    }
    return false;
}

function gameOver(){
    //console.log('D.E.D')
    clearInterval(game);
}