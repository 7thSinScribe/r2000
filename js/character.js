// Character creation questionnaire data for whoami command
const characterCreationData = {
  questions: [
    {
      text: "When the hypernet first glitched, where were you?",
      options: [
        { text: "In the gym, working out", attributes: { power: 2 } },
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
      text: "Your approach to surviving in the glitched world is...",
      options: [
        { text: "Overcome obstacles through sheer force", attributes: { power: 2 } },
        { text: "Try unconventional solutions no one else would think of", attributes: { oddity: 2 } },
        { text: "Learn as much as possible about how the world works now", attributes: { wisdom: 2 } },
        { text: "Build yourself up to withstand whatever comes", attributes: { endurance: 2 } },
        { text: "Stay mobile and never get cornered", attributes: { reflex: 2 } }
      ]
    },
    // Psychological assessment questions
    {
      text: "You discover a sealed bunker with strange markings. Do you...",
      options: [
        { text: "Bust the door open with whatever tools you have", 
          attributes: { power: 1 }, 
          item: "Crowbar (d8 damage, advantage on forcing things open)" },
        { text: "Study the markings to understand their meaning first", 
          attributes: { wisdom: 1 }, 
          item: "Cryptography Guide (+1 to decoding messages and symbols)" },
        { text: "Try various unusual combinations and approaches", 
          attributes: { oddity: 1 }, 
          item: "Lockpick Set (helps bypass simple locks and mechanisms)" },
        { text: "Carefully test the structural integrity before proceeding", 
          attributes: { endurance: 1 }, 
          item: "Reinforced Gloves (protect hands, +1 to climbing checks)" },
        { text: "Look for alternative, less obvious entrances", 
          attributes: { reflex: 1 }, 
          item: "Grappling Hook (helps with vertical traversal)" }
      ]
    },
    {
      text: "A stranger approaches your camp at night. You...",
      options: [
        { text: "Grab your weapon and confront them directly", 
          attributes: { power: 1 }, 
          item: "Combat Knife (d6 damage, concealable)" },
        { text: "Set up an elaborate decoy to test their intentions", 
          attributes: { oddity: 1 }, 
          item: "Motion Sensors (alerts you to movement within 50m)" },
        { text: "Observe them carefully before deciding how to act", 
          attributes: { wisdom: 1 }, 
          item: "Tactical Binoculars (see clearly at night and distance)" },
        { text: "Hide and prepare for potential conflict", 
          attributes: { endurance: 1 }, 
          item: "Kevlar Vest (reduces physical damage by 2)" },
        { text: "Disappear into the shadows, ready to strike or flee", 
          attributes: { reflex: 1 }, 
          item: "Smoke Grenades (creates cover, enables escape)" }
      ]
    },
    {
      text: "Your group is low on food. You suggest...",
      options: [
        { text: "Raiding the nearest settlement for supplies", 
          attributes: { power: 1 }, 
          item: "Combat Rations (nutritious emergency food, 3 days worth)" },
        { text: "Experimenting with cooking digital entities", 
          attributes: { oddity: 1 }, 
          item: "Data-Nutrient Converter (turns some digital matter into edible paste)" },
        { text: "Creating a sustainable farm with salvaged tech", 
          attributes: { wisdom: 1 }, 
          item: "Seed Vault (contains various vegetable and fruit seeds)" },
        { text: "Reducing rations and pushing through hunger", 
          attributes: { endurance: 1 }, 
          item: "Nutrient Optimizer (makes food 30% more filling)" },
        { text: "Setting multiple traps to catch small game", 
          attributes: { reflex: 1 }, 
          item: "Snare Kit (can catch small animals for food)" }
      ]
    },
    // Background selection question
    {
      text: "Before the digital apocalypse, what was your role in society?",
      options: [
        { 
          text: "I was in law enforcement or military service", 
          attributes: { power: 1, endurance: 1 },
          background: "ENFORCER",
          backgroundDesc: "Your training as a law enforcement officer or military personnel has proven invaluable in the post-apocalyptic world. You understand discipline, tactics, and how to handle yourself in violent situations. Some survivors look to you for protection, while others fear you might try to impose the old world's laws on the new reality."
        },
        { 
          text: "I was a programmer or tech specialist", 
          attributes: { wisdom: 1, oddity: 1 },
          background: "CODER",
          backgroundDesc: "Your understanding of code and systems gives you unique insight into how the Gamemaster operates. You can sometimes predict glitches or manipulate digital entities in ways others can't comprehend. You're haunted by the possibility that someone like you might have helped create this nightmare."
        },
        { 
          text: "I was a doctor or healthcare provider", 
          attributes: { wisdom: 2 },
          background: "HEALER",
          backgroundDesc: "Your medical knowledge is a precious resource in the glitched world. You've had to adapt conventional medicine to treat hybrid afflictions and digital infections. You're driven by your oath to help others, but the endless suffering sometimes makes you question if survival is worth the cost."
        },
        { 
          text: "I was a skilled tradesperson or engineer", 
          attributes: { power: 1, wisdom: 1 },
          background: "BUILDER",
          backgroundDesc: "Your practical knowledge of how things work has allowed you to jury-rig solutions from the wreckage of civilization. You can repurpose scrap into shelter, weapons, or tools. You take pride in creating islands of functionality amidst the chaos."
        },
        { 
          text: "I was an athlete or physical trainer", 
          attributes: { power: 1, reflex: 1 },
          background: "ATHLETE",
          backgroundDesc: "Your physical conditioning gave you an edge when the world collapsed. You can outrun, outfight, and outlast most threats. You sometimes struggle with the loss of the structured competition and recognition you once enjoyed, replacing it with the raw competition for survival."
        },
        { 
          text: "I was an academic or researcher", 
          attributes: { wisdom: 1, oddity: 1 },
          background: "SCHOLAR",
          backgroundDesc: "Your analytical mind helps you understand the new rules of reality. You document patterns in the chaos and theorize about the nature of the Gamemaster. Some see your knowledge as valuable, while others think your focus on understanding rather than surviving is a luxury they can't afford."
        },
        { 
          text: "I was a wilderness guide or survivalist", 
          attributes: { endurance: 1, reflex: 1 },
          background: "SURVIVALIST",
          backgroundDesc: "You were prepared for a disaster, though not this specific one. Your knowledge of hunting, foraging, and living off the land has helped you stay alive away from population centers. You've had to adapt your skills to account for glitched flora and fauna."
        },
        { 
          text: "I was an artist or entertainer", 
          attributes: { oddity: 2 },
          background: "PERFORMER",
          backgroundDesc: "Your creative thinking helps you navigate the bizarre logic of the glitched world. You find ways to bring moments of joy to other survivors through improvised performances. You believe preserving humanity's spirit is as important as preserving their bodies."
        },
        { 
          text: "I was involved in organized crime", 
          attributes: { reflex: 1, oddity: 1 },
          background: "CRIMINAL",
          backgroundDesc: "Your experience operating outside the law prepared you for when the law ceased to exist. You understand how to acquire resources, forge alliances, and identify threats in chaotic environments. You're not proud of everything you've done to survive, but pride is a luxury few can afford now."
        },
        { 
          text: "I was a corporate executive or businessperson", 
          attributes: { wisdom: 1, power: 1 },
          background: "EXECUTIVE",
          backgroundDesc: "Your leadership skills and strategic thinking have helped you organize survivor communities. You understand resource management and how to negotiate between competing interests. Some resent your attempt to recreate hierarchical structures in the new world."
        },
        { 
          text: "I was just a regular person with a normal job", 
          attributes: { endurance: 2 },
          background: "EVERYMAN",
          backgroundDesc: "You had no special training or skills when the world changed, just a stubborn determination to survive. Your adaptability and willingness to learn have kept you alive when many specialists couldn't adjust. You represent what humanity can endure when pushed to its limits."
        },
        { 
          text: "I was a child or teenager", 
          attributes: { reflex: 1, oddity: 1 },
          background: "DIGITAL NATIVE",
          backgroundDesc: "You've grown up in the glitched world, with only vague memories or stories of what came before. You navigate the merged reality instinctively, without the conceptual barriers adults struggle with. The older survivors try to protect you, not realizing you often understand this new world better than they do."
        }
      ]
    }
  ],
  
  startingGear: {
    power: ["Sledgehammer (d10 damage, two-handed)", "Work Gloves (+1 to climbing checks)"],
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
    
    const newValue = attributes[attr] + 1; // Only add 1 point at a time
    attributes[attr] = newValue;
    remainingExcess -= 1;
    
    if (remainingExcess <= 0) break;
  }
  
  if (remainingExcess > 0) {
    for (const attr of Object.keys(attributes)) {
      if (attr !== sourceAttr) {
        const newValue = attributes[attr] + 1;
        attributes[attr] = newValue;
        remainingExcess -= 1;
      }
      
      if (remainingExcess <= 0) break;
    }
  }
}

function generateDicePoolText(attributeValue) {
  if (attributeValue <= 5) {
    return `${attributeValue}d6`;
  }
  
  // Calculate dice pool for values above 5
  const fullSets = Math.floor(attributeValue / 5);
  const remainder = attributeValue % 5;
  
  let diceText = "";
  
  // Handle upgraded dice
  if (fullSets >= 1) {
    if (fullSets === 1) diceText += "5d7";
    else if (fullSets === 2) diceText += "5d8";
    else if (fullSets === 3) diceText += "5d10";
    else if (fullSets === 4) diceText += "5d12";
    else if (fullSets === 5) diceText += "5d14";
    else if (fullSets >= 6) diceText += "5d16";
  }
  
  // Add remaining d6s
  if (remainder > 0) {
    if (diceText !== "") diceText += " + ";
    diceText += `${remainder}d6`;
  }
  
  return diceText;
}

function generateCharacterSheet(name, attributes, items, background) {
  const blood = 3 + attributes.power + attributes.endurance;
  const sweat = 2 + attributes.endurance + attributes.reflex;
  const tears = 1 + attributes.wisdom + attributes.oddity;
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
  
  // Build ASCII character sheet
  let characterSheet = `
=======================================================================
                   SURVIVOR IDENTITY: ${name.toUpperCase()}
                   BACKGROUND: ${background.title}
=======================================================================

P.O.W.E.R ATTRIBUTES:
---------------------
POWER:     ${attributes.power.toString().padEnd(2)} | DICE POOL: ${generateDicePoolText(attributes.power)}
ODDITY:    ${attributes.oddity.toString().padEnd(2)} | DICE POOL: ${generateDicePoolText(attributes.oddity)}
WISDOM:    ${attributes.wisdom.toString().padEnd(2)} | DICE POOL: ${generateDicePoolText(attributes.wisdom)}
ENDURANCE: ${attributes.endurance.toString().padEnd(2)} | DICE POOL: ${generateDicePoolText(attributes.endurance)}
REFLEX:    ${attributes.reflex.toString().padEnd(2)} | DICE POOL: ${generateDicePoolText(attributes.reflex)}

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

BACKGROUND:
----------
${background.description}

STATUS: Physical
CYCLE: Saturday, January 1, 2000 #12,957
LOCATION: Unknown

"Stay alert, stay alive. The hypernet is always watching."
=======================================================================
`;
  
  return characterSheet;
}
