function createGlitchArtifacts(container, subtle = false) {

  const numArtifacts = subtle ? 10 : 25;
  const numStaticEffects = subtle ? 7 : 18;
  

  for (let i = 0; i < numArtifacts; i++) {
    setTimeout(() => {
      const artifact = document.createElement('div');
      

      if (Math.random() > 0.5) {

        artifact.className = 'artifact h-line';
        artifact.style.height = `${Math.random() * 3 + 1}px`;
        artifact.style.width = `${Math.random() * 100}%`;
        artifact.style.left = `${Math.random() * 100}%`;
        artifact.style.top = `${Math.random() * 100}%`;
      } else {
        
        artifact.className = 'artifact v-line';
        artifact.style.width = `${Math.random() * 3 + 1}px`;
        artifact.style.height = `${Math.random() * 100}%`;
        artifact.style.top = `${Math.random() * 100}%`;
        artifact.style.left = `${Math.random() * 100}%`;
      }
      
      
      artifact.style.position = 'absolute';
      
      
      const colorChoice = Math.random();
      if (colorChoice < 0.2) {
        artifact.style.backgroundColor = '#e0f8cf'; // Light green
      } else if (colorChoice < 0.7) {
        artifact.style.backgroundColor = '#86c06c'; // Medium green
      } else {
        artifact.style.backgroundColor = '#306850'; // Dark green
      }
      
     
      artifact.style.opacity = subtle ? 
                              (Math.random() * 0.5 + 0.2) : 
                              (Math.random() * 0.7 + 0.3);
      artifact.style.zIndex = '5';
      
      
      const duration = Math.random() * 0.5 + 0.2;
      artifact.style.animation = `artifact-${Math.random() > 0.5 ? 'h' : 'v'}-anim ${duration}s ease-out forwards`;
      
      container.appendChild(artifact);
      
      
      setTimeout(() => {
        if (artifact.parentNode) {
          artifact.parentNode.removeChild(artifact);
        }
      }, duration * 1000 + 100);
    }, Math.random() * (subtle ? 3000 : 5000));
  }
  
  
  for (let i = 0; i < numStaticEffects; i++) {
    setTimeout(() => {
      const staticEffect = document.createElement('div');
      staticEffect.className = 'death-static';
      staticEffect.style.position = 'absolute';
      staticEffect.style.width = `${Math.random() * 300 + 50}px`;
      staticEffect.style.height = `${Math.random() * 200 + 20}px`;
      staticEffect.style.top = `${Math.random() * 100}%`;
      staticEffect.style.left = `${Math.random() * 100}%`;
      staticEffect.style.backgroundColor = '#86c06c'; 
      staticEffect.style.opacity = subtle ? '0.1' : '0.2';
      staticEffect.style.mixBlendMode = 'overlay';
      staticEffect.style.animation = 'static-noise 0.3s ease-out forwards';
      
      container.appendChild(staticEffect);
      
      setTimeout(() => {
        if (staticEffect.parentNode) {
          staticEffect.parentNode.removeChild(staticEffect);
        }
      }, 300);
    }, Math.random() * (subtle ? 4000 : 7000)); 
  }
  
  // Screen shake effect
  if (!subtle) {
    setTimeout(() => {
      const terminalContainer = document.querySelector('.crt-screen');
      if (terminalContainer) {
        terminalContainer.classList.add('screen-glitch');
        setTimeout(() => {
          terminalContainer.classList.remove('screen-glitch');
        }, 200);
      }
    }, 500);
  }
}// Collection of existentialist quotes for death screen
const existentialistQuotes = [
  "Man is condemned to be free; because once thrown into the world, he is responsible for everything he does. - Jean-Paul Sartre",
  "Anxiety is the dizziness of freedom. - Søren Kierkegaard",
  "Life is nothing until it is lived; but it is yours to make sense of, and the value of it is nothing else but the sense that you choose. - Jean-Paul Sartre",
  "The absurd is born of this confrontation between the human need and the unreasonable silence of the world. - Albert Camus",
  "Freedom is what we do with what is done to us. - Jean-Paul Sartre",
  "The meaning of life is that it stops. - Franz Kafka",
  "Man is a useless passion. - Jean-Paul Sartre",
  "There is only one really serious philosophical problem, and that is suicide. - Albert Camus",
  "Life begins on the other side of despair. - Jean-Paul Sartre",
  "One repays a teacher badly if one always remains nothing but a pupil. - Friedrich Nietzsche",
  "We live as we dream—alone. - Joseph Conrad",
  "Everything that exists is born for no reason, carries on living through weakness, and dies by accident. - Jean-Paul Sartre",
  "I rebel; therefore I exist. - Albert Camus",
  "Existence precedes essence. - Jean-Paul Sartre",
  "When we are tired, we are attacked by ideas we conquered long ago. - Friedrich Nietzsche",
  "God is dead. God remains dead. And we have killed him. - Friedrich Nietzsche",
  "That which does not kill us makes us stronger. - Friedrich Nietzsche",
  "To live is to suffer, to survive is to find some meaning in the suffering. - Friedrich Nietzsche",
  "There are no facts, only interpretations. - Friedrich Nietzsche",
  "I opened myself to the gentle indifference of the world. - Albert Camus",
  "Man cannot endure his own littleness unless he can translate it into meaningfulness on the largest possible scale. - Ernest Becker",
  "One must imagine Sisyphus happy. - Albert Camus",
  "In the depth of winter, I finally learned that within me there lay an invincible summer. - Albert Camus",
  "You will never be happy if you continue to search for what happiness consists of. - Albert Camus",
  "The universe is indifferent; we have created the gods to hold our hands. - Simone de Beauvoir",
  "The individual's duty is to do what he wants to do, to think whatever he likes, to be accountable to no one but himself. - Simone de Beauvoir",
  "All human actions are equivalent and all are on principle doomed to failure. - Jean-Paul Sartre",
  "Life is an unending concatenation of situations. - Martin Heidegger",
  "Anxiety is the price of freedom. - Martin Heidegger",
  "I am my choices. - Jean-Paul Sartre",
  "We fear death, but what we really fear is emptiness. - Emil Cioran",
  "Not to be born is undoubtedly the best plan of all. Unfortunately it is within no one's reach. - Emil Cioran"
];

