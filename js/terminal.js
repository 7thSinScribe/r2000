// Updated terminal.js with simplified rendering

// ASCII art 
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

// terminal logo
function renderTerminalLogo() {
  return (
    <div>
      <div className="terminal-logo blink-animation">SurvivorOS©</div>
      <div className="copyright-text">rogueboy override v0.5b | build: srv-2957f5a</div>
    </div>
  );
}

// Format markdown text
function formatMarkdown(text, className = "") {
  // Process the markdown text
  const formattedText = text
    // Process headers
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    
    // Process emphasis
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Process lists
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    
    // Process blockquotes
    .replace(/^>>> (.*?)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
    
    // Convert line breaks to paragraphs
    .split('\n\n')
    .map(para => {
      // If paragraph already contains HTML tags, return as is
      if (para.match(/<[^>]*>/)) return para;
      
      // Handle lists
      if (para.includes('<li>')) {
        return `<ul>${para}</ul>`;
      }
      
      // Look for all caps headers (like in quickstart) and make them h2
      if (/^[A-Z][A-Z\s]+[A-Z]$/.test(para)) {
        return `<h2>${para}</h2>`;
      }
      
      return `<p>${para}</p>`;
    })
    .join('');
  
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} className={`markdown-content ${className}`} />;
}

// Render output with appropriate formatting
function renderOutput(item) {
  if (item.isTerminalLogo) {
    return renderTerminalLogo();
  } else if (item.isLogo) {
    return (
      <div className={item.shouldBlink ? "blink-animation" : ""} style={{color: '#e0f8cf'}}>
        <pre>{item.text}</pre>
      </div>
    );
  } else if (item.contentType === 'quickstart') {
    return formatMarkdown(item.text, "quickstart-content");
  } else if (item.contentType === 'log') {
    return formatMarkdown(item.text, "log-content");
  } else {
    if (item.text.startsWith('\n') && !item.text.includes('<p>')) {
      return <pre style={{whiteSpace: 'pre-wrap'}}>{item.text}</pre>;
    } else {
      return formatMarkdown(item.text);
    }
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