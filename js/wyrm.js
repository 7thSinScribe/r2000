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
const SIZE_REQUIREMENTS = [10, 20, 30]; // Minimum wyrm length to advance levels

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
    hunter: '#ff6b6b',  // Red - enables hunter mode
    bonus: '#4dabff'    // Blue - bonus points
  },
  wall: {
    deadly: '#285840',  // Dark green - deadly walls
    safe: '#429867'     // Light green - passable walls
  },
  mutation: '#f0f055', // Yellow for mutations
  text: '#e0f8cf',
  gameOver: '#e0f8cf'
};

// Food types and their effects
const FOOD_TYPES = {
  REGULAR: { name: 'regular', points: 10, color: COLORS.food.regular, moveChance: 0, speedEffect: 0 },
  SPEED: { name: 'speed', points: 15, color: COLORS.food.speed, moveChance: 0.1, speedEffect: -20 }, // Faster
  SLOW: { name: 'slow', points: 5, color: COLORS.food.slow, moveChance: 0.05, speedEffect: 20 },     // Slower
  HUNTER: { name: 'hunter', points: 20, color: COLORS.food.hunter, moveChance: 0.2, speedEffect: 0 }, // Hunter mode
  BONUS: { name: 'bonus', points: 30, color: COLORS.food.bonus, moveChance: 0.2, speedEffect: 0 }
};

// Mutation types
const MUTATIONS = {
  SPEED: { name: 'SPEED BOOST', effect: (gameState) => { gameState.gameSpeed = Math.max(50, gameState.gameSpeed - 30); }, duration: 100 },
  GHOST: { name: 'GHOST MODE', effect: () => {}, duration: 50 }, // Implemented in collision logic
  MAGNETIC: { name: 'FOOD MAGNET', effect: () => {}, duration: 40 }, // Implemented in update logic
  ARMORED: { name: 'ARMORED', effect: () => {}, duration: 70 }, // Prevents segment loss
  HUNTER: { name: 'HUNTER', effect: () => {}, duration: 60 }  // Enables attacking other wyrms
};

