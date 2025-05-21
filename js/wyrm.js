// ====== WYRM GAME IMPLEMENTATION ======
// A snake-like game for the SurvivorOS terminal

// Game constants
const GAME_WIDTH = 30;  // Width in cells
const GAME_HEIGHT = 20; // Height in cells
const CELL_SIZE = 16;   // Pixel size of each cell
const GAME_SPEED = 150; // Milliseconds between game updates
const COLORS = {
  background: '#306850',
  snake: '#e0f8cf',
  snakeHead: '#ffffff',
  food: '#86c06c',
  border: '#86c06c',
  text: '#e0f8cf',
  gameOver: '#e0f8cf'
};

// Game state variables
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let gameOver = false;
let score = 0;
let gameInterval = null;
let gameCanvas = null;
let gameCtx = null;

// Initialize the game
function initWyrmGame() {
  // Reset state
  snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
  ];
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  gameOver = false;
  
  // Spawn initial food
  spawnFood();
  
  // Create game container and canvas
  const gameContainer = document.createElement('div');
  gameContainer.id = 'wyrm-game-container';
  gameContainer.style.width = `${GAME_WIDTH * CELL_SIZE + 2}px`;
  gameContainer.style.height = `${GAME_HEIGHT * CELL_SIZE + 32}px`;
  gameContainer.style.margin = '0 auto';
  gameContainer.style.position = 'relative';
  gameContainer.style.fontFamily = 'monospace';
  gameContainer.style.marginTop = '10px';
  gameContainer.style.marginBottom = '10px';
  gameContainer.style.border = `1px solid ${COLORS.border}`;
  gameContainer.style.boxShadow = `0 0 10px ${COLORS.border}`;
  gameContainer.style.backgroundColor = COLORS.background;
  
  // Create game canvas
  gameCanvas = document.createElement('canvas');
  gameCanvas.width = GAME_WIDTH * CELL_SIZE;
  gameCanvas.height = GAME_HEIGHT * CELL_SIZE;
  gameCanvas.id = 'wyrm-game-canvas';
  gameCanvas.style.backgroundColor = COLORS.background;
  
  // Create score display
  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'wyrm-score-display';
  scoreDisplay.style.textAlign = 'center';
  scoreDisplay.style.padding = '5px';
  scoreDisplay.style.color = COLORS.text;
  scoreDisplay.style.backgroundColor = COLORS.background;
  scoreDisplay.style.borderTop = `1px solid ${COLORS.border}`;
  scoreDisplay.textContent = `SCORE: ${score} • PRESS ARROW KEYS TO PLAY`;
  
  // Add elements to container
  gameContainer.appendChild(gameCanvas);
  gameContainer.appendChild(scoreDisplay);
  
  // Get rendering context
  gameCtx = gameCanvas.getContext('2d');
  
  // Add scanline effect to match the terminal
  const scanlines = document.createElement('div');
  scanlines.style.position = 'absolute';
  scanlines.style.top = '0';
  scanlines.style.left = '0';
  scanlines.style.width = '100%';
  scanlines.style.height = `${GAME_HEIGHT * CELL_SIZE}px`;
  scanlines.style.background = 'repeating-linear-gradient(to bottom, rgba(7, 24, 33, 0), rgba(7, 24, 33, 0) 1px, rgba(7, 24, 33, 0.1) 1px, rgba(7, 24, 33, 0.1) 2px)';
  scanlines.style.pointerEvents = 'none';
  scanlines.style.zIndex = '2';
  gameContainer.appendChild(scanlines);
  
  return gameContainer;
}

// Spawn food at a random position
function spawnFood() {
  let validPosition = false;
  while (!validPosition) {
    food = {
      x: Math.floor(Math.random() * GAME_WIDTH),
      y: Math.floor(Math.random() * GAME_HEIGHT)
    };
    
    // Check if food is on snake
    validPosition = true;
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        validPosition = false;
        break;
      }
    }
  }
}

// Draw the game state
function drawGame() {
  // Clear canvas
  gameCtx.fillStyle = COLORS.background;
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // Draw snake
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Head
      gameCtx.fillStyle = COLORS.snakeHead;
    } else {
      // Body
      gameCtx.fillStyle = COLORS.snake;
    }
    
    // Draw with slight padding for a grid effect
    gameCtx.fillRect(
      segment.x * CELL_SIZE + 1, 
      segment.y * CELL_SIZE + 1, 
      CELL_SIZE - 2, 
      CELL_SIZE - 2
    );
  });
  
  // Draw food with a pulsing effect based on time
  const pulseAmount = Math.sin(Date.now() / 200) * 0.1 + 0.9;
  gameCtx.fillStyle = COLORS.food;
  gameCtx.beginPath();
  gameCtx.arc(
    food.x * CELL_SIZE + CELL_SIZE/2, 
    food.y * CELL_SIZE + CELL_SIZE/2, 
    (CELL_SIZE/2 - 2) * pulseAmount, 
    0, 
    Math.PI * 2
  );
  gameCtx.fill();
  
  // Draw game over message if needed
  if (gameOver) {
    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    gameCtx.font = '16px monospace';
    gameCtx.fillStyle = COLORS.gameOver;
    gameCtx.textAlign = 'center';
    gameCtx.fillText('GAME OVER', gameCanvas.width/2, gameCanvas.height/2 - 10);
    gameCtx.fillText(`SCORE: ${score}`, gameCanvas.width/2, gameCanvas.height/2 + 10);
    gameCtx.fillText('PRESS SPACE TO RESTART', gameCanvas.width/2, gameCanvas.height/2 + 30);
    
    // Add a glitch effect occasionally
    if (Math.random() < 0.1) {
      createGlitchEffect();
    }
  }
  
  // Update score
  const scoreDisplay = document.getElementById('wyrm-score-display');
  if (scoreDisplay) {
    scoreDisplay.textContent = `SCORE: ${score} • LENGTH: ${snake.length}`;
  }
}

