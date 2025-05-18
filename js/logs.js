// logs.js - Simplified version that mirrors the quickstart approach exactly

// The hardcoded content for log 76 as fallback
const LOG_76_FALLBACK = `---
Saturday: 76
title: "Digital Entities"
author: "[REDACTED]"
---
>>> PERSONAL LOG

Nearly lost it today. Was rummaging through an abandoned N-Co shop when my torch died. Just like that - full charge to nothing in seconds. Could have sworn I heard something moving, but couldn't see a bloody thing.

Then I remembered the RogueVision AR goggles I'd pocketed earlier. Put them on and there it was. A glowing blue... thing. Sort of like a jellyfish crossed with a lightning bolt. Some kind of pure digital entity, existing right there in physical space but completely invisible without the goggles.

It was draining the electricity from anything I had powered up. My watch stopped. Phone died. Even the little LED keychain went dark. Could actually see little streams of energy (the goggles visualize it as blue particles) flowing from my devices into the creature.

I panicked and chucked a spanner at it. Went straight through. No effect. Physical objects just pass right through digital entities - they don't exist on our physical plane, see? Tried punching it too - my hand passed right through, but I felt this weird tingle up my arm. Not painful, but not pleasant either.

Then it "attacked" me. No physical damage, but it sent this electrical pulse that locked up my muscles for about 5 seconds. Like being tased, but milder. Still terrifying when you can't move.

Finally figured out I could affect it by using other powered devices. Had an old taser in my pack - discharged it near the creature and it seemed to disrupt its form. Kept zapping until it dissipated entirely.

Key findings about pure digital entities:
- Invisible without AR glasses/goggles
- Can't physically touch or harm you
- Drain "Watts" from any powered device (measured the drain at about 10W/second)
- Can deliver stun attacks that temporarily paralyze
- Vulnerable to electrical surges, EM pulses, etc.
- No blood or physical components - just disrupt their pattern enough and they dissipate

Think I'll call these ones "Parasparks" - they seem to feed on electricity and resemble sparks of energy. Need to be careful about battery management in areas they inhabit. My rule now is always keep one device powered down as backup.

I've started measuring battery life in "Watts" rather than percentage - more precise when dealing with these things. Will record more entity types as I encounter them.

Also, discovered that certain music played through speakers seems to confuse them - something about the sound wave patterns disrupting their form. The Clash works particularly well. Digital entities don't like punk, apparently.`;

// Simple logs mode functionality
const LogsSystem = {
  // Load logs index
  loadLogsIndex: async (addToTerminalHistory) => {
    try {
      // Same exact pattern as quickstart
      const response = await fetch('data/logs_index.json');
      if (!response.ok) {
        throw new Error(`Failed to load logs index: ${response.status}`);
      }
      const data = await response.json();
      return data.logs;
    } catch (error) {
      console.error("Error loading logs index:", error);
      if (addToTerminalHistory) {
        addToTerminalHistory({ 
          type: 'output', 
          text: 'ERROR: Could not load logs data.' 
        });
      }
      // Use hardcoded fallback
      return [
        { day: 76, title: "Digital Entities" }
      ];
    }
  },
  
  // Enter logs mode
  enterLogsMode: async (setLogsMode, addToTerminalHistory, setTerminalInput) => {
    addToTerminalHistory({ type: 'input', text: `> logs` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'LOGS SYSTEM ACCESSED - LOADING AVAILABLE LOGS...' 
    });
    
    // Load logs index using the exact same pattern as quickstart
    const logs = await LogsSystem.loadLogsIndex(addToTerminalHistory);
    
    if (!logs || logs.length === 0) {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'No logs found in the system.' 
      });
      return;
    }
    
    setLogsMode({
      active: true,
      logs: logs,
      selectedLog: null
    });
    
    // Display logs list
    let logsList = 'AVAILABLE LOGS:\n\n';
    logs.forEach((log) => {
      const title = log.title.replace(/_/g, ' ');
      logsList += `${log.day}. ${title}\n`;
    });
    logsList += '\nEnter log number to view, or type EXIT to return to main terminal.';
    
    addToTerminalHistory({ 
      type: 'output', 
      text: logsList
    });
    
    setTerminalInput('');
  },
  
  // Process logs commands
  processLogsCommand: async (input, logsMode, setLogsMode, addToTerminalHistory) => {
    const command = input.trim().toUpperCase();
    
    addToTerminalHistory({ type: 'input', text: `LOGS> ${input}` });
    
    if (command === 'EXIT') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'Exiting logs system. Returning to main terminal.'
      });
      
      setLogsMode({
        active: false,
        logs: [],
        selectedLog: null
      });
      
      return;
    }
    
    const logNumber = parseInt(command);
    
    if (isNaN(logNumber)) {
      addToTerminalHistory({ 
        type: 'output', 
        text: `Invalid input. Please enter a log number, or type EXIT to return to main terminal.`
      });
      return;
    }
    
    const log = logsMode.logs.find(l => l.day === logNumber);
    
    if (!log) {
      addToTerminalHistory({ 
        type: 'output', 
        text: `Log ${logNumber} not found. Please enter a valid log number.`
      });
      return;
    }
    
    try {
      // Use the exact same fetch pattern as quickstart.md
      let logContent;
      
      // Special case for log 76 to ensure it works
      if (logNumber === 76) {
        try {
          // Try to load the log file using exact same pattern as quickstart
          const response = await fetch('data/log76.md');
          if (response.ok) {
            logContent = await response.text();
            console.log("Successfully loaded log76.md");
          } else {
            // Fallback to hardcoded content
            console.log("Using fallback for log76.md");
            logContent = LOG_76_FALLBACK;
          }
        } catch (error) {
          console.error("Error loading log76.md:", error);
          logContent = LOG_76_FALLBACK;
        }
      } else {
        // For other logs, use the same pattern
        const filename = `data/log${logNumber}.md`;
        try {
          const response = await fetch(filename);
          if (response.ok) {
            logContent = await response.text();
          } else {
            throw new Error(`Could not load ${filename}`);
          }
        } catch (error) {
          console.error(`Error loading ${filename}:`, error);
          throw new Error(`Log ${logNumber} content not available`);
        }
      }
      
      // Display the log content
      addToTerminalHistory({ 
        type: 'output', 
        text: `DISPLAYING LOG ${log.day}: ${log.title.replace(/_/g, ' ')}\n\n${logContent}`
      });
      
      // After displaying log, show logs list again
      let logsList = 'AVAILABLE LOGS:\n\n';
      logsMode.logs.forEach((log) => {
        const title = log.title.replace(/_/g, ' ');
        logsList += `${log.day}. ${title}\n`;
      });
      logsList += '\nEnter log number to view, or type EXIT to return to main terminal.';
      
      addToTerminalHistory({ 
        type: 'output', 
        text: logsList
      });
    } catch (error) {
      console.error("Error displaying log:", error);
      addToTerminalHistory({ 
        type: 'output', 
        text: `ERROR: Could not display log ${logNumber}. ${error.message}`
      });
      
      // Show logs list again
      let logsList = 'AVAILABLE LOGS:\n\n';
      logsMode.logs.forEach((log) => {
        const title = log.title.replace(/_/g, ' ');
        logsList += `${log.day}. ${title}\n`;
      });
      logsList += '\nEnter log number to view, or type EXIT to return to main terminal.';
      
      addToTerminalHistory({ 
        type: 'output', 
        text: logsList
      });
    }
  }
};