// Game variables
let gameState = null;
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
    deadSegments: [],
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
  
  // All levels have outer boundary walls - these are safe to pass through
  for (let x = 0; x < GAME_WIDTH; x++) {
    for (let y = 0; y < GAME_HEIGHT; y++) {
      // Top and bottom borders
      if (y === 0 || y === GAME_HEIGHT-1) {
        gameState.walls.push({x, y, safe: true});
      }
      // Left and right borders
      if (x === 0 || x === GAME_WIDTH-1) {
        gameState.walls.push({x, y, safe: true});
      }
    }
  }
  
  if (level === 1) {
    // Simple interior walls - these are deadly
    for (let x = 10; x < 30; x++) {
      if (x < 15 || x > 25) {
        gameState.walls.push({x, y: 15, safe: false});
      }
    }
    
    // Add some vertical obstacles
    for (let y = 5; y < 10; y++) {
      gameState.walls.push({x: 10, y, safe: false});
      gameState.walls.push({x: 30, y, safe: false});
    }
    
    for (let y = 20; y < 25; y++) {
      gameState.walls.push({x: 10, y, safe: false});
      gameState.walls.push({x: 30, y, safe: false});
    }
  } else if (level === 2) {
    // More complex pattern with deadly internal walls
    
    // Cross in the middle
    for (let x = 10; x < 30; x++) {
      if (x !== 20) {
        gameState.walls.push({x, y: 15, safe: false});
      }
    }
    
    for (let y = 5; y < 25; y++) {
      if (y !== 15) {
        gameState.walls.push({x: 20, y, safe: false});
      }
    }
    
    // Corner obstacles
    for (let i = 0; i < 5; i++) {
      gameState.walls.push({x: 5 + i, y: 5 + i, safe: false});
      gameState.walls.push({x: 35 - i, y: 5 + i, safe: false});
      gameState.walls.push({x: 5 + i, y: 25 - i, safe: false});
      gameState.walls.push({x: 35 - i, y: 25 - i, safe: false});
    }
  } else {
    // Random maze-like walls for level 3
    
    // Add diagonal walls
    for (let i = 5; i < 15; i++) {
      gameState.walls.push({x: i, y: i, safe: false});
      gameState.walls.push({x: GAME_WIDTH - i - 1, y: i, safe: false});
    }
    
    // Add some enclosures with small openings
    for (let x = 5; x < 15; x++) {
      for (let y = 20; y < 25; y++) {
        if (!(x === 10 && y === 20)) {
          gameState.walls.push({x, y, safe: false});
        }
      }
    }
    
    for (let x = 25; x < 35; x++) {
      for (let y = 5; y < 10; y++) {
        if (!(x === 30 && y === 9)) {
          gameState.walls.push({x, y, safe: false});
        }
      }
    }
    
    // Add a central circular obstacle
    const centerX = Math.floor(GAME_WIDTH / 2);
    const centerY = Math.floor(GAME_HEIGHT / 2);
    const radius = 5;
    
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      for (let y = centerY - radius; y <= centerY + radius; y++) {
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distance <= radius && distance > radius - 1) {
          gameState.walls.push({x, y, safe: false});
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
      
      // Check not on any wall
      let notOnWall = !gameState.walls.some(wall => wall.x === startX && wall.y === startY);
      
      // Check not on top of other enemies
      let notOnEnemy = !gameState.enemies.some(enemy => 
        enemy.segments.some(segment => segment.x === startX && segment.y === startY)
      );
      
      // Check not on dead segments
      let notOnDeadSegment = !gameState.deadSegments.some(segment => 
        segment.x === startX && segment.y === startY
      );
      
      validPosition = awayFromPlayer && notOnWall && notOnEnemy && notOnDeadSegment;
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
      
      // Check if the new segment is valid
      if (newSegment.x < 0 || newSegment.x >= GAME_WIDTH || 
          newSegment.y < 0 || newSegment.y >= GAME_HEIGHT) {
        // If out of bounds, stop adding segments
        break;
      }
      
      segments.push(newSegment);
    }
    
    // Add enemy to game state with at least 3 segments
    if (segments.length >= 3) {
      gameState.enemies.push({
        segments: segments,
        direction: direction,
        color: COLORS.enemies[i % COLORS.enemies.length],
        speed: INITIAL_GAME_SPEED + Math.floor(Math.random() * 50) - 25, // Vary speed
        moveCounter: 0
      });
    } else {
      // Try again if we couldn't create a valid enemy
      i--;
    }
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
        foodType = FOOD_TYPES.BONUS;
      } else {
        foodType = FOOD_TYPES.HUNTER; // Hunter food is rare
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
      
      // Check not on dead segments
      if (gameState.deadSegments.some(segment => segment.x === x && segment.y === y)) {
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
        
        // Check boundaries (wrap if needed)
        let checkX = newX;
        let checkY = newY;
        
        if (checkX < 0) checkX = GAME_WIDTH - 1;
        else if (checkX >= GAME_WIDTH) checkX = 0;
        else if (checkY < 0) checkY = GAME_HEIGHT - 1;
        else if (checkY >= GAME_HEIGHT) checkY = 0;
        
        // Check not on walls
        if (gameState.walls.some(wall => wall.x === checkX && wall.y === checkY && !wall.safe)) {
          validPosition = false;
          continue;
        }
        
        // Check not on player
        if (gameState.player.segments.some(segment => segment.x === checkX && segment.y === checkY)) {
          validPosition = false;
          continue;
        }
        
        // Check not on enemies
        if (gameState.enemies.some(enemy => 
          enemy.segments.some(segment => segment.x === checkX && segment.y === checkY)
        )) {
          validPosition = false;
          continue;
        }
        
        // Check not on other food
        if (gameState.food.some(f => f !== food && f.x === checkX && f.y === checkY)) {
          validPosition = false;
          continue;
        }
        
        // Check not on dead segments
        if (gameState.deadSegments.some(segment => segment.x === checkX && segment.y === checkY)) {
          validPosition = false;
          continue;
        }
        
        if (validPosition) {
          food.x = checkX;
          food.y = checkY;
          break;
        }
      }
    }
  });
}

