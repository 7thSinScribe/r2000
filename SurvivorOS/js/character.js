// Character creation questionnaire data for whoami command
const characterCreationData = {
  questions: [
    {
      text: "When the hypernet first glitched, where were you?",
      options: [
        { text: "In the gym, working on my strength", attributes: { power: 2 } },
        { text: "At a weird underground techno-seance", attributes: { oddity: 2 } },
        { text: "Studying at the university library", attributes: { wisdom: 2 } },
        { text: "Hiking in the wilderness for days", attributes: { endurance: 2 } },
        { text: "Running parkour with friends", attributes: { reflex: 2 } }
      ]
    },
    {
      text: "As a child, while others played normal games, you often...",
      options: [
        { text: "Challenged other kids to wrestling matches", attributes: { power: 1, endurance: 1 } },
        { text: "Ate bugs and investigated weird phenomena", attributes: { oddity: 2 } },
        { text: "Built elaborate structures from anything available", attributes: { wisdom: 1, oddity: 1 } },
        { text: "Could run for hours without tiring", attributes: { endurance: 2 } },
        { text: "Were always the fastest at tag and dodgeball", attributes: { reflex: 2 } }
      ]
    },
    {
      text: "When facing a Glitch Beast, your first instinct is to...",
      options: [
        { text: "Charge directly at it, weapons ready", attributes: { power: 2 } },
        { text: "Try communicating with it in binary or strange sounds", attributes: { oddity: 2 } },
        { text: "Observe its patterns and search for weaknesses", attributes: { wisdom: 2 } },
        { text: "Stand your ground, prepared to take hits if needed", attributes: { endurance: 1, power: 1 } },
        { text: "Dodge and weave to avoid its attacks", attributes: { reflex: 2 } }
      ]
    },
    {
      text: "Your most trusted tool in the Dead Zones is...",
      options: [
        { text: "A heavy wrench that doubles as a weapon", attributes: { power: 1 }, item: "Heavy Wrench (d8 damage)" },
        { text: "A modified scanner that detects strange anomalies", attributes: { oddity: 1 }, item: "Glitch Scanner (detects digital anomalies within 50m)" },
        { text: "A handwritten journal filled with survival notes", attributes: { wisdom: 1 }, item: "Survivor's Journal (+1 to knowledge checks)" },
        { text: "A reinforced jacket that can take a beating", attributes: { endurance: 1 }, item: "Reinforced Jacket (reduces damage by 1)" },
        { text: "Lightweight running shoes modified for better grip", attributes: { reflex: 1 }, item: "Grip-Mod Shoes (+1 to movement-based checks)" }
      ]
    },
    {
      text: "In a rare moment of calm, you spend your time...",
      options: [
        { text: "Practicing with makeshift weights", attributes: { power: 1, endurance: 1 } },
        { text: "Experimenting with glitched technology", attributes: { oddity: 1, wisdom: 1 } },
        { text: "Reading and cataloging survival information", attributes: { wisdom: 2 } },
        { text: "Running long distances to build stamina", attributes: { endurance: 2 } },
        { text: "Training your hand-eye coordination", attributes: { reflex: 1, wisdom: 1 } }
      ]
    },
    {
      text: "Your approach to surviving in the glitched world is...",
      options: [
        { text: "Overcome obstacles through sheer force", attributes: { power: 2 } },
        { text: "Try unconventional solutions no one else would think of", attributes: { oddity: 2 } },
        { text: "Learn as much as possible about how the world works now", attributes: { wisdom: 2 } },
        { text: "Build yourself up to withstand whatever comes", attributes: { endurance: 2 } },
        { text: "Stay mobile and never get cornered", attributes: { reflex: 2 } }
      ]
    },
    {
      text: "You keep a trinket from your past life. What is it?",
      options: [
        { text: "A medal from a strength competition", attributes: { power: 1 }, item: "Competition Medal (+1 to intimidation checks)" },
        { text: "A strange crystal that occasionally glows", attributes: { oddity: 1 }, item: "Anomalous Crystal (occasionally provides cryptic visions)" },
        { text: "A well-worn book with highlighted passages", attributes: { wisdom: 1 }, item: "Cherished Book (can be consulted once per day for insight)" },
        { text: "A family photo in a sturdy metal frame", attributes: { endurance: 1 }, item: "Family Photo (provides hope in dark times, resist despair)" },
        { text: "A lucky coin you can flip across your knuckles", attributes: { reflex: 1 }, item: "Lucky Coin (once per day, reroll one failed check)" }
      ]
    },
    {
      text: "Your biggest challenge in this new reality is...",
      options: [
        { text: "Finding ways to smash through digital barriers", attributes: { power: 1, oddity: 1 } },
        { text: "Understanding the rules of a reality that doesn't make sense", attributes: { oddity: 1, wisdom: 1 } },
        { text: "Gathering enough knowledge to plan for the future", attributes: { wisdom: 1, endurance: 1 } },
        { text: "Maintaining hope when everything seems broken", attributes: { endurance: 1, wisdom: 1 } },
        { text: "Adapting quickly to constantly changing dangers", attributes: { reflex: 1, oddity: 1 } }
      ]
    }
  ],
  
  startingGear: {
    power: ["Reinforced Pipe (d8 damage)", "Work Gloves (+1 to climbing checks)"],
    oddity: ["Glitched PDA (sometimes displays useful information)", "Kaleidoscope Goggles (see digital wavelengths)"],
    wisdom: ["Pocket Reference Manual (+1 to technical checks)", "High-Capacity Flashlight"],
    endurance: ["First Aid Kit (heal 2 health points, 3 uses)", "Canteen (purifies water automatically)"],
    reflex: ["Switchblade (d6 damage, quick draw)", "Climbing Harness (advantage on climbing checks)"]
  }
};

