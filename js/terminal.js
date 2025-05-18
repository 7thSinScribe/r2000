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

// Format text
function formatText(text) {
  text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
  text = text.replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>');
  text = text.replace(/^-\s+(.*?)$/gm, '<li>$1</li>');
  
  let inList = false;
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('<li>') && !inList) {
      lines[i] = '<ul>' + lines[i];
      inList = true;
    } else if (!lines[i].startsWith('<li>') && inList) {
      lines[i-1] = lines[i-1] + '</ul>';
      inList = false;
    }
  }
  if (inList) {
    lines[lines.length-1] = lines[lines.length-1] + '</ul>';
  }
  text = lines.join('\n');
  
  text = text.replace(/\n\n/g, '</p><p>');
  text = '<p>' + text + '</p>';
  text = text.replace(/<p><\/p>/g, '');
  
  return text;
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
  } else if (item.isQuickstart) {
    const sections = item.text.split('\n\n');
    return (
      <div className="quickstart">
        {sections.map((section, index) => {
          const lines = section.split('\n');
          const title = lines[0];
          const content = lines.slice(1).join('\n');
          
          if (lines.length === 1 || title.toUpperCase() === title) {
            return (
              <div key={index} className="mb-3">
                <h2 className="text-lg font-bold" style={{color: '#e0f8cf'}}>{title}</h2>
                {content && <div dangerouslySetInnerHTML={{ __html: formatText(content) }} />}
              </div>
            );
          } else {
            return (
              <div key={index} className="mb-2">
                <div dangerouslySetInnerHTML={{ __html: formatText(section) }} />
              </div>
            );
          }
        })}
      </div>
    );
  } else {
    if (item.text.startsWith('\n') && !item.text.includes('<p>')) {
      return <pre style={{whiteSpace: 'pre-wrap'}}>{item.text}</pre>;
    } else {
      let formattedText = formatText(item.text);
      return <div className="formatted-text" dangerouslySetInnerHTML={{ __html: formattedText }} />;
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