

// ========== CLICKER GAME ==========
class PetalClicker {
  constructor() {
    this.points = 0;
    this.totalClicks = 0;
    this.level = 1;
    this.pointsPerClick = 1;
    this.multiplier = 1;
    this.upgrades = {
      doublePoints: false,
      triplePoints: false,
      auto: false
    };
    
    this.init();
  }

  init() {
    this.pointsDisplay = document.getElementById('clickerPoints');
    this.levelDisplay = document.getElementById('clickerLevel');
    this.clickerBtn = document.getElementById('petalClickerBtn');
    
    if(this.clickerBtn) {
      this.clickerBtn.addEventListener('click', () => this.click());
    }
    
    this.loadProgress();
    this.startAutoClick();
  }

  click() {
    const points = this.pointsPerClick * this.multiplier;
    this.points += points;
    this.totalClicks++;
    this.updateUI();
    this.createClickFeedback();
    this.checkLevelUp();
    this.saveProgress();
  }

  createClickFeedback() {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      left: ${event.clientX}px;
      top: ${event.clientY}px;
      pointer-events: none;
      font-weight: bold;
      color: #f0a6ff;
      text-shadow: 0 0 6px rgba(168,85,247,0.8);
      z-index: 999;
      animation: floatUp 1s ease-out forwards;
    `;
    feedback.textContent = `+${this.pointsPerClick * this.multiplier} 💜`;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);
  }

  checkLevelUp() {
    const neededPoints = this.level * 100;
    if(this.points >= neededPoints) {
      this.level++;
      this.pointsPerClick += 1;
      this.multiplier = 1 + (this.level * 1);
      this.showLevelUpEffect();
    }
  }

  showLevelUpEffect() {
    const levelUpMsg = document.createElement('div');
    levelUpMsg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(168, 85, 247, 0.9);
      color: white;
      padding: 20px 40px;
      border-radius: 20px;
      font-size: 24px;
      font-weight: bold;
      z-index: 1001;
      animation: popIn 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
      pointer-events: none;
    `;
    levelUpMsg.innerHTML = `🎉 LEVEL ${this.level}! 🎉<br><small>+${this.pointsPerClick} per click</small>`;
    document.body.appendChild(levelUpMsg);
    
    // Create burst of petals
    for(let i = 0; i < 8; i++) {
      const petal = document.createElement('i');
      petal.className = 'fas fa-star';
      petal.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        font-size: 24px;
        color: #f0a6ff;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(petal);
      
      const angle = (i / 8) * Math.PI * 2;
      const velocity = 150;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let duration = 0;
      
      const animate = () => {
        duration += 16;
        x += vx * 0.016;
        y += vy * 0.016;
        petal.style.left = x + 'px';
        petal.style.top = y + 'px';
        petal.style.opacity = 1 - (duration / 500);
        
        if(duration < 500) {
          requestAnimationFrame(animate);
        } else {
          petal.remove();
        }
      };
      animate();
    }
    
    setTimeout(() => levelUpMsg.remove(), 1500);
  }

  updateUI() {
    if(this.pointsDisplay) this.pointsDisplay.textContent = this.points;
    if(this.levelDisplay) this.levelDisplay.textContent = this.level;
  }

  startAutoClick() {
    if(this.upgrades.auto) {
      setInterval(() => this.click(), 1000);
    }
  }

  saveProgress() {
    localStorage.setItem('clickerProgress', JSON.stringify({
      points: this.points,
      level: this.level,
      totalClicks: this.totalClicks
    }));
  }

  loadProgress() {
    const saved = localStorage.getItem('clickerProgress');
    if(saved) {
      const data = JSON.parse(saved);
      this.points = data.points;
      this.level = data.level;
      this.totalClicks = data.totalClicks;
      this.updateUI();
    }
  }
}

// ========== MEMORY GAME ==========
class LoveMemoryGame {
  constructor() {
    this.cards = [
      { id: 1, emoji: '💜', label: 'Purple Heart' },
      { id: 1, emoji: '💜', label: 'Purple Heart' },
      { id: 2, emoji: '🌙', label: 'Moon' },
      { id: 2, emoji: '🌙', label: 'Moon' },
      { id: 3, emoji: '🌸', label: 'Flower' },
      { id: 3, emoji: '🌸', label: 'Flower' },
      { id: 4, emoji: '✨', label: 'Sparkles' },
      { id: 4, emoji: '✨', label: 'Sparkles' },
      { id: 5, emoji: '💌', label: 'Love Letter' },
      { id: 5, emoji: '💌', label: 'Love Letter' },
      { id: 6, emoji: '👑', label: 'Crown' },
      { id: 6, emoji: '👑', label: 'Crown' }
    ];
    
    this.shuffled = [];
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.gameActive = false;
    
    this.init();
  }

