// ===== GAME SELECTION =====
let gamesData = null;

const LANGUAGE_PACK = {
  vi: {
    hub_title: "🎮 FAMILY GAME HUB",
    hub_subtitle: "Chọn trò chơi bạn thích",
    manage_players_btn: "👥 Quản lý người chơi",
    hub_version_note: "Sẽ có thêm game mới sớm thôi!",
    language_label: "Ngôn ngữ",
    quit_modal_title: "Thoát trò chơi?",
    quit_modal_text: "Bạn có chắc muốn thoát ván hiện tại không?",
    quit_modal_cancel: "Hủy",
    quit_modal_confirm: "Thoát",
    game_badge_available: "Chơi ngay",
    game_badge_coming: "Sắp ra mắt",
  },
  en: {
    hub_title: "🎮 FAMILY GAME HUB",
    hub_subtitle: "Choose your game",
    manage_players_btn: "👥 Manage Players",
    hub_version_note: "More games coming soon!",
    language_label: "Language",
    quit_modal_title: "Quit Game?",
    quit_modal_text: "Are you sure you want to quit the current game?",
    quit_modal_cancel: "Cancel",
    quit_modal_confirm: "Yes, quit",
    game_badge_available: "Play Now",
    game_badge_coming: "Coming Soon",
  },
};

let currentLanguage =
  localStorage.getItem("gameLanguage") &&
  LANGUAGE_PACK[localStorage.getItem("gameLanguage")]
    ? localStorage.getItem("gameLanguage")
    : "vi";

function t(key, fallback = "") {
  const pack = LANGUAGE_PACK[currentLanguage] || {};
  return pack[key] || fallback || key;
}

function getLocalizedGameData(game) {
  if (!game) return null;
  const translations = game.translations || {};
  return (
    translations[currentLanguage] ||
    translations.en ||
    translations.vi ||
    null
  );
}

function getBadgeLabel(type) {
  const fallbackKey =
    type === "available" ? "game_badge_available" : "game_badge_coming";
  const fallbackText = type === "available" ? "Play Now" : "Coming Soon";
  const localized =
    gamesData?.badges?.[type]?.[currentLanguage] ||
    gamesData?.badges?.[type]?.en ||
    gamesData?.badges?.[type]?.vi ||
    null;
  return localized || t(fallbackKey, fallbackText);
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    if (!key) return;
    const text = t(key, el.textContent.trim());
    if (text) {
      el.textContent = text;
    }
  });
}

function updateLanguageButtons() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const lang = btn.dataset.lang;
    btn.classList.toggle("active", lang === currentLanguage);
  });
}

function setLanguage(lang) {
  if (!LANGUAGE_PACK[lang]) return;
  currentLanguage = lang;
  localStorage.setItem("gameLanguage", lang);
  applyTranslations();
  updateLanguageButtons();
  renderGames();
}

function initLanguageControls() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
    });
  });
  applyTranslations();
  updateLanguageButtons();
}

async function loadGames() {
  try {
    const response = await fetch("games.json");
    gamesData = await response.json();
    renderGames();
  } catch (error) {
    console.error("Error loading games:", error);
    // Fallback to hardcoded games if JSON fails to load
    gamesData = {
      badges: {
        available: {
          vi: "Chơi ngay",
          en: "Play Now",
        },
        coming: {
          vi: "Sắp ra mắt",
          en: "Coming Soon",
        },
      },
      games: [
        {
          id: "battleship",
          name: "Battleship 2P",
          description:
            "Classic naval warfare strategy game (Offline Pass-Play)",
          players: "2 Players",
          status: "available",
          icon: "🚢",
          color: "#4dd0e1",
          version: "1.0.0",
          translations: {
            vi: {
              name: "Hải Chiến 2 Người",
              description: "Đặt tàu và đấu trí trên biển (chơi luân phiên)",
              players: "2 người chơi",
            },
            en: {
              name: "Battleship 2P",
              description:
                "Classic naval warfare strategy game (Offline Pass-Play)",
              players: "2 Players",
            },
          },
        },
        {
          id: "memory-match",
          name: "Memory Match Duel",
          description:
            "Turn-based memory matching game with animals (4×4, 5×4, or 6×6 grid)",
          players: "2 Players",
          status: "available",
          icon: "🐾",
          color: "#ff9800",
          version: "1.0.0",
          translations: {
            vi: {
              name: "Thử Trí Nhớ",
              description: "Lật thẻ thú cưng, ai nhớ nhanh hơn sẽ thắng",
              players: "2 người chơi",
            },
            en: {
              name: "Memory Match Duel",
              description:
                "Turn-based memory matching game with animals (4×4, 5×4, or 6×6 grid)",
              players: "2 Players",
            },
          },
        },
        {
          id: "sushi-poison",
          name: "Poison Sushi Duel",
          description: "Pick 2 poisoned sushi pieces and take turns eating them",
          players: "2 Players",
          status: "available",
          icon: "🍣",
          color: "#ff9a9e",
          version: "1.0.0",
          translations: {
            vi: {
              name: "Sushi Có Độc!",
              description: "Giấu độc và đoán xem đối thủ ăn miếng nào",
              players: "2 người chơi",
            },
            en: {
              name: "Poison Sushi Duel",
              description: "Pick 2 poisoned sushi pieces and take turns eating them",
              players: "2 Players",
            },
          },
        },
        {
          id: "smart-shop",
          name: "Smart Shop Race",
          description:
            "Educational shopping race - count, colors & categories (3 levels)",
          players: "2 Players",
          status: "available",
          icon: "🛒",
          color: "#9c27b0",
          version: "1.0.0",
          translations: {
            vi: {
              name: "Đua Siêu Thị",
              description: "Đi chợ vui vẻ: đếm đồ, phân loại màu sắc",
              players: "2 người chơi",
            },
            en: {
              name: "Smart Shop Race",
              description:
                "Educational shopping race - count, colors & categories (3 levels)",
              players: "2 Players",
            },
          },
        },
        {
          id: "magic-letter",
          name: "Magic Letter Hunt",
          description:
            "Vietnamese letter learning game - find letters, words & bigrams (3 levels)",
          players: "2 Players",
          status: "available",
          icon: "✨",
          color: "#f093fb",
          version: "1.0.0",
          translations: {
            vi: {
              name: "Săn Chữ Thần Kỳ",
              description: "Tìm chữ, ghép từ tiếng Việt qua 3 cấp độ",
              players: "2 người chơi",
            },
            en: {
              name: "Magic Letter Hunt",
              description:
                "Vietnamese letter learning game - find letters, words & bigrams (3 levels)",
              players: "2 Players",
            },
          },
        },
        {
          id: "candy-tower",
          name: "Candy Tower Turn",
          description: "Stack candies on a wobbly tower and stay balanced",
          players: "2 Players",
          status: "available",
          icon: "🍬",
          color: "#ff6f91",
          version: "1.0.0",
          translations: {
            vi: {
              name: "Xây Tháp Kẹo",
              description: "Đặt kẹo lên tháp, giữ cân bằng trong 10s",
              players: "2 người chơi",
            },
            en: {
              name: "Candy Tower Turn",
              description: "Stack candies on a wobbly tower and stay balanced",
              players: "2 Players",
            },
          },
        },
      ],
    };
    renderGames();
  }
}

