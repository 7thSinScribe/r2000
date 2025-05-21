// ====== WYRM GAME IMPLEMENTATION ======
// A roguelike snake game for the SurvivorOS terminal
// The one true Wyrm above all - a classic game within Rogue 2000

// Game constants
const GAME_WIDTH = 40;  // Width in cells
const GAME_HEIGHT = 30; // Height in cells
const CELL_SIZE = 14;   // Pixel size of each cell
const INITIAL_GAME_SPEED = 150; // Milliseconds between game updates
const MAX_ENEMIES = 4;  // Maximum number of enemy wyrms
const MUTATION_CHANCE = 0.2; // Chance of mutation spawning when eating food
const FOOD_MOVE_CHANCE = 0.3; // Chance that food will move each turn

// Visual settings
const COLORS = {
  background: '#306850',
  player: {
    head: '#e0f8cf',
    body: '#86c06c'
  },
  enemies: [
    { head: '#ff6b6b', body: '#c44d4d' }, // Red enemy
    { head: '#ffb347', body: '#d9952e' }, // Orange enemy
    { head: '#9370db', body: '#6c5294' }, // Purple enemy
    { head: '#4dabff', body: '#3a78b2' }  // Blue enemy
  ],
  food: {
    regular: '#e0f8cf',
    speed: '#ffb347',   // Orange - increases speed
    slow: '#9370db',    // Purple - decreases speed
    steal: '#ff6b6b',   // Red - steals segments
    bonus: '#4dabff'    // Blue - bonus points
  },
  wall: '#285840',
  mutation: '#f0f055', // Yellow for mutations
  text: '#e0f8cf',
  gameOver: '#e0f8cf'
};

// Food types and their effects
const FOOD_TYPES = {
  REGULAR: { name: 'regular', points: 10, color: COLORS.food.regular, moveChance: 0, stealChance: 0, speedEffect: 0 },
  SPEED: { name: 'speed', points: 15, color: COLORS.food.speed, moveChance: 0.1, stealChance: 0, speedEffect: -20 }, // Faster
  SLOW: { name: 'slow', points: 5, color: COLORS.food.slow, moveChance: 0.05, stealChance: 0, speedEffect: 20 },    // Slower
  STEAL: { name: 'steal', points: 20, color: COLORS.food.steal, moveChance: 0.4, stealChance: 0.6, speedEffect: 0 },
  BONUS: { name: 'bonus', points: 30, color: COLORS.food.bonus, moveChance: 0.2, stealChance: 0, speedEffect: 0 }
};

// Mutation types
const MUTATIONS = {
  SPEED: { name: 'SPEED BOOST', effect: (gameState) => { gameState.gameSpeed = Math.max(50, gameState.gameSpeed - 30); }, duration: 100 },
  GHOST: { name: 'GHOST MODE', effect: () => {}, duration: 50 }, // Implemented in collision logic
  MAGNETIC: { name: 'FOOD MAGNET', effect: () => {}, duration: 40 }, // Implemented in update logic
  ARMORED: { name: 'ARMORED', effect: () => {}, duration: 70 }, // Prevents segment loss
  HUNTER: { name: 'HUNTER', effect: () => {}, duration: 60 }  // Enemies flee from player
};

// Game state variables
let gameState = {
  player: {
    segments: [],
    direction: 'right',
    nextDirection: 'right',
    color: COLORS.player,
    mutations: [],
    segmentsToAdd: 0,
    speed: INITIAL_GAME_SPEED,
    isGhost: false,
    isMagnetic: false,
    isArmored: false,
    isHunter: false
  },
  enemies: [],
  food: [],
  walls: [],
  score: 0,
  gameOver: false,
  victory: false,
  level: 1,
  gameSpeed: INITIAL_GAME_SPEED,
  timeSinceLastFoodMove: 0,
  pendingMutations: [] // Mutations waiting to be activated
};

let gameInterval = null;
let gameCanvas = null;
let gameCtx = null;

