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
