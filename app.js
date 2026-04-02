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
    const size = Math.floor(Math.random() * 22) + 18; // 18-40px, slightly smaller for subtlety
    petal.style.fontSize = size + 'px';
    const hue = 260 + Math.random() * 35;
    petal.style.color = `hsl(${hue}, 75%, 68%)`;
    petal.style.opacity = 0.5 + Math.random() * 0.3;
    petal.style.position = 'fixed';
    petal.style.pointerEvents = 'none';
    petal.style.zIndex = 5;
    petal.style.willChange = 'transform';
    
    // Position: either specified or random within viewport
    const posX = (x !== null) ? x : Math.random() * window.innerWidth;
    const posY = (y !== null) ? y : Math.random() * window.innerHeight;
    petal.style.left = posX + 'px';
    petal.style.top = posY + 'px';
    
    // Longer, smoother animation duration (15-22 seconds)
    const duration = 15 + Math.random() * 10;
    petal.style.animation = `floatPetals ${duration}s ease-in-out infinite`;
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    petalField.appendChild(petal);
    activePetals.push(petal);
    petalCount++;
    updatePetalUI();
    
    // Auto-remove after longer period to maintain gentle population (20 seconds)
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
  
  // Gentle maintenance: keep petal count between 18-30 for smooth performance
  function maintainGentlePetals() {
    const targetMin = 20;
    const targetMax = 32;
    
    if (activePetals.length < targetMin) {
      // Add a few new petals gently
      const toAdd = Math.min(4, targetMin - activePetals.length);
      for (let i = 0; i < toAdd; i++) {
        setTimeout(() => createPetal(), i * 300);
      }
    } else if (activePetals.length > targetMax) {
      // Remove excess petals gradually (don't sudden clear)
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
  
  // Initialize gentle, constant petal field (not too many, not too few)
  function initGentlePetals(initialCount = 22) {
    for(let i = 0; i < initialCount; i++) {
      setTimeout(() => createPetal(), i * 150);
    }
  }
  
  // Start the gentle maintenance interval (every 8 seconds, adjust softly)
  setInterval(() => {
    maintainGentlePetals();
  }, 8000);
  
  // Also add a new petal occasionally to keep freshness (but very subtle)
  setInterval(() => {
    if (activePetals.length < 35 && Math.random() > 0.6) {
      createPetal();
    }
  }, 5000);
  
  // Show a small toast message (without disrupting petals)
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
  
  // Start the gentle floating petals
  initGentlePetals(24);
  
  // Romantic quotes focused on Ari (no Kuromi text)
  const quotes = [
    "💜 Ari, you are my eternal purple constellation. 💜",
    "🌙 Every moment with you is a beautiful dream, Ari. 🌙",
    "🌸 My love for you grows like lavender in moonlight, Ari. 🌸",
    "✨ Ari, you turned my world into a violet fairytale. ✨",
    "💕 Forever yours under a purple sky, my dearest Ari. 💕",
    "🌹 Ari, your love is the sweetest poetry I've ever known. 🌹",
    "💜 Ari, every flower whispers your name in my heart. 💜",
    "🌟 You are my magic, my Ari, my everything. 🌟"
  ];
  const quoteDisplay = document.getElementById('dynamicQuoteDisplay');
  const randomQuoteBtn = document.getElementById('randomQuoteBtn');
  if(randomQuoteBtn) {
    randomQuoteBtn.addEventListener('click', () => {
      const randomIdx = Math.floor(Math.random() * quotes.length);
      if(quoteDisplay) quoteDisplay.innerText = quotes[randomIdx];
      // Add just 2-3 gentle petals for feedback (not overwhelming)
      for(let i = 0; i < 2; i++) setTimeout(() => createPetal(), i * 100);
    });
  }
  
  // ---------- ENVELOPE POPUP SYSTEM (custom romantic messages FOR ARI) ----------
  // ✨✨ CUSTOMIZABLE MESSAGES: edit these texts to whatever you want for Ari ✨✨
  const envelopeMessages = {
    1: {
      title: "💜 Ari's Eternal Promise 💜",
      message: "My beloved Ari, every purple petal carries a piece of my heart to you. You are my today and all of my tomorrows. I love you more than all the flowers in the universe."
    },
    2: {
      title: "🌙 Forever Vow for Ari 🌙",
      message: "To my dearest Ari: under the purple moonlight, I promise to stand by you through every storm and every bloom. You make my world brighter than a thousand violets. I adore you endlessly."
    },
    3: {
      title: "💌 Purple Daydream Letter 💌",
      message: "My sweet Ari, your love is the melody of my soul. Thank you for being my magic, my peace, and my home. Every flower in this garden blooms for you. Forever yours."
    }
  };
  // ========== ✨ YOU CAN EDIT THE ABOVE TEXTS TO ANY ROMANTIC MESSAGE FOR ARI ✨ ==========
  
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
    // Add a few extra petals when opening envelope (subtle)
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
  
  // Interactive elements: Kuromi image & hearts add 1-2 petals only (subtle)
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
  
  // Editable romantic notes feedback
  const editableDivs = document.querySelectorAll('[contenteditable="true"]');
  editableDivs.forEach(div => {
    div.addEventListener('blur', () => {
      showToast('💕 Your love note is saved in this purple garden, Ari 💕', '#b77eff');
    });
  });
  
  // Performance: ensure petal count never gets too high (already handled by maintainGentlePetals)
  // Additional safety cleanup every 15 seconds
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