function renderGames() {
  const gamesGrid = document.getElementById("gamesGrid");
  if (!gamesGrid || !gamesData) return;

  gamesGrid.innerHTML = "";

  gamesData.games.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.className = `game-card ${game.status}`;
    gameCard.dataset.gameId = game.id;

    const localizedGame = getLocalizedGameData(game);
    const gameName = localizedGame?.name || game.name;
    const gameDescription = localizedGame?.description || game.description;
    const gamePlayers = localizedGame?.players || game.players;
    const badgeText =
      game.status === "available"
        ? getBadgeLabel("available")
        : getBadgeLabel("coming");

    gameCard.innerHTML = `
            <div class="game-status-badge ${game.status}">
                ${badgeText}
            </div>
            <div class="game-card-content">
                <span class="game-icon">${game.icon}</span>
                <div class="game-name">${gameName}</div>
                <div class="game-description">${gameDescription}</div>
                <div class="game-players">${gamePlayers}</div>
            </div>
        `;

    if (game.status === "available") {
      gameCard.addEventListener("click", () => selectGame(game.id));
    }

    gamesGrid.appendChild(gameCard);
  });
}

function selectGame(gameId) {
  // Check if we should show player selection (skip if coming from player selection)
  if (!window.skipPlayerSelection) {
    showPlayerSelection(gameId);
    return;
  }

  // Reset flag
  window.skipPlayerSelection = false;

  switch (gameId) {
    case "battleship":
      showScreen("mainMenu");
      break;
    case "memory-match":
      window.location.href = "memory-match.html";
      break;
    case "smart-shop":
      window.location.href = "smart-shop.html";
      break;
    case "magic-letter":
      window.location.href = "magic-letter.html";
      break;
    case "sushi-poison":
      window.location.href = "sushi-poison.html";
      break;
    case "candy-tower":
      window.location.href = "candy-tower.html";
      break;
    default:
      alert("This game is coming soon!");
  }
}

function backToGameSelection() {
  showScreen("gameSelectionScreen");
}

// ===== PLAYER MANAGEMENT =====
let editingPlayerId = null;
let selectingForSlot = null;

function showPlayerManagement() {
  renderPlayersList();
  showModal("playerManagementModal");
}

function closePlayerManagement() {
  hideModal("playerManagementModal");
}

function renderPlayersList() {
  const playersList = document.getElementById("playersList");
  const players = getPlayers();

  playersList.innerHTML = "";

  players.forEach((player, index) => {
    const playerItem = document.createElement("div");
    playerItem.className = "player-item";

    const fallbackSeed = (player.name && player.name.charAt(0).toUpperCase()) ||
      index + 1;
    const avatarSrc = player.avatar || createDefaultAvatar(fallbackSeed);
    const childBadge = player.isChild
      ? '<span class="player-role-badge kid">Bé</span>'
      : "";
    const childNote = player.isChild
      ? '<div class="player-item-meta">Đánh dấu là bé để bật hỗ trợ thân thiện</div>'
      : "";

    playerItem.innerHTML = `
            <div class="player-item-avatar">
                <img src="${avatarSrc}" alt="${player.name}">
            </div>
            <div class="player-info">
                <div class="player-item-name">${player.name}${childBadge}</div>
                ${childNote}
            </div>
            <div class="player-actions">
                <button class="btn btn-secondary btn-small" onclick="editPlayer('${player.id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="confirmDeletePlayer('${player.id}')">Delete</button>
            </div>
        `;

    playersList.appendChild(playerItem);
  });
}

function addNewPlayer() {
  editingPlayerId = null;
  document.getElementById("playerEditTitle").textContent = "Add New Player";
  document.getElementById("playerNameInput").value = "";
  document.getElementById("playerAvatarPreview").innerHTML = `
        <img src="${createDefaultAvatar(Date.now())}" alt="Default avatar">
    `;
  const childInput = document.getElementById("playerChildInput");
  if (childInput) childInput.checked = false;
  showModal("playerEditModal");
}

function editPlayer(id) {
  editingPlayerId = id;
  const player = getPlayerById(id);

  if (!player) return;

  document.getElementById("playerEditTitle").textContent = "Edit Player";
  document.getElementById("playerNameInput").value = player.name;
  const childInput = document.getElementById("playerChildInput");
  if (childInput) childInput.checked = !!player.isChild;

  const avatarPreview = document.getElementById("playerAvatarPreview");
  if (player.avatar) {
    avatarPreview.innerHTML = `<img src="${player.avatar}" alt="${player.name}">`;
  } else {
    const fallbackSeed = (player.name && player.name.charAt(0).toUpperCase()) ||
      Date.now();
    avatarPreview.innerHTML = `<img src="${createDefaultAvatar(
      fallbackSeed
    )}" alt="${player.name}">`;
  }

  showModal("playerEditModal");
}

function confirmDeletePlayer(id) {
  const player = getPlayerById(id);
  if (!player) return;

  if (confirm(`Are you sure you want to delete ${player.name}?`)) {
    deletePlayer(id);
    renderPlayersList();
  }
}

function closePlayerEdit() {
  hideModal("playerEditModal");
  editingPlayerId = null;
}

function savePlayer() {
  const name = document.getElementById("playerNameInput").value.trim();

  if (!name) {
    alert("Please enter a player name");
    return;
  }

  const avatarPreview = document.getElementById("playerAvatarPreview");
  const img = avatarPreview.querySelector("img");
  const avatar = img ? img.src : null;
  const childInput = document.getElementById("playerChildInput");
  const isChild = childInput ? childInput.checked : false;

  if (editingPlayerId) {
    // Update existing player
    updatePlayer(editingPlayerId, name, avatar, isChild);
  } else {
    // Add new player
    addPlayer(name, avatar, isChild);
  }

  renderPlayersList();
  closePlayerEdit();
}

// Handle avatar upload in player edit modal
document.addEventListener("DOMContentLoaded", () => {
  initLanguageControls();

  const avatarInput = document.getElementById("playerAvatarInput");
  if (avatarInput) {
    avatarInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        alert("Image size should be less than 20MB");
        return;
      }

      imageToBase64(file, (base64) => {
        const avatarPreview = document.getElementById("playerAvatarPreview");
        avatarPreview.innerHTML = `<img src="${base64}" alt="Avatar">`;
      });
    });
  }
});

// ===== PLAYER SELECTION =====
function showPlayerSelection(gameId) {
  selectingForSlot = null;
  renderAvailablePlayers();

  // Load previously selected players if any
  const selectedPlayerIds = getSelectedPlayers() || [];
  const players = getPlayers();

  if (selectedPlayerIds.length === 2) {
    const p1 = players.find((p) => p.id === selectedPlayerIds[0]);
    const p2 = players.find((p) => p.id === selectedPlayerIds[1]);

    if (p1) updateSelectedPlayerSlot(1, p1);
    if (p2) updateSelectedPlayerSlot(2, p2);
  } else {
    // Clear slots
    updateSelectedPlayerSlot(1, null);
    updateSelectedPlayerSlot(2, null);
  }

  // Ensure start button reflects the current selection state
  validatePlayerSelection();

  // Store game ID for later
  window.pendingGameId = gameId;

  showModal("playerSelectionModal");
}

function selectPlayerSlot(slot) {
  selectingForSlot = slot;

  // Highlight selected slot
  document.querySelectorAll(".selected-player-card").forEach((card) => {
    card.classList.remove("active-slot");
  });
  document.getElementById(`selectedPlayer${slot}`).classList.add("active-slot");
  renderAvailablePlayers(slot);
}

