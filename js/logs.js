// logs.js - No hardcoded fallback, just error messages

// We'll store the pre-loaded log content here
let preloadedLogContent = null;

// Pre-load log76.md at startup, just like quickstart.md
(async function preloadLog() {
  try {
    const response = await fetch('data/log76.md');
    if (response.ok) {
      preloadedLogContent = await response.text();
      console.log("Successfully pre-loaded log76.md");
    } else {
      console.error("Failed to pre-load log76.md:", response.status);
      preloadedLogContent = null;
    }
  } catch (error) {
    console.error("Error pre-loading log76.md:", error);
    preloadedLogContent = null;
  }
})();

const LogsSystem = {
  // Load logs index
  loadLogsIndex: async (addToTerminalHistory) => {
    try {
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
          text: 'ERROR: Could not load logs data. Please ensure logs_index.json is in the data folder.' 
        });
      }
      // Return empty array instead of hardcoded fallback
      return [];
    }
  },
  
  // Enter logs mode
  enterLogsMode: async (setLogsMode, addToTerminalHistory, setTerminalInput) => {
    addToTerminalHistory({ type: 'input', text: `> logs` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'LOGS SYSTEM ACCESSED - LOADING AVAILABLE LOGS...' 
    });
    
    // Load logs index
    const logs = await LogsSystem.loadLogsIndex(addToTerminalHistory);
    
    if (!logs || logs.length === 0) {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'No logs found in the system. Please make sure logs_index.json exists in the data folder.' 
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
  processLogsCommand: (input, logsMode, setLogsMode, addToTerminalHistory) => {
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
    
    // For log 76, use the pre-loaded content
    if (logNumber === 76) {
      // Check if we have the pre-loaded content
      if (preloadedLogContent) {
        // Display the log content
        addToTerminalHistory({ 
          type: 'output', 
          text: `DISPLAYING LOG ${log.day}: ${log.title.replace(/_/g, ' ')}\n\n${preloadedLogContent}`
        });
      } else {
        // Show error message
        addToTerminalHistory({ 
          type: 'output', 
          text: `ERROR: Log ${logNumber} could not be loaded. Please verify that log${logNumber}.md exists in the data folder.`
        });
      }
      
      // After displaying log or error, show logs list again
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
    } else {
      // For other logs - just show not implemented error
      addToTerminalHistory({ 
        type: 'output', 
        text: `Log ${logNumber} not implemented in this version. Only log 76 is currently available.`
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