// Update game logic
function updateGame() {
  if (gameOver) return;
  
  // Update direction
  direction = nextDirection;
  
  // Calculate new head position
  const head = {...snake[0]};
  
  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // Check collisions
  // 1. Wall collision
  if (head.x < 0 || head.x >= GAME_WIDTH || head.y < 0 || head.y >= GAME_HEIGHT) {
    endGame();
    return;
  }
  
  // 2. Self collision
  for (let segment of snake) {
    if (head.x === segment.x && head.y === segment.y) {
      endGame();
      return;
    }
  }
  
  // Add new head
  snake.unshift(head);
  
  // 3. Food collision
  if (head.x === food.x && head.y === food.y) {
    // Increase score and spawn new food
    score += 10;
    spawnFood();
    
    // Snake grows, so we don't remove the tail
    // Add a small glitch effect for eating
    createGlitchEffect();
  } else {
    // Remove tail if no food was eaten
    snake.pop();
  }
}

// End the game
function endGame() {
  gameOver = true;
  
  // Add major glitch effect
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createGlitchEffect(true), i * 100);
  }
}

// Reset the game
function resetGame() {
  snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
  ];
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  gameOver = false;
  spawnFood();
}

// Create a glitch effect
function createGlitchEffect(major = false) {
  const intensity = major ? 5 : 2;
  const numArtifacts = major ? 8 : 3;
  
  // Screen shake
  gameCanvas.style.transform = `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`;
  setTimeout(() => {
    gameCanvas.style.transform = 'none';
  }, 100);
  
  // Visual artifacts
  for (let i = 0; i < numArtifacts; i++) {
    const artifact = document.createElement('div');
    artifact.className = 'artifact h-line';
    artifact.style.position = 'absolute';
    artifact.style.height = `${Math.random() * 3 + 1}px`;
    artifact.style.width = `${Math.random() * 100}%`;
    artifact.style.left = '0';
    artifact.style.top = `${Math.random() * 100}%`;
    artifact.style.backgroundColor = major ? '#e0f8cf' : '#86c06c';
    artifact.style.opacity = '0.7';
    artifact.style.zIndex = '3';
    
    const container = document.getElementById('wyrm-game-container');
    if (container) {
      container.appendChild(artifact);
      setTimeout(() => {
        if (artifact.parentNode) {
          artifact.parentNode.removeChild(artifact);
        }
      }, 200);
    }
  }
}

// Start the game
function startWyrmGame(terminal) {
  // Initialize game state and create container
  const gameContainer = initWyrmGame();
  
  // Add game container to terminal
  terminal.appendChild(gameContainer);
  
  // Set up keyboard controls
  const keydownHandler = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'down') nextDirection = 'up';
        e.preventDefault(); // Prevent scrolling
        break;
      case 'ArrowDown':
        if (direction !== 'up') nextDirection = 'down';
        e.preventDefault(); // Prevent scrolling
        break;
      case 'ArrowLeft':
        if (direction !== 'right') nextDirection = 'left';
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (direction !== 'left') nextDirection = 'right';
        e.preventDefault();
        break;
      case ' ':
        if (gameOver) {
          resetGame();
        }
        e.preventDefault();
        break;
      case 'Escape':
        // Stop the game and remove it
        clearInterval(gameInterval);
        document.removeEventListener('keydown', keydownHandler);
        if (gameContainer.parentNode) {
          gameContainer.parentNode.removeChild(gameContainer);
        }
        break;
    }
  };
  
  document.addEventListener('keydown', keydownHandler);
  
  // Start game loop
  gameInterval = setInterval(() => {
    updateGame();
    drawGame();
  }, GAME_SPEED);
  
  // Initial render
  drawGame();
  
  return {
    stop: () => {
      clearInterval(gameInterval);
      document.removeEventListener('keydown', keydownHandler);
      if (gameContainer.parentNode) {
        gameContainer.parentNode.removeChild(gameContainer);
      }
    }
  };
}

// Export the main game function
window.startWyrmGame = startWyrmGame;