// Initialize the game
function initWyrmGame() {
  // Reset state
  gameState = {
    player: {
      segments: [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
      ],
      direction: 'right',
      nextDirection: 'right',
      color: COLORS.player,
      mutations: [],
      segmentsToAdd: 0,
      speed: INITIAL_GAME_SPEED,
      isGhost: false,
      isMagnetic: false,
      isArmored: false,
      isHunter: false
    },
    enemies: [],
    food: [],
    walls: [],
    score: 0,
    gameOver: false,
    victory: false,
    level: 1,
    gameSpeed: INITIAL_GAME_SPEED,
    timeSinceLastFoodMove: 0,
    pendingMutations: []
  };
  
  // Generate walls
  generateWalls();
  
  // Spawn initial enemies
  spawnEnemies();
  
  // Spawn initial food
  spawnFood(3); // Spawn 3 food items initially
  
  // Create game container and canvas
  const gameContainer = document.createElement('div');
  gameContainer.id = 'wyrm-game-container';
  gameContainer.style.width = `${GAME_WIDTH * CELL_SIZE + 2}px`;
  gameContainer.style.height = `${GAME_HEIGHT * CELL_SIZE + 60}px`;
  gameContainer.style.margin = '0 auto';
  gameContainer.style.position = 'relative';
  gameContainer.style.fontFamily = 'monospace';
  gameContainer.style.marginTop = '10px';
  gameContainer.style.marginBottom = '10px';
  gameContainer.style.border = `1px solid ${COLORS.player.body}`;
  gameContainer.style.boxShadow = `0 0 10px ${COLORS.player.body}`;
  gameContainer.style.backgroundColor = COLORS.background;
  
  // Create game canvas
  gameCanvas = document.createElement('canvas');
  gameCanvas.width = GAME_WIDTH * CELL_SIZE;
  gameCanvas.height = GAME_HEIGHT * CELL_SIZE;
  gameCanvas.id = 'wyrm-game-canvas';
  gameCanvas.style.backgroundColor = COLORS.background;
  
  // Create status display
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'wyrm-status-display';
  statusDisplay.style.textAlign = 'center';
  statusDisplay.style.padding = '5px';
  statusDisplay.style.color = COLORS.text;
  statusDisplay.style.backgroundColor = COLORS.background;
  statusDisplay.style.borderTop = `1px solid ${COLORS.player.body}`;
  statusDisplay.style.height = '50px';
  statusDisplay.style.display = 'flex';
  statusDisplay.style.flexDirection = 'column';
  statusDisplay.style.justifyContent = 'center';
  
  // Add elements to container
  gameContainer.appendChild(gameCanvas);
  gameContainer.appendChild(statusDisplay);
  
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

// Generate walls for the current level
function generateWalls() {
  gameState.walls = [];
  
  // Level design based on current level
  const level = gameState.level;
  
  if (level === 1) {
    // Simple walls at the borders with some gaps
    for (let x = 0; x < GAME_WIDTH; x++) {
      for (let y = 0; y < GAME_HEIGHT; y++) {
        // Top and bottom borders with gaps
        if ((y === 0 || y === GAME_HEIGHT-1) && 
            !(x > 10 && x < 15) && !(x > 25 && x < 30)) {
          gameState.walls.push({x, y});
        }
        // Left and right borders with gaps
        if ((x === 0 || x === GAME_WIDTH-1) && 
            !(y > 10 && y < 15) && !(y > 20 && y < 25)) {
          gameState.walls.push({x, y});
        }
      }
    }
  } else if (level === 2) {
    // More complex pattern with some internal walls
    for (let x = 0; x < GAME_WIDTH; x++) {
      for (let y = 0; y < GAME_HEIGHT; y++) {
        // Borders
        if (x === 0 || x === GAME_WIDTH-1 || y === 0 || y === GAME_HEIGHT-1) {
          if (!(x === 0 && y === 15) && 
              !(x === GAME_WIDTH-1 && y === 15) && 
              !(y === 0 && x === 20) && 
              !(y === GAME_HEIGHT-1 && x === 20)) {
            gameState.walls.push({x, y});
          }
        }
        
        // Cross in the middle
        if ((x === 20 || y === 15) && 
            x >= 10 && x <= 30 && y >= 5 && y <= 25) {
          if (!(x === 20 && y === 15)) { // Leave center open
            gameState.walls.push({x, y});
          }
        }
      }
    }
  } else {
    // Random maze-like walls for level 3+
    // Start with borders
    for (let x = 0; x < GAME_WIDTH; x++) {
      for (let y = 0; y < GAME_HEIGHT; y++) {
        if (x === 0 || x === GAME_WIDTH-1 || y === 0 || y === GAME_HEIGHT-1) {
          // Add some random gaps in the borders
          if (Math.random() > 0.2) {
            gameState.walls.push({x, y});
          }
        }
      }
    }
    
    // Add some random internal walls
    let internalWalls = 3 + level;
    for (let i = 0; i < internalWalls; i++) {
      let wallLength = 5 + Math.floor(Math.random() * 10);
      let startX = 5 + Math.floor(Math.random() * (GAME_WIDTH - 10));
      let startY = 5 + Math.floor(Math.random() * (GAME_HEIGHT - 10));
      let horizontal = Math.random() > 0.5;
      
      for (let j = 0; j < wallLength; j++) {
        let x = horizontal ? startX + j : startX;
        let y = horizontal ? startY : startY + j;
        
        if (x < GAME_WIDTH-1 && y < GAME_HEIGHT-1) {
          gameState.walls.push({x, y});
        }
      }
    }
  }
}

// Spawn enemy wyrms
function spawnEnemies() {
  const numEnemies = Math.min(gameState.level, MAX_ENEMIES);
  
  for (let i = 0; i < numEnemies; i++) {
    let validPosition = false;
    let startX, startY;
    
    // Find a valid starting position for the enemy
    while (!validPosition) {
      startX = 5 + Math.floor(Math.random() * (GAME_WIDTH - 10));
      startY = 5 + Math.floor(Math.random() * (GAME_HEIGHT - 10));
      
      // Check if position is away from player and not on a wall
      let awayFromPlayer = Math.abs(startX - gameState.player.segments[0].x) > 10 || 
                         Math.abs(startY - gameState.player.segments[0].y) > 10;
      
      let notOnWall = !gameState.walls.some(wall => wall.x === startX && wall.y === startY);
      
      // Check not on top of other enemies
      let notOnEnemy = !gameState.enemies.some(enemy => 
        enemy.segments.some(segment => segment.x === startX && segment.y === startY)
      );
      
      validPosition = awayFromPlayer && notOnWall && notOnEnemy;
    }
    
    // Create enemy with 3-5 segments
    const segmentCount = 3 + Math.floor(Math.random() * 3);
    const segments = [{x: startX, y: startY}];
    
    // Initial direction
    const directions = ['up', 'down', 'left', 'right'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    // Add additional segments based on initial direction
    for (let j = 1; j < segmentCount; j++) {
      let lastSegment = segments[j-1];
      let newSegment = {x: lastSegment.x, y: lastSegment.y};
      
      switch(direction) {
        case 'up': newSegment.y++; break;
        case 'down': newSegment.y--; break;
        case 'left': newSegment.x++; break;
        case 'right': newSegment.x--; break;
      }
      
      segments.push(newSegment);
    }
    
    // Add enemy to game state
    gameState.enemies.push({
      segments: segments,
      direction: direction,
      color: COLORS.enemies[i % COLORS.enemies.length],
      speed: INITIAL_GAME_SPEED + Math.floor(Math.random() * 50) - 25, // Vary speed
      moveCounter: 0
    });
  }
}

// Spawn food at random positions
function spawnFood(count = 1) {
  for (let i = 0; i < count; i++) {
    let validPosition = false;
    let food;
    
    while (!validPosition) {
      const x = Math.floor(Math.random() * GAME_WIDTH);
      const y = Math.floor(Math.random() * GAME_HEIGHT);
      
      // Determine food type
      let foodType;
      const rand = Math.random();
      if (rand < 0.6) {
        foodType = FOOD_TYPES.REGULAR;
      } else if (rand < 0.75) {
        foodType = FOOD_TYPES.SPEED;
      } else if (rand < 0.85) {
        foodType = FOOD_TYPES.SLOW;
      } else if (rand < 0.95) {
        foodType = FOOD_TYPES.STEAL;
      } else {
        foodType = FOOD_TYPES.BONUS;
      }
      
      food = {
        x, y, type: foodType, 
        moveChance: foodType.moveChance, 
        lastMoveTime: 0
      };
      
      // Check if position is valid (not on walls, player, enemies, or other food)
      validPosition = true;
      
      // Check not on walls
      if (gameState.walls.some(wall => wall.x === x && wall.y === y)) {
        validPosition = false;
        continue;
      }
      
      // Check not on player
      if (gameState.player.segments.some(segment => segment.x === x && segment.y === y)) {
        validPosition = false;
        continue;
      }
      
      // Check not on enemies
      if (gameState.enemies.some(enemy => 
        enemy.segments.some(segment => segment.x === x && segment.y === y)
      )) {
        validPosition = false;
        continue;
      }
      
      // Check not on other food
      if (gameState.food.some(f => f.x === x && f.y === y)) {
        validPosition = false;
        continue;
      }
    }
    
    gameState.food.push(food);
  }
}

// Handle food movement
function updateFoodPositions() {
  gameState.food.forEach(food => {
    // Only move food that has movement capability
    if (food.moveChance > 0 && Math.random() < food.moveChance) {
      const directions = [
        {dx: 0, dy: -1}, // Up
        {dx: 0, dy: 1},  // Down
        {dx: -1, dy: 0}, // Left
        {dx: 1, dy: 0}   // Right
      ];
      
      // Shuffle directions for random movement
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }
      
      // Try each direction until finding a valid one
      for (const dir of directions) {
        const newX = food.x + dir.dx;
        const newY = food.y + dir.dy;
        
        // Check if the new position is valid
        let validPosition = true;
        
        // Check boundaries
        if (newX < 0 || newX >= GAME_WIDTH || newY < 0 || newY >= GAME_HEIGHT) {
          validPosition = false;
          continue;
        }
        
        // Check not on walls
        if (gameState.walls.some(wall => wall.x === newX && wall.y === newY)) {
          validPosition = false;
          continue;
        }
        
        // Check not on player
        if (gameState.player.segments.some(segment => segment.x === newX && segment.y === newY)) {
          validPosition = false;
          continue;
        }
        
        // Check not on enemies
        if (gameState.enemies.some(enemy => 
          enemy.segments.some(segment => segment.x === newX && segment.y === newY)
        )) {
          validPosition = false;
          continue;
        }
        
        // Check not on other food
        if (gameState.food.some(f => f !== food && f.x === newX && f.y === newY)) {
          validPosition = false;
          continue;
        }
        
        if (validPosition) {
          food.x = newX;
          food.y = newY;
          break;
        }
      }
    }
  });
}

// Update enemy movement
function updateEnemies() {
  gameState.enemies.forEach(enemy => {
    enemy.moveCounter++;
    
    // Only move enemy when it's time (based on its speed)
    if (enemy.moveCounter >= enemy.speed / gameState.gameSpeed) {
      enemy.moveCounter = 0;
      
      // AI for enemy movement
      const head = enemy.segments[0];
      const directions = ['up', 'down', 'left', 'right'];
      
      // Filter out the opposite direction (can't go backwards)
      const opposites = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };
      const validDirections = directions.filter(dir => dir !== opposites[enemy.direction]);
      
      // Prioritize directions
      let targetDirection;
      
      // If player is in hunter mode, flee from player
      if (gameState.player.isHunter) {
        const playerHead = gameState.player.segments[0];
        const distX = playerHead.x - head.x;
        const distY = playerHead.y - head.y;
        
        // Move away from player
        if (Math.abs(distX) > Math.abs(distY)) {
          // Move horizontally away
          targetDirection = distX > 0 ? 'left' : 'right';
        } else {
          // Move vertically away
          targetDirection = distY > 0 ? 'up' : 'down';
        }
      } else {
        // Normal behavior: Hunt for food or chase player
        // Find nearest food
        let closestFood = null;
        let minFoodDist = Infinity;
        
        gameState.food.forEach(food => {
          const dist = Math.abs(food.x - head.x) + Math.abs(food.y - head.y);
          if (dist < minFoodDist) {
            minFoodDist = dist;
            closestFood = food;
          }
        });
        
        // 70% chance to go for food, 30% to chase player
        if (closestFood && Math.random() < 0.7) {
          const distX = closestFood.x - head.x;
          const distY = closestFood.y - head.y;
          
          // Decide direction based on relative position
          if (Math.abs(distX) > Math.abs(distY)) {
            // Move horizontally
            targetDirection = distX > 0 ? 'right' : 'left';
          } else {
            // Move vertically
            targetDirection = distY > 0 ? 'down' : 'up';
          }
        } else {
          // Chase player
          const playerHead = gameState.player.segments[0];
          const distX = playerHead.x - head.x;
          const distY = playerHead.y - head.y;
          
          // Decide direction based on relative position
          if (Math.abs(distX) > Math.abs(distY)) {
            // Move horizontally
            targetDirection = distX > 0 ? 'right' : 'left';
          } else {
            // Move vertically
            targetDirection = distY > 0 ? 'down' : 'up';
          }
        }
      }
      
      // Check if target direction is valid
      const newHead = { x: head.x, y: head.y };
      switch(targetDirection) {
        case 'up': newHead.y--; break;
        case 'down': newHead.y++; break;
        case 'left': newHead.x--; break;
        case 'right': newHead.x++; break;
      }
      
      // Check for collisions with walls or self
      let willCollide = false;
      
      // Wall collision (they can pass through walls at edges)
      if (gameState.walls.some(wall => wall.x === newHead.x && wall.y === newHead.y)) {
        // Check if it's a border wall - if so, wrap around
        if (newHead.x < 0) newHead.x = GAME_WIDTH - 1;
        else if (newHead.x >= GAME_WIDTH) newHead.x = 0;
        else if (newHead.y < 0) newHead.y = GAME_HEIGHT - 1;
        else if (newHead.y >= GAME_HEIGHT) newHead.y = 0;
        else willCollide = true; // Internal wall collision
      }
      
      // Self collision
      if (enemy.segments.slice(1).some(segment => 
        segment.x === newHead.x && segment.y === newHead.y
      )) {
        willCollide = true;
      }
      
      // If collision detected, try random valid direction
      if (willCollide) {
        // Shuffle valid directions
        for (let i = validDirections.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [validDirections[i], validDirections[j]] = [validDirections[j], validDirections[i]];
        }
        
        // Try each direction until finding a valid one
        let foundValidDirection = false;
        for (const dir of validDirections) {
          const testHead = { x: head.x, y: head.y };
          switch(dir) {
            case 'up': testHead.y--; break;
            case 'down': testHead.y++; break;
            case 'left': testHead.x--; break;
            case 'right': testHead.x++; break;
          }
          
          // Wall edge wrapping
          if (testHead.x < 0) testHead.x = GAME_WIDTH - 1;
          else if (testHead.x >= GAME_WIDTH) testHead.x = 0;
          else if (testHead.y < 0) testHead.y = GAME_HEIGHT - 1;
          else if (testHead.y >= GAME_HEIGHT) testHead.y = 0;
          
          // Check for collisions
          const wallCollision = gameState.walls.some(wall => 
            wall.x === testHead.x && wall.y === testHead.y
          );
          
          const selfCollision = enemy.segments.slice(1).some(segment => 
            segment.x === testHead.x && segment.y === testHead.y
          );
          
          if (!wallCollision && !selfCollision) {
            enemy.direction = dir;
            foundValidDirection = true;
            targetDirection = dir;
            newHead.x = testHead.x;
            newHead.y = testHead.y;
            break;
          }
        }
        
        // If no valid direction, just stay in place
        if (!foundValidDirection) {
          return;
        }
      } else {
        enemy.direction = targetDirection;
      }
      
      // Move enemy
      enemy.segments.unshift(newHead);
      enemy.segments.pop();
      
      // Check for food collision
      const foodIndex = gameState.food.findIndex(food => 
        food.x === newHead.x && food.y === newHead.y
      );
      
      if (foodIndex !== -1) {
        // Enemy eats food
        gameState.food.splice(foodIndex, 1);
        
        // Grow by 1 segment
        const tail = enemy.segments[enemy.segments.length - 1];
        enemy.segments.push({...tail});
        
        // Spawn new food
        spawnFood(1);
      }
      
      // Check for collision with player
      if (!gameState.player.isGhost) {
        const playerCollision = gameState.player.segments.some(segment => 
          segment.x === newHead.x && segment.y === newHead.y
        );
        
        if (playerCollision) {
          // Player loses a segment or game over
          if (gameState.player.segments.length > 3 && !gameState.player.isArmored) {
            // Remove last segment
            gameState.player.segments.pop();
            createGlitchEffect(true);
          } else if (!gameState.player.isArmored) {
            endGame(false);
          }
        }
      }
    }
  });
}

