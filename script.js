document.addEventListener("DOMContentLoaded", () => {
  let channels = [];

  async function fetchChannels() {
    try {
      const res = await fetch("channels.json");
      channels = await res.json();
      renderFilters();
      renderChannels(channels);
    } catch (e) {
      alert("Failed to load channels.");
    }
  }

  function renderFilters() {
    const categories = [...new Set(channels.map(ch => ch.category).filter(Boolean))];
    const genres = [...new Set(channels.map(ch => ch.genre).filter(Boolean))];
    const languages = [...new Set(channels.map(ch => ch.language).filter(Boolean))];

    addOptions("categoryFilter", categories);
    addOptions("genreFilter", genres);
    addOptions("languageFilter", languages);
  }

  function addOptions(selectId, options) {
    const select = document.getElementById(selectId);
    options.forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.innerText = opt;
      select.appendChild(o);
    });
  }

  function renderChannels(list) {
    const grid = document.getElementById("channelGrid");
    grid.innerHTML = "";
    list.forEach(ch => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${ch.logo || 'https://via.placeholder.com/160x90?text=No+Logo'}" alt="${ch.name}">
        <h3>${ch.name}</h3>
      `;
      card.onclick = () => playChannel(ch.url);
      grid.appendChild(card);
    });
  }

  function playChannel(url) {
    const wrapper = document.getElementById("playerWrapper");
    const oldPlayer = document.getElementById("videoPlayer");
    const newPlayer = oldPlayer.cloneNode(true);
    oldPlayer.parentNode.replaceChild(newPlayer, oldPlayer);

    if (url.endsWith(".mpd")) {
      const dash = dashjs.MediaPlayer().create();
      dash.initialize(newPlayer, url, true);
    } else {
      newPlayer.src = url;
      newPlayer.load();
    }
    wrapper.classList.add("show");
  }

  function closePlayer() {
    document.getElementById("playerWrapper").classList.remove("show");
    const player = document.getElementById("videoPlayer");
    player.pause();
    player.src = "";
  }

  function applyFilters() {
    const search = document.getElementById("search").value.toLowerCase();
    const cat = document.getElementById("categoryFilter").value;
    const gen = document.getElementById("genreFilter").value;
    const lang = document.getElementById("languageFilter").value;

    const filtered = channels.filter(ch =>
      (!cat || ch.category === cat) &&
      (!gen || ch.genre === gen) &&
      (!lang || ch.language === lang) &&
      ch.name.toLowerCase().includes(search)
    );

    renderChannels(filtered);
  }

  document.getElementById("search").addEventListener("input", applyFilters);
  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
  document.getElementById("genreFilter").addEventListener("change", applyFilters);
  document.getElementById("languageFilter").addEventListener("change", applyFilters);
  document.getElementById("refresh").addEventListener("click", fetchChannels);

  window.closePlayer = closePlayer;

  fetchChannels();
});