function distributeExcessPoints(attributes, sourceAttr, excess) {
  const attributeRelationships = {
    power: ['endurance', 'reflex', 'oddity', 'wisdom'],
    oddity: ['wisdom', 'reflex', 'power', 'endurance'],
    wisdom: ['oddity', 'endurance', 'reflex', 'power'],
    endurance: ['power', 'wisdom', 'reflex', 'oddity'],
    reflex: ['power', 'oddity', 'endurance', 'wisdom']
  };
  
  let remainingExcess = excess;
  const relatedAttrs = attributeRelationships[sourceAttr];
  
  for (const attr of relatedAttrs) {
    if (remainingExcess <= 0) break;
    
    const newValue = attributes[attr] + remainingExcess;
    if (newValue <= 5) {
      attributes[attr] = newValue;
      remainingExcess = 0;
    } else {
      attributes[attr] = 5;
      remainingExcess = newValue - 5;
    }
  }
  
  if (remainingExcess > 0) {
    for (const attr of Object.keys(attributes)) {
      if (attr !== sourceAttr && attributes[attr] < 5) {
        const newValue = attributes[attr] + remainingExcess;
        if (newValue <= 5) {
          attributes[attr] = newValue;
          remainingExcess = 0;
        } else {
          attributes[attr] = 5;
          remainingExcess = newValue - 5;
        }
      }
      
      if (remainingExcess <= 0) break;
    }
  }
}

function generateCharacterSheet(name, attributes, items) {
  const blood = attributes.power + attributes.endurance;
  const sweat = attributes.endurance + attributes.reflex;
  const tears = attributes.wisdom + attributes.oddity;
  const powerLevel = (attributes.power + attributes.oddity + attributes.wisdom + attributes.endurance + attributes.reflex) * 100;
  
  let highestAttr = 'power';
  let highestValue = attributes.power;
  
  for (const [attr, value] of Object.entries(attributes)) {
    if (value > highestValue) {
      highestValue = value;
      highestAttr = attr;
    }
  }
  
  const startingGear = characterCreationData.startingGear[highestAttr];
  
  let characterSheet = `
============== SURVIVOR IDENTITY: ${name.toUpperCase()} ==============

P.O.W.E.R ATTRIBUTES:
---------------------
POWER:     ${attributes.power} [${'■'.repeat(attributes.power)}${'□'.repeat(5-attributes.power)}]
ODDITY:    ${attributes.oddity} [${'■'.repeat(attributes.oddity)}${'□'.repeat(5-attributes.oddity)}]
WISDOM:    ${attributes.wisdom} [${'■'.repeat(attributes.wisdom)}${'□'.repeat(5-attributes.wisdom)}]
ENDURANCE: ${attributes.endurance} [${'■'.repeat(attributes.endurance)}${'□'.repeat(5-attributes.endurance)}]
REFLEX:    ${attributes.reflex} [${'■'.repeat(attributes.reflex)}${'□'.repeat(5-attributes.reflex)}]

DERIVED ATTRIBUTES:
------------------
BLOOD (Health): ${blood}
SWEAT (Stamina): ${sweat}
TEARS (Mental): ${tears}
POWER LEVEL: ${powerLevel}

EQUIPMENT:
---------
${startingGear.join('\n')}
${items.map(item => item).join('\n')}

STATUS: Physical
CYCLE: Saturday, January 1, 2000 #12,957
LOCATION: Unknown

"Stay alert, stay alive. The hypernet is always watching."
============================================================
`;
  
  return characterSheet;
}