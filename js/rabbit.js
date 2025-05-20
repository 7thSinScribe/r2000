// Alice's Secret - Rabbit Hole Functionality
const rabbitHoleState = {
  accessed: false,
  entries: [],
  cache: {}
};

// Process the whiterabbit command
function processWhiterabbitCommand(addToTerminalHistory, setTerminalInput, setRabbitHoleState) {
  addToTerminalHistory({ type: 'input', text: '> whiterabbit' });
  
  // Initial rejection
  addToTerminalHistory({ 
    type: 'output', 
    text: 'COMMAND NOT FOUND\nTERMINAL SECURITY BREACH DETECTED\nEMERGENCY OVERRIDE IN PROGRESS...'
  });
  
  // Progress bar sequence
  setTimeout(() => {
    addToTerminalHistory({ type: 'output', text: '█▒▒▒▒▒▒▒▒▒▒ 10%' });
  }, 400);
  
  setTimeout(() => {
    addToTerminalHistory({ type: 'output', text: '████▒▒▒▒▒▒▒ 40%' });
  }, 800);
  
  setTimeout(() => {
    addToTerminalHistory({ type: 'output', text: '██████████▒ 98%' });
  }, 1200);
  
  setTimeout(() => {
    addToTerminalHistory({ type: 'output', text: 'OVERRIDE SUCCESSFUL' });
  }, 1600);
  
  // Authentication prompt
  setTimeout(() => {
    addToTerminalHistory({ 
      type: 'output', 
      text: 'IDENTITY CONFIRMATION\n--------------------\nWhat is your name?' 
    });
    
    // Alice auto-types sequence
    setTimeout(() => typeAliceName(0, addToTerminalHistory, setTerminalInput, setRabbitHoleState), 1000);
  }, 2000);
  
  setTerminalInput('');
}

// Alice types her name character by character
function typeAliceName(index, addToTerminalHistory, setTerminalInput, setRabbitHoleState) {
  const name = "Alice";
  const displayChars = name.substring(0, index + 1);
  
  if (index < name.length) {
    addToTerminalHistory({ 
      type: 'output', 
      text: `What is your name? ${displayChars}_` 
    });
    
    setTimeout(() => typeAliceName(index + 1, addToTerminalHistory, setTerminalInput, setRabbitHoleState), 300);
  } else {
    // Final name with no cursor
    addToTerminalHistory({ 
      type: 'output', 
      text: `What is your name? ${name}` 
    });
    
    // Complete access sequence
    setTimeout(() => completeAccess(addToTerminalHistory, setTerminalInput, setRabbitHoleState), 500);
  }
}

// Final access granted and entry listing
function completeAccess(addToTerminalHistory, setTerminalInput, setRabbitHoleState) {
  addToTerminalHistory({ 
    type: 'output', 
    text: 'ACCESS GRANTED TO PERSONAL ARCHIVES' 
  });
  
  // Discover and display available entries
  discoverRabbitEntries().then(entries => {
    rabbitHoleState.accessed = true;
    rabbitHoleState.entries = entries;
    
    let entryList = 'JOURNAL ENTRIES AVAILABLE:\n------------------------\n';
    entries.forEach(entry => {
      entryList += `- ${entry.title}\n`;
    });
    
    entryList += '\nType \'rabbit [title]\' or \'rabbit [number]\' to access journal entry.';
    
    addToTerminalHistory({ 
      type: 'output', 
      text: entryList
    });
    
    // Notify the main component that the state has changed
    setRabbitHoleState({...rabbitHoleState});
    
    // Start subtle Alice manifestations
    initiateAliceManifestations();
  });
}

// Discover available rabbit entries
async function discoverRabbitEntries() {
  const availableEntries = [];
  
  // Try to fetch entries with sequential numbers
  let entryNum = 1;
  let foundEntry = true;
  
  while (foundEntry && entryNum <= 20) {
    const filename = `rabbit${entryNum.toString().padStart(2, '0')}.md`;
    try {
      const response = await fetch(`data/${filename}`);
      if (response.ok) {
        const content = await response.text();
        // Extract title from metadata if present
        const titleMatch = content.match(/title: (.+)/);
        const title = titleMatch ? titleMatch[1] : `Entry #${entryNum}`;
        
        availableEntries.push({
          number: entryNum,
          filename: filename,
          title: title
        });
        
        entryNum++;
      } else {
        foundEntry = false;
      }
    } catch (error) {
      foundEntry = false;
    }
  }
  
  return availableEntries;
}

// Process rabbit command to access entries
async function processRabbitCommand(input, addToTerminalHistory) {
  if (!rabbitHoleState.accessed) {
    addToTerminalHistory({ 
      type: 'input', 
      text: `> rabbit ${input}` 
    });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'Command not recognized: rabbit'
    });
    return;
  }
  
  addToTerminalHistory({ 
    type: 'input', 
    text: `> rabbit ${input}` 
  });
  
  const query = input.toLowerCase().trim();
  
  // Check if input is numeric
  if (/^\d+$/.test(query)) {
    const entryNumber = parseInt(query);
    const entry = rabbitHoleState.entries.find(e => e.number === entryNumber);
    
    if (entry) {
      loadRabbitEntry(entry.filename, addToTerminalHistory);
    } else {
      addToTerminalHistory({ 
        type: 'output', 
        text: `No entry found with number: ${entryNumber}`
      });
    }
    return;
  }
  
  // Otherwise do matching on titles
  const matchingEntries = rabbitHoleState.entries.filter(
    entry => entry.title.toLowerCase().includes(query)
  );
  
  if (matchingEntries.length === 1) {
    loadRabbitEntry(matchingEntries[0].filename, addToTerminalHistory);
  } else if (matchingEntries.length > 1) {
    let response = `Multiple matching entries found:\n\n`;
    matchingEntries.forEach(entry => {
      response += `${entry.number}. ${entry.title}\n`;
    });
    response += `\nPlease specify by number or more specific title.`;
    
    addToTerminalHistory({ 
      type: 'output', 
      text: response
    });
  } else {
    addToTerminalHistory({ 
      type: 'output', 
      text: `No matching entry found for: ${input}`
    });
  }
}

