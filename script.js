
const audio = document.getElementById("audio");
const trackList = document.getElementById("trackList");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const currentTitle = document.getElementById("currentTitle");
const currentArtist = document.getElementById("currentArtist");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const likeCurrent = document.getElementById("likeCurrent");
const miniArt = document.getElementById("miniArt");
const toast = document.getElementById("toast");

const tracks = [
  {
    title: "Midnight Dreams",
    artist: "Velora Sessions",
    mood: "Chill",
    time: "5:00",
    icon: "☾",
    cover: "cover-1",
    category: "chill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Ocean Between Us",
    artist: "The Quiet Hours",
    mood: "Ambient",
    time: "5:00",
    icon: "〜",
    cover: "cover-2",
    category: "chill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Golden Hour",
    artist: "Sunday Collective",
    mood: "Dreamy",
    time: "5:00",
    icon: "☼",
    cover: "cover-3",
    category: "energy",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Quiet Frequencies",
    artist: "Afterglow",
    mood: "Focus",
    time: "5:00",
    icon: "✧",
    cover: "cover-4",
    category: "focus",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Velvet Skies",
    artist: "Luna & Co.",
    mood: "Soulful",
    time: "5:00",
    icon: "✦",
    cover: "cover-5",
    category: "chill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Electric Bloom",
    artist: "Nova Sounds",
    mood: "Energy",
    time: "5:00",
    icon: "ϟ",
    cover: "cover-6",
    category: "energy",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  }
];

let currentIndex = -1;
let visibleTracks = [...tracks];
let favorites = new Set();
let isShuffle = false;
let isRepeat = false;
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function renderTracks(list = visibleTracks) {
  visibleTracks = list;
  trackList.innerHTML = "";

  document.getElementById("emptyState").hidden = list.length > 0;
  document.getElementById("trackCount").textContent =
    `${String(list.length).padStart(2, "0")} TRACKS`;

  list.forEach((track) => {
    const originalIndex = tracks.indexOf(track);
    const isPlaying = originalIndex === currentIndex;
    const isLiked = favorites.has(originalIndex);

    const row = document.createElement("div");
    row.className = `track-row${isPlaying ? " playing" : ""}`;

    const index = document.createElement("span");
    index.className = "track-index";
    index.textContent = isPlaying && !audio.paused
      ? "♫"
      : String(originalIndex + 1).padStart(2, "0");

    const info = document.createElement("div");
    info.className = "track-info";

    const cover = document.createElement("div");
    cover.className = `cover ${track.cover}`;
    cover.textContent = track.icon;

    const details = document.createElement("div");
    details.style.minWidth = "0";

    const name = document.createElement("strong");
    name.textContent = track.title;

    const artist = document.createElement("small");
    artist.textContent = track.artist;

    details.append(name, artist);
    info.append(cover, details);

    const mood = document.createElement("span");
    mood.className = "mood-tag";
    mood.textContent = track.mood;

    const length = document.createElement("span");
    length.className = "track-length";
    length.textContent = track.duration
      ? formatTime(track.duration)
      : track.time;

    const like = document.createElement("button");
    like.className = `row-like${isLiked ? " liked" : ""}`;
    like.textContent = isLiked ? "♥" : "♡";
    like.setAttribute("aria-label", "Toggle favorite");

    like.addEventListener("click", () => toggleFavorite(originalIndex));

    const play = document.createElement("button");
    play.className = "row-play";
    play.textContent = isPlaying && !audio.paused ? "Ⅱ" : "▶";
    play.setAttribute("aria-label", "Play track");

    play.addEventListener("click", () => playTrack(originalIndex));

    row.append(index, info, mood, length, like);

    info.style.cursor = "pointer";
    info.addEventListener("click", () => playTrack(originalIndex));

    row.addEventListener("dblclick", () => playTrack(originalIndex));
    row.title = "Select track to play";

    // Keep the row compact while preserving a separate play control.
    row.append(play);
    trackList.appendChild(row);
  });
}

function updatePlayer() {
  if (currentIndex < 0) return;

  const track = tracks[currentIndex];

  currentTitle.textContent = track.title;
  currentArtist.textContent = track.artist;
  miniArt.textContent = track.icon;
  miniArt.className = `mini-art ${track.cover}`;

  likeCurrent.textContent = favorites.has(currentIndex) ? "♥" : "♡";
  likeCurrent.classList.toggle("liked", favorites.has(currentIndex));

  renderTracks(visibleTracks);
}

async function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;

  if (currentIndex === index && !audio.paused) {
    audio.pause();
    return;
  }

  const isNewTrack = currentIndex !== index;
  currentIndex = index;

  if (isNewTrack) {
    audio.src = tracks[index].url;
    audio.load();
  }

  updatePlayer();

  try {
    await audio.play();
  } catch (error) {
    showToast("Unable to play this track. Check your internet connection.");
    console.error("Playback error:", error);
  }
}

