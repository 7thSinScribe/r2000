/**
 * SurvivorOS MerchNet System
 * A unified marketplace for physical, digital, and hybrid items in the Rogue 2000 universe.
 * 
 * Designed for easy extension and maintenance with strict coding standards.
 */

// Item class provides a standardized structure for all items
class Item {
  /**
   * Create a new item
   * @param {Object} config - Item configuration object
   * @param {string} config.id - Unique identifier for the item
   * @param {string} config.name - Display name of the item
   * @param {string} config.category - Main category (WEAPON, ARMOR, TOOL, etc.)
   * @param {string} config.state - Item state (PHYSICAL, DIGITAL, HYBRID)
   * @param {number} config.cost - Cost in Watts
   * @param {string} config.rarity - Rarity level (COMMON, UNCOMMON, RARE, LEGENDARY)
   * @param {string} config.description - Full description of the item
   * @param {Object} [config.properties={}] - Additional properties specific to this item
   * @param {string[]} [config.tags=[]] - Tags for filtering and searching
   */
  constructor(config) {
    // Required properties
    this.id = config.id;
    this.name = config.name;
    this.category = config.category;
    this.state = config.state;
    this.cost = config.cost;
    this.rarity = config.rarity;
    this.description = config.description;
    
    // State-specific properties
    if (this.state === 'PHYSICAL' || this.state === 'HYBRID') {
      this.weight = config.weight || 0; // Weight in kg
    }
    
    if (this.state === 'DIGITAL' || this.state === 'HYBRID') {
      this.memory = config.memory || 0; // Size in MB
    }
    
    // Optional properties with defaults
    this.properties = config.properties || {};
    this.tags = config.tags || [];
  }
  
  /**
   * Get item details formatted for display
   * @returns {string} Formatted item details
   */
  getDetails() {
    let output = [];
    
    output.push(`NAME: ${this.name}`);
    output.push(`CATEGORY: ${this.category}`);
    output.push(`STATE: ${this.state}`);
    output.push(`COST: ${this.cost} Watts`);
    
    if (this.state === 'PHYSICAL' || this.state === 'HYBRID') {
      output.push(`WEIGHT: ${this.weight} kg`);
    }
    
    if (this.state === 'DIGITAL' || this.state === 'HYBRID') {
      output.push(`MEMORY: ${this.memory} MB`);
    }
    
    output.push(`RARITY: ${this.rarity}`);
    
    // Add item-specific properties
    Object.entries(this.properties).forEach(([key, value]) => {
      const formattedKey = key.toUpperCase().replace(/_/g, ' ');
      output.push(`${formattedKey}: ${value}`);
    });
    
    output.push(`\nDESCRIPTION:\n${this.description}`);
    
    if (this.tags.length > 0) {
      output.push(`\nTAGS: ${this.tags.join(', ')}`);
    }
    
    return output.join('\n');
  }
  
  /**
   * Get item summary for list views
   * @returns {Object} Item summary data
   */
  getSummary() {
    const summary = {
      name: this.name,
      cost: `${this.cost} W`,
      rarity: this.rarity,
      state: this.state
    };
    
    if (this.state === 'PHYSICAL' || this.state === 'HYBRID') {
      summary.weight = `${this.weight} kg`;
    } else {
      summary.weight = 'N/A';
    }
    
    if (this.state === 'DIGITAL' || this.state === 'HYBRID') {
      summary.memory = `${this.memory} MB`;
    } else {
      summary.memory = 'N/A';
    }
    
    return summary;
  }
  
  /**
   * Check if the item matches a search term
   * @param {string} term - Search term
   * @returns {boolean} True if the item matches
   */
  matches(term) {
    const searchTerm = term.toLowerCase();
    
    // Search in the most common fields
    if (
      this.id.toLowerCase().includes(searchTerm) ||
      this.name.toLowerCase().includes(searchTerm) ||
      this.category.toLowerCase().includes(searchTerm) ||
      this.description.toLowerCase().includes(searchTerm) ||
      this.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ) {
      return true;
    }
    
    // Also search in properties
    return Object.values(this.properties).some(
      value => String(value).toLowerCase().includes(searchTerm)
    );
  }
}

/**
 * MerchNet - The main marketplace system for the SurvivorOS terminal
 */
class MerchNet {
  constructor() {
    this.items = [];
    this.version = '4.0';
  }
  
  /**
   * Add a new item to the marketplace
   * @param {Object} itemConfig - Item configuration object
   */
  addItem(itemConfig) {
    this.items.push(new Item(itemConfig));
  }
  
  /**
   * Add multiple items at once
   * @param {Object[]} itemConfigArray - Array of item configuration objects
   */
  addItems(itemConfigArray) {
    itemConfigArray.forEach(config => this.addItem(config));
  }
  
