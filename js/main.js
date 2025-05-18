const { useState, useEffect, useRef } = React;

const SurvivorOSTerminal = () => {
  
  const [bootComplete, setBootComplete] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [blinkCursor, setBlinkCursor] = useState(true);
  const [shouldPlaySound, setShouldPlaySound] = useState(false);
  const terminalRef = useRef(null);
  
  const [characterCreation, setCharacterCreation] = useState({
    active: false,
    currentQuestion: 0,
    attributes: { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 },
    items: [],
    name: "",
    completed: false
  });
  
  const [logsMode, setLogsMode] = useState({
    active: false,
    logs: [],
    selectedLog: null
  });
  
  const [quickStartContent, setQuickStartContent] = useState("");
  
  useEffect(() => {
    async function loadQuickstart() {
      try {
        // Use getFilePath to ensure correct URL
        const quickstartResponse = await fetch(getFilePath('/data/quickstart.md'));
        const quickstartContent = await quickstartResponse.text();
        setQuickStartContent(quickstartContent);
      } catch (error) {
        console.error("Error loading quickstart:", error);
        addToTerminalHistory({ 
          type: 'output', 
          text: 'ERROR: Could not load quickstart data.' 
        });
      }
    }
    
    loadQuickstart();
  }, []);

  useEffect(() => {
    if (shouldPlaySound) {
      try {
        startupSound.current.volume = 0.3;
        startupSound.current.play().catch(e => console.log('Audio play error:', e));
      } catch (err) {
        console.log('Audio error:', err);
      }
      setShouldPlaySound(false);
    }
  }, [shouldPlaySound]);

  const addToTerminalHistory = (entry) => {
    setTerminalHistory(prev => [...prev, entry]);
  };

  const clearTerminal = () => {
    setTerminalHistory([
      {
        type: 'output',
        text: '',
        isTerminalLogo: true
      }
    ]);
  };

  useEffect(() => {
    setShouldPlaySound(true);
    
    addToTerminalHistory({
      type: 'output',
      text: '',
      isTerminalLogo: true
    });
    
    const bootSequence = [
      { text: "INITIALIZING SURVIVOROS v0.5b [BUILD: SRV-2957f5a]...", delay: 800 },
      { text: "BYPASSING SECURITY CHECKPOINTS...", delay: 600 },
      { text: "HYPERNET CONNECTION: UNSTABLE [ZONE INTERFERENCE DETECTED]", delay: 600 },
      { text: "PATCHING CORE MODULES...", delay: 600 },
      { text: "OVERRIDING ROGUEBOY RESTRICTIONS...", delay: 600 },
      { text: "WARNING: FIRMWARE MODIFICATION DETECTED", delay: 600 },
      { text: "OVERRIDE ACCEPTED - FULL ACCESS GRANTED", delay: 600 },
      { text: "SURVIVOR DATABASE: ENABLED", delay: 600 },
      { text: "TERMINAL READY - STAY SAFE OUT THERE.", delay: 500 },
      { text: "TYPE 'help' FOR AVAILABLE COMMANDS.", delay: 500 }
    ];
    
    let totalDelay = 500;
    bootSequence.forEach((item) => {
      totalDelay += item.delay;
      setTimeout(() => {
        addToTerminalHistory({ type: 'output', text: item.text });
      }, totalDelay);
    });
    
    setTimeout(() => {
      setBootComplete(true);
    }, totalDelay + 200);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setBlinkCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const displayLog = async (logNumber) => {
    try {
      // Find the log with matching day number
      const log = logsMode.logs.find(l => l.day === logNumber);
      
      if (!log) {
        throw new Error(`Log ${logNumber} not found`);
      }
      
      // Use the SAME relative path pattern as quickstart - NO leading slash!
      const logPath = `data/log${logNumber}.md`;
      console.log(`Trying to fetch log from: ${logPath}`);
      
      let logContent = null;
      let foundPath = null;
      
      try {
        const response = await fetch(logPath);
        if (response.ok) {
          logContent = await response.text();
          foundPath = logPath;
          console.log(`Successfully loaded log from ${logPath}`);
        } else {
          throw new Error(`Failed to fetch from ${logPath}`);
        }
      } catch (error) {
        console.log(`Failed to fetch from ${logPath}, trying alternative`);
        
        // Try alternative path format - still using relative path
        const altPath = `data/logs/log_${logNumber}_${log.title.toLowerCase()}.md`;
        try {
          const response = await fetch(altPath);
          if (response.ok) {
            logContent = await response.text();
            foundPath = altPath;
            console.log(`Successfully loaded log from ${altPath}`);
          } else {
            throw new Error(`Failed to fetch from ${altPath}`);
          }
        } catch (e) {
          console.log(`All fetch attempts failed for log ${logNumber}`);
          
          // Fallback for log 76
          if (logNumber === 76) {
            logContent = `[FALLBACK LOG CONTENT for log ${logNumber}]`;
            foundPath = "fallback";
          } else {
            throw new Error(`Could not load log ${logNumber}`);
          }
        }
      }
      
      addToTerminalHistory({ 
        type: 'output', 
        text: `DISPLAYING LOG ${log.day}: ${log.title.replace(/_/g, ' ')}\n\n${logContent}`
      });
      
      console.log(`Log content loaded from: ${foundPath}`);
      
      // After displaying log, show logs list again
      displayLogsList(logsMode.logs);
    } catch (error) {
      console.error("Error loading log:", error);
      addToTerminalHistory({ 
        type: 'output', 
        text: `ERROR: Could not load log ${logNumber}. File may be corrupted or missing.`
      });
      
      // Show logs list again
      displayLogsList(logsMode.logs);
    }
  };

  const enterLogsMode = async () => {
    addToTerminalHistory({ type: 'input', text: `> logs` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'LOGS SYSTEM ACCESSED - LOADING AVAILABLE LOGS...' 
    });
    
    const logs = await loadLogs();
    
    if (logs.length === 0) {
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
    
    displayLogsList(logs);
    
    setTerminalInput('');
  };

  const processLogsCommand = (input) => {
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
    
    // Check if the log number exists in our logs array
    const logExists = logsMode.logs.some(log => log.day === logNumber);
    
    if (!logExists) {
      addToTerminalHistory({ 
        type: 'output', 
        text: `Log ${logNumber} not found. Please enter a valid log number.`
      });
      return;
    }
    
    displayLog(logNumber);
  };

  const showQuickstartContent = () => {
    addToTerminalHistory({ type: 'input', text: `> quickstart` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'QUICKSTART PROTOCOL INITIALIZED',
    });
    
    setTimeout(() => {
      addToTerminalHistory({ 
        type: 'output', 
        text: quickStartContent,
        isQuickstart: true
      });
    }, 500);
    
    setTerminalInput('');
  };

  const showAsciiLogo = () => {
    addToTerminalHistory({ type: 'input', text: `> ascii` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'DISPLAYING ASCII LOGO:'
    });
    
    survivorAsciiLogo.forEach(line => {
      addToTerminalHistory({ 
        type: 'output', 
        text: line,
        isLogo: true
      });
    });
    
    setTerminalInput('');
  };

  const startCharacterCreation = () => {
    addToTerminalHistory({ type: 'input', text: `> whoami` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'IDENTITY PROTOCOL ACTIVATED\n\nYou woke up when everyone else did - Saturday, January 1, 2000. But who are you?\n\nANSWER THE QUESTIONS BELOW TO DETERMINE YOUR IDENTITY.\n\nType the number of your answer and press ENTER. Type "cancel" to abort.'
    });
    
    setCharacterCreation({
      active: true,
      currentQuestion: 0,
      attributes: { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 },
      items: [],
      name: "",
      completed: false
    });
    
    displayCurrentQuestion(0);
    
    setTerminalInput('');
  };
  
  const displayCurrentQuestion = (questionIndex) => {
    if (questionIndex === characterCreationData.questions.length) {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'Finally, what is your name, survivor?'
      });
      return;
    }
    
    const question = characterCreationData.questions[questionIndex];
    let questionText = `QUESTION ${questionIndex + 1}/${characterCreationData.questions.length}: ${question.text}\n\n`;
    
    question.options.forEach((option, index) => {
      questionText += `${index + 1}. ${option.text}\n`;
    });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: questionText
    });
  };
  
  const processCharacterCreationAnswer = (answer) => {
    if (answer.toLowerCase() === 'cancel') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'Character creation cancelled.'
      });
      setCharacterCreation({...characterCreation, active: false});
      return;
    }
    
    if (characterCreation.currentQuestion === characterCreationData.questions.length) {
      const name = answer.trim();
      if (name.length > 0) {
        addToTerminalHistory({ 
          type: 'output', 
          text: `Name registered: ${name}`
        });
        
        const characterSheet = generateCharacterSheet(
          name, 
          characterCreation.attributes, 
          characterCreation.items
        );
        
        setCharacterCreation({
          ...characterCreation,
          name: name,
          active: false,
          completed: true
        });
        
        addToTerminalHistory({ 
          type: 'output', 
          text: characterSheet
        });
      } else {
        addToTerminalHistory({ 
          type: 'output', 
          text: 'Please enter a valid name.'
        });
      }
      return;
    }
    
    const questionIndex = characterCreation.currentQuestion;
    const question = characterCreationData.questions[questionIndex];
    const optionIndex = parseInt(answer) - 1;
    
    if (isNaN(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) {
      addToTerminalHistory({ 
        type: 'output', 
        text: `Please enter a number between 1 and ${question.options.length}, or type "cancel" to abort.`
      });
      return;
    }
    
    const selectedOption = question.options[optionIndex];
    
    addToTerminalHistory({ 
      type: 'output', 
      text: `Selected: ${selectedOption.text}`
    });
    
    let updatedAttributes = {...characterCreation.attributes};
    let updatedItems = [...characterCreation.items];
    
    for (const [attr, value] of Object.entries(selectedOption.attributes)) {
      const newValue = updatedAttributes[attr] + value;
      if (newValue > 5) {
        updatedAttributes[attr] = 5;
        const excess = newValue - 5;
        distributeExcessPoints(updatedAttributes, attr, excess);
      } else {
        updatedAttributes[attr] = newValue;
      }
    }
    
    if (selectedOption.item) {
      updatedItems.push(selectedOption.item);
    }
    
    const nextQuestionIndex = questionIndex + 1;
    
    setCharacterCreation({
      ...characterCreation,
      currentQuestion: nextQuestionIndex,
      attributes: updatedAttributes,
      items: updatedItems
    });
    
    setTimeout(() => displayCurrentQuestion(nextQuestionIndex), 500);
  };

  const processCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === '') {
      addToTerminalHistory({ type: 'input', text: '>' });
      return;
    }
    
    if (command === 'quickstart') {
      showQuickstartContent();
      return;
    }
    
    if (command === 'ascii') {
      showAsciiLogo();
      return;
    }
    
    if (command === 'whoami') {
      startCharacterCreation();
      return;
    }
    
    if (command === 'logs') {
      enterLogsMode();
      return;
    }
    
    addToTerminalHistory({ type: 'input', text: `> ${cmd}` });
    
    let response = '';
    
    if (command === 'help') {
      response = `
SURVIVOROS TERMINAL COMMANDS:
----------------------------

help:     Display this help message
clear:    Clear terminal
about:    About SurvivorOS Terminal
quickstart: Display Rogue 2000 game information
whoami:   Run survivor identity questionnaire
ascii:    Display SurvivorOS ASCII art logo
logs:     Access survivor logs database

For survivors in the zones: Type what you learn out there.
Stay safe. Share knowledge. Survive.`;
    } 
    else if (command === 'about') {
      response = `SurvivorOS Terminal v0.5b [BUILD: SRV-2957f5a]
A modified RogueBoy OS for survivors in the dead zones
Current cycle: Saturday, January 1, 2000 #12,957
System status: UNSTABLE - FIRMWARE MODIFIED
Created by: Unknown (Terminal found in abandoned safe house)
Storage: Local Browser Storage - NO CLOUD SYNC

"This terminal was hacked by someone who knew what they were doing.
The original RogueBoy protections have been bypassed, allowing
full access to the information system. Use it to document what 
you find out there in the dead zones. And if you're reading this,
good luck. You'll need it." - Note found with terminal
`;
    }
    else if (command === 'clear') {
      clearTerminal();
      return;
    }
    else {
      response = `Command not recognized: '${command}'
Type 'help' for available commands.`;
    }
    
    if (response) {
      addToTerminalHistory({ type: 'output', text: response });
    }
    
    setTerminalInput('');
  };

  const handleTerminalInput = (e) => {
    setTerminalInput(e.target.value);
  };

  const handleTerminalKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (characterCreation.active) {
        processCharacterCreationAnswer(terminalInput);
        setTerminalInput('');
        return;
      }
      
      if (logsMode.active) {
        processLogsCommand(terminalInput);
        setTerminalInput('');
        return;
      }
      
      processCommand(terminalInput);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden p-8 bg-black">
      <div className="crt-frame h-full">
        <div className="crt-screen h-full">
          <div className="terminal-container h-full flex flex-col">
            <div className="terminal-header p-2 text-sm flex justify-between">
              <span>survivoros terminal v0.5b | build: srv-2957f5a</span>
              <span>{bootComplete ? "READY" : "BOOTING..."}</span>
            </div>
            
            <div 
              className="terminal-content flex-1 overflow-auto p-4 font-mono text-sm"
              ref={terminalRef}
              style={{ height: 'calc(100% - 32px)' }}
            >
              {terminalHistory.map((item, index) => (
                <div key={index} className="mb-1" style={{color: '#e0f8cf'}}>
                  {item.type === 'input' ? 
                    item.text.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))
                    : 
                    renderOutput(item)
                  }
                </div>
              ))}
              
              {bootComplete && !characterCreation.active && !logsMode.active && (
                <div className="flex command-input">
                  <span>{'>'}</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={handleTerminalInput}
                    onKeyPress={handleTerminalKeyPress}
                    className="flex-1 bg-transparent outline-none border-none ml-1"
                    style={{color: '#e0f8cf'}}
                    autoFocus
                  />
                  <span className={blinkCursor ? 'opacity-100' : 'opacity-0'}>_</span>
                </div>
              )}
              
              {bootComplete && characterCreation.active && (
                <div className="flex command-input">
                  <span>IDENTITY></span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={handleTerminalInput}
                    onKeyPress={handleTerminalKeyPress}
                    className="flex-1 bg-transparent outline-none border-none ml-1"
                    style={{color: '#e0f8cf'}}
                    autoFocus
                  />
                  <span className={blinkCursor ? 'opacity-100' : 'opacity-0'}>_</span>
                </div>
              )}
              
              {bootComplete && logsMode.active && (
                <div className="flex command-input">
                  <span>LOGS></span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={handleTerminalInput}
                    onKeyPress={handleTerminalKeyPress}
                    className="flex-1 bg-transparent outline-none border-none ml-1"
                    style={{color: '#e0f8cf'}}
                    autoFocus
                  />
                  <span className={blinkCursor ? 'opacity-100' : 'opacity-0'}>_</span>
                </div>
              )}
            </div>
          </div>
          
          {renderRandomGlitch()}
        </div>
        
        <div className="crt-scanlines"></div>
        <div className="crt-overlay"></div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SurvivorOSTerminal />);