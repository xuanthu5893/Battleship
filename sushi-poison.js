const SUSHI_TYPES = buildSushiTypes();

let sushiAudioCtx = null;

let sushiState = null;

function defaultPlayers() {
    return {
        p1: { name: 'Player 1', avatar: null, isChild: false },
        p2: { name: 'Player 2', avatar: null, isChild: false }
    };
}

function loadPlayerProfiles() {
    const profiles = defaultPlayers();
    const fallbackAvatars = {
        p1: getFallbackAvatar(1),
        p2: getFallbackAvatar(2)
    };
    profiles.p1.avatar = fallbackAvatars.p1;
    profiles.p2.avatar = fallbackAvatars.p2;
    if (typeof getSelectedPlayers === 'function' && typeof getPlayers === 'function') {
        const selected = getSelectedPlayers() || [];
        const allPlayers = getPlayers() || [];
        ['p1', 'p2'].forEach((slot, index) => {
            let playerData = null;
            const selectedId = selected[index];
            if (selectedId) {
                playerData = allPlayers.find(p => p.id === selectedId) || null;
            }
            if (!playerData && allPlayers[index]) {
                playerData = allPlayers[index];
            }
            if (playerData) {
                profiles[slot].name = playerData.name || profiles[slot].name;
                profiles[slot].avatar = playerData.avatar || profiles[slot].avatar;
                profiles[slot].isChild = !!playerData.isChild;
            } else {
                profiles[slot].isChild = false;
            }
        });
    }
    return profiles;
}

function getFallbackAvatar(position) {
    if (typeof createDefaultAvatar === 'function') {
        return createDefaultAvatar(position);
    }
    return null;
}

function initSushiState() {
    sushiState = {
        phase: 'home',
        boards: {
            p1: generateSushiBoard('p1'),
            p2: generateSushiBoard('p2')
        },
        poisonSelections: { p1: [], p2: [] },
        currentPlayer: 'p1',
        winner: null,
        players: loadPlayerProfiles(),
        isAnimating: false,
        pendingAntidote: null
    };
    sushiState.powerUps = buildPlayerPowerUps(sushiState.players);
}

function generateSushiBoard(owner) {
    const pool = shuffleArray(SUSHI_TYPES).slice(0, 9);
    return pool.map((sushi, index) => {
        return {
            id: `${owner}-${index}`,
            type: sushi.id,
            label: sushi.label,
            icon: sushi.icon,
            state: 'uneaten',
            poisoned: false
        };
    });
}

function buildPlayerPowerUps(players) {
    return {
        p1: { antidotes: players.p1.isChild ? 1 : 0 },
        p2: { antidotes: players.p2.isChild ? 1 : 0 }
    };
}

function getPoisonLimit(playerKey) {
    if (!sushiState || !sushiState.players[playerKey]) return 2;
    return 2 + (sushiState.players[playerKey].isChild ? 1 : 0);
}

function getRemainingAntidotes(playerKey) {
    if (!sushiState || !sushiState.powerUps) return 0;
    const bucket = sushiState.powerUps[playerKey];
    return bucket ? bucket.antidotes : 0;
}

function tryUseAntidote(playerKey) {
    if (!sushiState || !sushiState.powerUps) return false;
    const store = sushiState.powerUps[playerKey];
    if (store && store.antidotes > 0) {
        store.antidotes -= 1;
        return true;
    }
    return false;
}

function initSushiAudio() {
    if (!sushiAudioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            sushiAudioCtx = new AudioContext();
        }
    }
}

function playChompSound() {
    initSushiAudio();
    if (!sushiAudioCtx) return;

    const ctx = sushiAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.18);
    gain.gain.setValueAtTime(0.0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach((screen) => {
        screen.classList.remove('active');
    });
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('active');
    }
}

function startSushiGame() {
    initSushiState();
    sushiState.phase = 'setup_p1';
    showPoisonSetup('p1');
}

function showPoisonSetup(playerKey) {
    sushiState.phase = playerKey === 'p1' ? 'setup_p1' : 'setup_p2';
    const targetBoard = playerKey === 'p1' ? 'p2' : 'p1';
    const title = `Poison Setup – ${sushiState.players[playerKey].name}`;
    const poisonLimit = getPoisonLimit(playerKey);
    const bonusNote = sushiState.players[playerKey].isChild ? ' (Bé được chọn thêm 1 miếng cho vui!)' : '';
    const instruction = `Chọn ${poisonLimit} miếng sushi của ${sushiState.players[targetBoard].name} để tẩm độc${bonusNote}`;
    document.getElementById('setupTitle').textContent = title;
    document.getElementById('setupInstruction').textContent = instruction;
    renderBoard('setupBoard', sushiState.boards[targetBoard], {
        mode: 'setup',
        selectingPlayer: playerKey,
        targetBoard,
        onClick: (index) => togglePoisonSelection(playerKey, targetBoard, index)
    });
    updateSetupSelectionInfo(playerKey);
    showScreen('setupScreen');
}

