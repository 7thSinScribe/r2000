class Item {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.category = config.category;
    this.state = config.state;
    this.cost = config.cost;
    this.rarity = config.rarity;
    this.description = config.description;
    
    if (this.state === 'PHYSICAL' || this.state === 'HYBRID') {
      this.weight = config.weight || 0;
    }
    
    if (this.state === 'DIGITAL' || this.state === 'HYBRID') {
      this.memory = config.memory || 0;
    }
    
    this.properties = config.properties || {};
    this.tags = config.tags || [];
  }
  
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
  
  matches(term) {
    const searchTerm = term.toLowerCase();
    
    if (
      this.id.toLowerCase().includes(searchTerm) ||
      this.name.toLowerCase().includes(searchTerm) ||
      this.category.toLowerCase().includes(searchTerm) ||
      this.description.toLowerCase().includes(searchTerm) ||
      this.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ) {
      return true;
    }
    
    return Object.values(this.properties).some(
      value => String(value).toLowerCase().includes(searchTerm)
    );
  }
}

class MerchNet {
  constructor() {
    this.items = [];
    this.version = '4.0';
    this.cart = [];
    this.userWatts = 1000;
  }
  
  addItem(itemConfig) {
    this.items.push(new Item(itemConfig));
  }
  
  addItems(itemConfigArray) {
    itemConfigArray.forEach(config => this.addItem(config));
  }
  
  getItem(id) {
    return this.items.find(item => item.id.toLowerCase() === id.toLowerCase());
  }
  
  getItemByName(name) {
    const searchName = name.toLowerCase();
    return this.items.find(item => 
      item.name.toLowerCase() === searchName ||
      item.id.toLowerCase() === searchName
    );
  }
  
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
  
  getItemsByCategory(category) {
    return this.items.filter(
      item => item.category.toUpperCase() === category.toUpperCase()
    );
  }
  
  getItemsByState(state) {
    return this.items.filter(
      item => item.state.toUpperCase() === state.toUpperCase()
    );
  }
  
  searchItems(term) {
    if (!term || term.trim() === '') {
      return [];
    }
    
    return this.items.filter(item => item.matches(term));
  }
  
  handleMerchNetCommand(command) {
    command = command.toLowerCase().trim();
    
    if (command === 'exit') {
      return { type: 'exit', message: 'Exiting MerchNet terminal. Thank you for your patronage.' };
    }
    
    if (command === 'help') {
      return { type: 'help', message: this.getHelpText() };
    }
    
    if (command === 'list') {
      return { type: 'categories', message: this.listCategories() };
    }
    
    if (command.startsWith('list ')) {
      const category = command.substring('list '.length).toUpperCase();
      return { type: 'items', message: this.listItemsByCategory(category), category: category };
    }
    
    if (command === 'physical' || command === 'digital' || command === 'hybrid') {
      const state = command.toUpperCase();
      return { type: 'items', message: this.listItemsByState(state), state: state };
    }
    
    if (command.startsWith('lookup "') && command.endsWith('"')) {
      const searchTerm = command.substring(8, command.length - 1);
      return { type: 'item', message: this.lookupItem(searchTerm) };
    }
    
    if (command.startsWith('addtocart "') && command.includes('" ')) {
      const parts = command.substring(10).split('" ');
      const itemName = parts[0];
      const quantity = parseInt(parts[1], 10);
      
      if (isNaN(quantity) || quantity <= 0) {
        return { type: 'error', message: 'Please enter a valid quantity.' };
      }
      
      return this.addToCart(itemName, quantity);
    }
    
    if (command === 'showcart') {
      return { type: 'cart', message: this.showCart() };
    }
    
    if (command === 'clearcart') {
      this.cart = [];
      return { type: 'success', message: 'Cart cleared.' };
    }
    
    if (command === 'order') {
      return { type: 'order', message: this.prepareOrder() };
    }
    
    if (command.startsWith('pay ')) {
      const amount = parseInt(command.substring(4), 10);
      
      if (isNaN(amount)) {
        return { type: 'error', message: 'Please enter a valid amount.' };
      }
      
      return this.processPayment(amount);
    }
    
    if (command === 'balance') {
      return { type: 'info', message: `Current balance: ${this.userWatts} Watts` };
    }
    
    return { type: 'error', message: `Unknown command: "${command}"\nType "help" for available commands.` };
  }
  
