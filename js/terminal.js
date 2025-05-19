const survivorAsciiLogo = [
  "███████╗██╗   ██╗██████╗ ██╗   ██╗██╗██╗   ██╗ ██████╗ ██████╗      ██████╗ ███████╗",
  "██╔════╝██║   ██║██╔══██╗██║   ██║██║██║   ██║██╔═══██╗██╔══██╗    ██╔═══██╗██╔════╝",
  "███████╗██║   ██║██████╔╝██║   ██║██║██║   ██║██║   ██║██████╔╝    ██║   ██║███████╗",
  "╚════██║██║   ██║██╔══██╗╚██╗ ██╔╝██║╚██╗ ██╔╝██║   ██║██╔══██╗    ██║   ██║╚════██║",
  "███████║╚██████╔╝██║  ██║ ╚████╔╝ ██║ ╚████╔╝ ╚██████╔╝██║  ██║    ╚██████╔╝███████║",
  "╚══════╝ ╚═════╝ ╚═╝  ╚═╝  ╚═══╝  ╚═╝  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝     ╚═════╝ ╚══════╝",
  "                                                                                     ",
  "                   terminal v0.5b | build: srv-2957f5a                              "
];

if (typeof marked !== 'undefined') {
  marked.setOptions({
    gfm: true,
    breaks: true,
    pedantic: false,
    headerIds: true,
    mangle: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  });
}

const logoStates = {
  BOOTING: 'booting',
  GLITCHING: 'glitching',
  COMPLETE: 'complete'
};

let currentGlitchState = {
  state: logoStates.BOOTING,
  glitchTimer: null,
  glitchCount: 0,
  maxGlitches: 3
};

function renderTerminalLogo(isBooting) {
  if (isBooting && !currentGlitchState.glitchTimer && Math.random() < 0.3) {
    currentGlitchState.state = logoStates.GLITCHING;
    startLogoGlitchSequence();
  }
  
  if (!isBooting && currentGlitchState.state !== logoStates.COMPLETE) {
    currentGlitchState.state = logoStates.COMPLETE;
    if (currentGlitchState.glitchTimer) {
      clearInterval(currentGlitchState.glitchTimer);
      currentGlitchState.glitchTimer = null;
    }
  }
  
  let logoClass = "terminal-logo";
  let logoContent = "";
  let copyrightText = "";
  
  switch(currentGlitchState.state) {
    case logoStates.BOOTING:
      logoClass += " booting blink-animation-continuous";
      logoContent = "Rogueboy";
      copyrightText = <span>rogueboy<span className="trademark">™</span> 2000 | n-co proprietary technology</span>;
      break;
      
    case logoStates.GLITCHING:
      const glitchRandom = Math.random();
      logoClass += " glitching";
      
      if (glitchRandom < 0.7) {
        logoContent = "Rogueboy";
        copyrightText = <span>rogueboy<span className="trademark">™</span> 2000 | n-co proprietary technology</span>;
        
        if (Math.random() < 0.5) {
          logoClass += " glitch-text";
        }
      } else {
        logoContent = "Survivor OS";
        copyrightText = "rogueboy override v0.5b | build: srv-2957f5a";
        
        if (Math.random() < 0.5) {
          logoClass += " glitch-text";
        }
      }
      break;
      
    case logoStates.COMPLETE:
      logoContent = "Survivor OS";
      copyrightText = "rogueboy override v0.5b | build: srv-2957f5a";
      break;
  }
  
  return (
    <div className="terminal-logo-container">
      <div className={logoClass} data-text={logoContent}>{logoContent}</div>
      <div 
        className={currentGlitchState.state === logoStates.GLITCHING ? "copyright-text glitch-text" : "copyright-text"}
        data-text={typeof copyrightText === 'string' ? copyrightText : 'rogueboy override v0.5b'}
      >
        {copyrightText}
      </div>
      
      {currentGlitchState.state === logoStates.GLITCHING && Math.random() < 0.3 && (
        <div className="artifact h-line" style={{ top: `${Math.random() * 100}%` }}></div>
      )}
      
      {currentGlitchState.state === logoStates.GLITCHING && Math.random() < 0.3 && (
        <div className="artifact v-line" style={{ left: `${Math.random() * 100}%` }}></div>
      )}
    </div>
  );
}

