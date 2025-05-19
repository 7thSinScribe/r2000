// Add a glitchy font transition effect to terminal.js

// Modified terminal.js with font transition effect
// Place at the beginning of the file, before any other code

// Font transition effect variables
let fontTransitionComplete = false;
let bootMessagesComplete = false;

// Define our ASCII art and other constants
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

// Initialize marked with the settings we want
if (typeof marked !== 'undefined') {
  marked.setOptions({
    gfm: true,                // GitHub Flavored Markdown
    breaks: true,             // Add <br> on a single line break
    pedantic: false,          // Don't be overly conformant to markdown spec
    headerIds: true,          // Generate IDs for headers
    mangle: false,            // Don't escape HTML
    smartLists: true,         // Use smarter list behavior
    smartypants: false,       // Don't use "smart" typographic punctuation
    xhtml: false              // Don't use XHTML style closing tags for singleton elements
  });
}

// Terminal logo component
function renderTerminalLogo() {
  return (
    <div>
      <div className="terminal-logo blink-animation">SurvivorOS©</div>
      <div className="copyright-text">rogueboy override v0.5b | build: srv-2957f5a</div>
    </div>
  );
}

// Output rendering with markdown processing and font transition effect
function renderOutput(item) {
  // Apply a specific class for boot sequence messages
  let outputClassName = '';
  
  if (!fontTransitionComplete && item.type === 'output' && 
      !item.isTerminalLogo && !item.isLogo && 
      (item.text.includes('INITIALIZING') || 
       item.text.includes('BYPASSING') || 
       item.text.includes('HYPERNET') || 
       item.text.includes('PATCHING') ||
       item.text.includes('OVERRIDING') ||
       item.text.includes('WARNING'))) {
    outputClassName = 'boot-message';
  } else if (item.text === 'OVERRIDE ACCEPTED - FULL ACCESS GRANTED') {
    outputClassName = 'access-granted-message';
    
    // Trigger the transition only once
    if (!fontTransitionComplete) {
      fontTransitionComplete = true;
      
      // Add the transitioned class to body after a delay to trigger the CSS animation
      setTimeout(() => {
        document.body.classList.add('font-transitioned');
      }, 500);
    }
  } else if (fontTransitionComplete && !item.isTerminalLogo && !item.isLogo) {
    outputClassName = 'hacked-terminal-message';
  }
  
  if (item.isTerminalLogo) {
    return renderTerminalLogo();
  } else if (item.isLogo) {
    return (
      <div className={item.shouldBlink ? "blink-animation" : ""}>
        <pre>{item.text}</pre>
      </div>
    );
  } else if (item.contentType === 'quickstart' || item.contentType === 'log') {
    // Use marked.js to properly render markdown content
    if (typeof marked !== 'undefined' && item.text) {
      return (
        <div 
          className={`terminal-${item.contentType} markdown-content ${outputClassName}`}
          dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
        />
      );
    } else {
      // Fallback if marked isn't loaded yet
      return <pre className={`terminal-${item.contentType} ${outputClassName}`}>{item.text}</pre>;
    }
  } else {
    // For regular output, check if it might be markdown content
    if (typeof marked !== 'undefined' && item.text && (
      item.text.includes('#') || 
      item.text.includes('*') || 
      item.text.includes('- ') ||
      item.text.includes('```') ||
      item.text.includes('> ')
    )) {
      return (
        <div 
          className={`terminal-output markdown-content ${outputClassName}`}
          dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
        />
      );
    }
    
    // Otherwise, display as plain text
    return <pre className={`terminal-output ${outputClassName}`}>{item.text}</pre>;
  }
}

// Generate random glitch effect
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