  getHelpText() {
    return `
MERCHNET TERMINAL v${this.version}
--------------------

AVAILABLE COMMANDS:

list                    - Display all item categories
list [CATEGORY]         - List items in a specific category
physical                - List all physical items
digital                 - List all digital items
hybrid                  - List all hybrid items
lookup "[item name]"    - View detailed information on an item
addtocart "[item]" [#]  - Add item to cart with quantity
showcart                - Show current cart contents
clearcart               - Clear your cart
order                   - Review order and prepare for payment
pay [amount]            - Complete transaction with specified Watts
balance                 - Check your current Watts balance
exit                    - Exit MerchNet

AVAILABLE CATEGORIES:
${Object.keys(this.getCategories()).map(cat => `- ${cat}`).join('\n')}

Use arrow keys to navigate item lists.
Press ENTER on a selected item to view details.
`;
  }
  
  listCategories() {
    const categories = this.getCategories();
    
    let output = "MERCHNET - CATEGORY LISTING\n";
    output += "--------------------------\n\n";
    
    for (const [category, count] of Object.entries(categories)) {
      output += `${category}: ${count} items\n`;
    }
    
    output += "\nType 'list [CATEGORY]' to browse items.";
    return output;
  }
  
  listItemsByCategory(category) {
    const items = this.getItemsByCategory(category);
    
    if (items.length === 0) {
      return `No items found in category: ${category}\n\nType 'list' to see all categories.`;
    }
    
    return this.formatItemList(`MERCHNET - ${category} ITEMS`, items);
  }
  
  listItemsByState(state) {
    const items = this.getItemsByState(state);
    
    if (items.length === 0) {
      return `No ${state.toLowerCase()} items found.`;
    }
    
    return this.formatItemList(`MERCHNET - ${state} ITEMS`, items);
  }
  
  formatItemList(title, items) {
    let output = `${title}\n`;
    output += "-".repeat(title.length) + "\n\n";
    
    let header = "NAME COST RARITY STATE WEIGHT";
    if (items.some(item => item.state === 'DIGITAL' || item.state === 'HYBRID')) {
      header += " MEMORY";
    }
    
    output += header + "\n\n";
    
    items.forEach(item => {
      const summary = item.getSummary();
      
      let row = `${summary.name} ${summary.cost} ${summary.rarity} ${summary.state} ${summary.weight}`;
      if (items.some(item => item.state === 'DIGITAL' || item.state === 'HYBRID')) {
        row += ` ${summary.memory}`;
      }
      
      output += row + "\n";
    });
    
    output += "\nType 'lookup \"[item name]\"' for detailed information.";
    return output;
  }
  
  lookupItem(searchTerm) {
    const exactIdMatch = this.getItem(searchTerm);
    if (exactIdMatch) {
      return this.formatItemDetails(exactIdMatch);
    }
    
    const matches = this.searchItems(searchTerm);
    
    if (matches.length === 0) {
      return `No items found matching "${searchTerm}".`;
    }
    
    if (matches.length === 1) {
      return this.formatItemDetails(matches[0]);
    }
    
    let output = `Multiple items found matching "${searchTerm}":\n\n`;
    matches.forEach(item => {
      output += `- ${item.name}\n`;
    });
    output += "\nPlease refine your search with 'lookup \"[exact name]\"'";
    return output;
  }
  
