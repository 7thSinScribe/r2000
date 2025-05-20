// Character creation questionnaire data
const characterCreationData = {
  questions: [
    {
      text: "When presented with a glitched environment, your first instinct is to:",
      options: [
        { text: "Force your way through physical obstacles", attributes: { power: 1 } },
        { text: "Look for unusual patterns or non-obvious solutions", attributes: { oddity: 1 } },
        { text: "Analyze the environment for predictable behaviors", attributes: { wisdom: 1 } },
        { text: "Prepare for the long haul and conserve your energy", attributes: { endurance: 1 } },
        { text: "Move quickly and stay one step ahead of danger", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "Your recurring dream in the endless January involves:",
      options: [
        { text: "Pushing against an immovable barrier until it breaks", attributes: { power: 1 } },
        { text: "Conversation with digital entities that answer in code", attributes: { oddity: 1 } },
        { text: "Seeing patterns in chaos that others miss", attributes: { wisdom: 1 } },
        { text: "Walking endlessly without tiring through corrupted zones", attributes: { endurance: 1 } },
        { text: "Moving through frozen time while everything else stands still", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "The other survivors often come to you when they need someone to:",
      options: [
        { text: "Break through a physical barrier or threat", attributes: { power: 1 } },
        { text: "Handle bizarre situations that defy normal logic", attributes: { oddity: 1 } },
        { text: "Solve complex problems or repair technology", attributes: { wisdom: 1 } },
        { text: "Endure harsh conditions or long treks", attributes: { endurance: 1 } },
        { text: "Move quickly or react to sudden dangers", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "Which Gamemaster challenge would you most likely overcome?",
      options: [
        { text: "Trial of Strength: force-based obstacles", attributes: { power: 1 } },
        { text: "Trial of Chaos: reality-bending puzzles", attributes: { oddity: 1 } },
        { text: "Trial of Knowledge: complex pattern recognition", attributes: { wisdom: 1 } },
        { text: "Trial of Persistence: prolonged environmental hazards", attributes: { endurance: 1 } },
        { text: "Trial of Speed: reaction-based challenges", attributes: { reflex: 1 } }
      ]
    },
    {
      text: "Your most valued possession in the glitched world is:",
      options: [
        { text: "A tool that amplifies your physical capabilities", 
          attributes: { power: 1 }, 
          item: "Modified Crowbar (d8)" },
        { text: "A device that behaves in ways that defy explanation", 
          attributes: { oddity: 1 }, 
          item: "Anomalous Calculator (sometimes reveals hidden information about the environment)" },
        { text: "A repository of technical information you've collected", 
          attributes: { wisdom: 1 }, 
          item: "N-CO Technical Manual (reference for understanding game entities)" },
        { text: "Equipment that helps you survive in harsh conditions", 
          attributes: { endurance: 1 }, 
          item: "Survival Pack" },
        { text: "Something that enhances your speed or reaction time", 
          attributes: { reflex: 1 }, 
          item: "Reflex Enhancer (grants +1 reflex when powered" }
      ]
    },
    {
      text: "Your specialized approach to digital anomalies involves:",
      options: [
        { text: "Physical disruption - sometimes you need to break things", 
          attributes: { power: 1 }, 
          item: "Signal Disruptor (temporarily disable digital entities)" },
        { text: "Unconventional interaction - communicating in strange ways", 
          attributes: { oddity: 1 }, 
          item: "Pattern Translator (interpret bizarre digital communications)" },
        { text: "Systematic analysis - understanding the underlying code", 
          attributes: { wisdom: 1 }, 
          item: "Code Analyzer (reveal weaknesses in digital entities)" },
        { text: "Weathering the effects - building resistance over time", 
          attributes: { endurance: 1 }, 
          item: "Digital Buffer (reduce damage from digital attacks)" },
        { text: "Rapid adaptation - changing tactics faster than they can", 
          attributes: { reflex: 1 }, 
          item: "Adaptive Interface (quicker reactions to digital threats)" }
      ]
    },
    {
      text: "Which fragment of your pre-collapse personality remains strongest?",
      options: [
        { 
          text: "Willingness to confront obstacles head-on", 
          attributes: { power: 1, endurance: 1 },
          background: "ENFORCER",
          backgroundDesc: "You've always believed in facing problems directly, using strength and determination to overcome what stands in your way. In the digital apocalypse, this approach has kept you alive when others hesitated. Digital entities seem to recognize your fortitude, sometimes avoiding direct confrontation with you."
        },
        { 
          text: "Curiosity about things others find disturbing", 
          attributes: { oddity: 1, wisdom: 1 },
          background: "INVESTIGATOR",
          backgroundDesc: "You've always been drawn to the strange and unexplained, willing to look where others won't. This curiosity now serves you well in a world where reality itself has become malleable. You sometimes experience déjà vu moments that provide insight into digital anomalies."
        },
        { 
          text: "Ability to stay calm and think clearly in chaos", 
          attributes: { wisdom: 1, endurance: 1 },
          background: "ANALYST",
          backgroundDesc: "Your analytical mind has always been your greatest asset, allowing you to see patterns and solutions where others see only confusion. In the merged reality, this clarity helps you navigate the seemingly random glitches. Sometimes digital systems briefly stabilize in your presence."
        },
        { 
          text: "Stubborn refusal to give up despite hardship", 
          attributes: { endurance: 1, power: 1 },
          background: "SURVIVOR",
          backgroundDesc: "Long before the collapse, you were known for perseverance through difficulties that would break others. This tenacity has only grown stronger in the face of the digital apocalypse. You require less rest than most and recover more quickly from injuries."
        },
        { 
          text: "Instinct for danger and ability to act instantly", 
          attributes: { reflex: 1, oddity: 1 },
          background: "SCOUT",
          backgroundDesc: "Your quick reactions and sixth sense for trouble kept you alive in the chaos of the collapse when others froze or panicked. You continue to rely on these instincts in the glitched world. You occasionally experience brief premonitions of digital anomalies before they manifest."
        }
      ]
    },
    {
      text: "Your final two attribute points - where do they matter most?",
      options: [
        { text: "Physical strength and impact", attributes: { power: 2 } },
        { text: "Unusual perception and thinking", attributes: { oddity: 2 } },
        { text: "Knowledge and problem-solving", attributes: { wisdom: 2 } },
        { text: "Stamina and resilience", attributes: { endurance: 2 } },
        { text: "Speed and reaction time", attributes: { reflex: 2 } }
      ]
    },
    {
      text: "What personal item from before the collapse do you still keep with you?",
      options: [
        { text: "A well-worn multi-tool, useful for repair", 
          item: "Reliable Multi-tool" 
        },
        { text: "A mixtape that never plays the same song", 
          item: "Glitched Mixtape)" 
        },
        { text: "A journal where you categorise anomalies", 
          item: "Anomaly Journal" 
        },
        { text: "A family photo that occasionally changes", 
          item: "Shifting Photo" 
        },
        { text: "A keychain, no keys", 
          item: "Keychain" 
        }
      ]
    },
    {
      text: "Digital entities seem to perceive you as:",
      options: [
        { text: "A threat to be avoided or confronted" },
        { text: "An anomaly they can't categorize" },
        { text: "A complex pattern worth analyzing" },
        { text: "A persistent variable in their calculations" },
        { text: "An unpredictable element in their system" }
      ]
    }
  ],
  
  startingGear: {
    power: ["Impact Wrench (d8 damage, effective against physical barriers)", "Reinforced Workgloves (d6 to breaking objects)"],
    oddity: ["Glitched Calculator (d8 to solving math problems)", "Signal Disruptor (creates temporary interference in digital fields)"],
    wisdom: ["N-CO Technical Manual (reference for understanding game entities)", "UV Flashlight (reveals things you wish you hadn't)"],
    endurance: ["Emergency Medkit (restore 1d6 BLOOD, 3 uses)", "Purification Tablets (makes nasty water drinkable)"],
    reflex: ["Flashbang (blinds enemies in a 15ft area for 3 turns)", "Grappling Hook (quick vertical movement)"]
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
  
  const fullSets = Math.floor(attributeValue / 5);
  const remainder = attributeValue % 5;
  
  let diceText = "";
  
  if (fullSets >= 1) {
    if (fullSets === 1) diceText += "5d7";
    else if (fullSets === 2) diceText += "5d8";
    else if (fullSets === 3) diceText += "5d10";
    else if (fullSets === 4) diceText += "5d12";
    else if (fullSets === 5) diceText += "5d14";
    else if (fullSets >= 6) diceText += "5d16";
  }
  
  if (remainder > 0) {
    if (diceText !== "") diceText += " + ";
    diceText += `${remainder}d6`;
  }
  
  return diceText;
}