// Update enemy movement
function updateEnemies() {
  gameState.enemies.forEach((enemy, enemyIndex) => {
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
        
        // Dead segments are also attractive as food
        gameState.deadSegments.forEach(segment => {
          const dist = Math.abs(segment.x - head.x) + Math.abs(segment.y - head.y);
          if (dist < minFoodDist) {
            minFoodDist = dist;
            closestFood = segment;
          }
        });
        
        // 70% chance to go for food, 30% to chase player if not much food
        if (closestFood && (Math.random() < 0.7 || minFoodDist < 5)) {
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
      
      // Calculate new head position
      const newHead = { x: head.x, y: head.y };
      switch(targetDirection) {
        case 'up': newHead.y--; break;
        case 'down': newHead.y++; break;
        case 'left': newHead.x--; break;
        case 'right': newHead.x++; break;
      }
      
      // Handle edge wrapping for enemies
      if (newHead.x < 0) newHead.x = GAME_WIDTH - 1;
      else if (newHead.x >= GAME_WIDTH) newHead.x = 0;
      else if (newHead.y < 0) newHead.y = GAME_HEIGHT - 1;
      else if (newHead.y >= GAME_HEIGHT) newHead.y = 0;
      
      // Check for deadly wall collision
      const hitWall = gameState.walls.find(wall => wall.x === newHead.x && wall.y === newHead.y);
      if (hitWall && !hitWall.safe) {
        // Enemy hit a deadly wall - destroy it
        gameState.enemies.splice(enemyIndex, 1);
        
        // Add segments to dead segments
        enemy.segments.forEach(segment => {
          gameState.deadSegments.push({
            x: segment.x,
            y: segment.y,
            color: enemy.color.body,
            points: 5,
            timeLeft: 300
          });
        });
        
        // Visual effect
        createGlitchEffect(true);
        return;
      }
      
      // Check for self collision
      if (enemy.segments.slice(1).some(segment => 
        segment.x === newHead.x && segment.y === newHead.y
      )) {
        // Try each alternative direction
        let avoidedCollision = false;
        for (const dir of validDirections.filter(d => d !== targetDirection)) {
          const testHead = { x: head.x, y: head.y };
          switch(dir) {
            case 'up': testHead.y--; break;
            case 'down': testHead.y++; break;
            case 'left': testHead.x--; break;
            case 'right': testHead.x++; break;
          }
          
          // Edge wrapping
          if (testHead.x < 0) testHead.x = GAME_WIDTH - 1;
          else if (testHead.x >= GAME_WIDTH) testHead.x = 0;
          else if (testHead.y < 0) testHead.y = GAME_HEIGHT - 1;
          else if (testHead.y >= GAME_HEIGHT) testHead.y = 0;
          
          // Check for deadly wall
          const wallHit = gameState.walls.find(wall => wall.x === testHead.x && wall.y === testHead.y);
          if (wallHit && !wallHit.safe) continue; // Skip deadly walls
          
          // Check for self collision
          const selfCollision = enemy.segments.slice(1).some(segment => 
            segment.x === testHead.x && segment.y === testHead.y
          );
          
          if (!selfCollision) {
            targetDirection = dir;
            newHead.x = testHead.x;
            newHead.y = testHead.y;
            avoidedCollision = true;
            break;
          }
        }
        
        if (!avoidedCollision) {
          // No safe direction - destroy the enemy
          gameState.enemies.splice(enemyIndex, 1);
          
          // Add to dead segments
          enemy.segments.forEach(segment => {
            gameState.deadSegments.push({
              x: segment.x,
              y: segment.y,
              color: enemy.color.body,
              points: 5,
              timeLeft: 300
            });
          });
          
          // Visual effect
          createGlitchEffect(true);
          return;
        }
      }
      
      // Update direction
      enemy.direction = targetDirection;
      
      // Check for head-on collision with other enemies
      for (let i = 0; i < gameState.enemies.length; i++) {
        if (i === enemyIndex) continue; // Skip self
        
        const otherEnemy = gameState.enemies[i];
        const otherHead = otherEnemy.segments[0];
        
        if (newHead.x === otherHead.x && newHead.y === otherHead.y) {
          // Head-on collision!
          // The larger wyrm survives, or both die if similar size
          if (enemy.segments.length > otherEnemy.segments.length * 1.5) {
            // This enemy wins
            const deadEnemy = gameState.enemies.splice(i, 1)[0];
            
            // Add dead enemy segments to the board
            deadEnemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: deadEnemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            // Grow this enemy
            enemy.segments.push({...enemy.segments[enemy.segments.length - 1]});
            
            // Visual effect
            createGlitchEffect(true);
            
            if (i < enemyIndex) enemyIndex--; // Adjust index if needed
            
          } else if (otherEnemy.segments.length > enemy.segments.length * 1.5) {
            // Other enemy wins
            gameState.enemies.splice(enemyIndex, 1);
            
            // Add segments to the board
            enemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: enemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            // Grow the other enemy
            otherEnemy.segments.push({...otherEnemy.segments[otherEnemy.segments.length - 1]});
            
            // Visual effect
            createGlitchEffect(true);
            return;
          } else {
            // Both die in the collision
            gameState.enemies.splice(Math.max(i, enemyIndex), 1);
            gameState.enemies.splice(Math.min(i, enemyIndex), 1);
            
            // Add both sets of segments to the board
            enemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: enemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            otherEnemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: otherEnemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            // Visual effect
            createGlitchEffect(true);
            return;
          }
        }
      }
      
      // Move enemy
      enemy.segments.unshift(newHead);
      enemy.segments.pop();
      
      // Check for collision with player body
      const playerBodyCollision = gameState.player.segments.slice(1).some(segment => 
        segment.x === newHead.x && segment.y === newHead.y
      );
      
      if (playerBodyCollision && !gameState.player.isGhost) {
        // Enemy slices through player's body
        let sliceIndex = gameState.player.segments.findIndex((segment, index) => 
          index > 0 && segment.x === newHead.x && segment.y === newHead.y
        );
        
        if (sliceIndex !== -1) {
          // Create dead segments from the cut pieces
          const slicedSegments = gameState.player.segments.splice(sliceIndex);
          
          slicedSegments.forEach(segment => {
            gameState.deadSegments.push({
              x: segment.x,
              y: segment.y,
              color: COLORS.player.body,
              points: 5,
              timeLeft: 300
            });
          });
          
          // Visual effect for slicing
          createGlitchEffect(true);
        }
      }
      
      // Check for food collision
      const foodIndex = gameState.food.findIndex(food => 
        food.x === newHead.x && food.y === newHead.y
      );
      
      if (foodIndex !== -1) {
        // Enemy eats food
        const food = gameState.food.splice(foodIndex, 1)[0];
        
        // Grow by 1 segment
        const tail = enemy.segments[enemy.segments.length - 1];
        enemy.segments.push({...tail});
        
        // If it was hunter food, enemy can briefly become a threat
        if (food.type === FOOD_TYPES.HUNTER) {
          // Make enemy faster for a short time
          enemy.speed = Math.max(50, enemy.speed - 30);
          setTimeout(() => {
            enemy.speed = INITIAL_GAME_SPEED + Math.floor(Math.random() * 50) - 25;
          }, 3000);
        }
        
        // Spawn new food
        spawnFood(1);
      }
      
      // Check for dead segment collision
      const deadSegmentIndex = gameState.deadSegments.findIndex(segment => 
        segment.x === newHead.x && segment.y === newHead.y
      );
      
      if (deadSegmentIndex !== -1) {
        // Enemy eats dead segment
        gameState.deadSegments.splice(deadSegmentIndex, 1);
        
        // Grow by 1 segment
        const tail = enemy.segments[enemy.segments.length - 1];
        enemy.segments.push({...tail});
      }
      
      // Check for collision with player head
      if (!gameState.player.isGhost) {
        const playerHead = gameState.player.segments[0];
        
        if (newHead.x === playerHead.x && newHead.y === playerHead.y) {
          // Head-on collision with player!
          if (gameState.player.isHunter) {
            // Player wins if in hunter mode
            gameState.enemies.splice(enemyIndex, 1);
            
            // Add to dead segments
            enemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: enemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            // Score points
            gameState.score += 50;
            
            // Grow player
            const playerTail = gameState.player.segments[gameState.player.segments.length - 1];
            gameState.player.segments.push({...playerTail});
            
            // Visual effect
            createGlitchEffect(true);
            return;
          } else if (gameState.player.segments.length > enemy.segments.length * 1.5) {
            // Player wins by size advantage
            gameState.enemies.splice(enemyIndex, 1);
            
            // Add to dead segments
            enemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: enemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            // Grow player
            gameState.player.segmentsToAdd += 2;
            
            // Score points
            gameState.score += 30;
            
            // Visual effect
            createGlitchEffect(true);
            return;
          } else if (enemy.segments.length > gameState.player.segments.length * 1.5) {
            // Enemy wins by size advantage
            if (!gameState.player.isArmored) {
              endGame(false);
              return;
            }
          } else {
            // Both die in the collision
            if (!gameState.player.isArmored) {
              endGame(false);
              return;
            } else {
              // Player survives due to armor
              gameState.enemies.splice(enemyIndex, 1);
              
              // Add to dead segments
              enemy.segments.forEach(segment => {
                gameState.deadSegments.push({
                  x: segment.x,
                  y: segment.y,
                  color: enemy.color.body,
                  points: 5,
                  timeLeft: 300
                });
              });
              
              // Visual effect
              createGlitchEffect(true);
              return;
            }
          }
        }
      }
    }
  });
  
  // Update dead segments timers
  for (let i = gameState.deadSegments.length - 1; i >= 0; i--) {
    gameState.deadSegments[i].timeLeft--;
    if (gameState.deadSegments[i].timeLeft <= 0) {
      gameState.deadSegments.splice(i, 1);
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
  
  // Handle edge wrapping (borders of the screen)
  if (head.x < 0) head.x = GAME_WIDTH - 1;
  else if (head.x >= GAME_WIDTH) head.x = 0;
  else if (head.y < 0) head.y = GAME_HEIGHT - 1;
  else if (head.y >= GAME_HEIGHT) head.y = 0;
  
  // Handle wall collision
  const hitWall = gameState.walls.find(wall => wall.x === head.x && wall.y === head.y);
  if (hitWall && !hitWall.safe && !gameState.player.isGhost) {
    // Deadly wall hit when not in ghost mode
    endGame(false);
    return;
  }
  
  // Check for self collision
  const selfCollision = gameState.player.segments.some(segment => 
    segment.x === head.x && segment.y === head.y
  );
  
  if (selfCollision && !gameState.player.isGhost) {
    endGame(false);
    return;
  }
  
  // Add new head
  gameState.player.segments.unshift(head);
  
  // Check for enemy body collision
  if (!gameState.player.isGhost) {
    for (let i = 0; i < gameState.enemies.length; i++) {
      const enemy = gameState.enemies[i];
      
      // Check collision with enemy body (not head)
      const bodyCollisionIndex = enemy.segments.findIndex((segment, index) => 
        index > 0 && segment.x === head.x && segment.y === head.y
      );
      
      if (bodyCollisionIndex !== -1) {
        if (gameState.player.isHunter) {
          // In hunter mode, slice the enemy in half
          const slicedSegments = enemy.segments.splice(bodyCollisionIndex);
          
          // Add sliced segments to dead segments
          slicedSegments.forEach(segment => {
            gameState.deadSegments.push({
              x: segment.x,
              y: segment.y,
              color: enemy.color.body,
              points: 5,
              timeLeft: 300
            });
          });
          
          // Score points
          gameState.score += slicedSegments.length * 5;
          
          // Visual effect
          createGlitchEffect(true);
          
          // Check if enemy is gone
          if (enemy.segments.length < 3) {
            // Remove the enemy entirely
            gameState.enemies.splice(i, 1);
            i--;
          }
          
          // Check for victory
          if (gameState.enemies.length === 0 && 
              gameState.player.segments.length >= SIZE_REQUIREMENTS[gameState.level - 1]) {
            if (gameState.level < 3) {
              // Advance to next level
              advanceLevel();
            } else {
              // Final victory
              endGame(true);
            }
          }
        } else {
          // Not in hunter mode - die
          endGame(false);
          return;
        }
      }
      
      // Check for head-on collision
      const enemyHead = enemy.segments[0];
      if (head.x === enemyHead.x && head.y === enemyHead.y) {
        // Head-on collision!
        if (gameState.player.isHunter) {
          // Player wins in hunter mode
          gameState.enemies.splice(i, 1);
          
          // Add to dead segments
          enemy.segments.forEach(segment => {
            gameState.deadSegments.push({
              x: segment.x,
              y: segment.y,
              color: enemy.color.body,
              points: 5,
              timeLeft: 300
            });
          });
          
          // Score points
          gameState.score += 50;
          
          // Grow player
          gameState.player.segmentsToAdd += 3;
          
          // Visual effect
          createGlitchEffect(true);
          
          i--;
        } else if (gameState.player.segments.length > enemy.segments.length * 1.5) {
          // Player wins by size advantage
          gameState.enemies.splice(i, 1);
          
          // Add to dead segments
          enemy.segments.forEach(segment => {
            gameState.deadSegments.push({
              x: segment.x,
              y: segment.y,
              color: enemy.color.body,
              points: 5,
              timeLeft: 300
            });
          });
          
          // Grow player
          gameState.player.segmentsToAdd += 2;
          
          // Score points
          gameState.score += 30;
          
          // Visual effect
          createGlitchEffect(true);
          
          i--;
        } else if (enemy.segments.length > gameState.player.segments.length * 1.5) {
          // Enemy wins by size advantage
          if (!gameState.player.isArmored) {
            endGame(false);
            return;
          }
        } else {
          // Both die in the collision
          if (!gameState.player.isArmored) {
            endGame(false);
            return;
          } else {
            // Player survives due to armor
            gameState.enemies.splice(i, 1);
            
            // Add to dead segments
            enemy.segments.forEach(segment => {
              gameState.deadSegments.push({
                x: segment.x,
                y: segment.y,
                color: enemy.color.body,
                points: 5,
                timeLeft: 300
              });
            });
            
            // Visual effect
            createGlitchEffect(true);
            
            i--;
          }
        }
      }
    }
  }
  
  // Check for food collision
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
    
    // Handle hunter food
    if (food.type === FOOD_TYPES.HUNTER) {
      // Spawn hunter mutation
      const mutation = {
        name: MUTATIONS.HUNTER.name,
        effect: MUTATIONS.HUNTER.effect,
        duration: MUTATIONS.HUNTER.duration
      };
      
      // Add to pending mutations
      gameState.pendingMutations.push(mutation);
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
  
  // Check for dead segment collision
  const deadSegmentIndex = gameState.deadSegments.findIndex(segment => 
    segment.x === head.x && segment.y === head.y
  );
  
  if (deadSegmentIndex !== -1) {
    // Player eats dead segment
    const segment = gameState.deadSegments[deadSegmentIndex];
    gameState.score += segment.points;
    gameState.deadSegments.splice(deadSegmentIndex, 1);
    
    // Grow by 1 segment
    gameState.player.segmentsToAdd += 1;
    
    // Visual effect
    createGlitchEffect(false);
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
  if (gameState.enemies.length === 0 && 
      gameState.player.segments.length >= SIZE_REQUIREMENTS[gameState.level - 1] && 
      !gameState.gameOver) {
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

// Draw the game state
function drawGame() {
  // Clear canvas
  gameCtx.fillStyle = COLORS.background;
  gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  
  // Draw dead segments
  gameState.deadSegments.forEach(segment => {
    gameCtx.fillStyle = segment.color;
    gameCtx.fillRect(
      segment.x * CELL_SIZE + 1, 
      segment.y * CELL_SIZE + 1, 
      CELL_SIZE - 2, 
      CELL_SIZE - 2
    );
    
    // Add slight fade effect as they decay
    if (segment.timeLeft < 100) {
      gameCtx.fillStyle = `rgba(48, 104, 80, ${0.7 * (1 - segment.timeLeft/100)})`;
      gameCtx.fillRect(
        segment.x * CELL_SIZE + 1, 
        segment.y * CELL_SIZE + 1, 
        CELL_SIZE - 2, 
        CELL_SIZE - 2
      );
    }
  });
  
  // Draw walls
  gameState.walls.forEach(wall => {
    gameCtx.fillStyle = wall.safe ? COLORS.wall.safe : COLORS.wall.deadly;
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
        color = mixColors(COLORS.player.head, COLORS.food.hunter, 0.3);
      } else {
        color = mixColors(COLORS.player.body, COLORS.food.hunter, 0.3);
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
    } else if (food.type === FOOD_TYPES.HUNTER) {
      // Star (hunter food)
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
  
  // Draw level indicator and size requirement
  gameCtx.font = '10px monospace';
  gameCtx.fillStyle = COLORS.text;
  gameCtx.textAlign = 'right';
  
  const sizeRequired = SIZE_REQUIREMENTS[gameState.level - 1];
  const currentSize = gameState.player.segments.length;
  gameCtx.fillText(
    `LEVEL ${gameState.level} - SIZE: ${currentSize}/${sizeRequired}`, 
    gameCanvas.width - 10, 
    20
  );
  
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
    let statusText = `SCORE: ${gameState.score} | LENGTH: ${gameState.player.segments.length}/${SIZE_REQUIREMENTS[gameState.level - 1]}`;
    
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
    
    // Add level and enemy info
    statusText += ` | ENEMIES: ${gameState.enemies.length}`;
    
    statusDisplay.innerHTML = statusText;
    
    // Add a "one Wyrm" indicator when close to victory
    if (gameState.enemies.length === 0 && 
        gameState.player.segments.length < SIZE_REQUIREMENTS[gameState.level - 1]) {
      const oneWyrmIndicator = document.createElement('div');
      oneWyrmIndicator.textContent = `NEED ${SIZE_REQUIREMENTS[gameState.level - 1] - gameState.player.segments.length} MORE SEGMENTS TO ADVANCE...`;
      oneWyrmIndicator.style.color = COLORS.mutation;
      statusDisplay.appendChild(oneWyrmIndicator);
    } else if (gameState.enemies.length === 1 && 
               gameState.player.segments.length > gameState.enemies[0].segments.length) {
      const oneWyrmIndicator = document.createElement('div');
      oneWyrmIndicator.textContent = "BECOMING THE ONE WYRM...";
      oneWyrmIndicator.style.color = COLORS.mutation;
      statusDisplay.appendChild(oneWyrmIndicator);
    }
    
    // Add hunter mode status
    if (gameState.player.isHunter) {
      const hunterIndicator = document.createElement('div');
      hunterIndicator.textContent = "HUNTER MODE ACTIVE!";
      hunterIndicator.style.color = COLORS.food.hunter;
      statusDisplay.appendChild(hunterIndicator);
    }
  }
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
  
  // Clear food and dead segments
  gameState.food = [];
  gameState.deadSegments = [];
  
  // Generate new walls for the next level
  generateWalls();
  
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
  // Clear game interval
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  
  // Initialize a fresh game state
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
    deadSegments: [],
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
  spawnFood(3);
  
  // Indicate in status that game is reset
  const statusDisplay = document.getElementById('wyrm-status-display');
  if (statusDisplay) {
    statusDisplay.innerHTML = '<div style="color: #e0f8cf">GAME RESET - ENTER THE PIT</div>';
  }
  
  // Restart game loop
  gameInterval = setInterval(() => {
    updateGame();
    drawGame();
  }, gameState.gameSpeed);
}

// Create a glitch effect
function createGlitchEffect(major = false) {
  const intensity = major ? 5 : 2;
  const numArtifacts = major ? 8 : 3;
  
  // Screen shake
  if (gameCanvas) {
    gameCanvas.style.transform = `translate(${(Math.random() - 0.5) * intensity}px, ${(Math.random() - 0.5) * intensity}px)`;
    setTimeout(() => {
      if (gameCanvas) {
        gameCanvas.style.transform = 'none';
      }
    }, 100);
  }
  
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
        if (gameInterval) {
          clearInterval(gameInterval);
          gameInterval = null;
        }
        document.removeEventListener('keydown', keydownHandler);
        if (gameContainer && gameContainer.parentNode) {
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
      if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
      }
      document.removeEventListener('keydown', keydownHandler);
      if (gameContainer && gameContainer.parentNode) {
        gameContainer.parentNode.removeChild(gameContainer);
      }
    }
  };
}

// Export the main game function
window.startWyrmGame = startWyrmGame;