function selectAvailablePlayer(id) {
  if (!selectingForSlot) {
    alert("Please select a player slot first (Player 1 or Player 2)");
    return;
  }

  const player = getPlayerById(id);
  if (!player) return;

  updateSelectedPlayerSlot(selectingForSlot, player);
  selectingForSlot = null;

  // Remove active slot highlight
  document.querySelectorAll(".selected-player-card").forEach((card) => {
    card.classList.remove("active-slot");
  });
  renderAvailablePlayers();

  // Check if both slots filled
  validatePlayerSelection();
}

function updateSelectedPlayerSlot(slot, player) {
  const slotElement = document.getElementById(`selectedPlayer${slot}`);

  if (player) {
    const fallbackSeed = (player.name && player.name.charAt(0).toUpperCase()) || slot;
    const avatarSrc = player.avatar || createDefaultAvatar(fallbackSeed);
    const childBadge = player.isChild
      ? '<span class="player-role-badge kid">Bé</span>'
      : "";

    slotElement.innerHTML = `
            <div class="player-card-avatar"><img src="${avatarSrc}" alt="${player.name}"></div>
            <div class="player-card-name">
                <span>${player.name}</span>
                ${childBadge}
            </div>
        `;
    slotElement.dataset.playerId = player.id;
  } else {
    slotElement.innerHTML = `
            <div class="player-card-avatar"></div>
            <div class="player-card-name">Click to select</div>
        `;
    delete slotElement.dataset.playerId;
  }
}

function renderAvailablePlayers(filterSlot = null) {
  const availablePlayers = document.getElementById("availablePlayers");
  const container = document.getElementById("availablePlayersContainer");
  if (!availablePlayers || !container) return;

  const players = getPlayers();
  const selectedIds = [];
  [1, 2].forEach((slot) => {
    const el = document.getElementById(`selectedPlayer${slot}`);
    if (el && el.dataset.playerId) {
      selectedIds.push(el.dataset.playerId);
    }
  });

  const filtered = players.filter(
    (player) => !selectedIds.includes(player.id)
  );

  availablePlayers.innerHTML = "";

  if (!filterSlot) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");

  if (!filtered.length) {
    availablePlayers.innerHTML = "<p class=\"available-player-empty\">No players available</p>";
    return;
  }

  filtered.forEach((player, index) => {
    const playerItem = document.createElement("div");
    playerItem.className = "available-player-item";
    playerItem.onclick = () => selectAvailablePlayer(player.id);

    const fallbackSeed = (player.name && player.name.charAt(0).toUpperCase()) ||
      index + 1;
    const avatarSrc = player.avatar || createDefaultAvatar(fallbackSeed);
    const childBadge = player.isChild
      ? '<span class="player-role-badge kid">Bé</span>'
      : "";

    playerItem.innerHTML = `
            <div class="available-player-avatar"><img src="${avatarSrc}" alt="${player.name}"></div>
            <div class="available-player-info">
                <span class="available-player-name">${player.name}</span>
                ${childBadge}
            </div>
        `;

    availablePlayers.appendChild(playerItem);
  });
}

function validatePlayerSelection() {
  const p1 = document.getElementById("selectedPlayer1").dataset.playerId;
  const p2 = document.getElementById("selectedPlayer2").dataset.playerId;

  const startBtn = document.getElementById("startGameBtn");

  if (p1 && p2 && p1 !== p2) {
    startBtn.disabled = false;
  } else {
    startBtn.disabled = true;
  }
}

function confirmPlayerSelection() {
  const p1Id = document.getElementById("selectedPlayer1").dataset.playerId;
  const p2Id = document.getElementById("selectedPlayer2").dataset.playerId;

  if (!p1Id || !p2Id) {
    alert("Please select both players");
    return;
  }

  if (p1Id === p2Id) {
    alert("Please select two different players");
    return;
  }

  // Save selected players
  saveSelectedPlayers([p1Id, p2Id]);

  // Load player data into game state
  const players = getPlayers();
  const p1 = players.find((p) => p.id === p1Id);
  const p2 = players.find((p) => p.id === p2Id);

  if (p1 && p2) {
    // Update game state with player info (for Battleship)
    if (gameState) {
      gameState.player1.captainName = p1.name;
      gameState.player1.captainImage = p1.avatar;
      gameState.player1.isChild = !!p1.isChild;
      gameState.player2.captainName = p2.name;
      gameState.player2.captainImage = p2.avatar;
      gameState.player2.isChild = !!p2.isChild;
    }
  }

  closePlayerSelection();

  // Start the appropriate game - set flag to skip player selection
  const gameId = window.pendingGameId;
  window.skipPlayerSelection = true;

  // For external games, pass player data via URL or localStorage
  if (
    gameId === "memory-match" ||
    gameId === "smart-shop" ||
    gameId === "magic-letter"
  ) {
    // Player data is already in localStorage via selectedPlayers
    window.location.href = getGameUrl(gameId);
  } else {
    selectGame(gameId);
  }
}

function getGameUrl(gameId) {
  switch (gameId) {
    case "memory-match":
      return "memory-match.html";
    case "smart-shop":
      return "smart-shop.html";
    case "magic-letter":
      return "magic-letter.html";
    case "sushi-poison":
      return "sushi-poison.html";
    default:
      return "index.html";
  }
}

function closePlayerSelection() {
  hideModal("playerSelectionModal");
  selectingForSlot = null;
}

// ===== GAME STATE =====
const BOARD_SIZE = 10;
const SHIPS = [
  { length: 2, count: 1 },
  { length: 3, count: 2 },
  { length: 4, count: 1 },
];

// ===== SOUND SYSTEM =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
}

function playSound(type) {
  if (!gameState.settings.sound) return;

  initAudio();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case "hit":
      // Explosion sound
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(200, now);
      oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;

    case "miss":
      // Splash sound
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, now);
      oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;

    case "sunk":
      // Big explosion sound
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(300, now);
      oscillator.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      oscillator.start(now);
      oscillator.stop(now + 0.5);

      // Add second oscillator for more depth
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = "square";
        const now2 = audioCtx.currentTime;
        osc2.frequency.setValueAtTime(150, now2);
        osc2.frequency.exponentialRampToValueAtTime(20, now2 + 0.4);
        gain2.gain.setValueAtTime(0.2, now2);
        gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.4);
        osc2.start(now2);
        osc2.stop(now2 + 0.4);
      }, 100);
      break;

    case "place":
      // Ship placement sound
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.setValueAtTime(550, now + 0.05);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;
  }
}

let gameState = {
  currentScreen: "mainMenu",
  currentPlayer: 1,
  setupPhase: "player1",
  selectedShip: null,
  selectedBoardShip: null,
  isHorizontal: true,
  isProcessingAttack: false,
  draggingShip: null,
  hintTimeoutId: null,
  hintCell: null,
  missStreak: { 1: 0, 2: 0 },

  player1: {
    board: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0)),
    ships: [],
    shipsRemaining: { 2: 1, 3: 2, 4: 1 },
    hits: 0,
    misses: 0,
    attacks: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0)),
    shipsDestroyed: 0,
    shipsDestroyedByType: { 2: 0, 3: 0, 4: 0 }, // Track by ship length
    captainImage: null, // Base64 image data
    captainName: "Player 1",
    isChild: false,
  },

  player2: {
    board: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0)),
    ships: [],
    shipsRemaining: { 2: 1, 3: 2, 4: 1 },
    hits: 0,
    misses: 0,
    attacks: Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0)),
    shipsDestroyed: 0,
    shipsDestroyedByType: { 2: 0, 3: 0, 4: 0 }, // Track by ship length
    captainImage: null, // Base64 image data
    captainName: "Player 2",
    isChild: false,
  },

  settings: {
    sound: true,
    animations: true,
    coordStyle: "letters",
  },

  gameStartTime: null,
  turnCount: 0,
  historyShots: [], // Track all shots: {player, row, col, result, turnIndex}
};

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
  gameState.currentScreen = screenId;
}

function showModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// ===== MAIN MENU =====
function startGame() {
  gameState.currentPlayer = 1;
  gameState.setupPhase = "player1";
  gameState.isHorizontal = true;
  gameState.selectedShip = null;
  clearSelectedBoardShip();
  gameState.isProcessingAttack = false;
  gameState.draggingShip = null;
  clearChildHint();
  resetPlayerData(gameState.player1);
  resetPlayerData(gameState.player2);
  gameState.turnCount = 0;
  gameState.historyShots = [];
  gameState.gameStartTime = null;
  gameState.missStreak = { 1: 0, 2: 0 };
  showSetupScreen(1);
}

function showHowToPlay() {
  showModal("howToPlayModal");
}

function closeHowToPlay() {
  hideModal("howToPlayModal");
}

function showSettings() {
  showScreen("settingsScreen");
}

function closeSettings() {
  showScreen("mainMenu");
}

function goHome() {
  showScreen("gameSelectionScreen");
}

// ===== SETTINGS =====
function toggleSoundSetting() {
  gameState.settings.sound = document.getElementById("soundToggle").checked;
}

function toggleAnimationSetting() {
  gameState.settings.animations =
    document.getElementById("animationToggle").checked;
}

function updateCoordStyle() {
  gameState.settings.coordStyle = document.getElementById("coordStyle").value;
}

function toggleSound() {
  gameState.settings.sound = !gameState.settings.sound;
  document.getElementById("soundStatus").textContent = gameState.settings.sound
    ? "ON"
    : "OFF";
}

// ===== SETUP PHASE =====
function showSetupScreen(playerNum) {
  const player = getCurrentPlayer();
  clearSelectedBoardShip();
  const playerName = player.captainName || `Player ${playerNum}`;
  document.getElementById("setupTitle").textContent = `Setup - ${playerName}`;
  updateShipCounts();
  renderSetupBoard();
  updateSetupStatus("Select a ship, hover board to preview");
  document.getElementById("readyButton").disabled = !isSetupComplete();

  showScreen("setupScreen");
}

function resetPlayerData(player) {
  player.board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));
  player.ships = [];
  player.shipsRemaining = { 2: 1, 3: 2, 4: 1 };
  player.hits = 0;
  player.misses = 0;
  player.attacks = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));
  player.shipsDestroyed = 0;
  player.shipsDestroyedByType = { 2: 0, 3: 0, 4: 0 };
}

function createEmptyBoard() {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));
}

function buildBoardFromShips(ships) {
  const board = createEmptyBoard();

  ships.forEach((ship) => {
    ship.cells.forEach(([r, c]) => {
      board[r][c] = 1;
    });
  });

  ships.forEach((ship) => {
    ship.cells.forEach(([r, c]) => {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
            if (board[nr][nc] === 0) {
              board[nr][nc] = -1;
            }
          }
        }
      }
    });
  });

  return board;
}

function rebuildPlayerBoard(player) {
  player.board = buildBoardFromShips(player.ships);
}

function clearSelectedBoardShip(shouldRerender = false) {
  if (!gameState.selectedBoardShip) return;
  gameState.selectedBoardShip = null;
  if (shouldRerender) {
    renderSetupBoard();
  }
}

function isShipHorizontal(ship) {
  if (!ship || ship.cells.length <= 1) return true;
  return ship.cells[0][0] === ship.cells[1][0];
}

function getShipAtCell(player, row, col) {
  if (!player) return null;

  const ship = player.ships.find((s) =>
    s.cells.some(([r, c]) => r === row && c === col)
  );

  if (!ship) return null;

  const offsetIndex = ship.cells.findIndex(([r, c]) => r === row && c === col);
  return { ship, offsetIndex };
}

function selectShip(length) {
  const player = getCurrentPlayer();
  if (player.shipsRemaining[length] > 0) {
    clearSelectedBoardShip(true);
    gameState.selectedShip = length;
    updateShipSelection();
    updateSetupStatus(
      `Selected ship: ${length} cells. Click on board to place.`
    );
  }
}

function updateShipSelection() {
  document.querySelectorAll(".ship-item").forEach((item) => {
    item.classList.remove("selected");
    const length = parseInt(item.dataset.length);
    const player = getCurrentPlayer();
    if (player.shipsRemaining[length] === 0) {
      item.classList.add("depleted");
    } else {
      item.classList.remove("depleted");
    }
  });

  if (gameState.selectedShip) {
    const selectedItem = document.querySelector(
      `.ship-item[data-length="${gameState.selectedShip}"]`
    );
    if (selectedItem) selectedItem.classList.add("selected");
  }
}

function updateShipCounts() {
  const player = getCurrentPlayer();
  document.getElementById("ship-2-count").textContent =
    player.shipsRemaining[2];
  document.getElementById("ship-3-count").textContent =
    player.shipsRemaining[3];
  document.getElementById("ship-4-count").textContent =
    player.shipsRemaining[4];
  updateShipSelection();
}

function rotateShip() {
  if (gameState.selectedBoardShip) {
    tryRotateSelectedBoardShip();
    return;
  }

  gameState.isHorizontal = !gameState.isHorizontal;
  updateSetupStatus(
    `Ship rotated to ${gameState.isHorizontal ? "horizontal" : "vertical"}`
  );
}

function randomPlacement() {
  const player = getCurrentPlayer();
  const MAX_RETRIES = 1000; // Maximum attempts per ship
  const MAX_TOTAL_ATTEMPTS = 10; // Max retries for entire placement

  let totalAttempts = 0;
  let success = false;

  while (!success && totalAttempts < MAX_TOTAL_ATTEMPTS) {
    resetBoard(player);
    success = true;

    const shipLengths = [];
    for (let length in player.shipsRemaining) {
      for (
        let i = 0;
        i < SHIPS.find((s) => s.length === parseInt(length)).count;
        i++
      ) {
        shipLengths.push(parseInt(length));
      }
    }

    // Sort by length descending (place larger ships first)
    shipLengths.sort((a, b) => b - a);

    for (let length of shipLengths) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < MAX_RETRIES) {
        const horizontal = Math.random() < 0.5;
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);

        if (canPlaceShip(player, row, col, length, horizontal)) {
          placeShip(player, row, col, length, horizontal);
          placed = true;
        }
        attempts++;
      }

      // If failed to place this ship, restart entire placement
      if (!placed) {
        success = false;
        break;
      }
    }

    totalAttempts++;
  }

  if (success) {
    // Reset ship counts to 0 since all ships are now placed
    player.shipsRemaining = { 2: 0, 3: 0, 4: 0 };
    updateShipCounts();
    renderSetupBoard();
    document.getElementById("readyButton").disabled = false;
    updateSetupStatus("Ships placed randomly! All ships ready.");
  } else {
    // This should rarely happen, but handle it gracefully
    resetBoard(player);
    updateSetupStatus(
      "Random placement failed. Please place ships manually or try again."
    );
  }
}