// Draw the game state
function drawGame() {
  // Clear canvas
  gameCtx.fillStyle = COLORS.background;
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // Draw walls
  gameState.walls.forEach(wall => {
    gameCtx.fillStyle = COLORS.wall;
    gameCtx.fillRect(
      wall.x * CELL_SIZE, 
      wall.y * CELL_SIZE, 
      CELL_SIZE, 
      CELL_SIZE
    );
  });
  
  // Draw player wyrm
  gameState.player.segments.forEach((segment, index) => {
    let color;
    
    // Apply visual effects from mutations
    if (gameState.player.isGhost) {
      // Ghost effect - semi-transparent
      if (index === 0) {
        // Head
        color = `rgba(${hexToRgb(COLORS.player.head)}, 0.5)`;
      } else {
        // Body
        color = `rgba(${hexToRgb(COLORS.player.body)}, 0.5)`;
      }
    } else if (gameState.player.isArmored) {
      // Armored effect - yellow outline
      if (index === 0) {
        color = COLORS.player.head;
        // Draw yellow outline
        gameCtx.strokeStyle = COLORS.mutation;
        gameCtx.lineWidth = 2;
        gameCtx.strokeRect(
          segment.x * CELL_SIZE + 1, 
          segment.y * CELL_SIZE + 1, 
          CELL_SIZE - 2, 
          CELL_SIZE - 2
        );
      } else {
        color = COLORS.player.body;
        // Draw yellow outline
        gameCtx.strokeStyle = COLORS.mutation;
        gameCtx.lineWidth = 1;
        gameCtx.strokeRect(
          segment.x * CELL_SIZE + 1, 
          segment.y * CELL_SIZE + 1, 
          CELL_SIZE - 2, 
          CELL_SIZE - 2
        );
      }
    } else if (gameState.player.isHunter) {
      // Hunter effect - reddish tint
      if (index === 0) {
        color = mixColors(COLORS.player.head, COLORS.food.steal, 0.3);
      } else {
        color = mixColors(COLORS.player.body, COLORS.food.steal, 0.3);
      }
    } else if (gameState.player.isMagnetic) {
      // Magnetic effect - bluish tint
      if (index === 0) {
        color = mixColors(COLORS.player.head, COLORS.food.bonus, 0.3);
      } else {
        color = mixColors(COLORS.player.body, COLORS.food.bonus, 0.3);
      }
    } else {
      // Normal colors
      if (index === 0) {
        // Head
        color = COLORS.player.head;
      } else {
        // Body
        color = COLORS.player.body;
      }
    }
    
    gameCtx.fillStyle = color;
    
    // Draw with slight padding for a grid effect
    gameCtx.fillRect(
      segment.x * CELL_SIZE + 1, 
      segment.y * CELL_SIZE + 1, 
      CELL_SIZE - 2, 
      CELL_SIZE - 2
    );
    
    // Draw eye details on head
    if (index === 0) {
      const eyeColor = '#000000';
      const eyeSize = Math.max(2, CELL_SIZE / 6);
      
      // Eye positions based on direction
      let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
      
      switch(gameState.player.direction) {
        case 'up':
          leftEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
          leftEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3;
          rightEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
          rightEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3;
          break;
        case 'down':
          leftEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
          leftEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3;
          rightEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
          rightEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3;
          break;
        case 'left':
          leftEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3;
          leftEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
          rightEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3;
          rightEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
          break;
        case 'right':
          leftEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3;
          leftEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
          rightEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3;
          rightEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
          break;
      }
      
      gameCtx.fillStyle = eyeColor;
      gameCtx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
      gameCtx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
    }
  });
  
  // Draw enemy wyrms
  gameState.enemies.forEach(enemy => {
    enemy.segments.forEach((segment, index) => {
      if (index === 0) {
        // Head
        gameCtx.fillStyle = enemy.color.head;
      } else {
        // Body
        gameCtx.fillStyle = enemy.color.body;
      }
      
      gameCtx.fillRect(
        segment.x * CELL_SIZE + 1, 
        segment.y * CELL_SIZE + 1, 
        CELL_SIZE - 2, 
        CELL_SIZE - 2
      );
      
      // Draw eye details on head
      if (index === 0) {
        const eyeColor = '#ffffff';
        const eyeSize = Math.max(2, CELL_SIZE / 6);
        
        // Eye positions based on direction
        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
        
        switch(enemy.direction) {
          case 'up':
            leftEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
            leftEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3;
            rightEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
            rightEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3;
            break;
          case 'down':
            leftEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
            leftEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3;
            rightEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
            rightEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3;
            break;
          case 'left':
            leftEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3;
            leftEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
            rightEyeX = segment.x * CELL_SIZE + CELL_SIZE / 3;
            rightEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
            break;
          case 'right':
            leftEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3;
            leftEyeY = segment.y * CELL_SIZE + CELL_SIZE / 3 - eyeSize / 2;
            rightEyeX = segment.x * CELL_SIZE + 2 * CELL_SIZE / 3;
            rightEyeY = segment.y * CELL_SIZE + 2 * CELL_SIZE / 3 - eyeSize / 2;
            break;
        }
        
        gameCtx.fillStyle = eyeColor;
        gameCtx.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
        gameCtx.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
      }
    });
  });
  
  // Draw food with a pulsing effect based on time
  gameState.food.forEach(food => {
    const pulseAmount = Math.sin(Date.now() / 200) * 0.1 + 0.9;
    gameCtx.fillStyle = food.type.color;
    
    // Different visual styles for different food types
    if (food.type === FOOD_TYPES.REGULAR) {
      gameCtx.beginPath();
      gameCtx.arc(
        food.x * CELL_SIZE + CELL_SIZE/2, 
        food.y * CELL_SIZE + CELL_SIZE/2, 
        (CELL_SIZE/2 - 2) * pulseAmount, 
        0, 
        Math.PI * 2
      );
      gameCtx.fill();
    } else if (food.type === FOOD_TYPES.SPEED) {
      // Triangle (speed food)
      gameCtx.beginPath();
      gameCtx.moveTo(food.x * CELL_SIZE + CELL_SIZE/2, food.y * CELL_SIZE + 2);
      gameCtx.lineTo(food.x * CELL_SIZE + CELL_SIZE - 2, food.y * CELL_SIZE + CELL_SIZE - 2);
      gameCtx.lineTo(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + CELL_SIZE - 2);
      gameCtx.closePath();
      gameCtx.fill();
    } else if (food.type === FOOD_TYPES.SLOW) {
      // Square (slow food)
      gameCtx.fillRect(
        food.x * CELL_SIZE + 3, 
        food.y * CELL_SIZE + 3, 
        CELL_SIZE - 6, 
        CELL_SIZE - 6
      );
    } else if (food.type === FOOD_TYPES.STEAL) {
      // Star (steal food)
      const centerX = food.x * CELL_SIZE + CELL_SIZE/2;
      const centerY = food.y * CELL_SIZE + CELL_SIZE/2;
      const outerRadius = (CELL_SIZE/2 - 2) * pulseAmount;
      const innerRadius = outerRadius / 2;
      
      gameCtx.beginPath();
      for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = Math.PI * 2 * i / 10 - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        if (i === 0) {
          gameCtx.moveTo(x, y);
        } else {
          gameCtx.lineTo(x, y);
        }
      }
      gameCtx.closePath();
      gameCtx.fill();
    } else if (food.type === FOOD_TYPES.BONUS) {
      // Diamond (bonus food)
      const centerX = food.x * CELL_SIZE + CELL_SIZE/2;
      const centerY = food.y * CELL_SIZE + CELL_SIZE/2;
      const size = (CELL_SIZE/2 - 2) * pulseAmount;
      
      gameCtx.beginPath();
      gameCtx.moveTo(centerX, centerY - size);
      gameCtx.lineTo(centerX + size, centerY);
      gameCtx.lineTo(centerX, centerY + size);
      gameCtx.lineTo(centerX - size, centerY);
      gameCtx.closePath();
      gameCtx.fill();
    }
  });
  
  // Draw active mutations
  if (gameState.player.mutations.length > 0) {
    gameCtx.font = '10px monospace';
    gameCtx.fillStyle = COLORS.mutation;
    gameCtx.textAlign = 'left';
    
    gameState.player.mutations.forEach((mutation, index) => {
      gameCtx.fillText(
        `${mutation.name}: ${mutation.duration}`, 
        10, 
        20 + index * 15
      );
    });
  }
  
  // Draw level indicator
  gameCtx.font = '10px monospace';
  gameCtx.fillStyle = COLORS.text;
  gameCtx.textAlign = 'right';
  gameCtx.fillText(`LEVEL ${gameState.level}`, gameCanvas.width - 10, 20);
  
  // Draw game over or victory message if needed
  if (gameState.gameOver) {
    gameCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    gameCtx.font = '20px monospace';
    gameCtx.fillStyle = COLORS.gameOver;
    gameCtx.textAlign = 'center';
    
    if (gameState.victory) {
      gameCtx.fillText('VICTORY! YOU ARE THE ONE WYRM!', gameCanvas.width/2, gameCanvas.height/2 - 20);
      gameCtx.fillText(`FINAL SCORE: ${gameState.score}`, gameCanvas.width/2, gameCanvas.height/2 + 10);
    } else {
      gameCtx.fillText('GAME OVER', gameCanvas.width/2, gameCanvas.height/2 - 20);
      gameCtx.fillText(`SCORE: ${gameState.score}`, gameCanvas.width/2, gameCanvas.height/2 + 10);
    }
    
    gameCtx.font = '14px monospace';
    gameCtx.fillText('PRESS SPACE TO RESTART', gameCanvas.width/2, gameCanvas.height/2 + 40);
    
    // Add a glitch effect occasionally
    if (Math.random() < 0.1) {
      createGlitchEffect();
    }
  }
  
  // Update status display
  updateStatusDisplay();
}

