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
    const player = document.getElementById('videoPlayer');
    const wrapper = document.getElementById('playerWrapper');
    if (url.endsWith('.mpd')) {
      const dashPlayer = dashjs.MediaPlayer().create();
      dashPlayer.initialize(player, url, true);
    } else {
      player.src = url;
      player.load();
    }
    wrapper.classList.add('show');
  }

  fetchChannels();
});
