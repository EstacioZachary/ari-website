
// ========== MUSIC BEAT DATA ==========
// BPM data for rhythm clicker synchronization
const musicBeatsData = {
  ambient: {
    name: '☕ Café Vibes',
    bpm: 62,
    fileName: 'cafe.mp3'
  },
  lofi: {
    name: '🎹 Lo-Fi Beats',
    bpm: 77,
    fileName: 'Lofi.mp3'
  },
  meditation: {
    name: '💕 RomCom Vibes',
    bpm: 102,
    fileName: 'Rob Deniel - RomCom (Official Music Video).mp3'
  }
};

// Function to generate beat timestamps from BPM
function generateBeats(bpm, durationSeconds = 300) {
  const beatInterval = 60 / bpm; // seconds between beats
  const beats = [];
  
  for(let time = beatInterval; time < durationSeconds; time += beatInterval) {
    beats.push(time);
  }
  
  return beats;
}

// Function to get beats for a specific track
function getBeatsForTrack(trackType) {
  const trackData = musicBeatsData[trackType];
  if(!trackData) return [];
  
  return generateBeats(trackData.bpm);
}

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
    const resetBtn = document.getElementById('resetClickerBtn');
    
    if(this.clickerBtn) {
      this.clickerBtn.addEventListener('click', () => this.click());
    }
    
    if(resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
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
    const neededPoints = 100 * Math.pow(2, this.level - 1);
    if(this.points >= neededPoints) {
      this.level++;
      this.pointsPerClick += 1;
      this.multiplier = 1 + (this.level * 0.3);
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
    if(this.pointsDisplay) this.pointsDisplay.textContent = Math.floor(this.points);
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

  reset() {
    if(confirm('Are you sure? This will reset your level and points!')) {
      this.points = 0;
      this.level = 1;
      this.totalClicks = 0;
      this.pointsPerClick = 1;
      this.multiplier = 1;
      localStorage.removeItem('clickerProgress');
      this.updateUI();
      
      // Show reset confirmation
      const resetMsg = document.createElement('div');
      resetMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(168, 85, 247, 0.9);
        color: white;
        padding: 20px 40px;
        border-radius: 20px;
        font-size: 18px;
        font-weight: bold;
        z-index: 1001;
        animation: popIn 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
        pointer-events: none;
      `;
      resetMsg.textContent = '🔄 Progress Reset! Starting fresh...';
      document.body.appendChild(resetMsg);
      setTimeout(() => resetMsg.remove(), 1500);
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
    
    // Local music files hosted in the /music folder
    this.musicLibrary = {
      ambient: {
        name: '☕ Café Vibes',
        urls: [
          './music/cafe.mp3'
        ]
      },
      lofi: {
        name: '🎹 Lo-Fi Beats',
        urls: [
          './music/Lofi.mp3'
        ]
      },
      meditation: {
        name: '💕 RomCom Vibes',
        urls: [
          './music/Rob Deniel - RomCom (Official Music Video).mp3'
        ]
      }
    };

    this.init();
  }

  init() {
    // Create audio element
    this.audioElement = new Audio();
    // Don't set crossOrigin - let the server handle it naturally
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

    const progressSlider = document.getElementById('musicProgress');
    if(progressSlider) {
      progressSlider.addEventListener('input', (e) => {
        if(this.audioElement && this.audioElement.duration) {
          this.audioElement.currentTime = (e.target.value / 100) * this.audioElement.duration;
        }
      });
    }

    // Update time display as music plays
    this.audioElement.addEventListener('timeupdate', () => {
      this.updateTimeDisplay();
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.updateTimeDisplay();
    });

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
    const types = ['ambient', 'lofi', 'meditation'];
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
        this.showErrorMessage('No music tracks available');
        return;
      }

      this.currentUrlIndex = 0;
      this.loadTrack(trackInfo.urls[0]);
    } catch(e) {
      console.error('Error playing music:', e);
      this.showErrorMessage('Error loading music');
    }
  }

  loadTrack(url) {
    try {
      // Stop previous playback
      this.audioElement.pause();
      
      // Load new track
      this.audioElement.src = url;
      this.audioElement.volume = this.volume;
      
      const playPromise = this.audioElement.play();
      
      if(playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updateToggleButton();
            console.log('✅ Music playing:', url);
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
    if(!trackInfo || !trackInfo.urls) {
      this.showErrorMessage('No music available');
      return;
    }

    this.currentUrlIndex = (this.currentUrlIndex || 0) + 1;
    
    if(this.currentUrlIndex < trackInfo.urls.length) {
      console.log(`Trying alternate source ${this.currentUrlIndex + 1}/${trackInfo.urls.length}...`);
      setTimeout(() => this.loadTrack(trackInfo.urls[this.currentUrlIndex]), 500);
    } else {
      console.error('All audio sources failed');
      this.showErrorMessage('Unable to load music. Check your connection.');
    }
  }

  showErrorMessage(msg) {
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
      max-width: 300px;
    `;
    errorMsg.textContent = '⚠️ ' + msg;
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

  formatTime(seconds) {
    if(isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updateTimeDisplay() {
    const currentTimeEl = document.getElementById('timeCurrent');
    const durationEl = document.getElementById('timeDuration');
    const progressSlider = document.getElementById('musicProgress');

    if(currentTimeEl && this.audioElement) {
      currentTimeEl.textContent = this.formatTime(this.audioElement.currentTime);
    }

    if(durationEl && this.audioElement) {
      durationEl.textContent = this.formatTime(this.audioElement.duration);
    }

    if(progressSlider && this.audioElement && this.audioElement.duration) {
      progressSlider.value = (this.audioElement.currentTime / this.audioElement.duration) * 100;
    }
  }
}

// ========== RHYTHM CLICKER GAME ==========
class RhythmClicker {
  constructor() {
    this.score = 0;
    this.combo = 0;
    this.isActive = false;
    this.beats = [];
    this.audioElement = null;
    this.currentTrack = 'ambient';
    this.clickWindow = 200; // milliseconds
    this.perfectWindow = 80;
    this.visibleBeats = new Map();
    
    this.init();
  }

  init() {
    const startBtn = document.getElementById('rhythmStartBtn');
    if(startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
  }

  startGame() {
    // Check if music is playing
    if(!window.ambientMusic || !window.ambientMusic.isPlaying) {
      this.showMessage('❌ Start the music player first!', 2000);
      return;
    }

    this.audioElement = window.ambientMusic.audioElement;
    this.currentTrack = window.ambientMusic.currentAudioType;
    
    if(!this.audioElement) {
      this.showMessage('❌ Music player not available', 2000);
      return;
    }

    this.score = 0;
    this.combo = 0;
    this.visibleBeats.clear();
    this.isActive = true;
    
    // Generate beats for current track (limit to song duration)
    const maxDuration = Math.min(this.audioElement.duration || 300, 300);
    this.beats = this.generateBeatsForTrack(this.currentTrack, maxDuration);
    
    this.updateUI();
    this.showMessage('🎵 Rhythm game started! Click to the beat!', 2000);
    this.gameLoop();
  }

  generateBeatsForTrack(trackType, maxDuration) {
    const trackData = musicBeatsData[trackType];
    if(!trackData) return [];
    
    const beatInterval = 60 / trackData.bpm;
    const beats = [];
    
    for(let time = beatInterval; time < maxDuration; time += beatInterval) {
      beats.push(time);
    }
    
    return beats;
  }

  gameLoop() {
    if(!this.isActive || !this.audioElement) return;

    const currentTime = this.audioElement.currentTime;
    const container = document.getElementById('beatTargets');
    
    if(!container) {
      requestAnimationFrame(() => this.gameLoop());
      return;
    }

    // Find beats to display (coming within 2 seconds)
    const upcomingBeats = this.beats.filter(beatTime => {
      const timeUntilBeat = beatTime - currentTime;
      return timeUntilBeat > -0.3 && timeUntilBeat <= 2;
    });

    // Add new beat elements that aren't already visible
    upcomingBeats.forEach(beatTime => {
      if(!this.visibleBeats.has(beatTime)) {
        const beatEl = this.createBeatElement(beatTime);
        container.appendChild(beatEl);
        this.visibleBeats.set(beatTime, beatEl);
      } else {
        // Update existing beat element
        const beatEl = this.visibleBeats.get(beatTime);
        this.updateBeatElement(beatEl, beatTime, currentTime);
      }
    });

    // Remove beats that have passed
    for(let [beatTime, beatEl] of this.visibleBeats) {
      if(currentTime > beatTime + (this.clickWindow / 1000)) {
        if(!beatEl.classList.contains('hit')) {
          this.combo = 0;
        }
        beatEl.remove();
        this.visibleBeats.delete(beatTime);
      }
    }

    // Continue loop
    if(this.audioElement.paused && currentTime > 0 && this.isActive) {
      // Music stopped
      this.endGame();
    } else if(this.isActive) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  createBeatElement(beatTime) {
    const beatEl = document.createElement('div');
    beatEl.className = 'beat-target';
    beatEl.setAttribute('data-beat-time', beatTime.toFixed(2));
    
    beatEl.innerHTML = '🎵';
    beatEl.addEventListener('click', (e) => {
      e.stopPropagation();
      this.registerClick(beatEl, beatTime);
    });
    
    return beatEl;
  }

  updateBeatElement(beatEl, beatTime, currentTime) {
    const timeUntilBeat = beatTime - currentTime;
    
    // Animate the circle size and opacity based on time until beat
    let scale = 0.6 + (1 - (timeUntilBeat / 2)) * 0.6;
    scale = Math.max(0.3, Math.min(1.2, scale));
    
    let opacity = Math.max(0.2, 1 - Math.abs(timeUntilBeat - 0.5) * 0.8);
    
    // Create outer ring that shrinks toward beat
    let ringScale = Math.max(1, 3 - (timeUntilBeat / 0.5));
    let ringOpacity = Math.max(0, 1 - timeUntilBeat * 2);
    
    // Determine color based on timing zone
    let color = '#a855f7';
    let textContent = '🎵';
    
    if(Math.abs(timeUntilBeat) <= (this.perfectWindow / 1000)) {
      // Perfect zone - bright green
      color = '#22c55e';
      beatEl.style.borderColor = '#22c55e';
      beatEl.style.background = 'radial-gradient(circle, rgba(34, 197, 94, 0.8), rgba(34, 197, 94, 0.1))';
      beatEl.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.9)';
      textContent = '✨ NOW! ✨';
    } else if(Math.abs(timeUntilBeat) <= (this.clickWindow / 1000)) {
      // Good zone - cyan
      color = '#06b6d4';
      beatEl.style.borderColor = '#06b6d4';
      beatEl.style.background = 'radial-gradient(circle, rgba(6, 182, 212, 0.7), rgba(6, 182, 212, 0.1))';
      beatEl.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.8)';
      textContent = '🎵 READY!';
    } else if(timeUntilBeat > 0 && timeUntilBeat <= 1) {
      // Approaching - yellow
      color = '#eab308';
      beatEl.style.borderColor = '#eab308';
      beatEl.style.background = 'radial-gradient(circle, rgba(234, 179, 8, 0.6), rgba(234, 179, 8, 0.1))';
      beatEl.style.boxShadow = '0 0 20px rgba(234, 179, 8, 0.7)';
      const countDown = Math.max(1, Math.ceil(timeUntilBeat * 2));
      textContent = countDown === 1 ? '🚀 GO!' : `⏱️ ${countDown}`;
    } else if(timeUntilBeat > 1) {
      // Far away - purple
      color = '#a855f7';
      beatEl.style.borderColor = '#a855f7';
      beatEl.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.7), rgba(168, 85, 247, 0.1))';
      beatEl.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.5)';
      textContent = '🎵';
    } else {
      // Passed the beat
      color = '#ef4444';
      beatEl.style.borderColor = '#ef4444';
      beatEl.style.background = 'radial-gradient(circle, rgba(239, 68, 68, 0.5), rgba(239, 68, 68, 0.1))';
      beatEl.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
      textContent = '❌ MISS!';
    }
    
    beatEl.innerHTML = textContent;
    beatEl.style.fontSize = Math.abs(timeUntilBeat) <= (this.perfectWindow / 1000) ? '24px' : '32px';
    beatEl.style.fontWeight = 'bold';
    beatEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
    beatEl.style.opacity = opacity;

    // Add outer ring that contracts
    let ringEl = beatEl.querySelector('.beat-ring');
    if(!ringEl && timeUntilBeat > -0.2 && timeUntilBeat < 2) {
      ringEl = document.createElement('div');
      ringEl.className = 'beat-ring';
      ringEl.style.cssText = `
        position: absolute;
        width: 150px;
        height: 150px;
        border: 2px solid ${color};
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(${ringScale});
        opacity: ${ringOpacity};
        pointer-events: none;
      `;
      beatEl.appendChild(ringEl);
    }
    
    if(ringEl) {
      ringEl.style.borderColor = color;
      ringEl.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
      ringEl.style.opacity = ringOpacity;
    }
  }

  registerClick(beatEl, beatTime) {
    if(!this.audioElement || beatEl.classList.contains('hit')) return;

    const currentTime = this.audioElement.currentTime;
    const timeDiff = Math.abs(beatTime - currentTime) * 1000;

    let points = 0;
    let accuracy = 'miss';
    let color = '#ef4444';

    if(timeDiff <= this.perfectWindow) {
      points = 50;
      accuracy = 'perfect';
      color = '#22c55e';
      this.combo++;
    } else if(timeDiff <= this.clickWindow) {
      points = 25;
      accuracy = 'good';
      color = '#06b6d4';
      this.combo++;
    } else {
      points = 0;
      accuracy = 'miss';
      color = '#ef4444';
      this.combo = 0;
    }

    this.score += points;
    beatEl.classList.add('hit');
    beatEl.style.borderColor = color;
    beatEl.style.background = `radial-gradient(circle, ${color}, ${color}22)`;
    beatEl.style.pointerEvents = 'none';

    // Burst animation
    this.createBurst(beatEl, color);

    // Show feedback text
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      font-size: 28px;
      pointer-events: none;
      z-index: 999;
      animation: floatUp 1s ease-out forwards;
    `;
    
    if(accuracy === 'perfect') {
      feedback.textContent = '⭐ PERFECT! +50';
      feedback.style.color = '#22c55e';
    } else if(accuracy === 'good') {
      feedback.textContent = '✨ GOOD! +25';
      feedback.style.color = '#06b6d4';
    } else {
      feedback.textContent = '❌ MISS';
      feedback.style.color = '#ef4444';
    }

    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1000);

    this.updateUI();
  }

  createBurst(beatEl, color) {
    const rect = beatEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for(let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      const angle = (i / 8) * Math.PI * 2;
      const vx = Math.cos(angle) * 150;
      const vy = Math.sin(angle) * 150;

      particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: ${color};
        pointer-events: none;
        z-index: 998;
      `;
      document.body.appendChild(particle);

      let duration = 0;
      let x = centerX;
      let y = centerY;

      const animate = () => {
        duration += 16;
        x += vx * 0.016;
        y += vy * 0.016;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.opacity = 1 - (duration / 400);

        if(duration < 400) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      animate();
    }
  }

  updateUI() {
    const scoreEl = document.getElementById('rhythmScore');
    const comboEl = document.getElementById('rhythmCombo');
    
    if(scoreEl) scoreEl.textContent = this.score;
    if(comboEl) {
      comboEl.textContent = this.combo;
      if(this.combo > 0) {
        comboEl.style.color = '#22c55e';
      } else {
        comboEl.style.color = '#06b6d4';
      }
    }
  }

  showMessage(msg, duration = 2000) {
    const msgEl = document.getElementById('rhythmMessage');
    if(msgEl) {
      msgEl.textContent = msg;
      msgEl.style.opacity = '1';
      setTimeout(() => {
        if(msgEl) msgEl.style.opacity = '0.5';
      }, duration);
    }
  }

  endGame() {
    this.isActive = false;
    const finalMsg = this.combo > 0 ? `🎉 Game Over! Final Score: ${this.score} | Combo: ${this.combo}` : `Final Score: ${this.score}`;
    this.showMessage(finalMsg);
  }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.isActive = false;
    const container = document.getElementById('beatTargets');
    if(container) {
      container.querySelectorAll('.beat-target').forEach(el => el.remove());
    }
    this.visibleBeats.clear();
    this.updateUI();
    this.showMessage('🎵 Ready to start!');
  }
}

// ========== INITIALIZE ALL GAMES ==========
document.addEventListener('DOMContentLoaded', () => {
  window.petalClicker = new PetalClicker();
  window.memoryGame = new LoveMemoryGame();
  window.ambientMusic = new AmbientMusic();
  window.rhythmGame = new RhythmClicker();
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

  .beat-target {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.7), rgba(168, 85, 247, 0.1));
    border: 3px solid #a855f7;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    cursor: pointer;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    z-index: 50;
    transition: all 0.08s ease-out;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
    overflow: visible;
  }

  .beat-ring {
    position: absolute;
    width: 150px;
    height: 150px;
    border: 2px solid #a855f7;
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
    transition: all 0.08s ease-out;
  }

  .beat-target:hover {
    box-shadow: 0 0 25px rgba(168, 85, 247, 0.8);
    transform: translate(-50%, -50%) scale(0.95);
  }

  .beat-target.hit {
    pointer-events: none;
    animation: beatHit 0.4s ease-out forwards;
  }

  @keyframes beatHit {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 0;
    }
  }

  @keyframes beatPulse {
    0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.7); }
    70% { box-shadow: 0 0 0 15px rgba(168, 85, 247, 0); }
    100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); }
  }
`;
document.head.appendChild(style);