function handleOutOfBlood() {
  // Create death screen overlay with initial dark state
  const deathScreen = document.createElement('div');
  deathScreen.className = 'death-screen';
  deathScreen.style.position = 'fixed';
  deathScreen.style.top = '0';
  deathScreen.style.left = '0';
  deathScreen.style.width = '100%';
  deathScreen.style.height = '100%';
  deathScreen.style.backgroundColor = 'rgba(7, 24, 33, 0.98)'; // Almost black
  deathScreen.style.zIndex = '10000';
  deathScreen.style.display = 'flex';
  deathScreen.style.flexDirection = 'column';
  deathScreen.style.justifyContent = 'center';
  deathScreen.style.alignItems = 'center';
  document.body.appendChild(deathScreen);

 
  const matrixContainer = document.createElement('div');
  matrixContainer.className = 'matrix-container';
  matrixContainer.style.position = 'absolute';
  matrixContainer.style.top = '0';
  matrixContainer.style.left = '0';
  matrixContainer.style.width = '100%';
  matrixContainer.style.height = '100%';
  matrixContainer.style.overflow = 'hidden';
  matrixContainer.style.opacity = '0.2'; 
  matrixContainer.style.zIndex = '0'; 
  deathScreen.appendChild(matrixContainer);
  

  createMatrixRain(matrixContainer);
  
 
  const deathMessage = document.createElement('div');
  deathMessage.textContent = 'YOU DIED.';
  deathMessage.style.color = '#e0f8cf'; // Lightest green from the palette
  deathMessage.style.fontFamily = 'RuneScape, monospace';
  deathMessage.style.fontSize = '64px';
  deathMessage.style.textShadow = '0 0 10px rgba(134, 192, 108, 0.8)'; // Green glow
  deathMessage.style.marginBottom = '40px';
  deathMessage.style.opacity = '0'; // Start hidden
  deathMessage.style.transition = 'opacity 3s ease-in';
  deathMessage.style.zIndex = '2';
  

  const randomQuote = existentialistQuotes[Math.floor(Math.random() * existentialistQuotes.length)];
  
  
  const quoteContainer = document.createElement('div');
  quoteContainer.style.maxWidth = '600px';
  quoteContainer.style.textAlign = 'center';
  quoteContainer.style.color = '#86c06c'; 
  quoteContainer.style.fontFamily = 'RuneScape, monospace';
  quoteContainer.style.fontSize = '18px';
  quoteContainer.style.opacity = '0'; 
  quoteContainer.style.transform = 'translateY(20px)';
  quoteContainer.style.transition = 'opacity 2s, transform 2s';
  quoteContainer.style.padding = '0 20px';
  quoteContainer.textContent = randomQuote;
  quoteContainer.style.zIndex = '2';
  

  const glitchEffects = document.createElement('div');
  glitchEffects.className = 'death-glitch-effects';
  glitchEffects.style.zIndex = '1';
  

  deathScreen.appendChild(glitchEffects);
  deathScreen.appendChild(deathMessage);
  deathScreen.appendChild(quoteContainer);
  

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes pulseGlow {
      0% { text-shadow: 0 0 10px rgba(134, 192, 108, 0.5); }
      50% { text-shadow: 0 0 20px rgba(134, 192, 108, 0.8), 0 0 40px rgba(134, 192, 108, 0.6); }
      100% { text-shadow: 0 0 10px rgba(134, 192, 108, 0.5); }
    }
    
    @keyframes matrixFadeIn {
      0% { opacity: 0.2; }
      100% { opacity: 0.6; }
    }
  `;
  document.head.appendChild(styleSheet);
  

  createGlitchArtifacts(glitchEffects, true);
  

  

  setTimeout(() => {

    matrixContainer.style.transition = 'opacity 2s';
    matrixContainer.style.opacity = '0.6';
    

    createGlitchArtifacts(glitchEffects, false);
    

    setTimeout(() => {
      deathMessage.style.opacity = '1';
      deathMessage.style.animation = 'pulseGlow 2s infinite';
      

      setTimeout(() => {
        quoteContainer.style.opacity = '1';
        quoteContainer.style.transform = 'translateY(0)';
        

        createGlitchArtifacts(glitchEffects, false);
      }, 3000);
    }, 2000);
  }, 1500);
  

  setTimeout(() => {
    window.location.reload();
  }, 12000);
}

function createMatrixRain(container) {

  const width = window.innerWidth;
  const fontSize = 20;
  const columns = Math.floor(width / fontSize);
  
  
  const getRandomChar = () => {
    return String.fromCharCode(33 + Math.floor(Math.random() * 94));
  };
  

  const colors = ['#e0f8cf', '#86c06c', '#306850'];
  

  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -20;
  }
  

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = window.innerHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  ctx.font = fontSize + 'px monospace';
  

  const drawMatrix = () => {

    ctx.fillStyle = 'rgba(7, 24, 33, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < drops.length; i++) {

      const text = getRandomChar();
      

      const colorIndex = Math.random() < 0.1 ? 0 : (Math.random() < 0.5 ? 1 : 2);
      ctx.fillStyle = colors[colorIndex];
      

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      

      drops[i]++;
      

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = Math.random() * -20;
      }
    }
  };
  

  const matrixInterval = setInterval(drawMatrix, 33); 
  

  return () => clearInterval(matrixInterval);
}


window.handleOutOfBlood = handleOutOfBlood;