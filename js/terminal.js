// terminal.js with simple markdown processing

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

// Terminal logo component
function renderTerminalLogo() {
  return (
    <div>
      <div className="terminal-logo blink-animation">SurvivorOS©</div>
      <div className="copyright-text">rogueboy override v0.5b | build: srv-2957f5a</div>
    </div>
  );
}

// Simple markdown processing
function processMarkdown(text) {
  if (!text) return '';
  
  // Split text into paragraphs
  const paragraphs = text.split(/\n\n+/);
  
  return paragraphs.map((para, index) => {
    // Skip empty paragraphs
    if (!para.trim()) return null;
    
    // Process headers
    if (para.startsWith('# ')) {
      return <h1 key={index}>{para.substring(2)}</h1>;
    }
    if (para.startsWith('## ')) {
      return <h2 key={index}>{para.substring(3)}</h2>;
    }
    if (para.startsWith('### ')) {
      return <h3 key={index}>{para.substring(4)}</h3>;
    }
    
    // Process lists
    if (para.match(/^[*-] /m)) {
      const items = para.split(/\n/).filter(item => item.trim().startsWith('- ') || item.trim().startsWith('* '));
      return (
        <ul key={index}>
          {items.map((item, i) => (
            <li key={i}>{item.substring(2)}</li>
          ))}
        </ul>
      );
    }
    
    // Process blockquotes
    if (para.startsWith('> ')) {
      return <blockquote key={index}>{para.substring(2)}</blockquote>;
    }
    
    // Process code blocks
    if (para.startsWith('```')) {
      const endCodeBlock = para.indexOf('```', 3);
      if (endCodeBlock !== -1) {
        const code = para.substring(para.indexOf('\n', 3) + 1, endCodeBlock);
        return <pre key={index} className="code-block"><code>{code}</code></pre>;
      }
    }
    
    // Regular paragraph
    // Process inline formatting like bold, italic, code
    let processedPara = para;
    
    // Bold
    processedPara = processedPara.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    processedPara = processedPara.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Inline code
    processedPara = processedPara.replace(/`(.*?)`/g, '<code>$1</code>');
    
    return <p key={index} dangerouslySetInnerHTML={{ __html: processedPara }} />;
  }).filter(Boolean); // Remove null entries
}

// Output rendering with markdown processing
function renderOutput(item) {
  if (item.isTerminalLogo) {
    return renderTerminalLogo();
  } else if (item.isLogo) {
    return (
      <div className={item.shouldBlink ? "blink-animation" : ""}>
        <pre>{item.text}</pre>
      </div>
    );
  } else if (item.contentType === 'quickstart' || item.contentType === 'log') {
    // Process markdown for quickstart and log content
    return <div className={`terminal-${item.contentType}`}>{processMarkdown(item.text)}</div>;
  } else {
    // For regular terminal output, detect if it might contain markdown
    if (item.text && (
      item.text.includes('#') || 
      item.text.includes('*') || 
      item.text.includes('- ') || 
      item.text.includes('> ')
    )) {
      return <div className="terminal-output">{processMarkdown(item.text)}</div>;
    }
    
    // Otherwise, display as plain text
    return <pre>{item.text}</pre>;
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