function togglePoisonSelection(playerKey, targetBoard, index) {
    const selection = sushiState.poisonSelections[playerKey];
    const limit = getPoisonLimit(playerKey);
    const alreadySelected = selection.includes(index);
    if (alreadySelected) {
        sushiState.poisonSelections[playerKey] = selection.filter((i) => i !== index);
    } else {
        if (selection.length >= limit) {
            showToast(`Đã chọn đủ ${limit} miếng rồi!`);
            return;
        }
        sushiState.poisonSelections[playerKey].push(index);
    }
    renderBoard('setupBoard', sushiState.boards[targetBoard], {
        mode: 'setup',
        selectingPlayer: playerKey,
        targetBoard,
        onClick: (i) => togglePoisonSelection(playerKey, targetBoard, i)
    });
    updateSetupSelectionInfo(playerKey);
}

function updateSetupSelectionInfo(playerKey) {
    const count = sushiState.poisonSelections[playerKey].length;
    const limit = getPoisonLimit(playerKey);
    document.getElementById('selectedCount').textContent = count;
    const limitEl = document.getElementById('selectedLimit');
    if (limitEl) limitEl.textContent = limit;
    const readyButton = document.getElementById('readyButton');
    if (readyButton) {
        readyButton.disabled = count !== limit;
    }
}

function resetPoisonSelection() {
    const playerKey = sushiState.phase === 'setup_p1' ? 'p1' : 'p2';
    sushiState.poisonSelections[playerKey] = [];
    const targetBoard = playerKey === 'p1' ? 'p2' : 'p1';
    renderBoard('setupBoard', sushiState.boards[targetBoard], {
        mode: 'setup',
        selectingPlayer: playerKey,
        targetBoard,
        onClick: (index) => togglePoisonSelection(playerKey, targetBoard, index)
    });
    updateSetupSelectionInfo(playerKey);
}

function confirmPoisonSelection() {
    const playerKey = sushiState.phase === 'setup_p1' ? 'p1' : 'p2';
    const targetBoard = playerKey === 'p1' ? 'p2' : 'p1';
    const limit = getPoisonLimit(playerKey);
    if (sushiState.poisonSelections[playerKey].length !== limit) return;

    sushiState.poisonSelections[playerKey].forEach((index) => {
        sushiState.boards[targetBoard][index].poisoned = true;
    });

    if (playerKey === 'p1') {
        sushiState.phase = 'pass';
        document.getElementById('nextPlayerName').textContent = sushiState.players.p2.name;
        showScreen('passScreen');
    } else {
        enterBattlePhase();
    }
}

function acknowledgePass() {
    showPoisonSetup('p2');
}

function enterBattlePhase() {
    sushiState.phase = 'battle';
    sushiState.currentPlayer = 'p1';
    updateBattleStatus();
    renderBattleBoards();
    showScreen('battleScreen');
}

function renderBattleBoards() {
    document.getElementById('p1BoardLabel').textContent = `${sushiState.players.p1.name} Board`;
    document.getElementById('p2BoardLabel').textContent = `${sushiState.players.p2.name} Board`;

    renderBoard('p1Board', sushiState.boards.p1, {
        mode: 'battle',
        owner: 'p1',
        allowClicks: sushiState.phase === 'battle' && sushiState.currentPlayer === 'p1' && !sushiState.isAnimating,
        onClick: (index) => handleEat('p1', index)
    });

    renderBoard('p2Board', sushiState.boards.p2, {
        mode: 'battle',
        owner: 'p2',
        allowClicks: sushiState.phase === 'battle' && sushiState.currentPlayer === 'p2' && !sushiState.isAnimating,
        onClick: (index) => handleEat('p2', index)
    });
}

function renderBoard(containerId, boardData, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    boardData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'sushi-card';
        cardEl.dataset.index = index;

        if (options.mode === 'battle') {
            if (card.state === 'eaten') cardEl.classList.add('eaten');
            if (card.state === 'revealedPoison') cardEl.classList.add('poisoned-reveal');
            if (card.state === 'eating') cardEl.classList.add('eating');
            if (!options.allowClicks) cardEl.classList.add('disabled');
        }

        if (options.mode === 'setup') {
            const selectingPlayer = options.selectingPlayer;
            const markers = sushiState.poisonSelections[selectingPlayer];
            if (markers.includes(index)) cardEl.classList.add('marked');
        }

        if (card.state === 'eaten') {
            cardEl.innerHTML = '<span>🥢</span><span class="label">Đã ăn</span>';
        } else if (card.state === 'revealedPoison') {
            cardEl.innerHTML = '<span>☠️</span><span class="label">Poison</span>';
        } else {
            cardEl.innerHTML = `${card.icon}<span class="label">${card.label}</span>`;
        }

        const marker = document.createElement('span');
        marker.className = 'poison-marker';
        marker.textContent = '☠️';
        cardEl.appendChild(marker);

        if (options.allowClicks || options.mode === 'setup') {
            cardEl.addEventListener('click', () => {
                if (options.mode === 'battle' && options.allowClicks) {
                    options.onClick(index);
                } else if (options.mode === 'setup') {
                    options.onClick(index);
                }
            });
        }

        container.appendChild(cardEl);
    });
}

