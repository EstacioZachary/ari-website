(function() {
  // ----------------------------- GENTLE PETAL SYSTEM (constant, low quantity, no lag) -----------------------------
  const petalField = document.getElementById('petal-field');
  let activePetals = [];
  let petalCount = 0;
  const petalCounterSpan = document.getElementById('petalCounter');
  
  // Beautiful purple flower icons for gentle floating
  const petalIcons = ['fas fa-flower', 'fas fa-fan', 'fas fa-seedling', 'fas fa-feather-alt', 'fas fa-heart', 'fas fa-crown', 'fas fa-gem', 'fas fa-moon', 'fas fa-star'];
  
  function updatePetalUI() {
    if(petalCounterSpan) petalCounterSpan.innerText = petalCount;
  }
  
  function createPetal(x = null, y = null) {
    const randIcon = petalIcons[Math.floor(Math.random() * petalIcons.length)];
    const petal = document.createElement('i');
    petal.className = `${randIcon} petal`;
    const size = Math.floor(Math.random() * 22) + 18; 
    petal.style.fontSize = size + 'px';
    const hue = 260 + Math.random() * 35;
    petal.style.color = `hsl(${hue}, 75%, 68%)`;
    petal.style.opacity = 0.5 + Math.random() * 0.3;
    petal.style.position = 'fixed';
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = 5;
    petal.style.willChange = 'transform';
    

    const posX = (x !== null) ? x : Math.random() * window.innerWidth;
    const posY = (y !== null) ? y : Math.random() * window.innerHeight;
    petal.style.left = posX + 'px';
    petal.style.top = posY + 'px';
    
 
    const duration = 15 + Math.random() * 10;
    petal.style.animation = `floatPetals ${duration}s ease-in-out infinite`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    petalField.appendChild(petal);
    activePetals.push(petal);
    petalCount++;
    updatePetalUI();
    

    setTimeout(() => {
      if(petal && petal.parentNode) {
        petal.remove();
        const idx = activePetals.indexOf(petal);
        if(idx !== -1) activePetals.splice(idx, 1);
        petalCount--;
        updatePetalUI();
      }
    }, 20000);
    
    return petal;
  }
  

  function maintainGentlePetals() {
    const targetMin = 20;
    const targetMax = 32;
    
    if (activePetals.length < targetMin) {
     
      const toAdd = Math.min(4, targetMin - activePetals.length);
      for (let i = 0; i < toAdd; i++) {
        setTimeout(() => createPetal(), i * 300);
      }
    } else if (activePetals.length > targetMax) {
  
      const toRemove = activePetals.slice(0, activePetals.length - targetMax);
      toRemove.forEach(petal => {
        if(petal && petal.remove) petal.remove();
        const idx = activePetals.indexOf(petal);
        if(idx !== -1) activePetals.splice(idx, 1);
      });
      petalCount = activePetals.length;
      updatePetalUI();
    }
  }
  
  
  function initGentlePetals(initialCount = 22) {
    for(let i = 0; i < initialCount; i++) {
      setTimeout(() => createPetal(), i * 150);
    }
  }
  

  setInterval(() => {
    maintainGentlePetals();
  }, 8000);
  

  setInterval(() => {
    if (activePetals.length < 35 && Math.random() > 0.6) {
      createPetal();
    }
  }, 5000);
  
 
  function showToast(msg, bg = '#a855f7') {
    let toastDiv = document.createElement('div');
    toastDiv.innerText = msg;
    toastDiv.style.position = 'fixed';
    toastDiv.style.bottom = '25px';
    toastDiv.style.left = '50%';
    toastDiv.style.transform = 'translateX(-50%)';
    toastDiv.style.backgroundColor = bg;
    toastDiv.style.padding = '8px 20px';
    toastDiv.style.borderRadius = '40px';
    toastDiv.style.color = 'white';
    toastDiv.style.fontWeight = 'bold';
    toastDiv.style.zIndex = '1001';
    toastDiv.style.fontSize = '14px';
    toastDiv.style.backdropFilter = 'blur(8px)';
    toastDiv.style.boxShadow = '0 0 12px rgba(168,85,247,0.6)';
    document.body.appendChild(toastDiv);
    setTimeout(() => toastDiv.remove(), 2000);
  }
  
 
  initGentlePetals(24);
  
 
  const quotes = [
    "💜 You've made me realize that red is not the most vibrant color there is. 💜",
    "🌙 Every moment with you is worth treasuring. 🌙",
    "🌸 My love for you continues to bloom and multiply as time passes by. 🌸",
    "✨ I shall be the red unto your blue. ✨",
    "💕 I love you because I chose to do so, always remember that. 💕",
    "🌟 Your radiance knows no bounds. 🌟"
  ];
  const quoteDisplay = document.getElementById('dynamicQuoteDisplay');
  const randomQuoteBtn = document.getElementById('randomQuoteBtn');
  if(randomQuoteBtn) {
    randomQuoteBtn.addEventListener('click', () => {
      const randomIdx = Math.floor(Math.random() * quotes.length);
      if(quoteDisplay) quoteDisplay.innerText = quotes[randomIdx];
    
      for(let i = 0; i < 2; i++) setTimeout(() => createPetal(), i * 100);
    });
  }
  
  // ---------- ENVELOPE POPUP ----------

  const envelopeMessages = {
    1: {
      title: "💜 I 💜",
      message: "I will not make promises, because I myself know that promises made by man are made to be broken. But I shall do my best to continouosly remind you and make you realize that you matter, you are loved, and you are worth it."
    },
    2: {
      title: "🌙 LOVE 🌙",
      message: "Love shall be my best symbol of appreciation to your whole being, Ari. And be reminded that my love for you is not of my own but from my God aswell. Thus, my love for you is not within the means of emotion, rather a choice and commitment that I'm willing to make 'till the day I die."
    },
    3: {
      title: "💌 YOU 💌",
      message: "You are a precious person to me. Which is why I shall continue to cherish and take care of you to the utmost best of my ability. I will choose to be with you in moments of joy, and even in moments of sadness. I love you, Ari!"
    }
  };
 
  
  const modal = document.getElementById('envelopeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  
  function openEnvelope(cardId) {
    const data = envelopeMessages[cardId];
    if(data) {
      modalTitle.innerText = data.title;
      modalMessage.innerText = data.message;
    } else {
      modalTitle.innerText = "💜 Love Note for Ari 💜";
      modalMessage.innerText = "Ari, you are my forever and always. I love you deeply. 💜";
    }
    modal.classList.add('active');
  
    for(let i = 0; i < 3; i++) setTimeout(() => createPetal(), i * 80);
  }
  
  function closeModalFunc() {
    modal.classList.remove('active');
  }
  
  const triggers = document.querySelectorAll('.envelope-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const envId = trigger.getAttribute('data-envelope');
      if(envId) openEnvelope(parseInt(envId));
      else openEnvelope(1);
    });
  });
  
  const closeBtn = document.querySelector('.close-modal');
  if(closeBtn) closeBtn.addEventListener('click', closeModalFunc);
  modal?.addEventListener('click', (e) => {
    if(e.target === modal) closeModalFunc();
  });
  

  const interactiveElements = document.querySelectorAll('.kuromi-visual, .fa-crown, .fa-heart, .fa-flower');
  interactiveElements.forEach(el => {
    el.addEventListener('click', (e) => {
      // Add just a couple of petals for gentle feedback
      for(let i = 0; i < 2; i++) {
        setTimeout(() => {
          if(e.clientX && e.clientY) {
            createPetal(e.clientX + (Math.random() - 0.5) * 60, e.clientY + (Math.random() - 0.5) * 60);
          } else {
            createPetal();
          }
        }, i * 50);
      }
    });
  });
  

  

  setInterval(() => {
    if(activePetals.length > 45) {
      const toRemove = activePetals.splice(0, activePetals.length - 35);
      toRemove.forEach(p => p?.remove());
      petalCount = activePetals.length;
      updatePetalUI();
    }
  }, 15000);
  
  console.log('💜 I love you 💜');
})();
