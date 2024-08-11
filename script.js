// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreText = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake with a face on the head and rounded body segments
function drawSnake() {
  snake.forEach((segment, index) => {
    const snakeElement = createGameElement(
      "div",
      index === 0 ? "snake snake-head" : "snake snake-body"
    );
    setPosition(snakeElement, segment);
    if (index === 0) {
      const tongueElement = document.createElement("div");
      tongueElement.classList.add("tongue");
      snakeElement.appendChild(tongueElement);
    }
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Generate food
function generateFood() {
  let newFoodPosition;
  do {
    newFoodPosition = {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1,
    };
  } while (isFoodOnSnake(newFoodPosition));

  return newFoodPosition;
}

// Check if the food is generated on the snake
function isFoodOnSnake(position) {
  return snake.some(
    (segment) => segment.x === position.x && segment.y === position.y
  );
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
  } else {
    snake.pop();
  }

  checkCollision();
  draw();
}

// Increase game speed and log to console
function increaseSpeed() {
  console.log(`Current speed delay: ${gameSpeedDelay}ms`);

  // Gradual speed increase
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 10; // Reduce delay by 10ms for each increase
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 5; // Reduce delay by 5ms for each increase
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2; // Reduce delay by 2ms for each increase
  }

  console.log(`New speed delay: ${gameSpeedDelay}ms`);

  // Ensure the delay doesn't go below a minimum threshold
  if (gameSpeedDelay < 25) {
    gameSpeedDelay = 25;
  }

  clearInterval(gameInterval);
  gameInterval = setInterval(move, gameSpeedDelay);
}

// Start game function
function startGame() {
  gameStarted = true;
  instructionText.style.display = "none"; // Hide instruction text when starting the game
  logo.style.display = "none";
  gameOverScreen.style.display = "none";
  gameInterval = setInterval(move, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "none"; // Keep instruction text hidden after game over
  logo.style.display = "none";
  gameOverScreen.style.display = "block";
  finalScoreText.textContent = `Final Score: ${score.textContent}`;
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

// Restart game button functionality
restartButton.addEventListener("click", () => {
  resetGame();
  startGame();
});