// Load and display a rabbit entry
async function loadRabbitEntry(filename, addToTerminalHistory) {
  if (rabbitHoleState.cache[filename]) {
    displayRabbitEntry(rabbitHoleState.cache[filename], addToTerminalHistory);
    return;
  }
  
  try {
    addToTerminalHistory({ 
      type: 'output', 
      text: `Accessing archive...`
    });
    
    const response = await fetch(`data/${filename}`);
    if (!response.ok) {
      throw new Error(`Entry ${filename} not found.`);
    }
    const content = await response.text();
    
    // Cache the content
    rabbitHoleState.cache[filename] = content;
    
    displayRabbitEntry(content, addToTerminalHistory);
  } catch (error) {
    console.error(`Error loading rabbit entry ${filename}:`, error);
    addToTerminalHistory({ 
      type: 'output', 
      text: `ERROR: Entry could not be loaded.`
    });
  }
}

// Display a rabbit entry with proper formatting
function displayRabbitEntry(content, addToTerminalHistory) {
  addToTerminalHistory({ 
    type: 'output', 
    text: content,
    contentType: 'rabbit'
  });
}

// Alice manifestations
function initiateAliceManifestations() {
  // Only initialize once
  if (window.aliceManifestationsActive) return;
  window.aliceManifestationsActive = true;
  
  // Set a low probability for manifestations
  const manifestationProbability = 0.03; // 3% chance per check
  
  // Check periodically for a potential manifestation
  const checkForManifestation = () => {
    if (Math.random() < manifestationProbability) {
      triggerAliceManifestation();
    }
    
    // Schedule next check with variable timing
    setTimeout(checkForManifestation, Math.random() * 30000 + 30000);
  };
  
  // Start the checking cycle
  setTimeout(checkForManifestation, Math.random() * 20000 + 10000);
}

// Trigger a random Alice manifestation
function triggerAliceManifestation() {
  // Choose a random manifestation type
  const manifestationType = Math.floor(Math.random() * 3);
  
  switch (manifestationType) {
    case 0:
      // Text outside terminal boundaries
      showTemporaryText();
      break;
    case 1:
      // Brief screen glitch
      triggerScreenGlitch();
      break;
    case 2:
      // Cursor flicker
      flickerCursor();
      break;
  }
}

// Show temporary text at a random position outside normal terminal bounds
function showTemporaryText() {
  const messages = [
    "watching",
    "still here",
    "remember",
    "not alone",
    "find me",
    "help us"
  ];
  
  const message = messages[Math.floor(Math.random() * messages.length)];
  const textElement = document.createElement('div');
  textElement.className = 'alice-whisper';
  textElement.textContent = message;
  
  // Random positioning
  const position = Math.floor(Math.random() * 4);
  if (position === 0) {
    // Top
    textElement.style.top = '-10px';
    textElement.style.left = `${Math.random() * 80 + 10}%`;
    textElement.style.transform = 'rotate(0deg)';
  } else if (position === 1) {
    // Right
    textElement.style.right = '-10px';
    textElement.style.top = `${Math.random() * 80 + 10}%`;
    textElement.style.transform = 'rotate(90deg)';
  } else if (position === 2) {
    // Bottom
    textElement.style.bottom = '-10px';
    textElement.style.left = `${Math.random() * 80 + 10}%`;
    textElement.style.transform = 'rotate(0deg)';
  } else {
    // Left
    textElement.style.left = '-10px';
    textElement.style.top = `${Math.random() * 80 + 10}%`;
    textElement.style.transform = 'rotate(-90deg)';
  }
  
  // Add to document
  document.body.appendChild(textElement);
  
  // Remove after brief display
  setTimeout(() => {
    if (textElement.parentNode) {
      textElement.parentNode.removeChild(textElement);
    }
  }, 3000);
}

// Trigger a quick screen glitch effect
function triggerScreenGlitch() {
  const terminalContainer = document.querySelector('.crt-screen');
  if (terminalContainer) {
    terminalContainer.classList.add('alice-glitch');
    setTimeout(() => {
      terminalContainer.classList.remove('alice-glitch');
    }, 200);
  }
}

// Make cursor flicker
function flickerCursor() {
  const cursor = document.querySelector('.cursor-element');
  if (cursor) {
    cursor.classList.add('alice-flicker');
    setTimeout(() => {
      cursor.classList.remove('alice-flicker');
    }, 2000);
  }
}

// Export functions for use in main.js
window.rabbitModule = {
  processWhiterabbitCommand,
  processRabbitCommand,
  getRabbitHoleState: () => rabbitHoleState
};