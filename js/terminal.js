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

function renderTerminalLogo(isBooting) {
  return (
    <div>
      <div className={isBooting ? "terminal-logo blink-animation-continuous" : "terminal-logo"}>SurvivorOS©</div>
      <div className="copyright-text">rogueboy override v0.5b | build: srv-2957f5a</div>
    </div>
  );
}

function renderOutput(item, isBooting) {
  if (item.text === 'OVERRIDE ACCEPTED - FULL ACCESS GRANTED') {
    document.body.classList.add('hacked');
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