function resetBoard(player = null) {
  if (!player) player = getCurrentPlayer();
  player.board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(0));
  player.ships = [];
  player.shipsRemaining = { 2: 1, 3: 2, 4: 1 };
  gameState.selectedShip = null;
  clearSelectedBoardShip();
  updateShipCounts();
  renderSetupBoard();
  document.getElementById("readyButton").disabled = true;
  updateSetupStatus("Board reset. Select a ship to start placing.");
}

function renderSetupBoard() {
  const board = document.getElementById("setupBoard");
  board.innerHTML = "";

  const player = getCurrentPlayer();

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (player.board[row][col] === 1) {
        cell.classList.add("ship");

        // Find ship details
        const ship = player.ships.find((s) =>
          s.cells.some(([r, c]) => r === row && c === col)
        );

        if (ship) {
          const shipIsHorizontal = isShipHorizontal(ship);
          const cellIndex = ship.cells.findIndex(
            ([r, c]) => r === row && c === col
          );

          cell.classList.add(
            shipIsHorizontal ? "ship-horizontal" : "ship-vertical"
          );

          // Highlight selection if needed
          if (gameState.selectedBoardShip?.ship === ship) {
            cell.classList.add("ship-selected");
            if (gameState.selectedBoardShip.offsetIndex === cellIndex) {
              cell.classList.add("ship-selected-pivot");
            }
          }

          if (cellIndex === 0) {
            // Determine direction for head
            if (ship.cells.length > 1) {
              const [nextRow, nextCol] = ship.cells[1];
              const [headRow, headCol] = ship.cells[0];
              if (nextRow > headRow) cell.classList.add("ship-head-down");
              else if (nextRow < headRow) cell.classList.add("ship-head-up");
              else if (nextCol > headCol) cell.classList.add("ship-head-right");
              else if (nextCol < headCol) cell.classList.add("ship-head-left");
            }
          } else if (cellIndex !== ship.cells.length - 1) {
            // Middle sections get conning tower
            cell.classList.add("ship-middle");
          }
        }

        cell.addEventListener("pointerdown", startShipDrag);
      } else if (player.board[row][col] === -1) {
        cell.classList.add("forbidden");
      }

      cell.addEventListener("mouseenter", handleSetupHover);
      cell.addEventListener("mouseleave", handleSetupHoverEnd);
      cell.addEventListener("click", handleSetupClick);

      board.appendChild(cell);
    }
  }
}

function handleSetupHover(e) {
  if (!gameState.selectedShip || gameState.draggingShip) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  const player = getCurrentPlayer();

  const canPlace = canPlaceShip(
    player,
    row,
    col,
    gameState.selectedShip,
    gameState.isHorizontal
  );

  // Preview ship cells
  const cells = getShipCells(
    row,
    col,
    gameState.selectedShip,
    gameState.isHorizontal
  );
  cells.forEach(([r, c]) => {
    const cell = document.querySelector(
      `#setupBoard .cell[data-row="${r}"][data-col="${c}"]`
    );
    if (cell) {
      cell.classList.add(canPlace ? "preview-valid" : "preview-invalid");
    }
  });

  // Highlight forbidden zone around ship to help user understand the rule
  if (canPlace) {
    const forbiddenCells = getForbiddenZone(cells);
    forbiddenCells.forEach(([r, c]) => {
      const cell = document.querySelector(
        `#setupBoard .cell[data-row="${r}"][data-col="${c}"]`
      );
      if (cell && !cell.classList.contains("preview-valid")) {
        cell.classList.add("forbidden-preview");
      }
    });
  }
}

function getForbiddenZone(shipCells) {
  const forbidden = new Set();

  shipCells.forEach(([r, c]) => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue; // Skip the ship cell itself
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          // Check if this cell is not part of the ship
          const isShipCell = shipCells.some(
            ([sr, sc]) => sr === nr && sc === nc
          );
          if (!isShipCell) {
            forbidden.add(`${nr},${nc}`);
          }
        }
      }
    }
  });

  return Array.from(forbidden).map((key) => key.split(",").map(Number));
}

function clearSetupPreviews() {
  document.querySelectorAll("#setupBoard .cell").forEach((cell) => {
    cell.classList.remove(
      "preview-valid",
      "preview-invalid",
      "forbidden-preview"
    );
  });
}

function handleSetupHoverEnd(e) {
  clearSetupPreviews();
}

function handleSetupClick(e) {
  if (gameState.draggingShip) return;

  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  const player = getCurrentPlayer();

  const shipInfo = getShipAtCell(player, row, col);

  if (shipInfo) {
    gameState.selectedShip = null;
    updateShipSelection();
    const alreadySelected =
      gameState.selectedBoardShip?.ship === shipInfo.ship &&
      gameState.selectedBoardShip.offsetIndex === shipInfo.offsetIndex;

    if (alreadySelected) {
      clearSelectedBoardShip(true);
      updateSetupStatus("Ship deselected.");
    } else {
      gameState.selectedBoardShip = {
        ship: shipInfo.ship,
        offsetIndex: shipInfo.offsetIndex,
      };
      renderSetupBoard();
      updateSetupStatus(
        "Ship selected! Tap Rotate or choose a new cell to move it."
      );
    }

    return;
  }

  if (gameState.selectedShip) {
    if (
      canPlaceShip(
        player,
        row,
        col,
        gameState.selectedShip,
        gameState.isHorizontal
      )
    ) {
      placeShip(
        player,
        row,
        col,
        gameState.selectedShip,
        gameState.isHorizontal
      );
      player.shipsRemaining[gameState.selectedShip]--;

      // Play ship placement sound
      playSound("place");

      if (player.shipsRemaining[gameState.selectedShip] === 0) {
        gameState.selectedShip = null;
      }

      updateShipCounts();
      renderSetupBoard();
      document.getElementById("readyButton").disabled = !isSetupComplete();

      if (isSetupComplete()) {
        updateSetupStatus("All ships placed! Click Ready to continue.");
      } else {
        updateSetupStatus(
          "Ship placed! Select another ship or continue placing."
        );
      }
    } else {
      updateSetupStatus(
        "Cannot place ship here! Ships cannot touch each other."
      );
    }
    return;
  }

  if (gameState.selectedBoardShip) {
    if (!tryMoveSelectedShipToCell(row, col)) {
      updateSetupStatus(
        "Cannot move ship there. Ships cannot overlap or touch."
      );
    }
    return;
  }

  updateSetupStatus("Select a ship from the list or tap an existing ship.");
}

function startShipDrag(e) {
  if (
    e.pointerType === "mouse" &&
    typeof e.button === "number" &&
    e.button !== 0
  ) {
    return;
  }

  if (gameState.draggingShip) return;
  if (typeof e.preventDefault === "function") {
    e.preventDefault();
  }

  const cell = e.target.closest(".cell");
  if (!cell || !cell.classList.contains("ship")) return;

  const player = getCurrentPlayer();
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  const ship = player.ships.find((s) =>
    s.cells.some(([r, c]) => r === row && c === col)
  );
  if (!ship) return;

  const offsetIndex = ship.cells.findIndex(([r, c]) => r === row && c === col);
  const horizontal =
    ship.cells.length <= 1
      ? true
      : ship.cells[0][0] === ship.cells[1][0];

  const otherShips = player.ships.filter((s) => s !== ship);
  const boardWithoutShip = buildBoardFromShips(otherShips);

  const boardElement = document.getElementById("setupBoard");

  gameState.draggingShip = {
    ship,
    length: ship.length,
    horizontal,
    offsetIndex,
    boardWithoutShip,
    pointerId: e.pointerId,
    boardElement,
    currentHead: null,
    validPlacement: false,
  };

  markShipAsDragging(ship, true);
  clearSetupPreviews();

  if (boardElement && boardElement.setPointerCapture) {
    try {
      boardElement.setPointerCapture(e.pointerId);
    } catch (err) {
      // Ignore capture errors on unsupported browsers
    }
  }

  if (boardElement) {
    boardElement.addEventListener("pointermove", handleShipDragMove);
    boardElement.addEventListener("pointerup", finishShipDrag);
    boardElement.addEventListener("pointercancel", cancelShipDrag);
  }

  updateSetupStatus("Drag the ship to reposition it.");
}

