// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{x: 13, y: 15}];
let food = {x: 6, y: 7};

// Linking HTML elements
const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");

// Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Collision check
function isCollide(snake) {
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Wall collision
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// Generate new food position (not overlapping snake)
function randomFoodPosition() {
    let a = 2, b = 16;
    let newFood;
    while (true) {
        newFood = {
            x: Math.round(a + (b - a) * Math.random()),
            y: Math.round(a + (b - a) * Math.random())
        };
        if (!snakeArr.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return newFood;
        }
    }
}

// Main Game Engine
function gameEngine() {
    // Part 1: Update snake
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = {x: 0, y: 0};
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        return;
    }

    // Snake eats food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        food = randomFoodPosition();
    }

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    // Display food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// HiScore Logic
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

// Start Game
window.requestAnimationFrame(main);

// Controls
window.addEventListener('keydown', e => {
    if (musicSound.paused) musicSound.play();
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = {x: 0, y: -1};
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = {x: 0, y: 1};
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = {x: -1, y: 0};
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = {x: 1, y: 0};
            break;
    }
});