  init() {
    const gameContainer = document.getElementById('memoryGameGrid');
    if(!gameContainer) return;
    
    this.shuffle();
    this.renderCards();
    this.gameActive = true;
  }

  shuffle() {
    this.shuffled = [...this.cards].sort(() => Math.random() - 0.5);
  }

  renderCards() {
    const container = document.getElementById('memoryGameGrid');
    if(!container) return;
    
    container.innerHTML = '';
    this.shuffled.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      cardEl.innerHTML = '<span class="card-inner">?</span>';
      cardEl.style.cursor = 'pointer';
      cardEl.addEventListener('click', () => this.flipCard(index, cardEl));
      container.appendChild(cardEl);
    });
  }

  flipCard(index, element) {
    if(!this.gameActive) return;
    if(this.flipped.some(f => f.index === index)) return;
    if(this.matched.includes(index)) return;
    
    this.flipped.push({ index, element });
    const card = this.shuffled[index];
    
    element.classList.add('flipped');
    element.querySelector('.card-inner').textContent = card.emoji;
    element.style.pointerEvents = 'none';
    
    if(this.flipped.length === 2) {
      this.gameActive = false;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flipped;
    const match = this.shuffled[first.index].id === this.shuffled[second.index].id;
    
    const movesDisplay = document.getElementById('memoryMoves');
    this.moves++;
    if(movesDisplay) movesDisplay.textContent = this.moves;
    
    setTimeout(() => {
      if(match) {
        this.matched.push(first.index, second.index);
        first.element.style.opacity = '0.5';
        second.element.style.opacity = '0.5';
        
        if(this.matched.length === this.cards.length) {
          this.gameWon();
        }
      } else {
        first.element.classList.remove('flipped');
        second.element.classList.remove('flipped');
        first.element.querySelector('.card-inner').textContent = '?';
        second.element.querySelector('.card-inner').textContent = '?';
      }
      
      first.element.style.pointerEvents = 'auto';
      second.element.style.pointerEvents = 'auto';
      this.flipped = [];
      this.gameActive = true;
    }, 600);
  }

  gameWon() {
    const winMsg = document.createElement('div');
    winMsg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(168, 85, 247, 0.95);
      color: white;
      padding: 30px 50px;
      border-radius: 20px;
      font-size: 28px;
      font-weight: bold;
      z-index: 1001;
      animation: popIn 0.5s ease-out forwards;
      text-align: center;
    `;
    winMsg.innerHTML = `🎉 You Won! 🎉<br><small>Moves: ${this.moves}</small>`;
    document.body.appendChild(winMsg);
    
    setTimeout(() => winMsg.remove(), 2000);
  }

  reset() {
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    const movesDisplay = document.getElementById('memoryMoves');
    if(movesDisplay) movesDisplay.textContent = '0';
    this.shuffle();
    this.renderCards();
    this.gameActive = true;
  }
}

// ========== AMBIENT MUSIC SYSTEM WITH REAL AUDIO FILES ==========
class AmbientMusic {
  constructor() {
    this.isPlaying = false;
    this.volume = 0.3;
    this.currentAudioType = 'ambient';
    this.audioElement = null;
    this.currentUrlIndex = 0;
    
    // Real audio URLs from royalty-free sources (SoundHelix & Pixabay)
    this.musicLibrary = {
      ambient: {
        name: '🌌 Ambient',
        urls: [
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          'https://cdn.pixabay.com/download/audio/2022/02/15/audio_d1718ab41b.mp3'
        ]
      },
      lofi: {
        name: '🎹 Lo-Fi',
        urls: [
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          'https://cdn.pixabay.com/download/audio/2021/08/04/audio_8d44427b47.mp3'
        ]
      },
      meditation: {
        name: '🧘 Meditation',
        urls: [
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          'https://cdn.pixabay.com/download/audio/2021/06/17/audio_99e78da3ff.mp3'
        ]
      },
      nature: {
        name: '🌿 Nature',
        urls: [
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
          'https://cdn.pixabay.com/download/audio/2022/01/20/audio_06cbe7e5f3.mp3'
        ]
      }
    };

    this.init();
  }

  init() {
    // Create audio element
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;
    
    const toggleBtn = document.getElementById('musicToggle');
    const volumeSlider = document.getElementById('musicVolume');
    const volumePercent = document.getElementById('volumePercent');
    const musicTypeBtn = document.getElementById('musicType');
    
    if(toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    if(volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.volume = e.target.value / 100;
        this.audioElement.volume = this.volume;
        if(volumePercent) volumePercent.textContent = e.target.value + '%';
      });
    }

    if(musicTypeBtn) {
      musicTypeBtn.addEventListener('click', () => this.nextMusicType());
    }

    // Handle audio errors gracefully
    this.audioElement.addEventListener('error', (e) => {
      console.warn('Current audio source failed, trying next...');
      this.tryNextSource();
    });

    // Handle when audio is ended
    this.audioElement.addEventListener('ended', () => {
      if(this.isPlaying) {
        this.audioElement.currentTime = 0;
        this.audioElement.play().catch(e => console.warn('Auto-replay failed'));
      }
    });
  }

  nextMusicType() {
    const types = ['ambient', 'lofi', 'meditation', 'nature'];
    const currentIndex = types.indexOf(this.currentAudioType);
    this.currentAudioType = types[(currentIndex + 1) % types.length];
    
    // If music is playing, stop and restart with new type
    if(this.isPlaying) {
      this.stop();
      setTimeout(() => this.play(), 300);
    }
    
    this.updateMusicTypeButton();
  }

  updateMusicTypeButton() {
    const btn = document.getElementById('musicType');
    if(!btn) return;
    
    const trackInfo = this.musicLibrary[this.currentAudioType];
    btn.textContent = trackInfo ? trackInfo.name : '🎵 Music';
  }

  toggle() {
    if(this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    try {
      const trackInfo = this.musicLibrary[this.currentAudioType];
      
      if(!trackInfo || !trackInfo.urls || trackInfo.urls.length === 0) {
        console.error('Music track not found');
        return;
      }

      this.currentUrlIndex = 0;
      this.loadTrack(trackInfo.urls[0]);
    } catch(e) {
      console.error('Error playing music:', e);
    }
  }

  loadTrack(url) {
    try {
      this.audioElement.src = url;
      this.audioElement.volume = this.volume;
      
      const playPromise = this.audioElement.play();
      
      if(playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updateToggleButton();
          })
          .catch(error => {
            console.warn('Playback failed for:', url, error);
            this.tryNextSource();
          });
      } else {
        this.isPlaying = true;
        this.updateToggleButton();
      }
    } catch(e) {
      console.error('Error loading track:', e);
      this.tryNextSource();
    }
  }

  tryNextSource() {
    const trackInfo = this.musicLibrary[this.currentAudioType];
    if(!trackInfo || !trackInfo.urls) return;

    this.currentUrlIndex = (this.currentUrlIndex || 0) + 1;
    
    if(this.currentUrlIndex < trackInfo.urls.length) {
      console.log(`Trying alternate source ${this.currentUrlIndex + 1}...`);
      this.loadTrack(trackInfo.urls[this.currentUrlIndex]);
    } else {
      console.error('All audio sources failed');
      this.showErrorMessage();
    }
  }

  showErrorMessage() {
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(220, 38, 38, 0.9);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      font-size: 14px;
      z-index: 1001;
      animation: slideIn 0.3s ease-out;
    `;
    errorMsg.textContent = '⚠️ Unable to load music. Please check your connection.';
    document.body.appendChild(errorMsg);
    
    setTimeout(() => errorMsg.remove(), 5000);
  }

  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPlaying = false;
    this.updateToggleButton();
  }

  updateToggleButton() {
    const toggleBtn = document.getElementById('musicToggle');
    if(toggleBtn) {
      toggleBtn.textContent = this.isPlaying ? '🎵 Music: ON' : '🎵 Music: OFF';
    }
  }
}