function handleShipDragMove(e) {
  const drag = gameState.draggingShip;
  if (!drag || e.pointerId !== drag.pointerId) return;

  const element = document
    .elementFromPoint(e.clientX, e.clientY);
  const cell = element
    ? element.closest("#setupBoard .cell")
    : null;

  if (!cell) {
    clearSetupPreviews();
    drag.validPlacement = false;
    drag.currentHead = null;
    return;
  }

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  const headRow = drag.horizontal ? row : row - drag.offsetIndex;
  const headCol = drag.horizontal ? col - drag.offsetIndex : col;

  const canPlace = canPlaceShip(
    null,
    headRow,
    headCol,
    drag.length,
    drag.horizontal,
    drag.boardWithoutShip
  );

  drag.validPlacement = canPlace;
  drag.currentHead = { row: headRow, col: headCol };

  const cells = getShipCells(headRow, headCol, drag.length, drag.horizontal);
  clearSetupPreviews();

  cells.forEach(([r, c]) => {
    const targetCell = document.querySelector(
      `#setupBoard .cell[data-row="${r}"][data-col="${c}"]`
    );
    if (targetCell) {
      targetCell.classList.add(canPlace ? "preview-valid" : "preview-invalid");
    }
  });

  if (canPlace) {
    const forbiddenCells = getForbiddenZone(cells);
    forbiddenCells.forEach(([r, c]) => {
      const targetCell = document.querySelector(
        `#setupBoard .cell[data-row="${r}"][data-col="${c}"]`
      );
      if (targetCell && !targetCell.classList.contains("preview-valid")) {
        targetCell.classList.add("forbidden-preview");
      }
    });
  }
}

function finishShipDrag(e) {
  completeShipDrag(e, false);
}

function cancelShipDrag(e) {
  completeShipDrag(e, true);
}

function completeShipDrag(e, cancelled) {
  const drag = gameState.draggingShip;
  if (!drag || e.pointerId !== drag.pointerId) return;

  const boardElement = drag.boardElement;
  if (boardElement) {
    if (boardElement.releasePointerCapture) {
      try {
        boardElement.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore release errors
      }
    }
    boardElement.removeEventListener("pointermove", handleShipDragMove);
    boardElement.removeEventListener("pointerup", finishShipDrag);
    boardElement.removeEventListener("pointercancel", cancelShipDrag);
  }

  clearSetupPreviews();
  markShipAsDragging(drag.ship, false);

  const player = getCurrentPlayer();

  if (!cancelled && drag.validPlacement && drag.currentHead) {
    const newCells = getShipCells(
      drag.currentHead.row,
      drag.currentHead.col,
      drag.length,
      drag.horizontal
    );
    drag.ship.cells = newCells.map(([r, c]) => [r, c]);
    rebuildPlayerBoard(player);
    renderSetupBoard();
    document.getElementById("readyButton").disabled = !isSetupComplete();
    updateSetupStatus("Ship repositioned!");
  } else {
    renderSetupBoard();
    updateSetupStatus("Ship position unchanged.");
  }

  gameState.draggingShip = null;
}

function markShipAsDragging(ship, isDragging) {
  if (!ship) return;
  ship.cells.forEach(([r, c]) => {
    const cell = document.querySelector(
      `#setupBoard .cell[data-row="${r}"][data-col="${c}"]`
    );
    if (cell) {
      cell.classList.toggle("drag-source", isDragging);
    }
  });
}

function canPlaceShip(player, row, col, length, horizontal, boardOverride = null) {
  const boardToCheck = boardOverride || (player ? player.board : null);
  if (!boardToCheck) return false;

  const cells = getShipCells(row, col, length, horizontal);

  for (let [r, c] of cells) {
    if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
      return false;
    }
    if (boardToCheck[r][c] !== 0) {
      return false;
    }
  }

  // Check surrounding cells (including diagonals)
  for (let [r, c] of cells) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          if (boardToCheck[nr][nc] === 1) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function placeShip(player, row, col, length, horizontal) {
  const cells = getShipCells(row, col, length, horizontal);

  cells.forEach(([r, c]) => {
    player.board[r][c] = 1;
  });

  player.ships.push({
    cells: cells,
    hits: 0,
    length: length,
    sunk: false,
  });

  // Mark forbidden zones
  cells.forEach(([r, c]) => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
          if (player.board[nr][nc] === 0) {
            player.board[nr][nc] = -1;
          }
        }
      }
    }
  });
}

function getShipCells(row, col, length, horizontal) {
  const cells = [];
  for (let i = 0; i < length; i++) {
    if (horizontal) {
      cells.push([row, col + i]);
    } else {
      cells.push([row + i, col]);
    }
  }
  return cells;
}

function tryMoveSelectedShipToCell(targetRow, targetCol) {
  const selection = gameState.selectedBoardShip;
  if (!selection) return false;

  const player = getCurrentPlayer();
  const { ship, offsetIndex } = selection;
  if (!ship) return false;

  const horizontal = isShipHorizontal(ship);
  const headRow = horizontal ? targetRow : targetRow - offsetIndex;
  const headCol = horizontal ? targetCol - offsetIndex : targetCol;

  const otherShips = player.ships.filter((s) => s !== ship);
  const boardWithoutShip = buildBoardFromShips(otherShips);

  if (
    canPlaceShip(
      null,
      headRow,
      headCol,
      ship.length,
      horizontal,
      boardWithoutShip
    )
  ) {
    ship.cells = getShipCells(headRow, headCol, ship.length, horizontal);
    rebuildPlayerBoard(player);
    renderSetupBoard();
    document.getElementById("readyButton").disabled = !isSetupComplete();
    updateSetupStatus("Ship moved!");
    return true;
  }

  return false;
}

function tryRotateSelectedBoardShip() {
  const selection = gameState.selectedBoardShip;
  if (!selection) return false;

  const player = getCurrentPlayer();
  const { ship, offsetIndex } = selection;
  if (!ship) return false;

  const targetHorizontal = !isShipHorizontal(ship);
  const pivotCell = ship.cells[offsetIndex] || ship.cells[0];
  const pivotRow = pivotCell[0];
  const pivotCol = pivotCell[1];
  const headRow = targetHorizontal ? pivotRow : pivotRow - offsetIndex;
  const headCol = targetHorizontal ? pivotCol - offsetIndex : pivotCol;

  const otherShips = player.ships.filter((s) => s !== ship);
  const boardWithoutShip = buildBoardFromShips(otherShips);

  if (
    canPlaceShip(
      null,
      headRow,
      headCol,
      ship.length,
      targetHorizontal,
      boardWithoutShip
    )
  ) {
    ship.cells = getShipCells(headRow, headCol, ship.length, targetHorizontal);
    rebuildPlayerBoard(player);
    renderSetupBoard();
    document.getElementById("readyButton").disabled = !isSetupComplete();
    updateSetupStatus("Ship rotated!");
  } else {
    updateSetupStatus("Cannot rotate ship here. Try moving it first.");
  }

  return true;
}

