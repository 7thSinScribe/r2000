// Rogue 2000 ASCII Roguelike
// A simplified implementation using the terminal's styling

// Game constants
const DISPLAY_WIDTH = 60;
const DISPLAY_HEIGHT = 18;
const STATS_HEIGHT = 5;
const MESSAGE_HEIGHT = 4;
const MAP_HEIGHT = DISPLAY_HEIGHT - STATS_HEIGHT - MESSAGE_HEIGHT;
const NUM_LEVELS = 10;
const COLORS = {
  player: '#e0f8cf',
  wall: '#86c06c',
  floor: '#071821',
  enemy: '#86c06c',
  item: '#cebb49',
  stairs: '#7abaa0',
  text: '#e0f8cf',
  blood: '#9b2a2a',
  sweat: '#4a8a70',
  tears: '#5a9ad1',
  critical: '#cebb49'
};

// Game state
let Game = {
  container: null,
  map: {},
  player: null,
  entities: [],
  items: [],
  level: 1,
  gameOver: false,
  messages: [],
  visibleTiles: {},
  keyHandler: null,
  gameLoop: null,
  
  // Initialize game
  init: function(container) {
    this.container = container;
    container.style.fontFamily = "RuneScape, monospace";
    container.style.fontSize = "16px";
    container.style.lineHeight = "1";
    container.style.color = COLORS.text;
    container.style.backgroundColor = COLORS.floor;
    container.style.padding = "0";
    container.style.margin = "0";
    container.style.overflow = "hidden";
    container.style.userSelect = "none";
    container.style.width = "100%";
    container.style.height = "500px";
    
    // Add scanline effect to match terminal
    const scanlines = document.createElement('div');
    scanlines.style.position = 'absolute';
    scanlines.style.top = '0';
    scanlines.style.left = '0';
    scanlines.style.width = '100%';
    scanlines.style.height = '100%';
    scanlines.style.background = 'repeating-linear-gradient(to bottom, rgba(7, 24, 33, 0), rgba(7, 24, 33, 0) 1px, rgba(7, 24, 33, 0.1) 1px, rgba(7, 24, 33, 0.1) 2px)';
    scanlines.style.pointerEvents = 'none';
    scanlines.style.zIndex = '2';
    container.appendChild(scanlines);
    
    // Initialize the player
    this.initPlayer();
    
    // Generate the first level
    this.generateLevel();
    
    // Add message
    this.addMessage("Welcome to Rogue 2000. Survive 10 levels to win.");
    this.addMessage("The Gamemaster is always watching.");
    
    // Set up input handling
    this.keyHandler = this.handleInput.bind(this);
    window.addEventListener("keydown", this.keyHandler);
    
    // Initial draw
    this.drawAll();
    
    return this;
  },
  
  // Initialize player
  initPlayer: function() {
    this.player = new Entity(0, 0, '@', COLORS.player, true);
    
    // Set player attributes (P.O.W.E.R)
    this.player.attributes = {
      power: 3,
      oddity: 2, 
      wisdom: 2,
      endurance: 3,
      reflex: 3
    };
    
    // Calculate derived stats
    this.player.updateDerivedStats();
  },
  
  // Generate a new level
  generateLevel: function() {
    this.map = {};
    this.entities = [this.player];
    this.items = [];
    this.visibleTiles = {};
    
    // Generate cave-like map
    this.generateCaveMap();
    
    // Find a valid position for the player
    let validPosition = this.findEmptyPosition();
    this.player.x = validPosition.x;
    this.player.y = validPosition.y;
    
    // Update FOV
    this.updateFOV();
    
    // Place stairs
    if (this.level < NUM_LEVELS) {
      let stairsPos = this.findEmptyPosition();
      const stairsKey = `${stairsPos.x},${stairsPos.y}`;
      this.map[stairsKey] = "stairs";
    }
    
    // Place entities and items
    this.placeEntities();
    this.placeItems();
  },
  
  // Generate a cave-like map using cellular automata algorithm
  generateCaveMap: function() {
    // Start with random noise
    let tempMap = {};
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const key = `${x},${y}`;
        tempMap[key] = Math.random() < 0.4 ? "floor" : "wall";
      }
    }
    
    // Run cellular automata rules for a few iterations
    for (let i = 0; i < 3; i++) {
      let newMap = {};
      for (let x = 0; x < DISPLAY_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          const key = `${x},${y}`;
          
          // Count walls in 3x3 neighborhood
          let walls = 0;
          for (let nx = x-1; nx <= x+1; nx++) {
            for (let ny = y-1; ny <= y+1; ny++) {
              const nkey = `${nx},${ny}`;
              if (nx < 0 || ny < 0 || nx >= DISPLAY_WIDTH || ny >= MAP_HEIGHT) {
                walls++; // Count edges as walls
              } else if (tempMap[nkey] === "wall") {
                walls++;
              }
            }
          }
          
          // Apply cellular automata rules
          if (tempMap[key] === "wall") {
            newMap[key] = (walls >= 4) ? "wall" : "floor";
          } else {
            newMap[key] = (walls >= 5) ? "wall" : "floor";
          }
        }
      }
      tempMap = newMap;
    }
    
    // Add border walls
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      tempMap[`${x},0`] = "wall";
      tempMap[`${x},${MAP_HEIGHT-1}`] = "wall";
    }
    for (let y = 0; y < MAP_HEIGHT; y++) {
      tempMap[`0,${y}`] = "wall";
      tempMap[`${DISPLAY_WIDTH-1},${y}`] = "wall";
    }
    
    this.map = tempMap;
  },
  
  // Find an empty position on the map
  findEmptyPosition: function() {
    let x, y, key;
    do {
      x = Math.floor(Math.random() * (DISPLAY_WIDTH - 2)) + 1;
      y = Math.floor(Math.random() * (MAP_HEIGHT - 2)) + 1;
      key = `${x},${y}`;
    } while (!(key in this.map) || this.map[key] !== "floor" || this.getEntityAt(x, y));
    
    return {x, y};
  },
  
  // Place entities on the map
  placeEntities: function() {
    // Number of enemies scales with level
    const numEnemies = 3 + Math.floor(this.level / 2);
    
    for (let i = 0; i < numEnemies; i++) {
      let pos = this.findEmptyPosition();
      let enemy = this.createEnemy(pos.x, pos.y);
      this.entities.push(enemy);
    }
  },
  
  // Create an enemy with scaled stats based on the current level
  createEnemy: function(x, y) {
    const enemy = new Entity(x, y, 'E', COLORS.enemy, false);
    
    // Scale stats with level
    const statBonus = Math.floor(this.level / 3);
    
    enemy.attributes = {
      power: 1 + statBonus + Math.floor(Math.random() * 3),
      oddity: 1 + Math.floor(Math.random() * 2),
      wisdom: 1 + Math.floor(Math.random() * 2),
      endurance: 1 + statBonus + Math.floor(Math.random() * 2),
      reflex: 1 + Math.floor(Math.random() * 3)
    };
    
    // Random enemy types
    const types = ['BITMAP SHADE', 'GLITCH STALKER', 'DATA WRAITH', 'CODE GOLEM', 'PIXEL FIEND'];
    enemy.name = types[Math.floor(Math.random() * types.length)];
    
    // Calculate derived stats
    enemy.updateDerivedStats();
    
    return enemy;
  },
  
  // Place items on the map
  placeItems: function() {
    // Healing items that restore BLOOD
    const numItems = 1 + Math.floor(this.level / 3);
    
    for (let i = 0; i < numItems; i++) {
      let pos = this.findEmptyPosition();
      let item = {
        x: pos.x,
        y: pos.y,
        type: "medkit",
        char: "+",
        color: COLORS.item,
        healing: 5 + Math.floor(Math.random() * this.level)
      };
      this.items.push(item);
    }
  },
  
  // Update field of view using basic raycasting
  updateFOV: function() {
    this.visibleTiles = {};
    
    // Helper function to check if a tile blocks sight
    const blocksSight = (x, y) => {
      const key = `${x},${y}`;
      return !(key in this.map) || this.map[key] === "wall";
    };
    
    // Simple 360-degree raycasting
    const viewDistance = 6;
    for (let angle = 0; angle < 360; angle += 3) {
      const rad = angle * (Math.PI / 180);
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      
      let cx = this.player.x;
      let cy = this.player.y;
      
      for (let i = 0; i < viewDistance; i++) {
        cx += dx;
        cy += dy;
        
        const x = Math.round(cx);
        const y = Math.round(cy);
        const key = `${x},${y}`;
        
        this.visibleTiles[key] = true;
        
        if (blocksSight(x, y)) {
          break;
        }
      }
    }
    
    // Always add player position and adjacent tiles
    this.visibleTiles[`${this.player.x},${this.player.y}`] = true;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${this.player.x + dx},${this.player.y + dy}`;
        this.visibleTiles[key] = true;
      }
    }
  },
  
  // Draw everything
  drawAll: function() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create the game display element
    const display = document.createElement('pre');
    display.style.margin = '0';
    display.style.padding = '0';
    display.style.backgroundColor = COLORS.floor;
    display.style.color = COLORS.text;
    display.style.fontFamily = 'RuneScape, monospace';
    display.style.width = '100%';
    display.style.height = '100%';
    display.style.overflow = 'hidden';
    
    // Create the map display
    let mapDisplay = '';
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < DISPLAY_WIDTH; x++) {
        const key = `${x},${y}`;
        
        if (this.visibleTiles[key]) {
          // Draw entities first
          const entity = this.getEntityAt(x, y);
          if (entity) {
            mapDisplay += `<span style="color:${entity.color}">${entity.char}</span>`;
            continue;
          }
          
          // Draw items
          const item = this.getItemAt(x, y);
          if (item) {
            mapDisplay += `<span style="color:${item.color}">${item.char}</span>`;
            continue;
          }
          
          // Draw map features
          if (key in this.map) {
            let tile = this.map[key];
            let char, color;
            
            switch (tile) {
              case "floor":
                char = ".";
                color = "#86c06c";
                break;
              case "wall":
                char = "#";
                color = "#e0f8cf";
                break;
              case "stairs":
                char = ">";
                color = COLORS.stairs;
                break;
              default:
                char = " ";
                color = COLORS.floor;
            }
            
            mapDisplay += `<span style="color:${color}">${char}</span>`;
          } else {
            mapDisplay += ' ';
          }
        } else {
          // Not visible
          mapDisplay += ' ';
        }
      }
      mapDisplay += '\n';
    }
    
    // Add border between map and stats
    let borderLine = '';
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      borderLine += '-';
    }
    
    // Create stat display
    const pText = `P:${this.player.attributes.power}`;
    const oText = `O:${this.player.attributes.oddity}`;
    const wText = `W:${this.player.attributes.wisdom}`;
    const eText = `E:${this.player.attributes.endurance}`;
    const rText = `R:${this.player.attributes.reflex}`;
    
    const statsDisplay = `
${borderLine}
LEVEL: ${this.level}/${NUM_LEVELS}          ${pText} ${oText} ${wText} ${eText} ${rText}

BLOOD: ${this.player.blood.current}/${this.player.blood.max} ${'█'.repeat(this.player.blood.current)}${'░'.repeat(this.player.blood.max - this.player.blood.current)}  ARROWS: Move/Attack
SWEAT: ${this.player.sweat.current}/${this.player.sweat.max} ${'█'.repeat(this.player.sweat.current)}${'░'.repeat(this.player.sweat.max - this.player.sweat.current)}  S: Use SWEAT to power attack
TEARS: ${this.player.tears.current}/${this.player.tears.max} ${'█'.repeat(this.player.tears.current)}${'░'.repeat(this.player.tears.max - this.player.tears.current)}  T: Use TEARS to analyze enemy
${borderLine}
`;
    
    // Create message display
    let messagesDisplay = '';
    for (let i = 0; i < Math.min(this.messages.length, MESSAGE_HEIGHT); i++) {
      const message = this.messages[this.messages.length - 1 - i];
      messagesDisplay = message.text + '\n' + messagesDisplay;
    }
    
    // If game over, display that message
    if (this.gameOver) {
      const gameOverMessage = this.level > NUM_LEVELS ? 
        "CONGRATULATIONS! You've survived the Gamemaster's trials!\nPress SPACE to play again." :
        "YOU DIED. The Gamemaster claims another victim.\nPress SPACE to try again.";
      
      mapDisplay = `<div style="text-align:center; margin-top:50px; font-size:20px; color:${COLORS.critical}">${gameOverMessage}</div>`;
    }
    
    // Combine all displays
    display.innerHTML = mapDisplay + statsDisplay + messagesDisplay;
    
    // Add the display to the container
    this.container.appendChild(display);
    
    // Add scanlines back
    const scanlines = document.createElement('div');
    scanlines.style.position = 'absolute';
    scanlines.style.top = '0';
    scanlines.style.left = '0';
    scanlines.style.width = '100%';
    scanlines.style.height = '100%';
    scanlines.style.background = 'repeating-linear-gradient(to bottom, rgba(7, 24, 33, 0), rgba(7, 24, 33, 0) 1px, rgba(7, 24, 33, 0.1) 1px, rgba(7, 24, 33, 0.1) 2px)';
    scanlines.style.pointerEvents = 'none';
    scanlines.style.zIndex = '2';
    this.container.appendChild(scanlines);
  },
  
  // Get entity at a specific position
  getEntityAt: function(x, y) {
    for (let entity of this.entities) {
      if (entity.x === x && entity.y === y) {
        return entity;
      }
    }
    return null;
  },
  
  // Get item at a specific position
  getItemAt: function(x, y) {
    for (let item of this.items) {
      if (item.x === x && item.y === y) {
        return item;
      }
    }
    return null;
  },
  
  // Add a message to the log
  addMessage: function(text, important = false) {
    this.messages.push({text, important});
    if (this.messages.length > 20) {
      this.messages.shift();
    }
  },
  
  // Handle input
  handleInput: function(e) {
    if (this.gameOver) {
      // If game over, any key restarts
      if (e.key === ' ' || e.key === 'Enter') {
        this.restartGame();
      }
      return;
    }
    
    let actionTaken = false;
    let dx = 0, dy = 0;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'k':
        dy = -1;
        actionTaken = true;
        break;
      case 'ArrowDown':
      case 'j':
        dy = 1;
        actionTaken = true;
        break;
      case 'ArrowLeft':
      case 'h':
        dx = -1;
        actionTaken = true;
        break;
      case 'ArrowRight':
      case 'l':
        dx = 1;
        actionTaken = true;
        break;
      case 's':
      case 'S':
        // Special attack using SWEAT
        if (this.player.sweat.current >= 2) {
          this.player.powerAttack = true;
          this.addMessage("Ready power attack! Move into enemy to attack.", true);
        } else {
          this.addMessage("Not enough SWEAT for power attack.");
        }
        break;
      case 't':
      case 'T':
        // Analyze enemy using TEARS
        if (this.player.tears.current >= 1) {
          this.player.analyze = true;
          this.player.tears.current--;
          this.addMessage("Ready to analyze! Move cursor over enemy.", true);
        } else {
          this.addMessage("Not enough TEARS for analysis.");
        }
        break;
      case 'Escape':
        // Stop the game
        this.stopGame();
        return;
    }
    
    if (actionTaken) {
      e.preventDefault(); // Prevent scrolling
      
      const newX = this.player.x + dx;
      const newY = this.player.y + dy;
      const newKey = `${newX},${newY}`;
      
      // Check if movement is valid
      if (newKey in this.map) {
        const tile = this.map[newKey];
        
        if (tile === "floor") {
          // Check for entity
          const entity = this.getEntityAt(newX, newY);
          if (entity) {
            // Attack entity
            this.combat(this.player, entity);
          } else {
            // Move player
            this.player.x = newX;
            this.player.y = newY;
            
            // Check for items
            this.checkForItems();
          }
          
          // Reset special move flags
          this.player.powerAttack = false;
          this.player.analyze = false;
          
          // Run enemy turns
          this.runEnemyTurns();
        } else if (tile === "stairs") {
          // Go to next level
          this.level++;
          this.addMessage(`Descending to level ${this.level}...`, true);
          
          // Restore some resources
          this.player.sweat.current = Math.min(this.player.sweat.max, this.player.sweat.current + 2);
          
          if (this.level > NUM_LEVELS) {
            this.victory();
          } else {
            this.generateLevel();
          }
        } else if (tile === "wall") {
          this.addMessage("You bump into a wall.");
        }
      }
      
      // Update FOV after movement
      this.updateFOV();
      
      // Redraw everything
      this.drawAll();
    }
  },
  
  // Check for items at player position
  checkForItems: function() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.x === this.player.x && item.y === this.player.y) {
        // Pick up item
        if (item.type === "medkit") {
          const healing = item.healing;
          this.player.blood.current = Math.min(this.player.blood.current + healing, this.player.blood.max);
          this.addMessage(`Used medkit, restored ${healing} BLOOD.`);
        }
        
        // Remove item from the map
        this.items.splice(i, 1);
        break;
      }
    }
  },
  
  // Run enemy turns
  runEnemyTurns: function() {
    for (let entity of this.entities) {
      if (entity !== this.player) {
        this.enemyTurn(entity);
      }
    }
  },
  
  // Enemy turn logic
  enemyTurn: function(enemy) {
    // Simple AI - move towards player if visible, otherwise random
    const key = `${enemy.x},${enemy.y}`;
    if (key in this.visibleTiles) {
      // Move towards player
      const dx = Math.sign(this.player.x - enemy.x);
      const dy = Math.sign(this.player.y - enemy.y);
      
      const newX = enemy.x + dx;
      const newY = enemy.y + dy;
      const newKey = `${newX},${newY}`;
      
      // Check if movement is valid
      if (newKey in this.map && this.map[newKey] === "floor") {
        // Check for entity
        const entity = this.getEntityAt(newX, newY);
        if (entity) {
          // Attack entity
          if (entity === this.player) {
            this.combat(enemy, entity);
          }
        } else {
          // Move
          enemy.x = newX;
          enemy.y = newY;
        }
      }
    } else {
      // Random movement if player not visible
      for (let attempt = 0; attempt < 5; attempt++) {
        const dirs = [
          [0, -1], [1, -1], [1, 0], [1, 1],
          [0, 1], [-1, 1], [-1, 0], [-1, -1]
        ];
        
        const index = Math.floor(Math.random() * dirs.length);
        const [dx, dy] = dirs[index];
        
        const newX = enemy.x + dx;
        const newY = enemy.y + dy;
        const newKey = `${newX},${newY}`;
        
        // Check if movement is valid
        if (newKey in this.map && this.map[newKey] === "floor" && !this.getEntityAt(newX, newY)) {
          enemy.x = newX;
          enemy.y = newY;
          break;
        }
      }
    }
  },
  
  // Handle combat between two entities
  combat: function(attacker, defender) {
    // Analyze enemy instead of attacking if flag is set
    if (attacker === this.player && attacker.analyze) {
      this.analyzeEnemy(defender);
      return;
    }
    
    // Determine dice pools based on P.O.W.E.R attributes
    let attackerDice = this.rollDice(attacker);
    let defenderDice = this.rollDice(defender);
    
    // Power attack uses SWEAT to add dice
    if (attacker === this.player && attacker.powerAttack && attacker.sweat.current >= 2) {
      // Add extra dice for power attack
      attackerDice = attackerDice.concat(this.rollExtraDice(2));
      attacker.sweat.current -= 2;
      this.addMessage("You channel your SWEAT into a powerful attack!");
    }
    
    // Get best 3 dice from each pool
    let attackerHand = this.getBestHand(attackerDice);
    let defenderHand = this.getBestHand(defenderDice);
    
    // Compare hands
    const attackerRank = this.evaluateHand(attackerHand);
    const defenderRank = this.evaluateHand(defenderHand);
    
    // Determine winner
    let damage = 0;
    let attackSucceeds = false;
    
    if (attackerRank.value > defenderRank.value) {
      attackSucceeds = true;
      damage = 1 + Math.floor(attackerRank.value / 10); // Scale damage with hand value
    } else if (attackerRank.value === defenderRank.value) {
      // Tie - attacker wins on equal value
      attackSucceeds = true;
      damage = 1;
    }
    
    // Apply damage
    if (attackSucceeds) {
      defender.blood.current -= damage;
      
      // Combat message
      if (attacker === this.player) {
        this.addMessage(`You hit ${defender.name} for ${damage} damage!`);
      } else {
        this.addMessage(`${attacker.name} hits you for ${damage} damage!`, true);
      }
      
      // Check if defender is dead
      if (defender.blood.current <= 0) {
        if (defender === this.player) {
          this.gameOver = true;
          this.addMessage("YOU DIED. The Gamemaster claims another victim.", true);
          this.addMessage("Press SPACE to try again.", true);
          this.drawAll();
        } else {
          // Remove enemy
          this.addMessage(`${defender.name} is defeated!`);
          this.removeEntity(defender);
          
          // Give player a small boost
          this.player.sweat.current = Math.min(this.player.sweat.max, this.player.sweat.current + 1);
        }
      }
    } else {
      // Attack missed
      if (attacker === this.player) {
        this.addMessage(`Your attack against ${defender.name} misses!`);
      } else {
        this.addMessage(`${attacker.name}'s attack misses you.`);
      }
    }
    
    // Create a glitch effect for combat
    this.createGlitchEffect(attackSucceeds);
  },
  
  // Roll dice for an entity based on P.O.W.E.R attributes
  rollDice: function(entity) {
    let dice = [];
    
    // Add dice based on POWER
    for (let i = 0; i < entity.attributes.power; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }
    
    // Add dice based on REFLEX
    for (let i = 0; i < entity.attributes.reflex; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }
    
    return dice;
  },
  
  // Roll extra dice for special moves
  rollExtraDice: function(count) {
    let dice = [];
    for (let i = 0; i < count; i++) {
      dice.push(Math.floor(Math.random() * 6) + 1);
    }
    return dice;
  },
  
  // Get the best 3 dice from a pool
  getBestHand: function(dicePool) {
    if (dicePool.length <= 3) return dicePool;
    
    // Sort dice descending
    dicePool.sort((a, b) => b - a);
    
    // Try to find three of a kind
    for (let value = 6; value >= 1; value--) {
      const sameValue = dicePool.filter(d => d === value);
      if (sameValue.length >= 3) return [value, value, value];
    }
    
    // Try to find a straight
    const uniqueDice = [...new Set(dicePool)].sort((a, b) => a - b);
    for (let i = 0; i <= uniqueDice.length - 3; i++) {
      if (uniqueDice[i + 1] === uniqueDice[i] + 1 && uniqueDice[i + 2] === uniqueDice[i] + 2) {
        return [uniqueDice[i], uniqueDice[i + 1], uniqueDice[i + 2]];
      }
    }
    
    // Try to find a pair
    for (let value = 6; value >= 1; value--) {
      const sameValue = dicePool.filter(d => d === value);
      if (sameValue.length >= 2) {
        // Get highest other die
        const otherDice = dicePool.filter(d => d !== value);
        if (otherDice.length > 0) {
          return [value, value, otherDice[0]];
        }
      }
    }
    
    // Return the three highest dice
    return dicePool.slice(0, 3);
  },
  
  // Evaluate a hand of dice
  evaluateHand: function(hand) {
    if (hand.length < 3) {
      // Pad hand with 1s if needed
      while (hand.length < 3) hand.push(1);
    }
    
    // Sort dice in descending order
    hand.sort((a, b) => b - a);
    
    // Check for three of a kind
    if (hand[0] === hand[1] && hand[1] === hand[2]) {
      return {
        type: "Three of a Kind",
        value: 100 + hand[0]
      };
    }
    
    // Check for straight
    if (hand[0] === hand[1] + 1 && hand[1] === hand[2] + 1) {
      return {
        type: "Straight",
        value: 80 + hand[0]
      };
    }
    if (hand[2] === hand[1] + 1 && hand[1] === hand[0] + 1) {
      return {
        type: "Straight",
        value: 80 + hand[2]
      };
    }
    
    // Check for pair + high
    if (hand[0] === hand[1]) {
      return {
        type: "Pair + High",
        value: 60 + hand[0] + hand[2] * 0.1
      };
    }
    if (hand[1] === hand[2]) {
      return {
        type: "Pair + High",
        value: 60 + hand[1] + hand[0] * 0.1
      };
    }
    
    // High total
    return {
      type: "High Total",
      value: 40 + hand.reduce((a, b) => a + b, 0) * 0.1
    };
  },
  
  // Analyze an enemy using TEARS
  analyzeEnemy: function(enemy) {
    this.addMessage(`Analyzing ${enemy.name}...`);
    this.addMessage(`P:${enemy.attributes.power} O:${enemy.attributes.oddity} W:${enemy.attributes.wisdom} E:${enemy.attributes.endurance} R:${enemy.attributes.reflex}`);
    this.addMessage(`BLOOD: ${enemy.blood.current}/${enemy.blood.max}`);
    this.createGlitchEffect(true);
  },
  
  // Remove an entity from the game
  removeEntity: function(entity) {
    // Remove from entities array
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  },
  
  // Create a glitch effect
  createGlitchEffect: function(intense = false) {
    const numArtifacts = intense ? 5 : 2;
    
    for (let i = 0; i < numArtifacts; i++) {
      setTimeout(() => {
        const artifact = document.createElement('div');
        artifact.className = Math.random() > 0.5 ? 'artifact h-line' : 'artifact v-line';
        artifact.style.position = 'absolute';
        artifact.style.height = Math.random() > 0.5 ? '1px' : `${Math.random() * 3 + 1}px`;
        artifact.style.width = Math.random() > 0.5 ? '100%' : `${Math.random() * 50 + 20}px`;
        artifact.style.left = `${Math.random() * 100}%`;
        artifact.style.top = `${Math.random() * 100}%`;
        artifact.style.backgroundColor = '#86c06c';
        artifact.style.opacity = '0.7';
        artifact.style.zIndex = '3';
        
        if (this.container) {
          this.container.appendChild(artifact);
          setTimeout(() => {
            if (artifact.parentNode) {
              artifact.parentNode.removeChild(artifact);
            }
          }, 200);
        }
      }, i * 50);
    }
  },
  
  // Player victory
  victory: function() {
    this.gameOver = true;
    this.addMessage("CONGRATULATIONS! You've completed all 10 levels!", true);
    this.addMessage("You have survived the Gamemaster's trials.", true);
    this.addMessage("Press SPACE to play again.", true);
    this.drawAll();
  },
  
  // Restart the game
  restartGame: function() {
    this.level = 1;
    this.gameOver = false;
    this.messages = [];
    
    // Reset player
    this.initPlayer();
    
    // Generate new level
    this.generateLevel();
    
    // Add message
    this.addMessage("Welcome to Rogue 2000. Survive 10 levels to win.");
    this.addMessage("The Gamemaster is always watching.");
    
    // Redraw
    this.drawAll();
  },
  
  // Stop the game and clean up
  stopGame: function() {
    if (this.keyHandler) {
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
    }
    
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
};

