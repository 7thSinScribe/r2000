// Rogue 2000 ASCII Roguelike
// A simplified implementation using rot.js and the P.O.W.E.R system

// Game constants
const DISPLAY_WIDTH = 80;
const DISPLAY_HEIGHT = 25;
const STATS_HEIGHT = 8;
const MESSAGE_HEIGHT = 3;
const MAP_HEIGHT = DISPLAY_HEIGHT - STATS_HEIGHT - MESSAGE_HEIGHT;
const NUM_LEVELS = 10;
const COLORS = {
  player: '#e0f8cf',
  wall: '#306850',
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
  display: null,
  map: {},
  player: null,
  entities: [],
  items: [],
  level: 1,
  scheduler: null,
  engine: null,
  gameOver: false,
  messages: [],
  fov: null,
  visibleTiles: {},
  
  // Initialize game
  init: function(container) {
    // Create display
    this.display = new ROT.Display({
      width: DISPLAY_WIDTH,
      height: DISPLAY_HEIGHT,
      fontFamily: "RuneScape, monospace",
      fontSize: 16,
      spacing: 1.0,
      forceSquareRatio: true
    });
    
    container.appendChild(this.display.getContainer());
    
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
    
    // Set up scheduler for turn-based gameplay
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);
    
    // Initialize the player
    this.initPlayer();
    
    // Generate the first level
    this.generateLevel();
    
    // Add message
    this.addMessage("Welcome to Rogue 2000. Survive 10 levels to win.");
    this.addMessage("The Gamemaster is always watching.");
    
    // Set up input handling
    window.addEventListener("keydown", this.handleInput.bind(this));
    
    // Start game
    this.engine.start();
    
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
    
    // Add player to scheduler
    this.scheduler.add(this.player, true);
  },
  
  // Generate a new level
  generateLevel: function() {
    this.map = {};
    this.entities = [this.player];
    this.items = [];
    this.visibleTiles = {};
    
    // Generate map using cellular automata for an organic cave feel
    const mapGenerator = new ROT.Map.Cellular(DISPLAY_WIDTH, MAP_HEIGHT);
    mapGenerator.randomize(0.5);
    
    // Run automata iterations
    for (let i = 0; i < 3; i++) {
      mapGenerator.create();
    }
    
    // Convert to our map format
    mapGenerator.create((x, y, value) => {
      const key = `${x},${y}`;
      // 0 = floor, 1 = wall
      this.map[key] = value ? "wall" : "floor";
    });
    
    // Find a valid position for the player
    let validPosition = this.findEmptyPosition();
    this.player.x = validPosition.x;
    this.player.y = validPosition.y;
    
    // Create FOV
    this.fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      const key = `${x},${y}`;
      return key in this.map && this.map[key] === "floor";
    });
    
    // Place stairs
    if (this.level < NUM_LEVELS) {
      let stairsPos = this.findEmptyPosition();
      const stairsKey = `${stairsPos.x},${stairsPos.y}`;
      this.map[stairsKey] = "stairs";
    }
    
    // Place entities and items
    this.placeEntities();
    this.placeItems();
    
    // Update FOV
    this.updateFOV();
    
    // Draw everything
    this.drawAll();
  },
  
  // Find an empty position on the map
  findEmptyPosition: function() {
    let x, y, key;
    do {
      x = Math.floor(ROT.RNG.getUniform() * DISPLAY_WIDTH);
      y = Math.floor(ROT.RNG.getUniform() * MAP_HEIGHT);
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
      this.scheduler.add(enemy, true);
    }
  },
  
  // Create an enemy with scaled stats based on the current level
  createEnemy: function(x, y) {
    const enemy = new Entity(x, y, 'E', COLORS.enemy, false);
    
    // Scale stats with level
    const statBonus = Math.floor(this.level / 3);
    
    enemy.attributes = {
      power: 1 + statBonus + Math.floor(ROT.RNG.getUniform() * 3),
      oddity: 1 + Math.floor(ROT.RNG.getUniform() * 2),
      wisdom: 1 + Math.floor(ROT.RNG.getUniform() * 2),
      endurance: 1 + statBonus + Math.floor(ROT.RNG.getUniform() * 2),
      reflex: 1 + Math.floor(ROT.RNG.getUniform() * 3)
    };
    
    // Random enemy types
    const types = ['BITMAP SHADE', 'GLITCH STALKER', 'DATA WRAITH', 'CODE GOLEM', 'PIXEL FIEND'];
    enemy.name = types[Math.floor(ROT.RNG.getUniform() * types.length)];
    
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
        healing: 5 + Math.floor(ROT.RNG.getUniform() * this.level)
      };
      this.items.push(item);
    }
  },
  
  // Update field of view
  updateFOV: function() {
    this.visibleTiles = {};
    
    // Calculate visible tiles
    this.fov.compute(this.player.x, this.player.y, 8, (x, y, r, visibility) => {
      const key = `${x},${y}`;
      this.visibleTiles[key] = true;
    });
  },
  
  // Draw everything
  drawAll: function() {
    // Clear display
    this.display.clear();
    
    // Draw map
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const key = `${x},${y}`;
        
        // Only draw if tile is visible
        if (this.visibleTiles[key]) {
          if (key in this.map) {
            let tile = this.map[key];
            let char, fg, bg;
            
            switch (tile) {
              case "floor":
                char = ".";
                fg = "#86c06c";
                bg = COLORS.floor;
                break;
              case "wall":
                char = "#";
                fg = "#e0f8cf";
                bg = COLORS.wall;
                break;
              case "stairs":
                char = ">";
                fg = COLORS.stairs;
                bg = COLORS.floor;
                break;
            }
            
            this.display.draw(x, y, char, fg, bg);
          }
        }
      }
    }
    
    // Draw items
    for (let item of this.items) {
      const key = `${item.x},${item.y}`;
      if (this.visibleTiles[key]) {
        this.display.draw(item.x, item.y, item.char, item.color, COLORS.floor);
      }
    }
    
    // Draw entities
    for (let entity of this.entities) {
      const key = `${entity.x},${entity.y}`;
      if (this.visibleTiles[key]) {
        this.display.draw(entity.x, entity.y, entity.char, entity.color, COLORS.floor);
      }
    }
    
    // Draw stats
    this.drawStats();
    
    // Draw messages
    this.drawMessages();
  },
  
  // Draw player stats
  drawStats: function() {
    const statsY = MAP_HEIGHT;
    
    // Draw border
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      this.display.draw(x, statsY, '-', COLORS.text);
    }
    
    // Draw basic stats
    this.display.drawText(1, statsY + 1, `LEVEL: ${this.level}/${NUM_LEVELS}`);
    
    // Draw P.O.W.E.R stats
    const statsText = `P:${this.player.attributes.power} O:${this.player.attributes.oddity} W:${this.player.attributes.wisdom} E:${this.player.attributes.endurance} R:${this.player.attributes.reflex}`;
    this.display.drawText(20, statsY + 1, statsText);
    
    // Draw health/resource bars
    this.drawResourceBar(1, statsY + 3, "BLOOD", this.player.blood.current, this.player.blood.max, COLORS.blood);
    this.drawResourceBar(1, statsY + 4, "SWEAT", this.player.sweat.current, this.player.sweat.max, COLORS.sweat);
    this.drawResourceBar(1, statsY + 5, "TEARS", this.player.tears.current, this.player.tears.max, COLORS.tears);
    
    // Help text
    this.display.drawText(40, statsY + 3, "ARROWS: Move/Attack");
    this.display.drawText(40, statsY + 4, "S: Use SWEAT to power attack");
    this.display.drawText(40, statsY + 5, "T: Use TEARS to analyze enemy");
  },
  
  // Draw a resource bar
  drawResourceBar: function(x, y, name, current, max, color) {
    const barText = `${name}: ${current}/${max}`;
    this.display.drawText(x, y, barText, color);
    
    const barWidth = 20;
    const filledWidth = Math.round((current / max) * barWidth);
    
    for (let i = 0; i < barWidth; i++) {
      const barX = x + barText.length + 1 + i;
      const barChar = i < filledWidth ? "█" : "░";
      this.display.draw(barX, y, barChar, color);
    }
  },
  
  // Draw messages
  drawMessages: function() {
    const messagesY = MAP_HEIGHT + STATS_HEIGHT;
    
    // Draw border
    for (let x = 0; x < DISPLAY_WIDTH; x++) {
      this.display.draw(x, messagesY, '-', COLORS.text);
    }
    
    // Draw messages
    for (let i = 0; i < Math.min(this.messages.length, MESSAGE_HEIGHT); i++) {
      const message = this.messages[this.messages.length - 1 - i];
      const color = message.important ? COLORS.critical : COLORS.text;
      this.display.drawText(1, messagesY + MESSAGE_HEIGHT - i, message.text, color);
    }
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
    
    // Only handle input when it's the player's turn
    if (this.engine.lock) return;
    
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
          
          // End player turn
          this.player.act();
        } else if (tile === "stairs") {
          // Go to next level
          this.level++;
          this.addMessage(`Descending to level ${this.level}...`, true);
          
          // Restore some resources
          this.player.sweat.current = Math.min(this.player.sweat.max, this.player.sweat.current + 2);
          
          if (this.level > NUM_LEVELS) {
            this.victory();
          } else {
            // Remove all entities except player from scheduler
            for (let entity of this.entities) {
              if (entity !== this.player) {
                this.scheduler.remove(entity);
              }
            }
            
            this.generateLevel();
          }
        }
      }
      
      // Update FOV after movement
      this.updateFOV();
      
      // Redraw everything
      this.drawAll();
    }
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
          this.addMessage("YOU DIED. Press SPACE to restart.", true);
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
  },
  
  // Roll dice for an entity based on P.O.W.E.R attributes
  rollDice: function(entity) {
    let dice = [];
    
    // Add dice based on POWER
    for (let i = 0; i < entity.attributes.power; i++) {
      dice.push(Math.floor(ROT.RNG.getUniform() * 6) + 1);
    }
    
    // Add dice based on REFLEX
    for (let i = 0; i < entity.attributes.reflex; i++) {
      dice.push(Math.floor(ROT.RNG.getUniform() * 6) + 1);
    }
    
    return dice;
  },
  
  // Roll extra dice for special moves
  rollExtraDice: function(count) {
    let dice = [];
    for (let i = 0; i < count; i++) {
      dice.push(Math.floor(ROT.RNG.getUniform() * 6) + 1);
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
  },
  
  // Remove an entity from the game
  removeEntity: function(entity) {
    // Remove from scheduler
    this.scheduler.remove(entity);
    
    // Remove from entities array
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  },
  
  // Player victory
  victory: function() {
    this.gameOver = true;
    this.addMessage("CONGRATULATIONS! You've completed all 10 levels!", true);
    this.addMessage("You have survived the Gamemaster's trials.", true);
    this.addMessage("Press SPACE to play again.");
    this.drawAll();
  },
  
  // Restart the game
  restartGame: function() {
    this.level = 1;
    this.gameOver = false;
    this.messages = [];
    
    // Remove all entities from scheduler
    for (let entity of this.entities) {
      this.scheduler.remove(entity);
    }
    
    // Reset player
    this.initPlayer();
    
    // Generate new level
    this.generateLevel();
    
    // Start engine
    this.engine.start();
    
    // Add message
    this.addMessage("Welcome to Rogue 2000. Survive 10 levels to win.");
    this.addMessage("The Gamemaster is always watching.");
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
  
  // Act - called by scheduler
  act() {
    if (this.isPlayer) {
      // Lock engine and wait for player input
      Game.engine.lock();
    } else {
      // Enemy AI
      this.aiAct();
    }
  }
  
  // Enemy AI
  aiAct() {
    // Simple AI - move towards player if visible, otherwise random
    const key = `${this.x},${this.y}`;
    if (key in Game.visibleTiles) {
      // Move towards player
      const dx = Math.sign(Game.player.x - this.x);
      const dy = Math.sign(Game.player.y - this.y);
      
      const newX = this.x + dx;
      const newY = this.y + dy;
      const newKey = `${newX},${newY}`;
      
      // Check if movement is valid
      if (newKey in Game.map && Game.map[newKey] === "floor") {
        // Check for entity
        const entity = Game.getEntityAt(newX, newY);
        if (entity) {
          // Attack entity
          if (entity === Game.player) {
            Game.combat(this, entity);
          }
        } else {
          // Move
          this.x = newX;
          this.y = newY;
        }
      }
    } else {
      // Random movement if player not visible
      const dirs = [
        [0, -1], [1, -1], [1, 0], [1, 1],
        [0, 1], [-1, 1], [-1, 0], [-1, -1]
      ];
      
      const index = Math.floor(ROT.RNG.getUniform() * dirs.length);
      const [dx, dy] = dirs[index];
      
      const newX = this.x + dx;
      const newY = this.y + dy;
      const newKey = `${newX},${newY}`;
      
      // Check if movement is valid
      if (newKey in Game.map && Game.map[newKey] === "floor" && !Game.getEntityAt(newX, newY)) {
        this.x = newX;
        this.y = newY;
      }
    }
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
      // Clean up and remove the game
      if (game.engine) {
        game.engine.lock();
      }
      window.removeEventListener("keydown", game.handleInput);
      if (gameContainer.parentNode) {
        gameContainer.parentNode.removeChild(gameContainer);
      }
    }
  };
}

// Export the main game function
window.startRoguelikeGame = startRoguelikeGame;
