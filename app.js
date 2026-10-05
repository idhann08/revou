'use strict';

/* ═══════════════════════════════════════════════════════════════════════
   DEMO PLAYLIST
   Uses free, royalty-free audio from pixabay CDN so the player works
   immediately without uploading any files.
   ═══════════════════════════════════════════════════════════════════════ */
const SONGS = [
  {
    id: 1,
    title:  'Dreamy Nights',
    artist: 'Chill Collective',
    album:  'Midnight Sessions',
    emoji:  '🌙',
    color1: '#6c2bbd',
    color2: '#fc3c44',
    color3: '#1e1e4e',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    lyrics: [
      'The city lights are fading now',
      'I close my eyes and drift away',
      'In dreamy nights I find my peace',
      'The stars above begin to play',
      'Every shadow tells a story',
      'Every heartbeat counts the time',
      'In the silence of the midnight',
      'Everything feels so sublime',
      'Dreamy nights, carry me home',
      'Through the dark, I\'m not alone',
      'Dreamy nights, soft and bright',
      'Everything feels right tonight',
    ],
  },
  {
    id: 2,
    title:  'Summer Pulse',
    artist: 'Wave Riders',
    album:  'Electric Horizon',
    emoji:  '🌊',
    color1: '#0066ff',
    color2: '#00d4aa',
    color3: '#001a3e',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lyrics: [
      'Riding on the summer wave',
      'Feel the rhythm in your veins',
      'Electric lights across the sky',
      'This moment never dies',
      'Pulse is beating, heart is racing',
      'Through the neon-drenched parade',
      'Summer nights will last forever',
      'In the memories we made',
      'Summer pulse, alive and free',
      'This is where I want to be',
      'Summer pulse, burning bright',
      'Dancing through the endless night',
    ],
  },
  {
    id: 3,
    title:  'Golden Hour',
    artist: 'Amber Sky',
    album:  'Warm Tones',
    emoji:  '🌅',
    color1: '#ff8c00',
    color2: '#ff4500',
    color3: '#2d1200',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    lyrics: [
      'The golden hour paints the sky',
      'In shades of amber, red and gold',
      'Every moment feels like magic',
      'Stories waiting to be told',
      'Sunlight dances on the water',
      'Time is standing perfectly still',
      'In this golden hour of wonder',
      'Everything feels like it will',
      'Golden hour, soft and warm',
      'After every bitter storm',
      'Golden hour, fade to night',
      'Leave behind the fading light',
    ],
  },
  {
    id: 4,
    title:  'Neon Circuit',
    artist: 'Synth Division',
    album:  'Digital Dreams',
    emoji:  '⚡',
    color1: '#00ff88',
    color2: '#00aaff',
    color3: '#001a10',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    lyrics: [
      'Circuits running through the night',
      'Neon pulses burning bright',
      'Data streams across my mind',
      'Leaving everything behind',
      'Binary code, electric soul',
      'Synthetic beats make me whole',
      'In the grid I find my way',
      'Algorithms start to play',
      'Neon circuit, light me up',
      'Fill my digital-dream cup',
      'Neon circuit, never ends',
      'Through the static signal bends',
    ],
  },
  {
    id: 5,
    title:  'Velvet Rain',
    artist: 'Midnight Echo',
    album:  'Storm & Calm',
    emoji:  '🌧️',
    color1: '#4a00e0',
    color2: '#8e2de2',
    color3: '#0d0020',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    lyrics: [
      'Velvet rain on window panes',
      'Washing clean all of my stains',
      'In the storm I find my calm',
      'Every drop a healing balm',
      'Thunder rolls across the hills',
      'Night air gives me winter chills',
      'But inside your warmth remains',
      'Even through the velvet rains',
      'Velvet rain, let it fall',
      'Cleanse the remnants of it all',
      'Velvet rain, soft and grey',
      'Wash tomorrow\'s fears away',
    ],
  },
  {
    id: 6,
    title:  'Solar Drift',
    artist: 'Astral Float',
    album:  'Orbit One',
    emoji:  '🪐',
    color1: '#ff6b35',
    color2: '#f7c59f',
    color3: '#1a0800',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    lyrics: [
      'Drifting through the solar wind',
      'Leaving everything behind',
      'Planets pass like scattered dreams',
      'Nothing\'s ever what it seems',
      'Gravity has lost its hold',
      'Every story yet untold',
      'In the void between the stars',
      'Caught between Venus and Mars',
      'Solar drift, float away',
      'Into light of a brighter day',
      'Solar drift, endless flight',
      'Stars become my guiding light',
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════════════ */
const state = {
  currentIndex: 0,
  isPlaying:    false,
  shuffle:      false,
  repeat:       0,          // 0 = off, 1 = repeat all, 2 = repeat one
  volume:       0.8,
  muted:        false,
  liked:        new Set(),
  isDragging:   false,
  shuffleOrder: [],
  shufflePos:   0,
  activeLyric:  -1,
};

/* ═══════════════════════════════════════════════════════════════════════
   DOM REFERENCES
   ═══════════════════════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);

const audio         = $('audioPlayer');
const bgGradient    = $('bgGradient');
const albumArt      = $('albumArt');
const albumCover    = $('albumCover');
const songTitle     = $('songTitle');
const songArtist    = $('songArtist');
const songAlbum     = $('songAlbum');
const heartBtn      = $('heartBtn');
const progressFill  = $('progressFill');
const progressThumb = $('progressThumb');
const progressCont  = $('progressContainer');
const currentTimeEl = $('currentTime');
const totalTimeEl   = $('totalTime');
const playPauseBtn  = $('playPauseBtn');
const playIcon      = playPauseBtn.querySelector('.play-icon');
const pauseIcon     = playPauseBtn.querySelector('.pause-icon');
const prevBtn       = $('prevBtn');
const nextBtn       = $('nextBtn');
const shuffleBtn    = $('shuffleBtn');
const repeatBtn     = $('repeatBtn');
const repeatBadge   = $('repeatBadge');
const volumeSlider  = $('volumeSlider');
const muteBtn       = $('muteBtn');
const volPath1      = $('volPath1');
const volPath2      = $('volPath2');
const playlist      = $('playlist');
const searchInput   = $('searchInput');
const lyricsBtn     = $('lyricsBtn');
const lyricsPanel   = $('lyricsPanel');
const lyricsContent = $('lyricsContent');
const closeLyricsBtn = $('closeLyricsBtn');

/* ═══════════════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════════════ */
function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function buildShuffleOrder() {
  const order = SONGS.map((_, i) => i).filter(i => i !== state.currentIndex);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  order.unshift(state.currentIndex);
  state.shuffleOrder = order;
  state.shufflePos   = 0;
}

/* ═══════════════════════════════════════════════════════════════════════
   BACKGROUND GRADIENT
   ═══════════════════════════════════════════════════════════════════════ */
function updateBackground(song) {
  bgGradient.style.background = `
    radial-gradient(ellipse 80% 60% at 15% 15%, ${song.color1}55 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 85% 85%, ${song.color2}50 0%, transparent 55%),
    radial-gradient(ellipse 50% 40% at 50% 50%, ${song.color3}80 0%, transparent 60%),
    linear-gradient(160deg, #0f0c29 0%, ${song.color3} 50%, #12001f 100%)
  `;
}

/* ═══════════════════════════════════════════════════════════════════════
   LOAD SONG
   ═══════════════════════════════════════════════════════════════════════ */
function loadSong(index, autoPlay = false) {
  state.currentIndex = index;
  const song = SONGS[index];

  // Audio source
  audio.src = song.src;
  audio.volume = state.muted ? 0 : state.volume;
  audio.load();

  // Metadata
  songTitle.textContent  = song.title;
  songArtist.textContent = song.artist;
  songAlbum.textContent  = song.album;

  // Album cover (emoji as cover art)
  albumCover.textContent = song.emoji;
  albumCover.style.backgroundImage = '';

  // Heart state
  heartBtn.classList.toggle('liked', state.liked.has(song.id));

  // Background
  updateBackground(song);

  // Progress reset
  progressFill.style.width  = '0%';
  progressThumb.style.left  = '0%';
  currentTimeEl.textContent = '0:00';
  totalTimeEl.textContent   = '0:00';

  // Lyrics
  renderLyrics(song);

  // Playlist highlight
  updatePlaylistActive(index);

  if (autoPlay) {
    playAudio();
  } else {
    pauseUI();
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   PLAY / PAUSE
   ═══════════════════════════════════════════════════════════════════════ */
function playAudio() {
  audio.play().then(() => {
    state.isPlaying = true;
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    albumArt.classList.add('playing');
    albumArt.classList.remove('paused');
    updatePlaylistBars(true);
  }).catch(() => {
    // autoplay blocked — stay paused
    pauseUI();
  });
}

function pauseUI() {
  state.isPlaying = false;
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  albumArt.classList.remove('playing');
  albumArt.classList.add('paused');
  updatePlaylistBars(false);
}

function togglePlay() {
  if (state.isPlaying) {
    audio.pause();
    pauseUI();
  } else {
    if (!audio.src) loadSong(0, true);
    else playAudio();
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   NEXT / PREV
   ═══════════════════════════════════════════════════════════════════════ */
function getNextIndex() {
  if (state.repeat === 2) return state.currentIndex;

  if (state.shuffle) {
    state.shufflePos = (state.shufflePos + 1) % state.shuffleOrder.length;
    return state.shuffleOrder[state.shufflePos];
  }
  return (state.currentIndex + 1) % SONGS.length;
}

function getPrevIndex() {
  // If more than 3s have played, restart current song
  if (audio.currentTime > 3) return state.currentIndex;

  if (state.shuffle) {
    state.shufflePos = (state.shufflePos - 1 + state.shuffleOrder.length) % state.shuffleOrder.length;
    return state.shuffleOrder[state.shufflePos];
  }
  return (state.currentIndex - 1 + SONGS.length) % SONGS.length;
}

function playNext() {
  animateButton(nextBtn);
  const next = getNextIndex();
  loadSong(next, state.isPlaying);
}

function playPrev() {
  animateButton(prevBtn);
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const prev = getPrevIndex();
  loadSong(prev, state.isPlaying);
}

/* ═══════════════════════════════════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════════════════════════════════ */
function updateProgress() {
  if (state.isDragging || !audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${pct}%`;
  progressThumb.style.left = `${pct}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent   = formatTime(audio.duration);
  updateLyricHighlight();
}

function seekFromEvent(e) {
  const rect = progressCont.querySelector('.progress-bar-bg').getBoundingClientRect();
  const x    = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const pct  = x / rect.width;
  audio.currentTime = pct * audio.duration;
  progressFill.style.width = `${pct * 100}%`;
  progressThumb.style.left = `${pct * 100}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

progressCont.addEventListener('mousedown', e => {
  state.isDragging = true;
  seekFromEvent(e);
});

document.addEventListener('mousemove', e => {
  if (state.isDragging) seekFromEvent(e);
});

document.addEventListener('mouseup', () => {
  state.isDragging = false;
});

// Touch support
progressCont.addEventListener('touchstart', e => {
  state.isDragging = true;
  seekFromEvent(e.touches[0]);
}, { passive: true });

document.addEventListener('touchmove', e => {
  if (state.isDragging) seekFromEvent(e.touches[0]);
}, { passive: true });

document.addEventListener('touchend', () => {
  state.isDragging = false;
});

/* ═══════════════════════════════════════════════════════════════════════
   VOLUME
   ═══════════════════════════════════════════════════════════════════════ */
function setVolume(val) {
  state.volume = val / 100;
  if (!state.muted) audio.volume = state.volume;
  updateVolumeSliderFill(val);
  updateVolumeIcon(val);
}

function updateVolumeSliderFill(val) {
  volumeSlider.style.setProperty('--vol', `${val}%`);
}

function updateVolumeIcon(val) {
  if (state.muted || val === 0) {
    volPath1.setAttribute('d', '');
    volPath2.setAttribute('d', '');
    muteBtn.querySelector('svg').innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/>
      <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>
    `;
  } else if (val < 40) {
    muteBtn.querySelector('svg').innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    `;
  } else {
    muteBtn.querySelector('svg').innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    `;
  }
}

function toggleMute() {
  state.muted = !state.muted;
  audio.volume = state.muted ? 0 : state.volume;
  updateVolumeIcon(state.muted ? 0 : state.volume * 100);
  volumeSlider.style.opacity = state.muted ? '0.4' : '1';
}

volumeSlider.addEventListener('input', e => setVolume(Number(e.target.value)));
muteBtn.addEventListener('click', toggleMute);

/* ═══════════════════════════════════════════════════════════════════════
   SHUFFLE
   ═══════════════════════════════════════════════════════════════════════ */
function toggleShuffle() {
  state.shuffle = !state.shuffle;
  shuffleBtn.classList.toggle('active', state.shuffle);
  if (state.shuffle) buildShuffleOrder();
  animateButton(shuffleBtn);
}

/* ═══════════════════════════════════════════════════════════════════════
   REPEAT   0 = off → 1 = repeat all → 2 = repeat one
   ═══════════════════════════════════════════════════════════════════════ */
function cycleRepeat() {
  state.repeat = (state.repeat + 1) % 3;
  repeatBtn.classList.toggle('active', state.repeat > 0);

  if (state.repeat === 2) {
    repeatBadge.classList.remove('hidden');
  } else {
    repeatBadge.classList.add('hidden');
  }
  animateButton(repeatBtn);
}

/* ═══════════════════════════════════════════════════════════════════════
   HEART / LIKE
   ═══════════════════════════════════════════════════════════════════════ */
function toggleLike() {
  const id = SONGS[state.currentIndex].id;
  if (state.liked.has(id)) {
    state.liked.delete(id);
    heartBtn.classList.remove('liked');
  } else {
    state.liked.add(id);
    heartBtn.classList.add('liked');
    heartBounce();
  }
  // Also update playlist item
  updatePlaylistActive(state.currentIndex);
}

function heartBounce() {
  heartBtn.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.4)' },
    { transform: 'scale(0.9)' },
    { transform: 'scale(1.1)' },
    { transform: 'scale(1)' },
  ], { duration: 400, easing: 'ease' });
}

/* ═══════════════════════════════════════════════════════════════════════
   PLAYLIST RENDERING
   ═══════════════════════════════════════════════════════════════════════ */
function renderPlaylist(songs = SONGS) {
  playlist.innerHTML = '';
  songs.forEach((song, idx) => {
    const realIndex = SONGS.indexOf(song);
    const li = document.createElement('li');
    li.className = 'playlist-item' + (realIndex === state.currentIndex ? ' active' : '');
    li.dataset.index = realIndex;

    li.innerHTML = `
      <div class="track-thumb">${song.emoji}</div>
      <div class="track-info">
        <div class="track-name">${song.title}</div>
        <div class="track-artist">${song.artist}</div>
      </div>
      <div class="track-duration" data-dur="${realIndex}">—</div>
      ${realIndex === state.currentIndex
        ? `<div class="now-playing-bars ${state.isPlaying ? '' : 'paused'}">
             <span></span><span></span><span></span>
           </div>`
        : ''
      }
    `;

    li.addEventListener('click', () => {
      loadSong(realIndex, true);
    });

    playlist.appendChild(li);
  });
}

function updatePlaylistActive(index) {
  document.querySelectorAll('.playlist-item').forEach(el => {
    const i = Number(el.dataset.index);
    el.classList.toggle('active', i === index);

    // Refresh now-playing bars
    const existing = el.querySelector('.now-playing-bars');
    if (existing) existing.remove();

    if (i === index) {
      const bars = document.createElement('div');
      bars.className = 'now-playing-bars' + (state.isPlaying ? '' : ' paused');
      bars.innerHTML = '<span></span><span></span><span></span>';
      el.appendChild(bars);
    }
  });
}

function updatePlaylistBars(playing) {
  document.querySelectorAll('.now-playing-bars').forEach(el => {
    if (playing) el.classList.remove('paused');
    else         el.classList.add('paused');
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   SEARCH
   ═══════════════════════════════════════════════════════════════════════ */
searchInput.addEventListener('input', e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) { renderPlaylist(); return; }
  const filtered = SONGS.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.artist.toLowerCase().includes(q) ||
    s.album.toLowerCase().includes(q)
  );
  renderPlaylist(filtered);
});

/* ═══════════════════════════════════════════════════════════════════════
   LYRICS
   ═══════════════════════════════════════════════════════════════════════ */
function renderLyrics(song) {
  lyricsContent.innerHTML = '';
  state.activeLyric = -1;
  song.lyrics.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'lyric-line';
    p.textContent = line;
    p.dataset.index = i;
    p.addEventListener('click', () => {
      if (audio.duration) {
        const step = audio.duration / song.lyrics.length;
        audio.currentTime = i * step;
        if (!state.isPlaying) playAudio();
      }
    });
    lyricsContent.appendChild(p);
  });
}

function updateLyricHighlight() {
  const song = SONGS[state.currentIndex];
  if (!audio.duration || !song.lyrics.length) return;

  const step    = audio.duration / song.lyrics.length;
  const lineIdx = Math.min(
    Math.floor(audio.currentTime / step),
    song.lyrics.length - 1
  );

  if (lineIdx === state.activeLyric) return;
  state.activeLyric = lineIdx;

  document.querySelectorAll('.lyric-line').forEach((el, i) => {
    el.classList.toggle('active', i === lineIdx);
  });

  // Scroll into view
  const active = lyricsContent.querySelector('.lyric-line.active');
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

lyricsBtn.addEventListener('click', () => {
  lyricsPanel.classList.toggle('hidden');
  lyricsBtn.classList.toggle('active', !lyricsPanel.classList.contains('hidden'));
});

closeLyricsBtn.addEventListener('click', () => {
  lyricsPanel.classList.add('hidden');
  lyricsBtn.classList.remove('active');
});

/* ═══════════════════════════════════════════════════════════════════════
   AUDIO EVENTS
   ═══════════════════════════════════════════════════════════════════════ */
audio.addEventListener('timeupdate', updateProgress);

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
  // Try to update duration in playlist
  const durEl = document.querySelector(`[data-dur="${state.currentIndex}"]`);
  if (durEl) durEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (state.repeat === 2) {
    audio.currentTime = 0;
    playAudio();
  } else if (state.repeat === 1 && state.currentIndex === SONGS.length - 1) {
    loadSong(0, true);
  } else {
    const next = getNextIndex();
    // If we've wrapped to the beginning with no repeat, stop
    if (!state.shuffle && state.repeat === 0 && next <= state.currentIndex && next === 0 && state.currentIndex === SONGS.length - 1) {
      loadSong(0, false);
    } else {
      loadSong(next, true);
    }
  }
});

audio.addEventListener('error', () => {
  console.warn('Audio load error for:', SONGS[state.currentIndex].src);
});

/* ═══════════════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ═══════════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  // Don't hijack typing in the search box
  if (e.target === searchInput) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (e.shiftKey) playNext();
      else audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || 0);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (e.shiftKey) playPrev();
      else audio.currentTime = Math.max(audio.currentTime - 5, 0);
      break;
    case 'ArrowUp':
      e.preventDefault();
      volumeSlider.value = Math.min(Number(volumeSlider.value) + 5, 100);
      setVolume(Number(volumeSlider.value));
      break;
    case 'ArrowDown':
      e.preventDefault();
      volumeSlider.value = Math.max(Number(volumeSlider.value) - 5, 0);
      setVolume(Number(volumeSlider.value));
      break;
    case 'KeyM':
      toggleMute();
      break;
    case 'KeyS':
      if (e.ctrlKey || e.metaKey) break;
      toggleShuffle();
      break;
    case 'KeyR':
      cycleRepeat();
      break;
    case 'KeyL':
      lyricsBtn.click();
      break;
  }
});

/* ═══════════════════════════════════════════════════════════════════════
   BUTTON CLICK ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════ */
function animateButton(btn) {
  btn.animate([
    { transform: 'scale(0.82)' },
    { transform: 'scale(1.12)' },
    { transform: 'scale(1)' },
  ], { duration: 240, easing: 'ease' });
}

/* ═══════════════════════════════════════════════════════════════════════
   WIRE UP BUTTONS
   ═══════════════════════════════════════════════════════════════════════ */
playPauseBtn.addEventListener('click', () => {
  animateButton(playPauseBtn);
  togglePlay();
});

nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', cycleRepeat);
heartBtn.addEventListener('click', toggleLike);

/* ═══════════════════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════════════════ */
(function init() {
  renderPlaylist();
  setVolume(80);
  loadSong(0, false);

  // Stagger playlist items in
  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-12px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    }, 60 + i * 55);
  });
})();
