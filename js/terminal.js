
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
      <div className="terminal-logo">SurvivorOS©</div>
      <div className="copyright-text">rogueboy override v0.5b | build: srv-2957f5a</div>
    </div>
  );
}

// Enhanced markdown formatting function
function formatMarkdown(text, className = "") {

  let formattedText = text;

  formattedText = formattedText.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, language, code) => {
    return `<pre class="code-block ${language}"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });
  

  formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
  

  formattedText = formattedText
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  

  formattedText = formattedText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  formattedText = formattedText
    .replace(/^>>> (.*?)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

  const paragraphs = formattedText.split(/\n\n+/);
  

  const processedParagraphs = paragraphs.map(para => {

    if (para.match(/<(h1|h2|h3|pre|blockquote)[^>]*>/)) return para;
    
    if (para.match(/^- .+(\n- .+)*$/)) {
      const items = para.split('\n').map(line => {
        if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        return line;
      }).join('');
      return `<ul>${items}</ul>`;
    }
    

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
    

    if (/^[A-Z][A-Z\s]+[A-Z]$/.test(para)) {
      return `<h2>${para}</h2>`;
    }
    

    return `<p>${para}</p>`;
  });
  

  const finalText = processedParagraphs.join('');
  
  return <div dangerouslySetInnerHTML={{ __html: finalText }} className={`markdown-content ${className}`} />;
}


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