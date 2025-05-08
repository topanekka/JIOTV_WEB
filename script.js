document.addEventListener("DOMContentLoaded", () => {
  let channels = [];

  async function fetchChannels() {
    const response = await fetch('channels.json');
    channels = await response.json();
    renderFilters();
    renderChannels();
  }

  function renderFilters() {
    const genres = [...new Set(channels.map(ch => ch.genre))];
    const categories = [...new Set(channels.map(ch => ch.category))];
    const languages = [...new Set(channels.map(ch => ch.language))];

    document.getElementById('genreFilter').innerHTML = genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
    document.getElementById('categoryFilter').innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
    document.getElementById('languageFilter').innerHTML = languages.map(language => `<option value="${language}">${language}</option>`).join('');
  }

  function renderChannels() {
    const grid = document.getElementById('channelGrid');
    grid.innerHTML = '';
    channels.forEach(channel => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${channel.logo}" alt="${channel.name}">
        <h3>${channel.name}</h3>
        <span>${channel.category}</span>
      `;
      card.addEventListener('click', () => playChannel(channel.url));
      grid.appendChild(card);
    });
  }

function playChannel(url) {
  const wrapper = document.getElementById("playerWrapper");

  // Replace old video element
  const oldPlayer = document.getElementById("videoPlayer");
  const newPlayer = oldPlayer.cloneNode(true);
  oldPlayer.parentNode.replaceChild(newPlayer, oldPlayer);

  // Clear previous errors or sources
  newPlayer.src = "";
  newPlayer.load();

  // Determine stream type
  const isMPD = url.includes(".mpd");
  const isHLS = url.includes(".m3u8") || url.includes("ch=") || url.includes("id=");

  // DASH (.mpd) stream
  if (isMPD) {
    try {
      const dash = dashjs.MediaPlayer().create();
      dash.initialize(newPlayer, url, true);
    } catch (e) {
      alert("DASH stream failed to load.");
      console.error("DASH error:", e);
    }
  }

  // HLS or fallback
  else if (isHLS || url.startsWith("http")) {
    newPlayer.src = url;
    newPlayer.load();
  }

  // Show player popup
  wrapper.classList.add("show");

  // Optional: auto fullscreen
  if (newPlayer.requestFullscreen) {
    newPlayer.requestFullscreen().catch(() => {});
  }
}

  fetchChannels();
});