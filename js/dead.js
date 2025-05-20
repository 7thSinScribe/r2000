// Collection of existentialist quotes for death screen
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
  // Create death screen overlay
  const deathScreen = document.createElement('div');
  deathScreen.className = 'death-screen';
  deathScreen.style.position = 'fixed';
  deathScreen.style.top = '0';
  deathScreen.style.left = '0';
  deathScreen.style.width = '100%';
  deathScreen.style.height = '100%';
  deathScreen.style.backgroundColor = 'rgba(7, 24, 33, 0.95)';
  deathScreen.style.zIndex = '10000';
  deathScreen.style.display = 'flex';
  deathScreen.style.flexDirection = 'column';
  deathScreen.style.justifyContent = 'center';
  deathScreen.style.alignItems = 'center';
  deathScreen.style.animation = 'deathFadeIn 2s forwards';
  
  // Create animated death message
  const deathMessage = document.createElement('div');
  deathMessage.textContent = 'YOU DIED';
  deathMessage.style.color = '#8B0000'; // Momentarily using red
  deathMessage.style.fontFamily = 'Pixelcastle, monospace';
  deathMessage.style.fontSize = '64px';
  deathMessage.style.textShadow = '0 0 10px rgba(134, 192, 108, 0.8)'; // Green glow from your palette
  deathMessage.style.marginBottom = '40px';
  deathMessage.style.animation = 'pulseGlow 2s infinite';
  
  // Select a random quote
  const randomQuote = existentialistQuotes[Math.floor(Math.random() * existentialistQuotes.length)];
  
  // Create quote container
  const quoteContainer = document.createElement('div');
  quoteContainer.style.maxWidth = '600px';
  quoteContainer.style.textAlign = 'center';
  quoteContainer.style.color = '#86c06c'; // From your palette
  quoteContainer.style.fontFamily = 'RuneScape, monospace';
  quoteContainer.style.fontSize = '18px';
  quoteContainer.style.opacity = '0';
  quoteContainer.style.animation = 'quoteAppear 2s forwards 1s';
  quoteContainer.style.padding = '0 20px';
  quoteContainer.textContent = randomQuote;
  
  // Create glitchy effects container
  const glitchEffects = document.createElement('div');
  glitchEffects.className = 'death-glitch-effects';
  
  // Add elements to DOM
  deathScreen.appendChild(deathMessage);
  deathScreen.appendChild(quoteContainer);
  deathScreen.appendChild(glitchEffects);
  document.body.appendChild(deathScreen);
  
  // Add keyframe animations
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes deathFadeIn {
      0% { background-color: rgba(7, 24, 33, 0.3); }
      100% { background-color: rgba(7, 24, 33, 0.95); }
    }
    
    @keyframes pulseGlow {
      0% { text-shadow: 0 0 10px rgba(134, 192, 108, 0.5); color: #8B0000; }
      50% { text-shadow: 0 0 20px rgba(134, 192, 108, 0.8), 0 0 40px rgba(134, 192, 108, 0.6); color: #8B0000; }
      100% { text-shadow: 0 0 10px rgba(134, 192, 108, 0.5); color: #8B0000; }
    }
    
    @keyframes quoteAppear {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleSheet);
  
  // Add glitch artifacts
  createGlitchArtifacts(glitchEffects);
  
  // Refresh page after delay
  setTimeout(() => {
    window.location.reload();
  }, 8000); // 8 seconds
}

function createGlitchArtifacts(container) {
  // Create several glitch elements
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const artifact = document.createElement('div');
      
      // Randomly choose horizontal or vertical line
      if (Math.random() > 0.5) {
        // Horizontal line
        artifact.className = 'artifact h-line';
        artifact.style.height = `${Math.random() * 3 + 1}px`;
        artifact.style.width = `${Math.random() * 100}%`;
        artifact.style.left = `${Math.random() * 100}%`;
        artifact.style.top = `${Math.random() * 100}%`;
      } else {
        // Vertical line
        artifact.className = 'artifact v-line';
        artifact.style.width = `${Math.random() * 3 + 1}px`;
        artifact.style.height = `${Math.random() * 100}%`;
        artifact.style.top = `${Math.random() * 100}%`;
        artifact.style.left = `${Math.random() * 100}%`;
      }
      
      // Set base styles
      artifact.style.position = 'absolute';
      
      // Use game palette colors
      const colorChoice = Math.random();
      if (colorChoice < 0.2) {
        artifact.style.backgroundColor = '#e0f8cf'; // Light green
      } else if (colorChoice < 0.7) {
        artifact.style.backgroundColor = '#86c06c'; // Medium green
      } else {
        artifact.style.backgroundColor = '#306850'; // Dark green
      }
      
      artifact.style.opacity = Math.random() * 0.7 + 0.3;
      artifact.style.zIndex = '5';
      
      // Add random animation duration for variety
      const duration = Math.random() * 0.5 + 0.2;
      artifact.style.animation = `artifact-${Math.random() > 0.5 ? 'h' : 'v'}-anim ${duration}s ease-out forwards`;
      
      container.appendChild(artifact);
      
      // Remove after animation completes
      setTimeout(() => {
        if (artifact.parentNode) {
          artifact.parentNode.removeChild(artifact);
        }
      }, duration * 1000 + 100);
    }, Math.random() * 5000); // Random start time within 5 seconds
  }
  
  // Add some flashing/static effects
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const staticEffect = document.createElement('div');
      staticEffect.className = 'death-static';
      staticEffect.style.position = 'absolute';
      staticEffect.style.width = `${Math.random() * 300 + 50}px`;
      staticEffect.style.height = `${Math.random() * 200 + 20}px`;
      staticEffect.style.top = `${Math.random() * 100}%`;
      staticEffect.style.left = `${Math.random() * 100}%`;
      staticEffect.style.backgroundColor = '#86c06c'; // From your palette
      staticEffect.style.opacity = '0.2';
      staticEffect.style.mixBlendMode = 'overlay';
      staticEffect.style.animation = 'static-noise 0.3s ease-out forwards';
      
      container.appendChild(staticEffect);
      
      setTimeout(() => {
        if (staticEffect.parentNode) {
          staticEffect.parentNode.removeChild(staticEffect);
        }
      }, 300);
    }, Math.random() * 7000); // Random start time within 7 seconds
  }
  
  // Screen shake effect
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

// Export the handler function
window.handleOutOfBlood = handleOutOfBlood;