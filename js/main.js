const { useState, useEffect, useRef } = React;

const SurvivorOSTerminal = () => {
  const [bootComplete, setBootComplete] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [blinkCursor, setBlinkCursor] = useState(true);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  
  const [inMerchNet, setInMerchNet] = useState(false);
  const [merchNetItemsList, setMerchNetItemsList] = useState([]);
  const [selectedMerchNetIndex, setSelectedMerchNetIndex] = useState(0);
  const [merchNetWatts, setMerchNetWatts] = useState(1000);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [lastSelectedItem, setLastSelectedItem] = useState("");
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [navMode, setNavMode] = useState(false);
  
  const [characterCreation, setCharacterCreation] = useState({
    active: false,
    currentQuestion: 0,
    attributes: { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 },
    items: [],
    background: null,
    name: "",
    completed: false,
    pointsAllocated: 5,
    pointsRemaining: 10
  });
  
  const [quickStartContent, setQuickStartContent] = useState("");
  const [logsCache, setLogsCache] = useState({});
  const availableLogs = [76, 55];

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

  useEffect(() => {
    if (bootComplete && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [bootComplete, terminalHistory]);

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

  useEffect(() => {
    if (!inMerchNet || !navMode) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && selectedMerchNetIndex > 0) {
        setSelectedMerchNetIndex(prev => prev - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && selectedMerchNetIndex < merchNetItemsList.length - 1) {
        setSelectedMerchNetIndex(prev => prev + 1);
        e.preventDefault();
      } else if (e.key === 'Enter' && merchNetItemsList.length > 0) {
        const selectedItem = merchNetItemsList[selectedMerchNetIndex];
        const lookupCommand = `lookup "${selectedItem.name}"`;
        processMerchNetCommand(lookupCommand);
        setNavMode(false);
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setNavMode(false);
        e.preventDefault();
      } else if (e.key === 'Backspace' && browsingHistory.length > 0) {
        const prevState = browsingHistory[browsingHistory.length - 1];
        setMerchNetItemsList(prevState.items || []);
        setBrowsingHistory(prev => prev.slice(0, -1));
        e.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inMerchNet, navMode, selectedMerchNetIndex, merchNetItemsList, browsingHistory]);

  useEffect(() => {
    if (inMerchNet && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inMerchNet, terminalInput]);

  const handleTerminalInput = (e) => {
    setTerminalInput(e.target.value);
  };

  const handleTerminalKeyPress = (e) => {
    if (e.key === 'Enter') {
      const inputValue = terminalInput;
      setTerminalInput('');
      
      if (characterCreation.active) {
        processCharacterCreationAnswer(inputValue);
        return;
      }
      
      if (inMerchNet) {
        processMerchNetCommand(inputValue);
        return;
      }
      
      processCommand(inputValue);
    }
  };

  const processMerchNetCommand = (command) => {
    addToTerminalHistory({ type: 'input', text: `MERCHNET> ${command}` });
    
    if (command.toLowerCase() === 'exit') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'Exiting MerchNet terminal. Thank you for your patronage.'
      });
      setInMerchNet(false);
      setMerchNetItemsList([]);
      setBrowsingHistory([]);
      return;
    }
    
    if (window.processMerchnetCommand) {
      const result = window.processMerchnetCommand(command);
      
      if (result.type === 'items') {
        if (result.items && Array.isArray(result.items)) {
          if (merchNetItemsList.length > 0) {
            setBrowsingHistory(prev => [...prev, { 
              items: merchNetItemsList,
              selectedIndex: selectedMerchNetIndex
            }]);
          }
          
          setMerchNetItemsList(result.items);
          setSelectedMerchNetIndex(0);
          setNavMode(true);
          if (inputRef.current) {
            inputRef.current.blur();
          }
        }
      } else if (result.type === 'order') {
        setAwaitingPayment(true);
        setPaymentAmount(result.total || 0);
      } else if (result.type === 'success' && result.orderItems) {
        setAwaitingPayment(false);
      }
      
      addToTerminalHistory({ 
        type: 'output', 
        text: result.message || "Command processed."
      });

      if (terminalRef.current) {
        setTimeout(() => {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }, 50);
      }
    } else {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'ERROR: MerchNet module not found. Please update SurvivorOS.'
      });
    }
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
        contentType: 'quickstart'
      });
    }, 500);
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
  };

  const startCharacterCreation = () => {
    addToTerminalHistory({ type: 'input', text: `> whoami` });
    
    addToTerminalHistory({ 
      type: 'output', 
      text: 'IDENTITY PROTOCOL ACTIVATED\n\nNearly 13,000 Saturdays since the collapse. You\'ve survived somehow, but who are you?\n\nANSWER THE QUESTIONS BELOW TO DETERMINE YOUR IDENTITY.\n\nType the number of your answer and press ENTER. Type "cancel" to abort.'
    });
    
    setCharacterCreation({
      active: true,
      currentQuestion: 0,
      attributes: { power: 1, oddity: 1, wisdom: 1, endurance: 1, reflex: 1 },
      items: [],
      background: null,
      name: "",
      completed: false,
      pointsAllocated: 5, 
      pointsRemaining: 10  
    });
    
    displayCurrentQuestion(0);
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
      questionText += `${index + 1} ${option.text}\n`;
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
        
        const totalPoints = Object.values(characterCreation.attributes).reduce((sum, val) => sum + val, 0);
        
        if (totalPoints !== 15) {
          console.error(`Point total ${totalPoints} !== 15. Character creation error.`);
        }
        
        const characterSheet = generateCharacterSheet(
          name, 
          characterCreation.attributes, 
          characterCreation.items,
          characterCreation.background || { title: "UNKNOWN", description: "Your past is a blur, forgotten in the chaos of the digital apocalypse." }
        );
        
        setCharacterCreation({
          ...characterCreation,
          name: name,
          active: false,
          completed: true
        });
        
        addToTerminalHistory({ 
          type: 'output', 
          text: characterSheet,
          isCharacterSheet: true
        });
        
        setTimeout(() => {
          addToTerminalHistory({
            type: 'output',
            text: 'TIP: You can copy and paste your character sheet to a text editor to save it for your game.'
          });
        }, 1000);
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
    let updatedBackground = characterCreation.background;
    
    if (selectedOption.primaryAttributes) {
      updatedAttributes = distributeMultipleAttributes(
        updatedAttributes,
        selectedOption.primaryAttributes
      );
    } else if (selectedOption.primaryAttribute) {
      const pointsToAdd = selectedOption.multiplePoints || 1;
      updatedAttributes = distributeAttributePoints(
        updatedAttributes,
        selectedOption.primaryAttribute,
        selectedOption.fallbackOrder,
        pointsToAdd
      );
    }
    
    if (selectedOption.item && !updatedItems.includes(selectedOption.item)) {
      updatedItems.push(selectedOption.item);
    }
    
    if (selectedOption.background) {
      updatedBackground = {
        title: selectedOption.background,
        description: selectedOption.backgroundDesc
      };
    }
    
    const totalPoints = Object.values(updatedAttributes).reduce((sum, val) => sum + val, 0);
    
    setCharacterCreation({
      ...characterCreation,
      currentQuestion: questionIndex + 1,
      attributes: updatedAttributes,
      items: updatedItems,
      background: updatedBackground,
      pointsAllocated: totalPoints,
      pointsRemaining: 15 - totalPoints
    });
    
    setTimeout(() => displayCurrentQuestion(questionIndex + 1), 500);
  };

  const processCommand = (cmd) => {
    const command = cmd.toLowerCase().trim();
    
    if (command === '') {
      addToTerminalHistory({ type: 'input', text: '>' });
      return;
    }
    
    addToTerminalHistory({ type: 'input', text: `> ${command}` });
    
    if (command === 'merchnet') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'CONNECTING TO MERCHNET...'
      });
      
      setTimeout(() => {
        if (window.processMerchnetCommand) {
          setInMerchNet(true);
          setBrowsingHistory([]);
          setMerchNetItemsList([]);
          
          addToTerminalHistory({ 
            type: 'output', 
            text: 'MERCHNET TERMINAL v4.0\n--------------------\n\nWelcome to MerchNet, your source for survivor supplies.\nType "help" for available commands or "exit" to return to SurvivorOS.\n\nYour balance: 1000 Watts\n'
          });
        } else {
          addToTerminalHistory({ 
            type: 'output', 
            text: 'ERROR: MerchNet module not found. Please update SurvivorOS.'
          });
        }
      }, 500);
      
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
    
    if (command === 'wyrm') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'LAUNCHING WYRM v1.0\n\nUse arrow keys to control the wyrm.\nCollect food to grow.\nAvoid walls and yourself.\nPress ESC to quit.\n\nLoading game...'
      });
      
      const gameOutputItem = { 
        type: 'output', 
        text: '', 
        isWyrmGame: true 
      };
      
      addToTerminalHistory(gameOutputItem);
      
      setTimeout(() => {
        const outputElements = terminalRef.current.querySelectorAll('.terminal-output');
        const gameElement = Array.from(outputElements).find(el => el.textContent === '');
        
        if (gameElement && window.startWyrmGame) {
          window.startWyrmGame(gameElement);
          gameElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      
      return;
    }
    
    if (command === 'outofblood') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'CRITICAL ERROR: BLOOD LEVEL ZERO\nVITAL FUNCTIONS COMPROMISED\nSYSTEM SHUTDOWN IMMINENT...'
      });
      
      const vignette = document.createElement('div');
      vignette.className = 'blood-loss-vignette';
      document.body.appendChild(vignette);
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const artifact = document.createElement('div');
          artifact.className = 'artifact h-line';
          artifact.style.position = 'fixed';
          artifact.style.height = '2px';
          artifact.style.width = '100%';
          artifact.style.left = '0';
          artifact.style.top = `${Math.random() * 100}%`;
          artifact.style.backgroundColor = '#86c06c';
          artifact.style.opacity = '0.7';
          artifact.style.zIndex = '9998';
          
          document.body.appendChild(artifact);
          
          setTimeout(() => {
            if (artifact.parentNode) {
              artifact.parentNode.removeChild(artifact);
            }
          }, 300);
        }, 800 + i * 300);
      }
      
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const terminalContainer = document.querySelector('.crt-screen');
          if (terminalContainer) {
            terminalContainer.classList.add('screen-glitch');
            setTimeout(() => {
              terminalContainer.classList.remove('screen-glitch');
            }, 150);
          }
        }, 500 + i * 300);
      }
      
      setTimeout(() => {
        window.handleOutOfBlood();
      }, 2000);
      
      return;
    }
    
    if (command === 'catalogue' || command === 'catalogue list') {
      addToTerminalHistory({ 
        type: 'output', 
        text: 'LOADING ENTITY DATABASE...'
      });
      
      setTimeout(() => {
        addToTerminalHistory({ 
          type: 'output', 
          text: listCatalogueEntities()
        });
      }, 500);
      return;
    }
    
    if (command.startsWith('catalogue view ')) {
      const entityId = command.split('catalogue view ')[1].trim();
      
      addToTerminalHistory({ 
        type: 'output', 
        text: `LOADING ENTITY #${entityId}...`
      });
      
      setTimeout(() => {
        const entity = catalogueEntities.find(e => e.id === entityId);
        if (entity) {
          addToTerminalHistory({ 
            type: 'output', 
            text: renderEntityCard(entity)
          });
        } else {
          addToTerminalHistory({ 
            type: 'output', 
            text: `ERROR: Entity #${entityId} not found in database.`
          });
        }
      }, 500);
      return;
    }
    
    if (command.startsWith('catalogue search ')) {
      const searchTerm = command.split('catalogue search ')[1].trim();
      
      addToTerminalHistory({ 
        type: 'output', 
        text: `SEARCHING DATABASE FOR "${searchTerm}"...`
      });
      
      setTimeout(() => {
        addToTerminalHistory({ 
          type: 'output', 
          text: listCatalogueEntities(searchTerm)
        });
      }, 500);
      return;
    }
    
    if (command === 'clear') {
      clearTerminal();
      return;
    }
    
    let response = '';
    
    if (command === 'help') {
      response = `
SURVIVOROS TERMINAL COMMANDS:
----------------------------

help:       Display this help message
clear:      Clear terminal
about:      About SurvivorOS
quickstart: Display Rogue 2000 game information
whoami:     Run survivor identity questionnaire
ascii:      Display SurvivorOS ASCII art logo
catalogue:  Access entity database
logs:       List available survivor logs
log [#]:    Display specific log entry
wyrm:       Play Wyrm snake game
merchnet:   Access survivor marketplace

For survivors in the zones: Type what you learn out there.
Stay safe. Share knowledge. Survive.`;
    } 
    else if (command === 'about') {
      response = `SurvivorOS v0.5b [BUILD: SRV-2957f5a]
A community-developed operating system for Rogueboy 2000 devices
`;
    }
    else if (command === 'logs') {
      response = `AVAILABLE LOGS:\n\n${availableLogs.map(logNum => `- Log #${logNum}`).join('\n')}\n\nType 'log [number]' to view a specific log.`;
    } 
    else if (command.startsWith('log ')) {
      const logNumber = parseInt(command.split('log ')[1], 10);
      
      if (isNaN(logNumber)) {
        response = "Invalid log number. Type 'logs' to see available logs.";
      } else {
        addToTerminalHistory({ type: 'output', text: `Accessing log #${logNumber}...` });
        
        const loadLog = async (logNum) => {
          if (logsCache[logNum]) {
            return logsCache[logNum];
          }
          
          try {
            const logResponse = await fetch(`data/log${logNum}.md`);
            if (!logResponse.ok) {
              throw new Error(`Log ${logNum} not found.`);
            }
            const logContent = await logResponse.text();
            
            setLogsCache(prev => ({
              ...prev,
              [logNum]: logContent
            }));
            
            return logContent;
          } catch (error) {
            console.error(`Error loading log ${logNum}:`, error);
            return null;
          }
        };
        
        loadLog(logNumber).then(logContent => {
          if (logContent) {
            addToTerminalHistory({ 
              type: 'output', 
              text: logContent,
              contentType: 'log'
            });
          } else {
            addToTerminalHistory({ 
              type: 'output', 
              text: `ERROR: Log #${logNumber} not found or could not be loaded.`
            });
          }
        });
        
        return;
      }
    }
    else {
      response = `Command not recognized: '${command}'
Type 'help' for available commands.`;
    }
    
    if (response) {
      addToTerminalHistory({ type: 'output', text: response });
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden p-8 bg-black">
      <div className="crt-frame h-full">
        <div className="crt-screen h-full">
          <div className="terminal-container h-full flex flex-col">
            <div className="terminal-header p-2 text-sm flex justify-between">
              <span>survivoros v0.5b | build: srv-2957f5a</span>
              <span>{bootComplete ? (inMerchNet ? "MERCHNET" : "READY") : "BOOTING..."}</span>
            </div>
            
            <div 
              className="terminal-content flex-1 overflow-auto p-4 font-mono text-sm"
              ref={terminalRef}
              style={{ height: 'calc(100% - 64px)' }}
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
              
              {inMerchNet && merchNetItemsList.length > 0 && navMode && (
                <div className="mb-4 mt-2">
                  {merchNetItemsList.map((item, index) => (
                    <div 
                      key={index} 
                      className={`py-1 px-2 ${selectedMerchNetIndex === index ? 'bg-gray-700 text-white' : ''}`}
                      style={{backgroundColor: selectedMerchNetIndex === index ? '#306850' : 'transparent'}}
                    >
                      {item.name} - {item.cost} W - {item.rarity} - {item.state}
                    </div>
                  ))}
                  <div className="mt-2 text-sm text-green-200">
                    Use arrow keys to navigate, ENTER to select, ESC to exit navigation, BACKSPACE to go back
                  </div>
                </div>
              )}
            </div>
            
            <div className="terminal-input-container p-2 border-t border-green-700 bg-gray-900 bg-opacity-50">
              {bootComplete && !characterCreation.active && !inMerchNet && (
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
                    ref={inputRef}
                  />
                  <span className={blinkCursor ? 'opacity-100' : 'opacity-0'}>_</span>
                </div>
              )}
              
              {bootComplete && !characterCreation.active && inMerchNet && (
                <div className="flex command-input">
                  <span>{'MERCHNET>'}</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={handleTerminalInput}
                    onKeyPress={handleTerminalKeyPress}
                    className="flex-1 bg-transparent outline-none border-none ml-1"
                    style={{color: '#e0f8cf'}}
                    autoFocus={!navMode}
                    ref={inputRef}
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
                    ref={inputRef}
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