// Update the status display
function updateStatusDisplay() {
  const statusDisplay = document.getElementById('wyrm-status-display');
  if (statusDisplay) {
    let statusText = `SCORE: ${gameState.score} | LENGTH: ${gameState.player.segments.length}`;
    
    // Add active mutations
    if (gameState.player.mutations.length > 0) {
      statusText += ' | MUTATIONS: ';
      gameState.player.mutations.forEach((mutation, index) => {
        statusText += `${mutation.name}(${mutation.duration})`;
        if (index < gameState.player.mutations.length - 1) {
          statusText += ', ';
        }
      });
    }
    
    // Add level info
    statusText += ` | ENEMIES: ${gameState.enemies.length}`;
    
    statusDisplay.textContent = statusText;
    
    // Add a "one Wyrm" indicator when close to victory
    if (gameState.enemies.length === 1 && gameState.enemies[0].segments.length < gameState.player.segments.length) {
      const oneWyrmIndicator = document.createElement('div');
      oneWyrmIndicator.textContent = "BECOMING THE ONE WYRM...";
      oneWyrmIndicator.style.color = COLORS.mutation;
      statusDisplay.appendChild(oneWyrmIndicator);
    }
  }
}

// Update game logic
function updateGame() {
  if (gameState.gameOver) return;
  
  // Update player direction
  gameState.player.direction = gameState.player.nextDirection;
  
  // Update food positions occasionally
  updateFoodPositions();
  
  // Calculate new head position
  const head = {...gameState.player.segments[0]};
  
  switch (gameState.player.direction) {
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
  
  // Handle wall wrapping (passage through borders)
  if (head.x < 0) head.x = GAME_WIDTH - 1;
  else if (head.x >= GAME_WIDTH) head.x = 0;
  else if (head.y < 0) head.y = GAME_HEIGHT - 1;
  else if (head.y >= GAME_HEIGHT) head.y = 0;
  
  // Check collisions
  // 1. Wall collision (only internal walls, not borders)
  const wallCollision = gameState.walls.some(wall => 
    wall.x === head.x && wall.y === head.y &&
    !(wall.x === 0 || wall.x === GAME_WIDTH-1 || wall.y === 0 || wall.y === GAME_HEIGHT-1)
  );
  
  if (wallCollision && !gameState.player.isGhost) {
    // Non-ghost players bounce off internal walls
    createGlitchEffect(true);
    return; // Skip the rest of the update
  }
  
  // 2. Self collision
  const selfCollision = gameState.player.segments.some(segment => 
    segment.x === head.x && segment.y === head.y
  );
  
  if (selfCollision && !gameState.player.isGhost) {
    endGame(false);
    return;
  }
  
  // Add new head
  gameState.player.segments.unshift(head);
  
  // 3. Enemy collision
  if (!gameState.player.isGhost) {
    for (let i = 0; i < gameState.enemies.length; i++) {
      const enemy = gameState.enemies[i];
      const enemyCollision = enemy.segments.some(segment => 
        segment.x === head.x && segment.y === head.y
      );
      
      if (enemyCollision) {
        if (gameState.player.isHunter) {
          // In hunter mode, eat the enemy
          gameState.enemies.splice(i, 1);
          gameState.score += 50;
          createGlitchEffect(true);
          
          // Add segments equal to half the enemy's length
          const segmentsToAdd = Math.floor(enemy.segments.length / 2);
          for (let j = 0; j < segmentsToAdd; j++) {
            const tail = gameState.player.segments[gameState.player.segments.length - 1];
            gameState.player.segments.push({...tail});
          }
          
          // Check for victory
          if (gameState.enemies.length === 0) {
            if (gameState.level < 3) {
              // Advance to next level
              advanceLevel();
            } else {
              // Final victory
              endGame(true);
            }
          }
          
          break;
        } else if (gameState.player.isArmored) {
          // Armored players push enemies away
          createGlitchEffect(true);
          break;
        } else {
          // Normal collision - lose segments or game over
          if (gameState.player.segments.length > 5) {
            // Remove last 3 segments
            for (let j = 0; j < 3; j++) {
              if (gameState.player.segments.length > 3) {
                gameState.player.segments.pop();
              }
            }
            createGlitchEffect(true);
          } else {
            endGame(false);
            return;
          }
        }
      }
    }
  }
  
  // 4. Food collision
  const foodIndex = gameState.food.findIndex(food => 
    food.x === head.x && food.y === head.y
  );
  
  if (foodIndex !== -1) {
    const food = gameState.food[foodIndex];
    
    // Increase score
    gameState.score += food.type.points;
    
    // Snake grows, so we don't remove the tail
    gameState.player.segmentsToAdd += 1;
    
    // Apply food effects
    if (food.type.speedEffect !== 0) {
      // Change game speed
      gameState.gameSpeed = Math.max(50, Math.min(250, gameState.gameSpeed + food.type.speedEffect));
    }
    
    // Handle steal food
    if (food.type === FOOD_TYPES.STEAL && Math.random() < food.type.stealChance) {
      // Find an enemy to steal from
      if (gameState.enemies.length > 0) {
        const targetEnemyIndex = Math.floor(Math.random() * gameState.enemies.length);
        const targetEnemy = gameState.enemies[targetEnemyIndex];
        
        if (targetEnemy.segments.length > 3) {
          // Steal a segment
          targetEnemy.segments.pop();
          gameState.player.segmentsToAdd += 1;
          
          // Visual feedback
          createGlitchEffect(true);
        }
      }
    }
    
    // Remove consumed food
    gameState.food.splice(foodIndex, 1);
    
    // Spawn new food
    spawnFood(1);
    
    // Chance to spawn a mutation
    if (Math.random() < MUTATION_CHANCE) {
      spawnMutation();
    }
    
    // Add a small glitch effect for eating
    createGlitchEffect();
  }
  
  // Update enemy wyrms
  updateEnemies();
  
  // Add segments from queue or remove tail if no food was eaten
  if (gameState.player.segmentsToAdd > 0) {
    gameState.player.segmentsToAdd--;
  } else {
    gameState.player.segments.pop();
  }
  
  // Update mutations
  updateMutations();
  
  // Check for victory condition
  if (gameState.enemies.length === 0 && !gameState.gameOver) {
    if (gameState.level < 3) {
      // Advance to next level
      advanceLevel();
    } else {
      // Final victory
      endGame(true);
    }
  }
}

// Update active mutations
function updateMutations() {
  // Reduce duration of active mutations
  for (let i = gameState.player.mutations.length - 1; i >= 0; i--) {
    gameState.player.mutations[i].duration--;
    
    if (gameState.player.mutations[i].duration <= 0) {
      // Remove expired mutation
      const removedMutation = gameState.player.mutations.splice(i, 1)[0];
      
      // Remove the effect
      switch(removedMutation.name) {
        case 'SPEED BOOST':
          gameState.gameSpeed = INITIAL_GAME_SPEED;
          break;
        case 'GHOST MODE':
          gameState.player.isGhost = false;
          break;
        case 'FOOD MAGNET':
          gameState.player.isMagnetic = false;
          break;
        case 'ARMORED':
          gameState.player.isArmored = false;
          break;
        case 'HUNTER':
          gameState.player.isHunter = false;
          break;
      }
    }
  }
  
  // Apply pending mutations
  if (gameState.pendingMutations.length > 0) {
    const mutation = gameState.pendingMutations.shift();
    
    // Apply mutation effect
    mutation.effect(gameState);
    
    // Set the appropriate flag
    switch(mutation.name) {
      case 'SPEED BOOST':
        // Already applied in the effect function
        break;
      case 'GHOST MODE':
        gameState.player.isGhost = true;
        break;
      case 'FOOD MAGNET':
        gameState.player.isMagnetic = true;
        break;
      case 'ARMORED':
        gameState.player.isArmored = true;
        break;
      case 'HUNTER':
        gameState.player.isHunter = true;
        break;
    }
    
    // Add to active mutations
    gameState.player.mutations.push(mutation);
    
    // Visual effect
    createGlitchEffect(true);
  }
  
  // Handle food magnet effect
  if (gameState.player.isMagnetic && gameState.food.length > 0) {
    const head = gameState.player.segments[0];
    
    // Find closest food
    let closestFood = null;
    let minDist = Infinity;
    
    gameState.food.forEach(food => {
      const dist = Math.abs(food.x - head.x) + Math.abs(food.y - head.y);
      if (dist < minDist && dist < 8) { // Only attract food within range
        minDist = dist;
        closestFood = food;
      }
    });
    
    // Move closest food toward player
    if (closestFood && Math.random() < 0.3) {
      const distX = head.x - closestFood.x;
      const distY = head.y - closestFood.y;
      
      if (Math.abs(distX) > Math.abs(distY)) {
        closestFood.x += Math.sign(distX);
      } else {
        closestFood.y += Math.sign(distY);
      }
    }
  }
}

// Spawn a random mutation
function spawnMutation() {
  // Choose a random mutation
  const mutationKeys = Object.keys(MUTATIONS);
  const randomKey = mutationKeys[Math.floor(Math.random() * mutationKeys.length)];
  const mutationType = MUTATIONS[randomKey];
  
  // Create a new mutation instance
  const mutation = {
    name: mutationType.name,
    effect: mutationType.effect,
    duration: mutationType.duration
  };
  
  // Add to pending mutations
  gameState.pendingMutations.push(mutation);
}

// Advance to the next level
function advanceLevel() {
  gameState.level++;
  
  // Visual feedback
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createGlitchEffect(true), i * 100);
  }
  
  // Reset game speed
  gameState.gameSpeed = INITIAL_GAME_SPEED;
  
  // Clear active mutations
  gameState.player.mutations = [];
  gameState.pendingMutations = [];
  gameState.player.isGhost = false;
  gameState.player.isMagnetic = false;
  gameState.player.isArmored = false;
  gameState.player.isHunter = false;
  
  // Generate new walls for the next level
  generateWalls();
  
  // Clear food
  gameState.food = [];
  
  // Clear enemies
  gameState.enemies = [];
  
  // Spawn new enemies
  spawnEnemies();
  
  // Spawn new food
  spawnFood(3);
  
  // Display level message
  const statusDisplay = document.getElementById('wyrm-status-display');
  if (statusDisplay) {
    statusDisplay.innerHTML = `<div style="color: ${COLORS.mutation}">LEVEL ${gameState.level} - THE PIT DEEPENS</div>`;
    
    // Restore normal status after a delay
    setTimeout(() => {
      updateStatusDisplay();
    }, 3000);
  }
}