// Entity class for player and enemies
class Entity {
  constructor(x, y, char, color, isPlayer) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.color = color;
    this.isPlayer = isPlayer;
    this.name = isPlayer ? "PLAYER" : "ENEMY";
    this.attributes = { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 };
    this.blood = { current: 0, max: 0 };
    this.sweat = { current: 0, max: 0 };
    this.tears = { current: 0, max: 0 };
    this.powerAttack = false;
    this.analyze = false;
  }
  
  // Update derived stats based on attributes
  updateDerivedStats() {
    // BLOOD = 3 + Power + Endurance (for humans/player)
    this.blood.max = 3 + this.attributes.power + this.attributes.endurance;
    this.blood.current = this.blood.max;
    
    // SWEAT = 2 + Endurance + Reflex
    this.sweat.max = 2 + this.attributes.endurance + this.attributes.reflex;
    this.sweat.current = this.sweat.max;
    
    // TEARS = 1 + Wisdom + Oddity
    this.tears.max = 1 + this.attributes.wisdom + this.attributes.oddity;
    this.tears.current = this.tears.max;
  }
}

// Initialize and start the game
function startRoguelikeGame(terminal) {
  // Initialize game state and create container
  const gameContainer = document.createElement('div');
  gameContainer.id = 'roguelike-game-container';
  gameContainer.style.width = '100%';
  gameContainer.style.height = '100%';
  gameContainer.style.position = 'relative';
  gameContainer.style.margin = '0 auto';
  gameContainer.style.marginTop = '10px';
  gameContainer.style.marginBottom = '10px';
  gameContainer.style.border = `1px solid ${COLORS.text}`;
  gameContainer.style.backgroundColor = COLORS.floor;
  
  // Add game container to terminal
  terminal.appendChild(gameContainer);
  
  // Start game
  const game = Game.init(gameContainer);
  
  return {
    stop: () => {
      // Clean up
      game.stopGame();
    }
  };
}

// Export the main game function
window.startRoguelikeGame = startRoguelikeGame;