function handleEat(boardKey, index) {
    if (sushiState.phase !== 'battle') return;
    if (sushiState.currentPlayer !== boardKey) return;
    if (sushiState.isAnimating) return;

    const card = sushiState.boards[boardKey][index];
    if (card.state !== 'uneaten') return;

    sushiState.isAnimating = true;
    card.state = 'eating';
    renderBattleBoards();
    showToast(`${sushiState.players[boardKey].name} đang ăn...`);
    playChompSound();

    setTimeout(() => {
        if (card.poisoned) {
            card.state = 'revealedPoison';
            renderBattleBoards();
            const saved = tryUseAntidote(boardKey);
            if (saved) {
                card.poisoned = false;
                sushiState.pendingAntidote = { boardKey, cardIndex: index };
                showAntidoteModal(boardKey);
            } else {
                showToast('Oh no! Poisoned!');
                setTimeout(() => {
                    endGame(boardKey === 'p1' ? 'p2' : 'p1');
                }, 900);
            }
        } else {
            card.state = 'eaten';
            renderBattleBoards();
            showToast('Yummy! An toàn');
            sushiState.isAnimating = false;
            sushiState.currentPlayer = boardKey === 'p1' ? 'p2' : 'p1';
            if (!checkDraw()) {
                updateBattleStatus();
                renderBattleBoards();
            }
        }
    }, 900);
}

function updateBattleStatus() {
    if (!sushiState) return;
    const currentKey = sushiState.currentPlayer;
    const currentPlayer = sushiState.players[currentKey];
    const label = document.getElementById('currentTurnLabel');
    if (label) label.textContent = currentPlayer.name;
    const status = document.getElementById('battleStatus');
    if (status) {
        const antidotes = currentPlayer.isChild ? getRemainingAntidotes(currentKey) : 0;
        const bonus = antidotes > 0 ? ` (còn ${antidotes} thuốc giải)` : '';
        status.textContent = `${currentPlayer.name}${bonus}, chọn 1 miếng để ăn`;
    }
    updateAvatarImage('currentPlayerAvatar', currentKey);
    updateBadgeTheme('currentTurnBadge', currentKey);
}

function checkDraw() {
    const allEaten = [...sushiState.boards.p1, ...sushiState.boards.p2].every((card) => card.state !== 'uneaten');
    if (allEaten) {
        endGame(null);
        return true;
    }
    return false;
}

function endGame(winnerKey) {
    sushiState.phase = 'end';
    sushiState.winner = winnerKey;
    sushiState.isAnimating = false;
    const title = document.getElementById('endTitle');
    const subtitle = document.getElementById('endSubtitle');
    if (winnerKey) {
        if (title) title.textContent = 'POISONED!';
        if (subtitle) subtitle.textContent = `${sushiState.players[winnerKey].name} WINS! 🎉`;
        showEndgameBadge(winnerKey);
    } else {
        if (title) title.textContent = 'DRAW';
        if (subtitle) subtitle.textContent = 'Không ai trúng độc - Hòa!';
        hideEndgameBadge();
    }
    showScreen('endScreen');
}

function showEndgameBadge(winnerKey) {
    const badge = document.getElementById('endPlayerBadge');
    if (!badge) return;
    badge.classList.remove('hidden');
    updateBadgeTheme('endPlayerBadge', winnerKey);
    const label = document.getElementById('endPlayerLabel');
    if (label) label.textContent = 'Winner';
    const nameEl = document.getElementById('endPlayerName');
    if (nameEl) nameEl.textContent = sushiState.players[winnerKey].name;
    updateAvatarImage('endPlayerAvatar', winnerKey);
}

function hideEndgameBadge() {
    const badge = document.getElementById('endPlayerBadge');
    if (badge) badge.classList.add('hidden');
}