function isSetupComplete() {
  const player = getCurrentPlayer();
  return (
    player.shipsRemaining[2] === 0 &&
    player.shipsRemaining[3] === 0 &&
    player.shipsRemaining[4] === 0
  );
}

function confirmSetup() {
  if (!isSetupComplete()) return;

  if (gameState.setupPhase === "player1") {
    gameState.setupPhase = "player2";
    gameState.currentPlayer = 2; // Switch to player 2 for setup
    gameState.selectedShip = null; // Reset selection for player 2
    gameState.isHorizontal = true; // Reset orientation
    clearSelectedBoardShip();
    const player2Name = gameState.player2.captainName || "Player 2";
    showPassScreen(`Please hand the device to ${player2Name}`);
  } else {
    // Player 2 setup complete, ready to start battle
    // NO pass screen needed - both players face the screen together
    gameState.setupPhase = "battle"; // Mark setup as complete
    gameState.gameStartTime = Date.now();
    gameState.currentPlayer = 1; // Battle starts with player 1
    clearSelectedBoardShip();
    showBattleScreen(); // Go directly to battle
  }
}

function updateSetupStatus(message) {
  document.getElementById("setupStatus").textContent = message;
}

// ===== PASS DEVICE SCREEN =====
function showPassScreen(message) {
  document.getElementById("passMessage").textContent = message;
  showScreen("passDeviceScreen");
}

function acknowledgePass() {
  // After Player 1 ready, Player 2 needs to setup
  if (gameState.setupPhase === "player2") {
    showSetupScreen(2);
  }
  // After Player 2 ready, or during battle turn changes
  else if (gameState.currentScreen === "passDeviceScreen") {
    showBattleScreen();
  }
}

// ===== BATTLE PHASE =====
function showBattleScreen() {
  const player = getCurrentPlayer();
  const playerName = player.captainName || `Player ${gameState.currentPlayer}`;
  document.getElementById("currentTurn").textContent = playerName;
  updateBattleStatus(`${playerName}, choose a cell to fire`);
  updateBattleCaptainDisplay();
  renderBattleBoards();
  showScreen("battleScreen");
  scheduleChildHint();

  // Show turn popup for first player after a short delay
  setTimeout(() => {
    showTurnPopup(gameState.currentPlayer);
  }, 500);
}

function updateBattleCaptainDisplay() {
  const player = getCurrentPlayer();
  const avatarContainer = document.getElementById("battleCaptainAvatar");
  const captainNameEl = document.getElementById("battleCaptainName");

  // Update captain name
  captainNameEl.textContent = player.captainName;

  // Update ships destroyed display
  updateShipsDestroyedDisplay();

  // Update avatar
  if (player.captainImage) {
    avatarContainer.innerHTML = `<img src="${player.captainImage}" alt="Captain" class="uploaded-avatar">`;
  } else {
    // Show default SVG
    avatarContainer.innerHTML = `
            <svg class="default-avatar" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#4dd0e1"/>
                <circle cx="50" cy="40" r="18" fill="#ffffff"/>
                <path d="M 25 75 Q 25 55, 50 55 Q 75 55, 75 75 Q 75 85, 50 90 Q 25 85, 25 75" fill="#ffffff"/>
            </svg>
        `;
  }
}

function updateShipsDestroyedDisplay() {
  const player = getCurrentPlayer();

  // Update total destroyed
  document.getElementById(
    "totalShipsDestroyed"
  ).textContent = `${player.shipsDestroyed} / 4`;

  // Update by type
  document.getElementById(
    "ship2Destroyed"
  ).textContent = `${player.shipsDestroyedByType[2]}/1`;
  document.getElementById(
    "ship3Destroyed"
  ).textContent = `${player.shipsDestroyedByType[3]}/2`;
  document.getElementById(
    "ship4Destroyed"
  ).textContent = `${player.shipsDestroyedByType[4]}/1`;
}

function renderBattleBoards() {
  const currentPlayerData = getCurrentPlayer();
  const opponentData = getOpponentPlayer();

  // Render single battle board showing ONLY current player's attacks on opponent's board
  const battleBoard = document.getElementById("battleBoard");
  battleBoard.innerHTML = "";

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Show only the CURRENT player's attacks
      const attackStatus = currentPlayerData.attacks[row][col];

      if (attackStatus === 1) {
        // Miss
        cell.classList.add("miss");
        cell.textContent = "o";
      } else if (attackStatus === 2) {
        // Hit
        cell.classList.add("hit");
        cell.textContent = "X";

        // Check if this hit is part of a sunk ship on opponent's board
        const sunkShip = opponentData.ships.find(
          (s) => s.sunk && s.cells.some(([r, c]) => r === row && c === col)
        );
        if (sunkShip) {
          cell.classList.remove("hit");
          cell.classList.add("sunk");
          cell.textContent = "#";
        }
      }

      // Only clickable if not already attacked by current player
      if (attackStatus === 0) {
        cell.addEventListener("click", handleAttack);
        cell.style.cursor = "pointer";
      } else {
        cell.style.cursor = "not-allowed";
      }

      battleBoard.appendChild(cell);
    }
  }

  applyChildHintHighlight();
}

function scheduleChildHint() {
  clearChildHint();
  if (!gameState) return;
  const player = getCurrentPlayer();
  if (!player || !player.isChild) return;
  if ((gameState.missStreak[gameState.currentPlayer] || 0) < 3) return;
  gameState.hintTimeoutId = setTimeout(() => {
    showChildHint();
  }, 10000);
}