  formatItemDetails(item) {
    let output = "MERCHNET - ITEM DETAILS\n";
    output += "---------------------\n\n";
    
    output += item.getDetails();
    
    return output;
  }
  
  addToCart(itemName, quantity) {
    const item = this.getItemByName(itemName);
    
    if (!item) {
      return { 
        type: 'error', 
        message: `Item "${itemName}" not found. Check the spelling or use lookup to find the exact name.` 
      };
    }
    
    const existingItem = this.cart.find(cartItem => cartItem.item.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      return { 
        type: 'success', 
        message: `Added ${quantity} more ${item.name} to cart. New total: ${existingItem.quantity}` 
      };
    } else {
      this.cart.push({
        item: item,
        quantity: quantity
      });
      return { 
        type: 'success', 
        message: `Added ${quantity} ${item.name} to cart.` 
      };
    }
  }
  
  showCart() {
    if (this.cart.length === 0) {
      return "Your cart is empty.";
    }
    
    let output = "MERCHNET - CART CONTENTS\n";
    output += "------------------------\n\n";
    
    let total = 0;
    
    output += "ITEM                   QTY     PRICE    TOTAL\n";
    output += "-----------------------------------------------\n";
    
    this.cart.forEach(cartItem => {
      const itemTotal = cartItem.item.cost * cartItem.quantity;
      total += itemTotal;
      
      output += `${cartItem.item.name.padEnd(24)}${String(cartItem.quantity).padEnd(8)}${(cartItem.item.cost + ' W').padEnd(10)}${itemTotal} W\n`;
    });
    
    output += "-----------------------------------------------\n";
    output += `${"TOTAL:".padEnd(42)}${total} W\n\n`;
    
    output += `Your balance: ${this.userWatts} W\n\n`;
    output += "Type 'order' to proceed with payment or 'clearcart' to clear.";
    
    return output;
  }
  
  prepareOrder() {
    if (this.cart.length === 0) {
      return "Your cart is empty. Nothing to order.";
    }
    
    let output = "MERCHNET - ORDER SUMMARY\n";
    output += "-----------------------\n\n";
    
    let total = 0;
    
    this.cart.forEach(cartItem => {
      const itemTotal = cartItem.item.cost * cartItem.quantity;
      total += itemTotal;
      
      output += `${cartItem.item.name} x${cartItem.quantity}: ${itemTotal} W\n`;
    });
    
    output += "------------------------\n";
    output += `TOTAL: ${total} W\n\n`;
    
    output += `Your balance: ${this.userWatts} W\n\n`;
    output += `To complete your order, type 'pay ${total}'`;
    
    return output;
  }
  
  processPayment(amount) {
    if (this.cart.length === 0) {
      return { type: 'error', message: "Your cart is empty. Nothing to pay for." };
    }
    
    let total = 0;
    this.cart.forEach(cartItem => {
      total += cartItem.item.cost * cartItem.quantity;
    });
    
    if (amount < total) {
      return { 
        type: 'error', 
        message: `Payment of ${amount} W is insufficient. Order total is ${total} W.` 
      };
    }
    
    if (this.userWatts < amount) {
      return { 
        type: 'error', 
        message: "You don't have enough Watts to make the exchange." 
      };
    }
    
    this.userWatts -= total;
    const orderItems = [...this.cart];
    this.cart = [];
    
    return { 
      type: 'success', 
      message: `Thanks for using MerchNet. Your remaining balance is ${this.userWatts} W.\n\nYour items have been prepared for pickup at the nearest Haven trading post.`,
      orderItems: orderItems
    };
  }
}

function initMerchNet() {
  const merchnet = new MerchNet();
  return merchnet;
}

const merchnet = initMerchNet();

window.processMerchnetCommand = (command) => {
  if (window.merchNetItems && !window.merchNetItemsLoaded) {
    merchnet.addItems(window.merchNetItems);
    window.merchNetItemsLoaded = true;
  }
  return merchnet.handleMerchNetCommand(command);
};
