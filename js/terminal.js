// Updated terminal.js with improved markdown rendering and logo

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

// terminal logo - updated to match with custom font changes
function renderTerminalLogo() {
  return (
    <div>
      <div className="terminal-logo blink-animation">SurvivorOS©</div>
      <div className="copyright-text">rogueboy override v0.5b | build: srv-2957f5a</div>
    </div>
  );
}

// Enhanced markdown formatting function
function formatMarkdown(text, className = "") {
  // First, handle code blocks with triple backticks
  let formattedText = text;
  
  // Process code blocks (triple backticks)
  formattedText = formattedText.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, language, code) => {
    return `<pre class="code-block ${language}"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });
  
  // Process inline code
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Process headers
  formattedText = formattedText
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Process emphasis
  formattedText = formattedText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Process blockquotes
  formattedText = formattedText
    .replace(/^>>> (.*?)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
  
  // Split into paragraphs
  const paragraphs = formattedText.split(/\n\n+/);
  
  // Process each paragraph
  const processedParagraphs = paragraphs.map(para => {
    // Skip if already contains HTML
    if (para.match(/<(h1|h2|h3|pre|blockquote)[^>]*>/)) return para;
    
    // Handle unordered lists
    if (para.match(/^- .+(\n- .+)*$/)) {
      const items = para.split('\n').map(line => {
        if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        return line;
      }).join('');
      return `<ul>${items}</ul>`;
    }
    
    // Handle ordered lists
    if (para.match(/^\d+\. .+(\n\d+\. .+)*$/)) {
      const items = para.split('\n').map(line => {
        const match = line.match(/^\d+\. (.+)/);
        if (match) {
          return `<li>${match[1]}</li>`;
        }
        return line;
      }).join('');
      return `<ol>${items}</ol>`;
    }
    
    // Look for all caps headers and make them h2
    if (/^[A-Z][A-Z\s]+[A-Z]$/.test(para)) {
      return `<h2>${para}</h2>`;
    }
    
    // Default to paragraph
    return `<p>${para}</p>`;
  });
  
  // Join processed paragraphs
  const finalText = processedParagraphs.join('');
  
  return <div dangerouslySetInnerHTML={{ __html: finalText }} className={`markdown-content ${className}`} />;
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
  } else if (item.contentType === 'quickstart' || item.contentType === 'log') {
    // Use the same formatting for both quickstart and logs
    return formatMarkdown(item.text, "terminal-markdown");
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