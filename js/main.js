const { useState, useEffect, useRef } = React;

const SurvivorOSTerminal = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [blinkCursor, setBlinkCursor] = useState(true);
  const terminalRef = useRef(null);
  
  const [characterCreation, setCharacterCreation] = useState({
    active: false,
    currentQuestion: 0,
    attributes: { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 },
    items: [],
    name: "",
    completed: false
  });
  
  const [quickStartContent, setQuickStartContent] = useState("");
  // Cache for storing loaded logs
  const [logsCache, setLogsCache] = useState({});
  // List of available logs -
  const availableLogs = [76];
  
  useEffect(() => {
    async function loadQuickstart() {
      try {
        const quickstartResponse = await fetch('data/quickstart.md');
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

  // Preload log76 since it's the initial log
  useEffect(() => {
    if (availableLogs.includes(76)) {
      fetchLog(76);
    }
  }, []);

  // Function to fetch a log and store it in the cache
  const fetchLog = async (logNumber) => {
    if (logsCache[logNumber]) {
      return logsCache[logNumber]; // Return from cache if already loaded
    }
    
    try {
      const logResponse = await fetch(`data/log${logNumber}.md`);
      if (!logResponse.ok) {
        throw new Error(`Log ${logNumber} not found`);
      }
      
      const logContent = await logResponse.text();
      
      // Update the cache
      setLogsCache(prev => ({
        ...prev,
        [logNumber]: logContent
      }));
      
      return logContent;
    } catch (error) {
      console.error(`Error loading log${logNumber}:`, error);
      throw error;
    }
  };


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
        contentType: 'quickstart'
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

  const showLogsList = () => {
    addToTerminalHistory({ type: 'input', text: `> logs` });
    
    // Generate list of logs from the availableLogs array
    let logsListContent = `
AVAILABLE SURVIVOR LOGS:
----------------------

`;
    availableLogs.forEach(logNumber => {
      logsListContent += `log${logNumber}: Survivor Log Entry #${logNumber}\n`;
    });
    
    logsListContent += `\nTo view a log, type 'log' followed by the log number (e.g., 'log76')`;
    
    addToTerminalHistory({ 
      type: 'output', 
      text: logsListContent
    });
    
    setTerminalInput('');
  };

  // Generic log display function that works with any log number
  const showLogByNumber = (logNumber) => {
    addToTerminalHistory({ type: 'input', text: `> log${logNumber}` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: `ACCESSING LOG ENTRY #${logNumber}`,
    });
    
    // Try to get from cache first, or fetch if needed
    if (logsCache[logNumber]) {
      // Log is in cache, display it
      setTimeout(() => {
        addToTerminalHistory({ 
          type: 'output', 
          text: logsCache[logNumber],
          contentType: 'log'
        });
      }, 500);
    } else {
      // Log not in cache, fetch it
      fetchLog(logNumber)
        .then(content => {
          setTimeout(() => {
            addToTerminalHistory({ 
              type: 'output', 
              text: content,
              contentType: 'log'
            });
          }, 500);
        })
        .catch(error => {
          addToTerminalHistory({ 
            type: 'output', 
            text: `ERROR: ${error.message}. Log may not exist.`
          });
        });
    }
    
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
      showLogsList();
      return;
    }
    
    // Handle any log command with a single regex check
    const logMatch = command.match(/^log(\d+)$/);
    if (logMatch) {
      const logNumber = parseInt(logMatch[1]);
      showLogByNumber(logNumber);
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
logs:     Display a list of available survivor logs
log#:     View a specific log entry (e.g., log76)

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
                    renderOutput(item, !bootComplete)
                  }
                </div>
              ))}
              
              {bootComplete && !characterCreation.active && (
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