// ========== INITIALIZE ALL GAMES ==========
document.addEventListener('DOMContentLoaded', () => {
  window.petalClicker = new PetalClicker();
  window.memoryGame = new LoveMemoryGame();
  window.ambientMusic = new AmbientMusic();
});

// Add CSS animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
  }

  @keyframes popIn {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.05); }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  @keyframes slideIn {
    0% { transform: translateX(400px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  .memory-card {
    background: rgba(46, 25, 65, 0.75);
    border: 2px solid rgba(168, 85, 247, 0.5);
    border-radius: 12px;
    padding: 20px;
    font-size: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
    aspect-ratio: 1 / 1;
  }

  .memory-card:hover {
    background: rgba(46, 25, 65, 0.9);
    border-color: #f0a6ff;
    transform: scale(1.05);
  }

  .memory-card.flipped {
    background: rgba(168, 85, 247, 0.3);
    border-color: #f0a6ff;
  }

  .card-inner {
    display: block;
    transition: transform 0.3s ease;
  }

  .clicker-btn {
    background: linear-gradient(135deg, #a855f7, #d946ef);
    border: 2px solid #f0a6ff;
    color: white;
    font-size: 18px;
    font-weight: bold;
    padding: 20px 30px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .clicker-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
  }

  .clicker-btn:active {
    transform: scale(0.95);
  }
`;
document.head.appendChild(style);