function togglePlayback() {
  if (currentIndex < 0) {
    playTrack(0);
    return;
  }

  if (audio.paused) {
    audio.play().catch(() => {
      showToast("Playback failed. Please try again.");
    });
  } else {
    audio.pause();
  }
}

function nextTrack() {
  if (isShuffle && tracks.length > 1) {
    let nextIndex;

    do {
      nextIndex = Math.floor(Math.random() * tracks.length);
    } while (nextIndex === currentIndex);

    playTrack(nextIndex);
  } else {
    playTrack((currentIndex + 1) % tracks.length);
  }
}

function previousTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  playTrack((currentIndex - 1 + tracks.length) % tracks.length);
}

function toggleFavorite(index) {
  if (favorites.has(index)) {
    favorites.delete(index);
    showToast("Removed from favorites");
  } else {
    favorites.add(index);
    showToast("Added to favorites ♥");
  }

  updatePlayer();

  if (document.getElementById("viewName").textContent === "Favorites") {
    renderTracks(tracks.filter((track, i) => favorites.has(i)));
  }
}

function filterTracks(query) {
  const search = query.trim().toLowerCase();

  const filtered = tracks.filter((track) => {
    return track.title.toLowerCase().includes(search) ||
      track.artist.toLowerCase().includes(search) ||
      track.mood.toLowerCase().includes(search);
  });

  document.getElementById("tracksTitle").textContent =
    search ? "Search results" : "Trending tracks";

  renderTracks(filtered);
}

function showView(view) {
  const viewNames = {
    home: "Discover",
    library: "Your Library",
    favorites: "Favorites",
    chill: "Midnight Chill",
    focus: "Deep Focus",
    energy: "Good Energy"
  };

  const title = viewNames[view] || "Discover";

  document.getElementById("viewName").textContent = title;
  document.getElementById("tracksTitle").textContent =
    view === "favorites" ? "Your favorites" :
    view === "library" ? "Your library" :
    view === "home" ? "Trending tracks" : title;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  let filtered = tracks;

  if (view === "favorites") {
    filtered = tracks.filter((track, i) => favorites.has(i));
  } else if (["chill", "focus", "energy"].includes(view)) {
    filtered = tracks.filter((track) => track.category === view);
  }

  if (view === "library") {
    showToast("Your music library");
  }

  document.getElementById("searchInput").value = "";
  renderTracks(filtered);
}

playBtn.addEventListener("click", togglePlayback);
document.getElementById("prevBtn").addEventListener("click", previousTrack);
document.getElementById("nextBtn").addEventListener("click", nextTrack);
document.getElementById("heroPlay").addEventListener("click", () => {
  playTrack(currentIndex < 0 ? 0 : currentIndex);
});

document.getElementById("exploreBtn").addEventListener("click", () => {
  document.getElementById("tracksSection").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

likeCurrent.addEventListener("click", () => {
  if (currentIndex < 0) {
    showToast("Play a track first");
    return;
  }

  toggleFavorite(currentIndex);
});

document.getElementById("shuffleBtn").addEventListener("click", (event) => {
  isShuffle = !isShuffle;
  event.currentTarget.classList.toggle("enabled", isShuffle);
  showToast(isShuffle ? "Shuffle is on" : "Shuffle is off");
});

document.getElementById("repeatBtn").addEventListener("click", (event) => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  event.currentTarget.classList.toggle("enabled", isRepeat);
  showToast(isRepeat ? "Repeat is on" : "Repeat is off");
});

document.getElementById("searchInput").addEventListener("input", (event) => {
  filterTracks(event.target.value);
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

document.querySelectorAll("[data-mood]").forEach((button) => {
  button.addEventListener("click", () => {
    showView(button.dataset.mood);
    document.getElementById("tracksSection").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

audio.addEventListener("play", () => {
  playBtn.textContent = "Ⅱ";
  playBtn.setAttribute("aria-label", "Pause");
  updatePlayer();
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  playBtn.setAttribute("aria-label", "Play");
  updatePlayer();
});

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);

  if (currentIndex >= 0) {
    tracks[currentIndex].duration = audio.duration;
    renderTracks(visibleTracks);
  }
});

audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTime.textContent = formatTime(audio.currentTime);
  duration.textContent = formatTime(audio.duration);

  progress.style.setProperty("--progress", `${progress.value}%`);
});

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

audio.addEventListener("ended", () => {
  if (!isRepeat) nextTrack();
});

audio.addEventListener("error", () => {
  if (currentIndex >= 0) {
    showToast("Audio unavailable. Try another track.");
  }
});

document.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTyping = target.matches("input, textarea, select");

  if (event.code === "Space" && !isTyping) {
    event.preventDefault();
    togglePlayback();
  }

  if (event.key === "/" && !isTyping) {
    event.preventDefault();
    document.getElementById("searchInput").focus();
  }
});

audio.volume = Number(volume.value);
renderTracks(tracks);