// End the game
function endGame(victory) {
  gameState.gameOver = true;
  gameState.victory = victory;
  
  // Add major glitch effect
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createGlitchEffect(true), i * 100);
  }
}

// Reset the game
function resetGame() {
  // Initialize a fresh game state
  initWyrmGame();
  
  // Indicate in status that game is reset
  const statusDisplay = document.getElementById('wyrm-status-display');
  if (statusDisplay) {
    statusDisplay.innerHTML = '<div style="color: #e0f8cf">GAME RESET - ENTER THE PIT</div>';
  }
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

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

// Helper function to mix two colors
function mixColors(color1, color2, ratio) {
  // Remove # if present
  color1 = color1.replace('#', '');
  color2 = color2.replace('#', '');
  
  // Parse the values
  const r1 = parseInt(color1.substring(0, 2), 16);
  const g1 = parseInt(color1.substring(2, 4), 16);
  const b1 = parseInt(color1.substring(4, 6), 16);
  
  const r2 = parseInt(color2.substring(0, 2), 16);
  const g2 = parseInt(color2.substring(2, 4), 16);
  const b2 = parseInt(color2.substring(4, 6), 16);
  
  // Mix the colors
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
        if (gameState.player.direction !== 'down') gameState.player.nextDirection = 'up';
        e.preventDefault(); // Prevent scrolling
        break;
      case 'ArrowDown':
        if (gameState.player.direction !== 'up') gameState.player.nextDirection = 'down';
        e.preventDefault(); // Prevent scrolling
        break;
      case 'ArrowLeft':
        if (gameState.player.direction !== 'right') gameState.player.nextDirection = 'left';
        e.preventDefault();
        break;
      case 'ArrowRight':
        if (gameState.player.direction !== 'left') gameState.player.nextDirection = 'right';
        e.preventDefault();
        break;
      case ' ':
        if (gameState.gameOver) {
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
  }, gameState.gameSpeed);
  
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