  /**
   * Get item by ID
   * @param {string} id - Item ID
   * @returns {Item|undefined} The item if found
   */
  getItem(id) {
    return this.items.find(item => item.id.toLowerCase() === id.toLowerCase());
  }
  
  /**
   * Get all categories with item counts
   * @returns {Object} Map of categories to counts
   */
  getCategories() {
    const categories = {};
    
    this.items.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = 0;
      }
      categories[item.category]++;
    });
    
    return categories;
  }
  
  /**
   * Get items by category
   * @param {string} category - Category name
   * @returns {Item[]} Items in the category
   */
  getItemsByCategory(category) {
    return this.items.filter(
      item => item.category.toUpperCase() === category.toUpperCase()
    );
  }
  
  /**
   * Get items by state (PHYSICAL, DIGITAL, HYBRID)
   * @param {string} state - Item state
   * @returns {Item[]} Items with the specified state
   */
  getItemsByState(state) {
    return this.items.filter(
      item => item.state.toUpperCase() === state.toUpperCase()
    );
  }
  
  /**
   * Search for items by name or other properties
   * @param {string} term - Search term
   * @returns {Item[]} Matching items
   */
  searchItems(term) {
    if (!term || term.trim() === '') {
      return [];
    }
    
    return this.items.filter(item => item.matches(term));
  }
  
  /**
   * Process a command string and return the response
   * @param {string} command - Command string
   * @returns {string} Command response
   */
  processCommand(command) {
    command = command.toLowerCase().trim();
    
    // Basic merchnet command
    if (command === 'merchnet') {
      return this.getHelpText();
    }
    
    // List all categories
    if (command === 'merchnet list') {
      return this.listCategories();
    }
    
    // List items in a category
    if (command.startsWith('merchnet list ')) {
      const category = command.substring('merchnet list '.length).toUpperCase();
      return this.listItemsByCategory(category);
    }
    
    // List items by state
    if (command === 'merchnet physical' || 
        command === 'merchnet digital' || 
        command === 'merchnet hybrid') {
      const state = command.substring('merchnet '.length).toUpperCase();
      return this.listItemsByState(state);
    }
    
    // Lookup an item
    if (command.startsWith('lookup "') && command.endsWith('"')) {
      const searchTerm = command.substring(8, command.length - 1);
      return this.lookupItem(searchTerm);
    }
    
    // Unknown command
    return `Unknown merchnet command: "${command}"\nType "merchnet" for help.`;
  }
  
  /**
   * Get the help text for the merchnet command
   * @returns {string} Help text
   */
  getHelpText() {
    return `
MERCHNET TERMINAL v${this.version} - SURVIVOR MARKETPLACE
-----------------------------------------------------

AVAILABLE COMMANDS:

merchnet list              - Display all item categories
merchnet list [CATEGORY]   - List items in a specific category
merchnet physical          - List all physical items
merchnet digital           - List all digital items
merchnet hybrid            - List all hybrid items
lookup "item name"         - Search for a specific item

AVAILABLE CATEGORIES:
${Object.keys(this.getCategories()).map(cat => `- ${cat}`).join('\n')}

All prices listed in Watts - the universal currency post-collapse.
Items available at Haven marketplaces or from wandering traders.
Memory for digital items measured in MB (${getTotalDigitalMemory()} MB max storage).
`;
  }
  
  /**
   * List all categories with counts
   * @returns {string} Formatted category list
   */
  listCategories() {
    const categories = this.getCategories();
    
    let output = "MERCHNET - CATEGORY LISTING\n";
    output += "---------------------------\n\n";
    
    for (const [category, count] of Object.entries(categories)) {
      output += `${category}: ${count} items\n`;
    }
    
    output += "\nType 'merchnet list [CATEGORY]' to browse items.";
    return output;
  }
  
  /**
   * List items in a category
   * @param {string} category - Category name
   * @returns {string} Formatted item list
   */
  listItemsByCategory(category) {
    const items = this.getItemsByCategory(category);
    
    if (items.length === 0) {
      return `No items found in category: ${category}\n\nType 'merchnet list' to see all categories.`;
    }
    
    return this.formatItemList(`MERCHNET - ${category} ITEMS`, items);
  }
  
  /**
   * List items by state
   * @param {string} state - Item state
   * @returns {string} Formatted item list
   */
  listItemsByState(state) {
    const items = this.getItemsByState(state);
    
    if (items.length === 0) {
      return `No ${state.toLowerCase()} items found.`;
    }
    
    return this.formatItemList(`MERCHNET - ${state} ITEMS`, items);
  }
  
  /**
   * Format a list of items for display
   * @param {string} title - List title
   * @param {Item[]} items - Items to display
   * @returns {string} Formatted list
   */
  formatItemList(title, items) {
    let output = `${title}\n`;
    output += "-".repeat(title.length) + "\n\n";
    
    // Setup table header based on item states present
    const hasPhysical = items.some(item => item.state === 'PHYSICAL' || item.state === 'HYBRID');
    const hasDigital = items.some(item => item.state === 'DIGITAL' || item.state === 'HYBRID');
    
    let header = "NAME".padEnd(30) + "COST".padEnd(10) + "RARITY".padEnd(12) + "STATE".padEnd(10);
    
    if (hasPhysical) {
      header += "WEIGHT".padEnd(10);
    }
    
    if (hasDigital) {
      header += "MEMORY".padEnd(10);
    }
    
    output += header + "\n";
    output += "-".repeat(header.length) + "\n";
    
    // Add items to table
    items.forEach(item => {
      const summary = item.getSummary();
      
      let row = summary.name.padEnd(30) + 
        summary.cost.padEnd(10) + 
        summary.rarity.padEnd(12) + 
        summary.state.padEnd(10);
      
      if (hasPhysical) {
        row += summary.weight.padEnd(10);
      }
      
      if (hasDigital) {
        row += summary.memory.padEnd(10);
      }
      
      output += row + "\n";
    });
    
    output += "\nType 'lookup \"[item name]\"' for detailed information.";
    return output;
  }
  
  /**
   * Look up an item by name
   * @param {string} searchTerm - Term to search for
   * @returns {string} Formatted item details or error message
   */
  lookupItem(searchTerm) {
    // Try exact ID match first
    const exactIdMatch = this.getItem(searchTerm);
    if (exactIdMatch) {
      return this.formatItemDetails(exactIdMatch);
    }
    
    // Then try search
    const matches = this.searchItems(searchTerm);
    
    if (matches.length === 0) {
      return `No items found matching "${searchTerm}".`;
    }
    
    if (matches.length === 1) {
      return this.formatItemDetails(matches[0]);
    }
    
    // Multiple matches, show list
    let output = `Multiple items found matching "${searchTerm}":\n\n`;
    matches.forEach(item => {
      output += `- ${item.name} (${item.id})\n`;
    });
    output += "\nPlease refine your search with 'lookup \"[exact name or id]\"'";
    return output;
  }
  
  /**
   * Format item details for display
   * @param {Item} item - Item to display
   * @returns {string} Formatted item details
   */
  formatItemDetails(item) {
    let output = "MERCHNET - ITEM DETAILS\n";
    output += "---------------------\n\n";
    
    output += item.getDetails();
    
    return output;
  }
}

