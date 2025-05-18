const { useState, useEffect, useRef } = React;

// Main component
const SurvivorOSTerminal = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [blinkCursor, setBlinkCursor] = useState(true);
  const [shouldPlaySound, setShouldPlaySound] = useState(false);
  const terminalRef = useRef(null);
  
  // Character creation
  const [characterCreation, setCharacterCreation] = useState({
    active: false,
    currentQuestion: 0,
    attributes: { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 },
    items: [],
    name: "",
    completed: false
  });
  
  // Survivor logs - simplified
  const [survivorLogs, setSurvivorLogs] = useState({
    active: false,
    viewingLog: null,
    availableLogs: [],
    logContent: {}
  });

  // Quickstart content
  const [quickStartContent, setQuickStartContent] = useState("");

  // Audio for logo animation
  const startupSound = useRef(new Audio('data:audio/wav;base64,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rq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/4CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA=='));

  // Load data from external files - COMPLETELY REWRITTEN
  useEffect(() => {
    async function loadData() {
      try {
        // Load quickstart content
        const quickstartResponse = await fetch('data/quickstart.md');
        const quickstartContent = await quickstartResponse.text();
        setQuickStartContent(quickstartContent);
        
        // Load log 76 content directly (hardcoded for simplicity)
        try {
          const log76Response = await fetch('data/logs/log_076_digital_entities');
          if (!log76Response.ok) {
            // Try alternative path if the first one fails
            const altResponse = await fetch('data/log_76.md');
            if (!altResponse.ok) {
              throw new Error("Could not load log from any path");
            }
            const log76Content = await altResponse.text();
            // Parse the markdown (remove frontmatter)
            const contentWithoutFrontmatter = log76Content.replace(/^---\n.*?\n---\n/s, '');
            
            // Set up logs system with the log content
            setSurvivorLogs(prev => ({
              ...prev,
              availableLogs: [
                { day: 76, title: "Digital Entities" }
              ],
              logContent: {
                76: contentWithoutFrontmatter
              }
            }));
          } else {
            const log76Content = await log76Response.text();
            // Parse the markdown (remove frontmatter)
            const contentWithoutFrontmatter = log76Content.replace(/^---\n.*?\n---\n/s, '');
            
            // Set up logs system with the log content
            setSurvivorLogs(prev => ({
              ...prev,
              availableLogs: [
                { day: 76, title: "Digital Entities" }
              ],
              logContent: {
                76: contentWithoutFrontmatter
              }
            }));
          }
        } catch (logError) {
          console.error("Failed to load log 76:", logError);
          // If log loading fails, still set up the log listing
          setSurvivorLogs(prev => ({
            ...prev,
            availableLogs: [
              { day: 76, title: "Digital Entities" }
            ]
          }));
        }
      } catch (error) {
        console.error("Error loading data:", error);
        addToTerminalHistory({ 
          type: 'output', 
          text: 'ERROR: Could not load required data files.' 
        });
      }
    }
    
    loadData();
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
  
  // SIMPLIFIED LOGS SYSTEM
  const showSurvivorLogs = () => {
    addToTerminalHistory({ type: 'input', text: `> logs` });
    
    const sortedLogs = [...survivorLogs.availableLogs].sort((a, b) => a.day - b.day);
    let logsText = `
SURVIVOR LOGS DATABASE
---------------------
Recovered personal logs from SurvivorOS creator
${sortedLogs.length} entries found

AVAILABLE LOGS:
`;
    
    sortedLogs.forEach(log => {
      logsText += `[${log.day}] ${log.title}\n`;
    });
    
    logsText += `
To view a log, type the day number (e.g. "76")
Type "exit" or "back" to return to main terminal
`;
    
    addToTerminalHistory({ 
      type: 'output', 
      text: logsText
    });
    
    setSurvivorLogs(prev => ({
      ...prev,
      active: true,
      viewingLog: null
    }));
    
    setTerminalInput('');
  };
  
  // COMPLETELY REWRITTEN LOG DISPLAY FUNCTION
  const showSpecificLog = (day) => {
    const dayNumber = parseInt(day);
    
    if (isNaN(dayNumber) || !survivorLogs.availableLogs.find(log => log.day === dayNumber)) {
      addToTerminalHistory({ 
        type: 'output', 
        text: `Log for day ${day} not found. Type "logs" to see available logs.`
      });
      setSurvivorLogs(prev => ({
        ...prev,
        active: false,
        viewingLog: null
      }));
      return;
    }
    
    // Simply display the log from state if it exists
    if (survivorLogs.logContent[dayNumber]) {
      addToTerminalHistory({ 
        type: 'output', 
        text: survivorLogs.logContent[dayNumber]
      });
    } else {
      // Log is listed in index but content couldn't be loaded
      addToTerminalHistory({ 
        type: 'output', 
        text: `Log ${dayNumber} could not be loaded. The file may be missing or corrupted.
        
Please contact your terminal administrator or check the developer console for details.`
      });
    }
    
    // Exit logs mode
    setSurvivorLogs(prev => ({
      ...prev,
      active: false,
      viewingLog: null
    }));
  };
  
  const processSurvivorLogsInput = (input) => {
    const command = input.toLowerCase().trim();
    
    if (command === 'exit' || command === 'back' || command === 'cancel') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'Exiting logs database.'
      });
      setSurvivorLogs(prev => ({
        ...prev,
        active: false,
        viewingLog: null
      }));
      return;
    }
    
    showSpecificLog(command);
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
      showSurvivorLogs();
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
logs:     Access recovered survivor logs
ascii:    Display SurvivorOS ASCII art logo

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
      
      if (survivorLogs.active) {
        processSurvivorLogsInput(terminalInput);
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
              
              {bootComplete && !characterCreation.active && !survivorLogs.active && (
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
              
              {bootComplete && survivorLogs.active && (
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