function startLogoGlitchSequence() {
  const rapidGlitchInterval = setInterval(() => {
    const logoElement = document.querySelector('.terminal-logo');
    if (logoElement) {
      logoElement.classList.toggle('force-update');
      
      if (Math.random() < 0.4) {
        const staticEl = document.createElement('div');
        staticEl.className = 'glitch-static';
        staticEl.style.position = 'absolute';
        staticEl.style.width = `${Math.random() * 50 + 20}px`;
        staticEl.style.height = `${Math.random() * 10 + 2}px`;
        staticEl.style.backgroundColor = Math.random() > 0.5 ? '#86c06c' : '#e0f8cf';
        staticEl.style.opacity = '0.7';
        staticEl.style.left = `${Math.random() * 100}%`;
        staticEl.style.top = `${Math.random() * 100}%`;
        staticEl.style.zIndex = '10';
        
        const container = document.querySelector('.terminal-logo-container');
        if (container) {
          container.appendChild(staticEl);
          setTimeout(() => {
            if (staticEl.parentNode) {
              staticEl.parentNode.removeChild(staticEl);
            }
          }, 300);
        }
      }
    }
    
    currentGlitchState.glitchCount++;
    
    if (currentGlitchState.glitchCount >= 5) {
      clearInterval(rapidGlitchInterval);
      
      if (Math.random() < 0.5) {
        const screenGlitch = document.createElement('div');
        screenGlitch.className = 'screen-glitch';
        screenGlitch.style.position = 'fixed';
        screenGlitch.style.top = '0';
        screenGlitch.style.left = '0';
        screenGlitch.style.width = '100%';
        screenGlitch.style.height = '100%';
        screenGlitch.style.backgroundColor = 'transparent';
        screenGlitch.style.zIndex = '1000';
        screenGlitch.style.pointerEvents = 'none';
        
        const xShift = Math.random() * 10 - 5 + 'px';
        const yShift = Math.random() * 6 - 3 + 'px';
        screenGlitch.style.transform = `translate(${xShift}, ${yShift})`;
        
        document.body.appendChild(screenGlitch);
        
        setTimeout(() => {
          if (screenGlitch.parentNode) {
            screenGlitch.parentNode.removeChild(screenGlitch);
          }
        }, 150);
      }
      
      setTimeout(() => {
        if (currentGlitchState.state === logoStates.GLITCHING) {
          currentGlitchState.state = logoStates.BOOTING;
        }
        currentGlitchState.glitchCount = 0;
        currentGlitchState.glitchTimer = null;
      }, 200);
    }
  }, 150);
  
  currentGlitchState.glitchTimer = rapidGlitchInterval;
}

function renderOutput(item, isBooting) {
  if (item.text === 'OVERRIDE ACCEPTED - FULL ACCESS GRANTED') {
    document.body.classList.add('hacked');
    currentGlitchState.state = logoStates.COMPLETE;
    return <pre className="access-granted">{item.text}</pre>;
  }
  
  if (item.isTerminalLogo) {
    return renderTerminalLogo(isBooting);
  } else if (item.isLogo) {
    return (
      <div className={item.shouldBlink ? "blink-animation" : ""}>
        <pre>{item.text}</pre>
      </div>
    );
  } else if (item.contentType === 'quickstart' || item.contentType === 'log') {
    if (typeof marked !== 'undefined' && item.text) {
      return (
        <div 
          className={`terminal-${item.contentType} markdown-content`}
          dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
        />
      );
    } else {
      return <pre className={`terminal-${item.contentType}`}>{item.text}</pre>;
    }
  } else {
    if (typeof marked !== 'undefined' && item.text && (
      item.text.includes('#') || 
      item.text.includes('*') || 
      item.text.includes('- ') ||
      item.text.includes('```') ||
      item.text.includes('> ')
    )) {
      return (
        <div 
          className="terminal-output markdown-content"
          dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
        />
      );
    }
    
    return <pre className="terminal-output">{item.text}</pre>;
  }
}

function renderRandomGlitch() {
  const shouldShow = Math.random() < 0.015;
  if (!shouldShow) return null;
  
  const glitchStyle = {
    position: 'absolute',
    height: `${Math.random() * 20}px`,
    width: `${Math.random() * 200 + 50}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    backgroundColor: Math.random() > 0.5 ? '#86c06c' : '#e0f8cf',
    opacity: 0.7,
    zIndex: 12,
    animation: 'glitch-animation 0.3s forwards'
  };
  
  return <div style={glitchStyle} className="glitch"></div>;
}