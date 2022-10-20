// GLOBAL VARS
let height = document.querySelector('#height'); // input
let width = document.querySelector('#width'); // input

const grid = document.querySelector('#grid'); // canvas 
const ctx = grid.getContext("2d"); // canvas context

const cell = 32; // cell size in px
const bgCell = new Image();
bgCell.src = "src/img/snakeBg.png" // Background cell image

const snakeBody = new Image();
snakeBody.src = "src/img/snakeBody.png" // Body of snake image

const goalImg = new Image();
goalImg.src = "src/img/goal.png" // Goal image

let scoreDisplay = document.querySelector('#score'); // text

const playBtn = document.querySelector('#play'); // button
const resetBtn = document.querySelector('#reset'); // button


let maxX; // Grid boundaries
let maxY;

let snake = []; // array of obj{x:...,y:...}
let goal = {}; // obj {}{x:...,y:...}
let score = 0;
let d = "RIGHT"; // init direction is right

let game; // global acces of the game
let canPress = true; // key press timing mitigation

// START ON PLAY
playBtn.addEventListener('click', () => {
    playBtn.disabled = true;
    playBtn.innerText = "...PLAYING...";
    // Set init. grid and boundaries
    generateGrid(width.value,height.value);
    // set init. cells of the snake (middle of grid)
    generateStartSnake(maxX,maxY);
    // set init. goal
    generateNextGoal(maxX,maxY);
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
    ctx.drawImage(goalImg,goal.x,goal.y);

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
    if (headX === (goal.x / cell) && headY === (goal.y / cell)){
        score++;
        scoreDisplay.innerText = score;
        generateNextGoal(maxX,maxY);
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
        width = 30;
        height = 20;
    }
    // define grid size
    grid.width = width * cell;
    grid.height = height * cell;
    // add each cell
    for (let i=0; i<width; i++){
        for (let j=0; j<height; j++){
            ctx.drawImage(bgCell,i*cell,j*cell);
        }
    }
    maxX = width;
    maxY = height;
    //return `${width}-${height}`;
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
// Define goal position in grid
function generateNextGoal(maxX,maxY){
    goal = {
        x : Math.floor(Math.random()*maxX) * cell,
        y : Math.floor(Math.random()*maxY) * cell
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