function updateAvatarImage(imgId, playerKey) {
    if (!sushiState) return;
    const img = document.getElementById(imgId);
    if (!img) return;
    const player = sushiState.players[playerKey];
    if (!player) return;
    const wrapper = img.closest('.badge-avatar');
    if (player.avatar) {
        img.src = player.avatar;
        img.alt = `${player.name} avatar`;
        if (wrapper) {
            wrapper.classList.remove('avatar-placeholder');
            wrapper.dataset.initial = '';
        }
    } else {
        img.removeAttribute('src');
        img.alt = `${player.name} avatar placeholder`;
        if (wrapper) {
            wrapper.classList.add('avatar-placeholder');
            wrapper.dataset.initial = (player.name || '?').charAt(0).toUpperCase();
        }
    }
}

function updateBadgeTheme(badgeId, playerKey) {
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    badge.classList.remove('player-p1', 'player-p2');
    badge.classList.add(playerKey === 'p2' ? 'player-p2' : 'player-p1');
}

function rematch() {
    initSushiState();
    sushiState.phase = 'setup_p1';
    showPoisonSetup('p1');
}

function showToast(message) {
    const toast = document.getElementById('sushiToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1500);
}

function showAntidoteModal(playerKey) {
    const modal = document.getElementById('antidoteModal');
    const message = document.getElementById('antidoteMessage');
    if (message && sushiState) {
        const player = sushiState.players[playerKey];
        const remaining = player.isChild ? getRemainingAntidotes(playerKey) : 0;
        const tail = remaining > 0 ? `Còn ${remaining} thuốc giải.` : 'Đây là liều cuối, cẩn thận nhé!';
        message.textContent = `${player.name} đã uống thuốc giải! ${tail}`;
    }
    if (modal) modal.classList.add('active');
}

function hideAntidoteModal() {
    const modal = document.getElementById('antidoteModal');
    if (modal) modal.classList.remove('active');
}

function continueAfterAntidote() {
    if (!sushiState) {
        hideAntidoteModal();
        return;
    }
    hideAntidoteModal();
    const pending = sushiState.pendingAntidote;
    sushiState.pendingAntidote = null;
    if (!pending) {
        sushiState.isAnimating = false;
        return;
    }
    const board = sushiState.boards[pending.boardKey];
    if (board && board[pending.cardIndex]) {
        board[pending.cardIndex].state = 'eaten';
    }
    sushiState.isAnimating = false;
    sushiState.currentPlayer = pending.boardKey === 'p1' ? 'p2' : 'p1';
    renderBattleBoards();
    showToast('Đã giải độc, tiếp tục nào!');
    if (!checkDraw()) {
        updateBattleStatus();
        renderBattleBoards();
    }
}

function showHowToPlay() {
    document.getElementById('howToPlayModal').classList.add('active');
}

function closeHowToPlay() {
    document.getElementById('howToPlayModal').classList.remove('active');
}

function goBackToHub() {
    window.location.href = 'index.html';
}

function returnToHomeFromBattle() {
    if (confirm('Quit current game and return to menu?')) {
        initSushiState();
        showHome();
    }
}

function showHome() {
    if (sushiState) sushiState.phase = 'home';
    showScreen('homeScreen');
}

document.addEventListener('DOMContentLoaded', () => {
    initSushiState();
    showHome();
});

function buildSushiTypes() {
    const configs = [
        { id: 'salmon', label: 'Salmon Nigiri', image: 'images/split_1_1.png' },
        { id: 'tuna', label: 'Tuna Nigiri', image: 'images/split_1_2.png' },
        { id: 'shrimp', label: 'Shrimp Nigiri', image: 'images/split_1_3.png' },
        { id: 'tamago', label: 'Tamago Nigiri', image: 'images/split_1_4.png' },
        { id: 'unagi', label: 'Unagi Nigiri', image: 'images/split_1_5.png' },
        { id: 'hamachi', label: 'Hamachi Nigiri', image: 'images/split_2_1.png' },
        { id: 'hotate', label: 'Hotate Nigiri', image: 'images/split_2_2.png' },
        { id: 'kani', label: 'Kani Nigiri', image: 'images/split_2_3.png' },
        { id: 'ebi', label: 'Ebi Tempura', image: 'images/split_2_4.png' },
        { id: 'ikura', label: 'Ikura Gunkan', image: 'images/split_2_5.png' },
        { id: 'tobiko', label: 'Tobiko Gunkan', image: 'images/split_4_1.png' },
        { id: 'dragon', label: 'Dragon Roll', image: 'images/split_4_2.png' },
        { id: 'veggie', label: 'Veggie Roll', image: 'images/split_4_3.png' },
        { id: 'spicy', label: 'Spicy Tuna Roll', image: 'images/split_4_4.png' },
        { id: 'rainbow', label: 'Rainbow Roll', image: 'images/split_4_5.png' }
    ];
    return configs.map(cfg => ({
        id: cfg.id,
        label: cfg.label,
        icon: `<img src="${cfg.image}" alt="${cfg.label}" class="sushi-photo" />`
    }));
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
