// Character creation questionnaire data for whoami command
const characterCreationData = {
  questions: [
    {
      text: "When the Hypernet collapsed and digital entities started glitching into reality, what were you doing?",
      options: [
        { text: "Fighting off looters at the local mall", attributes: { power: 1 } },
        { text: "Tinkering with a homebrew faraday cage", attributes: { oddity: 1 } },
        { text: "Collecting data on the glitch patterns", attributes: { wisdom: 1 } },
        { text: "Running a supply marathon to stock up", attributes: { endurance: 1 } },
        { text: "Navigating through panic-filled streets", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "Which digital device did you keep even after it started behaving strangely?",
      options: [
        { text: "A modified power tool with unstable energy output", attributes: { power: 1 } },
        { text: "A glitching Tamagotchi that seems aware of your thoughts", attributes: { oddity: 1 } },
        { text: "An old PDA that occasionally displays accurate predictions", attributes: { wisdom: 1 } },
        { text: "A fitness tracker that enhances your stamina when charged", attributes: { endurance: 1 } },
        { text: "A pair of AR glasses that reveal hidden movement patterns", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "What skill helped you survive the first week of digital chaos?",
      options: [
        { text: "Ability to break down doors and barriers when escaping", attributes: { power: 1 } },
        { text: "Understanding how to communicate with glitched entities", attributes: { oddity: 1 } },
        { text: "Knowledge of which areas would be least affected by the merge", attributes: { wisdom: 1 } },
        { text: "Capacity to go days with minimal sleep or resources", attributes: { endurance: 1 } },
        { text: "Instinct for avoiding digital anomalies before they manifest", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "How do you approach surviving the Gamemaster challenges?", // Modified to remove apostrophes
      options: [
        { text: "Confronting threats directly - better to face danger head-on", attributes: { power: 1 } },
        { text: "Testing reality limits - the rules have changed, why not exploit them?", attributes: { oddity: 1 } },
        { text: "Analyzing patterns - everything follows some kind of logic", attributes: { wisdom: 1 } },
        { text: "Outlasting dangers - most threats dissipate if you can endure", attributes: { endurance: 1 } },
        { text: "Staying constantly mobile - never present a stationary target", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "What unusual ability manifested in you after extended Hypernet exposure?",
      options: [
        { text: "Brief surges of impossible strength when glitches occur nearby", 
          attributes: { power: 1 }, 
          item: "Power Gloves (enhance strength during digital anomalies)" },
        { text: "Occasional visual distortions that reveal hidden code fragments", 
          attributes: { oddity: 1 }, 
          item: "Reality Lens (helps decipher glitch patterns)" },
        { text: "Dreams that contain fragmented memories from digital entities", 
          attributes: { wisdom: 1 }, 
          item: "Dream Journal (records information from subconscious connections)" },
        { text: "Resistance to digital corruption that would harm others", 
          attributes: { endurance: 1 }, 
          item: "Anti-Corruption Amulet (reduces digital damage by 1)" },
        { text: "Moments where time seems to slow during digital anomalies", 
          attributes: { reflex: 1 }, 
          item: "Temporal Refractor (occasional +1 to initiative during anomalies)" }
      ]
    },
    {
      text: "How do you navigate the merged reality dangerous zones?", // Modified to be consistent
      options: [
        { text: "Destroy glitched obstacles blocking the path", 
          attributes: { power: 1 }, 
          item: "Bitmap Breaker (d8 damage against digital objects)" },
        { text: "Reprogram small areas of the environment temporarily", 
          attributes: { oddity: 1 }, 
          item: "Pocket Terminal (can make minor adjustments to digital matter)" },
        { text: "Track patterns in the glitch field to find safe passages", 
          attributes: { wisdom: 1 }, 
          item: "Corruption Compass (points toward stable areas)" },
        { text: "Push through corrupted areas others cannot tolerate", 
          attributes: { endurance: 1 }, 
          item: "Stabilization Patches (reduce corruption accumulation)" },
        { text: "Dart through temporarily stable pathways between anomalies", 
          attributes: { reflex: 1 }, 
          item: "Glitch Timer (predicts window of opportunity between anomalies)" }
      ]
    },
    {
      text: "What did you do during the Week of Madness ad campaign before the collapse?",
      options: [
        { 
          text: "Participated in a strength challenge at an N-CO promotional event", 
          attributes: { power: 1 },
          background: "CONTEST WINNER",
          backgroundDesc: "You won an N-CO promotional contest during the Week of Madness campaign. The prize was one of the first Rogueboy 2000 units, delivered to your home moments before midnight. You sometimes wonder if your early connection to the device is why you can perceive certain glitches others cannot."
        },
        { 
          text: "Explored rumors about hidden easter eggs in the game", 
          attributes: { oddity: 1 },
          background: "CURIOSITY SEEKER",
          backgroundDesc: "You were obsessed with uncovering the secrets N-CO had supposedly hidden in Rogue 2000. You discovered three of the five rumored reality shifting easter eggs before the collapse. Sometimes you catch glimpses of game text only you can see, hinting at the final secrets that were never meant to be found."
        },
        { 
          text: "Wrote analyses predicting the game would underperform", 
          attributes: { wisdom: 1 },
          background: "TECH ANALYST",
          backgroundDesc: "You predicted the Rogueboy 2000 would be a commercial disaster due to unrealistic promises. Your final article critiquing N-CO claims about intelligent procedural generation was scheduled to publish at 12:01am on January 1st, 2000. The draft still sits in a defunct server somewhere in the digital realm."
        },
        { 
          text: "Camped outside an electronics store for the midnight release", 
          attributes: { endurance: 1 },
          background: "DEDICATED FAN",
          backgroundDesc: "You spent three days and nights waiting to be first in line for the Rogueboy 2000 release. When the collapse happened, you were at the register, with the device in your hands. You have recurring dreams of the store clerk face, frozen in the exact moment everything changed."
        },
        { 
          text: "Practiced speedrunning strategies based on preview footage", 
          attributes: { reflex: 1 },
          background: "COMPETITIVE GAMER",
          backgroundDesc: "You were determined to set the first world record speedrun for Rogue 2000. You memorized map layouts from leak footage and practiced button combinations for hours. Now those muscle memories sometimes activate involuntarily when you encounter similar patterns in the merged reality."
        },
        { 
          text: "Avoided the hype completely, thinking it was just another game", 
          attributes: { power: 1, oddity: 1 },
          background: "SKEPTIC",
          backgroundDesc: "You ignored the Rogue 2000 marketing blitz, convinced it was overhyped nonsense. Being untouched by the pre-release conditioning might explain why you see the world differently than many survivors. Digital entities occasionally mistake you for an NPC rather than a player."
        },
        { 
          text: "Investigated N-CO unusual server activity that week", 
          attributes: { wisdom: 1, oddity: 1 },
          background: "WHISTLEBLOWER",
          backgroundDesc: "You were tracking unusual data patterns from N-CO servers in the days before launch. You compiled evidence of unprecedented data collection through their marketing ARG. Your investigation was cut short by the collapse, but you still have encrypted fragments of what you found."
        },
        { 
          text: "Documented yourself unboxing and testing a review copy", 
          attributes: { wisdom: 1, reflex: 1 },
          background: "CONTENT CREATOR",
          backgroundDesc: "You received an early review unit of the Rogueboy 2000 from N-CO marketing team. Your livestream of the unboxing was running when the collapse occurred. Sometimes you encounter digital entities who quote fragments of your final broadcast back to you."
        }
      ]
    },
    {
      text: "What personal item from before the collapse do you still keep with you?",
      options: [
        { text: "A well-worn multi-tool that seems immune to digital corruption", 
          attributes: { power: 1 },
          item: "Reliable Multi-tool (advantage on physical repair attempts)" 
        },
        { text: "A mixtape that plays different songs than what was recorded", 
          attributes: { oddity: 1 },
          item: "Glitched Mixtape (can sometimes influence digital entities behavior)" 
        },
        { text: "A journal where you mapped the first glitch patterns", 
          attributes: { wisdom: 1 },
          item: "Anomaly Journal (+1 to identifying glitch patterns)" 
        },
        { text: "A family photo that occasionally shows different poses", 
          attributes: { endurance: 1 },
          item: "Shifting Photo (stabilizes your mental state during digital storms)" 
        },
        { text: "A keychain with reflexes that occasionally move on their own", 
          attributes: { reflex: 1 },
          item: "Predictive Keychain (gives warning vibrations near hidden dangers)" 
        }
      ]
    },
    {
      text: "Which habit have you developed since the digital apocalypse?",
      options: [
        { text: "Testing physical boundaries of objects to see if they are real", 
          attributes: { power: 1 } },
        { text: "Whispering to your devices as if they can understand you", 
          attributes: { oddity: 1 } },
        { text: "Cataloging recurring glitches in your surroundings", 
          attributes: { wisdom: 1 } },
        { text: "Practicing functioning on minimal sleep and resources", 
          attributes: { endurance: 1 } },
        { text: "Constantly scanning environments for movement anomalies", 
          attributes: { reflex: 1 } }
      ]
    },
    {
      text: "What recurring nightmare haunts your rare moments of deep sleep?",
      options: [
        { text: "Being unable to move while digital entities reconstruct your body", 
          attributes: { power: 1 } },
        { text: "Conversations with a glitched version of yourself from another timeline", 
          attributes: { oddity: 1 } },
        { text: "Seeing code beneath everyone skin, revealing they are all NPCs", 
          attributes: { wisdom: 1 } },
        { text: "Endlessly running through repeating environments that never change", 
          attributes: { endurance: 1 } },
        { text: "Watching digital hazards in slow-motion but being unable to warn others", 
          attributes: { reflex: 1 } }
      ]
    }
  ],
  
  startingGear: {
    power: ["Impact Wrench (d8 damage, effective against physical barriers)", "Reinforced Workgloves (+1 to breaking objects)"],
    oddity: ["Glitched Calculator (sometimes displays useful information about digital anomalies)", "Signal Disruptor (creates temporary interference in digital fields)"],
    wisdom: ["N-CO Technical Manual (reference for understanding game entities)", "UV Flashlight (reveals hidden digital trace elements)"],
    endurance: ["Emergency Medkit (restore 1d4 BLOOD, 3 uses)", "Purification Tablets (make corrupted water drinkable)"],
    reflex: ["Concussion Grenade (stuns entities in small area)", "Grappling Hook (quick vertical movement)"]
  }
};

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
  
  // Build plain text character sheet
  let characterSheet = `
SURVIVOR IDENTITY: ${name.toUpperCase()}
BACKGROUND: ${background.title}

P.O.W.E.R ATTRIBUTES:
--------------------
POWER:     ${attributes.power.toString().padEnd(2)} | ${generateDicePoolText(attributes.power)}
ODDITY:    ${attributes.oddity.toString().padEnd(2)} | ${generateDicePoolText(attributes.oddity)}
WISDOM:    ${attributes.wisdom.toString().padEnd(2)} | ${generateDicePoolText(attributes.wisdom)}
ENDURANCE: ${attributes.endurance.toString().padEnd(2)} | ${generateDicePoolText(attributes.endurance)}
REFLEX:    ${attributes.reflex.toString().padEnd(2)} | ${generateDicePoolText(attributes.reflex)}

DERIVED ATTRIBUTES:
------------------
BLOOD: ${blood}
SWEAT: ${sweat}
TEARS: ${tears}
POWER LEVEL: ${powerLevel}

EQUIPMENT:
---------
${startingGear.join('\n')}
${items.map(item => item).join('\n')}

BACKGROUND:
----------
${background.description}

STATUS: Physical
SATURDAY #12,957

"Stay alert, stay alive. The Gamemaster is always watching."
`;
  
  return characterSheet;
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