/**
 * Get total digital memory capacity of a Rogueboy 2000
 * @returns {number} Memory capacity in MB
 */
function getTotalDigitalMemory() {
  return 1024; // 1024 MB (1 GB) as specified
}

/**
 * Initialize the MerchNet system with catalog data
 * @returns {MerchNet} Initialized MerchNet system
 */
function initMerchNet() {
  const merchnet = new MerchNet();

  // Add sample items - easy to add more with this format
  merchnet.addItems([
    // WEAPONS
    {
      id: "crowbar-reinforced",
      name: "Reinforced Crowbar",
      category: "WEAPONS",
      state: "PHYSICAL",
      cost: 120,
      weight: 1.5,
      rarity: "COMMON",
      properties: {
        damage: "1d8",
        hands: "One-handed"
      },
      description: "A sturdy crowbar reinforced with steel bands. Equally useful for prying things open or cracking skulls.",
      tags: ["melee", "blunt", "tool"]
    },
    {
      id: "pipe-wrench",
      name: "Heavy Pipe Wrench",
      category: "WEAPONS",
      state: "PHYSICAL",
      cost: 80,
      weight: 2.1,
      rarity: "COMMON",
      properties: {
        damage: "1d10",
        hands: "Two-handed",
        special: "-1 REFLEX die on attack rolls"
      },
      description: "A massive wrench that can crush bones with ease. Slow to swing but devastating on impact.",
      tags: ["melee", "blunt", "tool"]
    },
    
    // ARMOR
    {
      id: "jacket-reinforced",
      name: "Reinforced Jacket",
      category: "ARMOR",
      state: "PHYSICAL",
      cost: 200,
      weight: 3.0,
      rarity: "COMMON",
      properties: {
        protection: "1d6",
        slot: "Torso"
      },
      description: "A leather jacket reinforced with kevlar inserts. Offers decent protection without restricting movement.",
      tags: ["armor", "light", "everyday"]
    },
    {
      id: "vest-faraday",
      name: "Faraday Vest",
      category: "ARMOR",
      state: "HYBRID",
      cost: 650,
      weight: 3.5,
      memory: 128,
      rarity: "RARE",
      properties: {
        protection: "1d6 vs DIGITAL",
        slot: "Torso",
        special: "Reduces damage from digital attacks by 50%, immunity to power draining effects"
      },
      description: "A vest lined with conductive materials that redirect digital energy around the wearer instead of through them.",
      tags: ["armor", "digital-defense", "tech"]
    },

    // TOOLS
    {
      id: "n98-goggles", 
      name: "N98 Vision Goggles",
      category: "TOOLS",
      state: "HYBRID",
      cost: 450,
      weight: 0.8,
      memory: 64,
      rarity: "UNCOMMON",
      properties: {
        effect: "Allows viewing of digital entities and anomalies",
        power: "Uses 5 Watts per hour"
      },
      description: "Standard-issue N-Co goggles that allow viewing of digital entities. Battery lasts 6 hours of continuous use.",
      tags: ["perception", "technology", "vision", "n-co"]
    },
    {
      id: "multitool-reliable",
      name: "Reliable Multi-tool",
      category: "TOOLS",
      state: "PHYSICAL",
      cost: 100,
      weight: 0.3,
      rarity: "COMMON",
      properties: {
        effect: "+1 WISDOM die on repair checks"
      },
      description: "A well-worn multi-tool that's survived countless repairs. Contains pliers, knife, screwdrivers, and other essential tools.",
      tags: ["tool", "utility", "repair"]
    },
    
    // MEDICAL
    {
      id: "medkit-emergency",
      name: "Emergency Medkit",
      category: "MEDICAL",
      state: "PHYSICAL",
      cost: 250,
      weight: 1.2,
      rarity: "UNCOMMON",
      properties: {
        effect: "Restores 1d6 BLOOD",
        uses: 3
      },
      description: "A compact medical kit with bandages, antiseptics, and suture materials. Essential for patching up wounds in the field.",
      tags: ["healing", "emergency", "multi-use"]
    },
    
    // CONSUMABLES
    {
      id: "slurrp-energy",
      name: "Slurrp Energy Drink",
      category: "CONSUMABLES",
      state: "PHYSICAL",
      cost: 30,
      weight: 0.4,
      rarity: "COMMON",
      properties: {
        effect: "Restores 1d4 SWEAT instantly",
        quantity: 6
      },
      description: "A sickeningly sweet energy drink that somehow survived the collapse with its factory intact. Now a common trade good in Havens.",
      tags: ["beverage", "stimulant", "everyday"]
    },
    
    // TECH (HYBRID)
    {
      id: "disruptor-signal",
      name: "Signal Disruptor",
      category: "TECH",
      state: "HYBRID",
      cost: 450,
      weight: 0.5,
      memory: 256,
      rarity: "RARE",
      properties: {
        effect: "Creates 15ft radius anti-digital field, DIGITAL entities cannot enter",
        duration: "1 minute",
        charges: "3 per day",
        recharge: "4 hours per charge"
      },
      description: "A device that generates a field of disruptive energy that digital entities cannot penetrate.",
      tags: ["protection", "digital-effective", "multi-use", "tech"]
    },
    
    // DIGITAL ITEMS
    {
      id: "scanner-glitch",
      name: "Glitch Detection Algorithm",
      category: "SOFTWARE",
      state: "DIGITAL",
      cost: 300,
      memory: 48,
      rarity: "UNCOMMON",
      properties: {
        effect: "Provides 10% early warning for imminent glitch events",
        prerequisite: "WISDOM 3+"
      },
      description: "An algorithm that analyzes background data for telltale signs of imminent reality distortion. Not perfect, but better than nothing.",
      tags: ["safety", "detection", "passive"]
    },
    {
      id: "translator-code",
      name: "Code Translator v2.8",
      category: "SOFTWARE",
      state: "DIGITAL",
      cost: 450,
      memory: 64,
      rarity: "UNCOMMON",
      properties: {
        effect: "+1 WISDOM die when interpreting digital entities or anomalies",
        prerequisite: "WISDOM 2+"
      },
      description: "Software that helps interpret the 'language' of digital entities. Provides insights into their behavior patterns and likely responses.",
      tags: ["translation", "communication", "analysis"]
    },
    {
      id: "map-haven",
      name: "Haven Network Map",
      category: "DATA",
      state: "DIGITAL",
      cost: 100,
      memory: 36,
      rarity: "COMMON",
      properties: {
        effect: "Shows known safe havens and major trade routes",
        update: "Automatic when connected to Haven terminal"
      },
      description: "A regularly updated map showing the network of survivor havens and commonly traveled routes between them. Updated via peer connections when in havens.",
      tags: ["map", "navigation", "community"]
    }
  ]);
  
  return merchnet;
}

// Create and initialize the global MerchNet instance
const merchnet = initMerchNet();

// Export the command processor for terminal integration
window.processMerchnetCommand = (command) => merchnet.processCommand(command);
