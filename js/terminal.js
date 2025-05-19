// terminal.js - simplified font transition
// ASCII art for the logo
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

// Output rendering with simple font transition
function renderOutput(item) {
  // Check if this is the message that triggers the transition
  if (item.text === 'OVERRIDE ACCEPTED - FULL ACCESS GRANTED') {
    // Trigger the font transition
    document.body.classList.add('font-transitioned');
    return <pre className="access-granted-message">{item.text}</pre>;
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
          className={`terminal-${item.contentType} markdown-content`}
          dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
        />
      );
    } else {
      // Fallback if marked isn't loaded yet
      return <pre className={`terminal-${item.contentType}`}>{item.text}</pre>;
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
          className="terminal-output markdown-content"
          dangerouslySetInnerHTML={{ __html: marked.parse(item.text) }}
        />
      );
    }
    
    // Otherwise, display as plain text
    return <pre className="terminal-output">{item.text}</pre>;
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