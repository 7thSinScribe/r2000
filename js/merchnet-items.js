window.merchNetItems = [
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
      damage: "d8",
      effect: "Advantage on breaking objects"
    },
    description: "A sturdy crowbar reinforced with steel bands. Equally useful for prying things open or cracking skulls. Has become a symbol of survival in the post-collapse world.",
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
      damage: "d10",
      effect: "Requires POWER 3+ to use effectively"
    },
    description: "A massive wrench that can crush bones with ease. Slow to swing but devastating on impact. Popular among those with high POWER attributes.",
    tags: ["melee", "blunt", "tool"]
  },
  {
    id: "hatchet-tactical",
    name: "Tactical Hatchet",
    category: "WEAPONS",
    state: "PHYSICAL",
    cost: 200,
    weight: 0.9,
    rarity: "COMMON",
    properties: {
      damage: "d6",
      effect: "Can be thrown (range 15ft)"
    },
    description: "A lightweight tactical hatchet with a carbon fiber handle. Good balance makes it suitable for throwing or chopping. Excellent for both combat and utility tasks.",
    tags: ["melee", "thrown", "sharp", "tool"]
  },
  {
    id: "hammer-sledge",
    name: "Sledgehammer",
    category: "WEAPONS",
    state: "PHYSICAL",
    cost: 150,
    weight: 4.2,
    rarity: "COMMON",
    properties: {
      damage: "2d8",
      effect: "Requires POWER 4+ to use effectively"
    },
    description: "A massive sledgehammer that requires significant strength to wield. Can demolish barriers and enemies alike, but its weight makes it unwieldy.",
    tags: ["melee", "two-handed", "blunt", "tool"]
  },
  {
    id: "bat-spiked",
    name: "Spiked Baseball Bat",
    category: "WEAPONS",
    state: "PHYSICAL",
    cost: 160,
    weight: 1.8,
    rarity: "COMMON",
    properties: {
      damage: "d10",
      effect: "Intimidating appearance"
    },
    description: "A baseball bat with nails and metal spikes driven through it. Crude but effective, and the sight of it is often enough to deter potential threats. A favorite among less technically inclined survivors.",
    tags: ["melee", "blunt", "intimidation"]
  },
  {
    id: "bow-hunting",
    name: "Hunting Bow",
    category: "WEAPONS",
    state: "PHYSICAL",
    cost: 250,
    weight: 1.2,
    rarity: "UNCOMMON",
    properties: {
      damage: "d8",
      effect: "Silent, recoverable ammunition"
    },
    description: "A sturdy compound bow that allows for silent hunting and combat. Arrows can often be recovered and reused, making this a sustainable option for the resource-conscious survivor.",
    tags: ["ranged", "silent", "hunting"]
  },
  {
    id: "stungun-standard",
    name: "Standard Stungun",
    category: "WEAPONS",
    state: "PHYSICAL",
    cost: 220,
    weight: 0.6,
    rarity: "UNCOMMON",
    properties: {
      damage: "d4",
      effect: "Target may lose SWEAT"
    },
    description: "A police-grade stungun that delivers a powerful electrical charge. More useful for incapacitating than causing harm. Particularly effective on organic targets but useless against purely digital entities.",
    tags: ["ranged", "electrical", "stun"]
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
      protection: "d6",
      slot: "Torso"
    },
    description: "A leather jacket reinforced with kevlar inserts. Offers decent protection without restricting movement. Standard garb for anyone venturing outside the Havens.",
    tags: ["armor", "light", "everyday"]
  },
  {
    id: "gauntlets-work",
    name: "Heavy Work Gauntlets",
    category: "ARMOR",
    state: "PHYSICAL",
    cost: 80,
    weight: 0.6,
    rarity: "COMMON",
    properties: {
      protection: "d4",
      slot: "Hands",
      effect: "+1 POWER die for breaking objects"
    },
    description: "Thick leather work gloves reinforced with metal plates on the knuckles and palm. Allows for handling of hot or sharp objects with reduced risk.",
    tags: ["armor", "hands", "work", "utility"]
  },
  {
    id: "vest-tactical",
    name: "Tactical Vest",
    category: "ARMOR",
    state: "PHYSICAL",
    cost: 350,
    weight: 4.0,
    rarity: "UNCOMMON",
    properties: {
      protection: "d8",
      slot: "Torso",
      effect: "Multiple pockets for small items"
    },
    description: "A heavy-duty tactical vest with ceramic plates. Offers superior protection at the cost of mobility and comfort. The multiple pockets are useful for keeping essential items close at hand.",
    tags: ["armor", "heavy", "tactical", "storage"]
  },
  {
    id: "helmet-combat",
    name: "Combat Helmet",
    category: "ARMOR",
    state: "PHYSICAL",
    cost: 180,
    weight: 1.3,
    rarity: "COMMON",
    properties: {
      protection: "d8",
      slot: "Head",
      effect: "Protects against head injuries"
    },
    description: "A sturdy combat helmet that protects against impacts and projectiles. Essential for any serious combat situation. Includes an adjustable chin strap for a secure fit.",
    tags: ["armor", "head", "combat"]
  },
  {
    id: "boots-combat",
    name: "Combat Boots",
    category: "ARMOR",
    state: "PHYSICAL",
    cost: 120,
    weight: 1.4,
    rarity: "COMMON",
    properties: {
      protection: "d4",
      slot: "Feet",
      effect: "Improved stability on rough terrain"
    },
    description: "Heavy-duty boots with reinforced toes and ankle support. Good for long treks through rough terrain or kicking down doors in emergencies.",
    tags: ["armor", "feet", "utility", "mobility"]
  },
  {
    id: "hazmat-partial",
    name: "Partial Hazmat Suit",
    category: "ARMOR",
    state: "PHYSICAL",
    cost: 400,
    weight: 4.5,
    rarity: "UNCOMMON",
    properties: {
      protection: "d4",
      slot: "Full Body",
      effect: "+2 ENDURANCE dice vs environmental hazards"
    },
    description: "A patchwork hazmat suit made from salvaged materials. Provides moderate protection against environmental hazards, toxic substances, and airborne contaminants.",
    tags: ["armor", "environmental", "utility"]
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
      effect: "Reveals DIGITAL entities and anomalies",
      power: "Uses 5 Watts per hour"
    },
    description: "Standard-issue N-Co goggles that allow viewing of digital entities. Without these, DIGITAL entities are completely invisible to the naked eye. Battery lasts 6 hours of continuous use.",
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
    description: "A well-worn multi-tool that's survived countless repairs. Contains pliers, knife, screwdrivers, and other essential tools. A survivor's best friend for improvised fixes.",
    tags: ["tool", "utility", "repair"]
  },
  {
    id: "backpack-reinforced",
    name: "Reinforced Backpack",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 150,
    weight: 1.2,
    rarity: "COMMON",
    properties: {
      effect: "Carries up to 15kg of equipment"
    },
    description: "A durable backpack with reinforced straps and water-resistant material. Multiple compartments for organized storage. The internal frame helps distribute weight for long treks.",
    tags: ["storage", "utility", "everyday"]
  },
  {
    id: "flashlight-uv",
    name: "UV Flashlight",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 120,
    weight: 0.4,
    rarity: "COMMON",
    properties: {
      effect: "Reveals hidden markings and residue"
    },
    description: "A powerful ultraviolet flashlight that reveals things not visible to the naked eye. Digital entities sometimes leave traces visible under UV light, making this useful for tracking their movements.",
    tags: ["perception", "light", "utility"]
  },
  {
    id: "charger-solar",
    name: "Solar Power Charger",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 300,
    weight: 1.0,
    rarity: "UNCOMMON",
    properties: {
      effect: "Generates 10 Watts per hour in direct sunlight"
    },
    description: "A portable solar panel with battery storage. Essential for keeping devices charged on long trips away from Haven power sources. Performs at reduced capacity in cloudy conditions.",
    tags: ["power", "technology", "utility"]
  },
  {
    id: "grapple-mechanical",
    name: "Mechanical Grappling Hook",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 180,
    weight: 1.5,
    rarity: "UNCOMMON",
    properties: {
      effect: "Reach places up to 50ft above",
      limit: "Can support up to 150kg"
    },
    description: "A spring-loaded grappling hook with reinforced cord. Excellent for scaling buildings or crossing gaps. The mechanical advantage system allows even those with lower POWER to climb effectively.",
    tags: ["mobility", "utility", "climbing"]
  },
  {
    id: "detector-metal",
    name: "Metal Detector",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 200,
    weight: 1.1,
    rarity: "UNCOMMON",
    properties: {
      effect: "Finds buried metal objects"
    },
    description: "A battery-powered metal detector, useful for finding buried caches or hidden compartments. Essential for scavengers looking to uncover pre-collapse technology or supplies.",
    tags: ["detection", "scavenging", "tech"]
  },
  {
    id: "binoculars-high",
    name: "High-Powered Binoculars",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 220,
    weight: 0.8,
    rarity: "UNCOMMON",
    properties: {
      effect: "+2 REFLEX dice for spotting distant threats"
    },
    description: "Military-grade binoculars with 10x50 magnification. Useful for scouting terrain and spotting threats from a safe distance. The rubberized coating provides grip even in wet conditions.",
    tags: ["perception", "scouting", "optics"]
  },
  {
    id: "tent-singlewall",
    name: "Single-Wall Tent",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 150,
    weight: 2.0,
    rarity: "COMMON",
    properties: {
      effect: "Provides shelter for 1-2 people"
    },
    description: "A simple, lightweight tent that provides shelter from the elements. Not the most durable option, but easy to carry and quick to set up. Includes basic waterproofing for light rain.",
    tags: ["shelter", "camping", "utility"]
  },
  {
    id: "compass-reliable",
    name: "Reliable Compass",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 60,
    weight: 0.1,
    rarity: "COMMON",
    properties: {
      effect: "Always shows true north"
    },
    description: "A simple but reliable compass that helps with navigation. One of the few pre-collapse technologies that still works perfectly, since it requires no electricity or digital components.",
    tags: ["navigation", "utility", "travel"]
  },
  {
    id: "lock-picking",
    name: "Lock Picking Set",
    category: "TOOLS",
    state: "PHYSICAL",
    cost: 180,
    weight: 0.2,
    rarity: "UNCOMMON",
    properties: {
      effect: "+1 ODDITY die for opening locks"
    },
    description: "A professional set of lock picks in a leather roll. Useful for accessing locked containers or buildings without causing damage. Requires practice to use effectively.",
    tags: ["security", "access", "utility"]
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
      effect: "Restores d6 BLOOD",
      uses: 3
    },
    description: "A compact medical kit with bandages, antiseptics, and suture materials. Essential for patching up wounds in the field. Most survivors consider this a necessity when venturing outside Havens.",
    tags: ["healing", "emergency", "multi-use"]
  },
  {
    id: "stimshot-adrenaline",
    name: "Adrenaline Stimshot",
    category: "MEDICAL",
    state: "PHYSICAL",
    cost: 150,
    weight: 0.1,
    rarity: "UNCOMMON",
    properties: {
      effect: "Restores d6 SWEAT instantly, -2 ENDURANCE dice for 5 turns after",
      uses: 1
    },
    description: "An injectable stimulant that provides a temporary burst of energy followed by a significant crash. Use in emergencies only, as the comedown can leave you vulnerable.",
    tags: ["stimulant", "temporary", "consumable"]
  },
  {
    id: "patches-painblock",
    name: "Painblock Patches",
    category: "MEDICAL",
    state: "PHYSICAL",
    cost: 180,
    weight: 0.2,
    rarity: "UNCOMMON",
    properties: {
      effect: "Ignore BLOOD penalties for 1 hour",
      uses: 3
    },
    description: "Transdermal patches that release powerful painkillers. Allows continued function despite injuries, but doesn't actually heal damage. The comedown can be rough if used for prolonged periods.",
    tags: ["painkiller", "temporary", "consumable"]
  },
  {
    id: "bandage-compression",
    name: "Compression Bandages",
    category: "MEDICAL",
    state: "PHYSICAL",
    cost: 80,
    weight: 0.3,
    rarity: "COMMON",
    properties: {
      effect: "Stops bleeding, restores 1 BLOOD",
      uses: 5
    },
    description: "Elastic bandages designed to apply pressure to wounds and stop bleeding. A basic but essential component of any medical kit. Quick and easy to apply even without medical training.",
    tags: ["healing", "first-aid", "multi-use"]
  },
  {
    id: "antibiotics-broad",
    name: "Broad-Spectrum Antibiotics",
    category: "MEDICAL",
    state: "PHYSICAL",
    cost: 230,
    weight: 0.2,
    rarity: "UNCOMMON",
    properties: {
      effect: "Prevents infection from wounds",
      uses: 10
    },
    description: "Pills that fight bacterial infections. Essential for treating wounds in unsanitary conditions. The collapse has made these significantly more valuable as production has nearly ceased.",
    tags: ["medicine", "infection", "multi-use"]
  },
  {
    id: "splint-adjustable",
    name: "Adjustable Splint",
    category: "MEDICAL",
    state: "PHYSICAL",
    cost: 120,
    weight: 0.5,
    rarity: "COMMON",
    properties: {
      effect: "Stabilizes broken limbs",
      uses: "Reusable"
    },
    description: "A versatile metal and fabric splint that can be adjusted to fit any limb. Helps immobilize broken bones until proper medical attention can be found. A must-have for long expeditions.",
    tags: ["medical", "fracture", "reusable"]
  },

  // CONSUMABLES
  {
    id: "ration-preserved",
    name: "Preserved Rations",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 50,
    weight: 0.5,
    rarity: "COMMON",
    properties: {
      effect: "Restores 2 SWEAT",
      shelf_life: "1 year"
    },
    description: "Vacuum-sealed food packages with extended shelf life. Not tasty, but nutritious and filling. Standard fare for travelers between Havens.",
    tags: ["food", "survival", "everyday"]
  },
  {
    id: "water-purifier",
    name: "Water Purification Tablets",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 40,
    weight: 0.1,
    rarity: "COMMON",
    properties: {
      effect: "Makes contaminated water safe to drink",
      uses: 10
    },
    description: "Chemical tablets that kill bacteria and neutralize many toxins in water. Takes 30 minutes to work. One tablet treats 1 liter of water, making these essential for long journeys.",
    tags: ["water", "survival", "multi-use"]
  },
  {
    id: "slurrp-energy",
    name: "Slurrp Energy Drink",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 30,
    weight: 0.4,
    rarity: "COMMON",
    properties: {
      effect: "Restores d4 SWEAT instantly",
      quantity: "Six-pack"
    },
    description: "A sickeningly sweet energy drink that somehow survived the collapse with its factory intact. Now a common trade good in Havens. Found in mysterious vending machines that appear in unexpected locations.",
    tags: ["beverage", "stimulant", "everyday"]
  },
  {
    id: "slurrp-blue",
    name: "Slurrp BLUE",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 45,
    weight: 0.4,
    rarity: "UNCOMMON",
    properties: {
      effect: "Restores d4 TEARS, chance of addiction",
      quantity: "Six-pack"
    },
    description: "A variant of Slurrp with a vibrant blue color and blueberry flavor. Highly addictive, with some users reporting unusual dreams after regular consumption. Distributed by the same mysterious vending machines as regular Slurrp.",
    tags: ["beverage", "stimulant", "addiction-risk"]
  },
  {
    id: "flare-signal",
    name: "Signal Flares",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 60,
    weight: 0.3,
    rarity: "COMMON",
    properties: {
      effect: "Visible for 2 miles, burns for 3 minutes",
      uses: 3
    },
    description: "Bright emergency flares that can be used for signaling or temporarily illuminating an area. Be aware that they may attract unwanted attention from both physical and digital entities.",
    tags: ["signal", "light", "emergency", "multi-use"]
  },
  {
    id: "grenade-flash",
    name: "Flashbang Grenade",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 200,
    weight: 0.4,
    rarity: "UNCOMMON",
    properties: {
      effect: "Blinds and deafens all entities within 15ft for 3 turns",
      uses: 1
    },
    description: "A non-lethal grenade that produces a blinding flash and deafening bang. Useful for escaping dangerous situations. Affects both PHYSICAL and DIGITAL entities that have sensory capabilities.",
    tags: ["tactical", "stun", "one-use"]
  },
  {
    id: "mushroom-glowcap",
    name: "Glowcap Mushroom",
    category: "CONSUMABLES",
    state: "HYBRID",
    cost: 120,
    weight: 0.1,
    memory: 4,
    rarity: "UNCOMMON",
    properties: {
      effect: "+1 ODDITY die for 1 hour, emits soft light",
      uses: 1
    },
    description: "A bioluminescent mushroom that originated in the game world but now grows in dark, damp places in reality. Eating it enhances perception of patterns and provides a soft glow that doesn't attract attention.",
    tags: ["fungi", "perception", "light", "game-origin"]
  },
  {
    id: "jerky-venison",
    name: "Venison Jerky",
    category: "CONSUMABLES",
    state: "PHYSICAL",
    cost: 70,
    weight: 0.3,
    rarity: "COMMON",
    properties: {
      effect: "Restores 3 SWEAT, high protein",
      shelf_life: "6 months"
    },
    description: "Dried strips of deer meat, heavily spiced and preserved. A favorite among hunters and travelers for its combination of taste and nutritional value. Keeps well in all conditions.",
    tags: ["food", "protein", "hunting", "travel"]
  },

  // COMPONENTS
  {
    id: "capacitor-highcap",
    name: "High-Capacity Capacitor",
    category: "COMPONENTS",
    state: "PHYSICAL",
    cost: 180,
    weight: 0.3,
    rarity: "UNCOMMON",
    properties: {
      effect: "Stores large electrical charge",
      compatible: "Energy weapons, advanced tech"
    },
    description: "A specialized capacitor capable of storing and discharging large amounts of electrical energy. Essential component for many energy-based devices and weapons.",
    tags: ["electronic", "power", "component"]
  },
  {
    id: "circuit-processing",
    name: "Processing Circuit",
    category: "COMPONENTS",
    state: "PHYSICAL",
    cost: 250,
    weight: 0.1,
    rarity: "UNCOMMON",
    properties: {
      effect: "Enables computational functions",
      compatible: "Digital interfaces, analytical devices"
    },
    description: "A salvaged or repurposed processing circuit that can handle complex calculations. A key component in devices that need to analyze or interact with digital entities.",
    tags: ["electronic", "computation", "component"]
  },
  {
    id: "lens-focusing",
    name: "Focusing Lens",
    category: "COMPONENTS",
    state: "PHYSICAL",
    cost: 120,
    weight: 0.2,
    rarity: "COMMON",
    properties: {
      effect: "Precisely focuses light or energy",
      compatible: "Optical devices, targeting systems"
    },
    description: "A precision-ground lens that can focus light or other energy with high accuracy. Used in everything from scopes to scanning devices.",
    tags: ["optical", "precision", "component"]
  },
  {
    id: "battery-standard",
    name: "Standard Battery Pack",
    category: "COMPONENTS",
    state: "PHYSICAL",
    cost: 80,
    weight: 0.5,
    rarity: "COMMON",
    properties: {
      effect: "Provides 100 Watts of power",
      compatible: "Most electronic devices"
    },
    description: "A rechargeable battery pack that can power most common electronic devices. The universal connector makes it compatible with almost any device that requires power.",
    tags: ["power", "electronic", "component"]
  },
  {
    id: "cable-data",
    name: "Data Transfer Cable",
    category: "COMPONENTS",
    state: "PHYSICAL",
    cost: 60,
    weight: 0.2,
    rarity: "COMMON",
    properties: {
      effect: "Enables data transfer between devices",
      compatible: "Digital storage, computing devices"
    },
    description: "A high-speed cable for transferring data between electronic devices. Essential for updating digital equipment or copying information between storage media.",
    tags: ["data", "connectivity", "component"]
  },
  {
    id: "sensor-motion",
    name: "Motion Sensor Module",
    category: "COMPONENTS",
    state: "PHYSICAL",
    cost: 150,
    weight: 0.1,
    rarity: "UNCOMMON",
    properties: {
      effect: "Detects movement within range",
      compatible: "Security systems, traps, alerts"
    },
    description: "A sensitive electronic component that can detect motion. Can be incorporated into security systems, alarms, or automated devices that need to respond to movement.",
    tags: ["detection", "security", "component"]
  },

  // DIGITAL ITEMS
  {
    id: "detector-anomaly",
    name: "Anomaly Detection Program",
    category: "SOFTWARE",
    state: "DIGITAL",
    cost: 300,
    memory: 48,
    rarity: "UNCOMMON",
    properties: {
      effect: "+1 ODDITY die to detect reality fluctuations",
      prerequisite: "N98 Goggles or compatible device"
    },
    description: "Software that runs on compatible devices to help identify unstable areas where reality is thin. Can provide warnings about potentially dangerous glitches in the environment.",
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
      effect: "+1 WISDOM die when interpreting digital entities",
      prerequisite: "WISDOM 2+"
    },
    description: "Software that helps interpret the 'language' of digital entities. Provides insights into their behavior patterns and likely responses when loaded into a compatible device.",
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
  },
  {
    id: "database-entities",
    name: "Digital Entity Database",
    category: "DATA",
    state: "DIGITAL",
    cost: 200,
    memory: 128,
    rarity: "UNCOMMON",
    properties: {
      effect: "+1 WISDOM die when identifying digital threats",
      update: "Manual via survivor reports"
    },
    description: "A collection of information about known digital entities, their behaviors, weaknesses, and territories. Compiled from survivor reports and research by tech-savvy haven dwellers.",
    tags: ["information", "security", "entities"]
  },
  {
    id: "encryption-basic",
    name: "Basic Encryption Package",
    category: "SOFTWARE",
    state: "DIGITAL",
    cost: 150,
    memory: 32,
    rarity: "COMMON",
    properties: {
      effect: "Protects personal data from digital intrusion",
      prerequisite: "Any digital storage device"
    },
    description: "A simple but effective encryption system that helps protect personal data from being accessed or corrupted by digital entities. A basic precaution for anyone storing important information.",
    tags: ["security", "protection", "privacy"]
  },
  {
    id: "backup-personal",
    name: "Personal Data Backup",
    category: "DATA",
    state: "DIGITAL",
    cost: 80,
    memory: 16,
    rarity: "COMMON",
    properties: {
      effect: "Preserves important personal information",
      prerequisite: "None"
    },
    description: "A compressed archive of important personal information, maps, contacts, and notes. Insurance against data loss in a world where information can mean survival.",
    tags: ["backup", "personal", "insurance"]
  }
];