function clearChildHint() {
  if (gameState.hintTimeoutId) {
    clearTimeout(gameState.hintTimeoutId);
    gameState.hintTimeoutId = null;
  }
  if (gameState.hintCell) {
    const { row, col } = gameState.hintCell;
    const cell = document.querySelector(
      `#battleBoard .cell[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) {
      cell.classList.remove("child-hint");
    }
    gameState.hintCell = null;
  }
}

function showChildHint() {
  if (!gameState) return;
  gameState.hintTimeoutId = null;
  const player = getCurrentPlayer();
  if (!player || !player.isChild) return;
  if ((gameState.missStreak[gameState.currentPlayer] || 0) < 3) return;
  const opponent = getOpponentPlayer();
  const candidates = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (player.attacks[row][col] === 0 && opponent.board[row][col] === 1) {
        candidates.push({ row, col });
      }
    }
  }

  if (!candidates.length) return;
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  gameState.hintCell = target;
  applyChildHintHighlight();
}

function applyChildHintHighlight() {
  if (!gameState || !gameState.hintCell) return;
  const { row, col } = gameState.hintCell;
  const cell = document.querySelector(
    `#battleBoard .cell[data-row="${row}"][data-col="${col}"]`
  );
  if (cell) {
    cell.classList.add("child-hint");
  }
}

function handleAttack(e) {
  if (gameState.isProcessingAttack) {
    // Ignore extra taps until current attack animation completes
    return;
  }
  clearChildHint();
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);

  const currentPlayerData = getCurrentPlayer();
  const opponentData = getOpponentPlayer();

  // Validate: cannot shoot already attacked cell
  if (currentPlayerData.attacks[row][col] !== 0) {
    updateBattleStatus(
      "You already attacked this cell! Choose another target."
    );
    return;
  }
  gameState.isProcessingAttack = true;

  // Disable all cells during attack processing
  document.querySelectorAll("#battleBoard .cell").forEach((cell) => {
    cell.style.pointerEvents = "none";
  });

  gameState.turnCount++;

  // Check if hit or miss
  const isHit = opponentData.board[row][col] === 1;
  let result = "miss";
  let toastMessage = "";

  if (isHit) {
    currentPlayerData.attacks[row][col] = 2; // Hit
    currentPlayerData.hits++;
    gameState.missStreak[gameState.currentPlayer] = 0;
    result = "hit";

    // Find which ship was hit
    const hitShip = opponentData.ships.find((ship) =>
      ship.cells.some(([r, c]) => r === row && c === col)
    );

    if (hitShip) {
      hitShip.hits++;

      // Check if ship is sunk
      if (hitShip.hits === hitShip.length) {
        hitShip.sunk = true;
        currentPlayerData.shipsDestroyed++;

        // Track by ship type
        currentPlayerData.shipsDestroyedByType[hitShip.length]++;

        result = "sunk";

        // Play sunk sound
        playSound("sunk");

        const shipName = getShipName(hitShip.length);
        toastMessage = `You destroyed opponent's ${shipName}!`;
        showToast("HIT!", toastMessage);

        // Update ship destruction display
        updateShipsDestroyedDisplay();

        // Check if all ships sunk (game over)
        if (opponentData.ships.every((ship) => ship.sunk)) {
          // Record shot history
          gameState.historyShots.push({
            player: gameState.currentPlayer,
            row: row,
            col: col,
            result: result,
            turnIndex: gameState.turnCount,
          });

          renderBattleBoards();

          setTimeout(() => {
            endGame(gameState.currentPlayer);
            gameState.isProcessingAttack = false;
          }, 2500);
          return;
        }
      } else {
        // Play hit sound
        playSound("hit");
        showToast("HIT!", "Direct hit!");
      }
    }
  } else {
    currentPlayerData.attacks[row][col] = 1; // Miss
    currentPlayerData.misses++;
    gameState.missStreak[gameState.currentPlayer] =
      (gameState.missStreak[gameState.currentPlayer] || 0) + 1;

    // Play miss sound
    playSound("miss");
    showToast("MISS", "You missed!");
  }

  // Record shot history
  gameState.historyShots.push({
    player: gameState.currentPlayer,
    row: row,
    col: col,
    result: result,
    turnIndex: gameState.turnCount,
  });

  renderBattleBoards();

  // Switch turn after delay (NO pass screen - both players watch together)
  setTimeout(() => {
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    const player = getCurrentPlayer();
    const playerName =
      player.captainName || `Player ${gameState.currentPlayer}`;
    document.getElementById("currentTurn").textContent = playerName;
    updateBattleStatus(`${playerName}, choose a cell to fire`);
    updateBattleCaptainDisplay(); // Update captain avatar for new player
    renderBattleBoards(); // Re-render to update clickable cells
    scheduleChildHint();

    gameState.isProcessingAttack = false;

    // Show turn popup with avatar
    showTurnPopup(gameState.currentPlayer);
  }, 2500);
}

function getShipName(length) {
  switch (length) {
    case 2:
      return "Destroyer (2 cells)";
    case 3:
      return "Cruiser (3 cells)";
    case 4:
      return "Battleship (4 cells)";
    default:
      return "Ship";
  }
}

function showToast(title, message) {
  const toast = document.getElementById("battleToast");
  document.getElementById("toastTitle").textContent = title;
  document.getElementById("toastMessage").textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function showTurnPopup(playerNum) {
  const popup = document.getElementById("turnPopup");
  const playerName = document.getElementById("turnPopupPlayerName");
  const message = document.getElementById("turnPopupMessage");
  const avatarContainer = document.getElementById("turnPopupAvatar");

  // Get player data
  const playerData = playerNum === 1 ? gameState.player1 : gameState.player2;

  // Update text with player name
  playerName.textContent = playerData.captainName || `Player ${playerNum}`;
  message.textContent = "Your Turn!";

  // Update avatar
  if (playerData.captainImage) {
    avatarContainer.innerHTML = `<img src="${playerData.captainImage}" alt="${playerData.captainName}" class="uploaded-avatar">`;
  } else {
    // Use default avatar
    avatarContainer.innerHTML = `
            <svg class="default-avatar" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#4dd0e1"/>
                <circle cx="50" cy="40" r="18" fill="#ffffff"/>
                <path d="M 25 75 Q 25 55, 50 55 Q 75 55, 75 75 Q 75 85, 50 90 Q 25 85, 25 75" fill="#ffffff"/>
            </svg>
        `;
  }

  // Show popup with animation
  popup.classList.add("show");

  // Hide after 2 seconds
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function updateBattleStatus(message) {
  document.getElementById("battleStatus").textContent = message;
}

// ===== ENDGAME =====
function endGame(winner) {
  clearChildHint();
  const winnerData = winner === 1 ? gameState.player1 : gameState.player2;
  const winnerName = winnerData.captainName || `Player ${winner}`;

  // Update winner text
  document.getElementById("winnerText").textContent = `${winnerName} WINS!`;

  // Update winner's avatar
  const avatarContainer = document.getElementById("victoryCaptainAvatar");
  if (winnerData.captainImage) {
    avatarContainer.innerHTML = `<img src="${winnerData.captainImage}" alt="Winner" class="uploaded-avatar">`;
  } else {
    // Show default SVG
    avatarContainer.innerHTML = `
            <svg class="default-avatar" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#4dd0e1"/>
                <circle cx="50" cy="40" r="18" fill="#ffffff"/>
                <path d="M 25 75 Q 25 55, 50 55 Q 75 55, 75 75 Q 75 85, 50 90 Q 25 85, 25 75" fill="#ffffff"/>
            </svg>
        `;
  }

  // Update stats
  document.getElementById("statTurns").textContent = gameState.turnCount;
  document.getElementById("statHits").textContent = winnerData.hits;
  document.getElementById("statMisses").textContent = winnerData.misses;

  const accuracy =
    winnerData.hits + winnerData.misses > 0
      ? (
          (winnerData.hits / (winnerData.hits + winnerData.misses)) *
          100
        ).toFixed(1)
      : 0;
  document.getElementById("statAccuracy").textContent = accuracy + "%";

  const duration = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  document.getElementById("statDuration").textContent = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  showScreen("endgameScreen");
}

function rematch() {
  startGame();
}

function quitGame() {
  const modal = document.getElementById("quitGameModal");
  if (modal) {
    modal.classList.add("active");
  }
}

function confirmQuitGame() {
  const modal = document.getElementById("quitGameModal");
  if (modal) modal.classList.remove("active");
  goHome();
}

function cancelQuitGame() {
  const modal = document.getElementById("quitGameModal");
  if (modal) modal.classList.remove("active");
}

// ===== HELPER FUNCTIONS =====
function getCurrentPlayer() {
  return gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
}

function getOpponentPlayer() {
  return gameState.currentPlayer === 1 ? gameState.player2 : gameState.player1;
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener("keydown", (e) => {
  // Only handle keyboard in setup screen
  if (gameState.currentScreen === "setupScreen") {
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      rotateShip();
      // Re-render preview if hovering
      const hoverCell = document.querySelector("#setupBoard .cell:hover");
      if (hoverCell) {
        handleSetupHoverEnd();
        handleSetupHover({ target: hoverCell });
      }
    }
  }
});

// ===== INITIALIZE =====
document.addEventListener("DOMContentLoaded", () => {
  loadGames();
  showScreen("gameSelectionScreen");
});
