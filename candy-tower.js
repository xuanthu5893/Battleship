const CANDY_SIZES = {
    small: { label: 'Small', weight: 1, color: '#ffadad' },
    medium: { label: 'Medium', weight: 1.6, color: '#ffd6a5' },
    large: { label: 'Large', weight: 2.4, color: '#cdb4db' }
};

const SIZE_DISTRIBUTION = [
    { type: 'small', chance: 0.5 },
    { type: 'medium', chance: 0.35 },
    { type: 'large', chance: 0.15 }
];

const SLOT_POSITIONS = [-1.5, -0.5, 0.5, 1.5];

const DIFFICULTY_SETTINGS = {
    easy: { label: 'Easy', threshold: 1.1 },
    normal: { label: 'Normal', threshold: 0.9 },
    hard: { label: 'Hard', threshold: 0.75 }
};

const AUTO_SLOT_ORDER = [1, 2, 0, 3];
const MAX_LAYERS_FOR_CELEBRATION = 10;

let candyState = null;
let candyTimer = null;

function initCandyState() {
    candyState = {
        phase: 'home',
        difficulty: 'normal',
        currentPlayer: 'p1',
        tower: [],
        tray: [],
        selectedCandyId: null,
        isResolving: false,
        players: loadCandyPlayers(),
        winner: null,
        turnEndAt: null
    };
    buildInitialTower();
    updateDifficultyButtons();
}

function loadCandyPlayers() {
    const defaults = {
        p1: { name: 'Player 1', avatar: getCandyFallbackAvatar(1), isChild: false },
        p2: { name: 'Player 2', avatar: getCandyFallbackAvatar(2), isChild: false }
    };
    if (typeof getSelectedPlayers === 'function' && typeof getPlayers === 'function') {
        const selected = getSelectedPlayers() || [];
        const players = getPlayers();
        if (selected.length === 2) {
            const p1 = players.find(p => p.id === selected[0]);
            const p2 = players.find(p => p.id === selected[1]);
            if (p1) {
                defaults.p1.name = p1.name;
                defaults.p1.avatar = p1.avatar || defaults.p1.avatar;
                defaults.p1.isChild = !!p1.isChild;
            }
            if (p2) {
                defaults.p2.name = p2.name;
                defaults.p2.avatar = p2.avatar || defaults.p2.avatar;
                defaults.p2.isChild = !!p2.isChild;
            }
        }
    }
    return defaults;
}

function getCandyFallbackAvatar(position) {
    if (typeof createDefaultAvatar === 'function') {
        return createDefaultAvatar(position);
    }
    return null;
}

function buildInitialTower() {
    candyState.tower = [];
    for (let i = 0; i < 3; i++) {
        candyState.tower.push(createBalancedLayer());
    }
    candyState.tower.push(createEmptyLayer());
}

function createBalancedLayer() {
    const patterns = [
        ['small', 'medium', 'medium', 'small'],
        ['medium', 'small', 'small', 'medium'],
        ['medium', 'large', 'large', 'medium']
    ];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    return {
        id: `layer-${Date.now()}-${Math.random()}`,
        slots: pattern.map((size) => ({ ...createCandy(size), state: 'placed' }))
    };
}

function createEmptyLayer() {
    return {
        id: `layer-${Date.now()}-${Math.random()}`,
        slots: [null, null, null, null]
    };
}

function createCandy(sizeType) {
    const size = CANDY_SIZES[sizeType];
    const palette = ['#ff8fab', '#ffb3c1', '#ffcfd2', '#fcbf49', '#70d6ff', '#b8c0ff'];
    return {
        id: `candy-${Date.now()}-${Math.random()}`,
        sizeType,
        weight: size.weight,
        label: size.label,
        color: palette[Math.floor(Math.random() * palette.length)],
        state: 'inTray'
    };
}

function generateTray() {
    const tray = [];
    for (let i = 0; i < 5; i++) {
        tray.push(createCandy(pickSizeByDistribution()));
    }
    return tray;
}

function pickSizeByDistribution() {
    const roll = Math.random();
    let cumulative = 0;
    for (const entry of SIZE_DISTRIBUTION) {
        cumulative += entry.chance;
        if (roll <= cumulative) return entry.type;
    }
    return 'small';
}

function startCandyGame() {
    stopCandyTimer();
    buildInitialTower();
    candyState.phase = 'playing';
    candyState.currentPlayer = 'p1';
    candyState.tray = generateTray();
    candyState.selectedCandyId = null;
    candyState.isResolving = false;
    candyState.winner = null;
    candyState.players = loadCandyPlayers();
    const endAvatar = document.getElementById('endPlayerAvatar');
    if (endAvatar) endAvatar.style.display = 'block';
    const endLabel = document.getElementById('endPlayerLabel');
    if (endLabel) endLabel.textContent = 'Winner';
    const endName = document.getElementById('endPlayerName');
    if (endName) endName.textContent = candyState.players.p1.name;
    closeCandyHowTo();
    renderCandyUI();
    setCandyStatus(`${candyState.players.p1.name}, chọn 1 viên kẹo rồi đặt lên tháp`);
    setCandyScreen('gameScreen');
    startCandyTimer();
}

function renderCandyUI() {
    renderTower();
    renderTray();
    updateSelectedCandyInfo();
    updatePlayerHeader();
    updateDifficultyBadge();
    updateTowerHeight();
}

function renderTower() {
    const stack = document.getElementById('towerStack');
    if (!stack) return;
    stack.classList.remove('shake-soft', 'shake-strong', 'fall-left', 'fall-right');
    stack.innerHTML = '';
    const activeIndex = getActiveLayerIndex();
    for (let i = candyState.tower.length - 1; i >= 0; i--) {
        const layer = candyState.tower[i];
        const layerEl = document.createElement('div');
        layerEl.className = 'tower-layer';
        if (i === activeIndex) layerEl.classList.add('active');
        layerEl.dataset.layerIndex = i;
        layer.slots.forEach((slot, slotIndex) => {
            const slotEl = document.createElement('div');
            slotEl.className = 'tower-slot';
            slotEl.dataset.slotIndex = slotIndex;
            if (!slot) {
                slotEl.classList.add('empty');
                if (i === activeIndex && candyState.phase === 'playing' && !candyState.isResolving) {
                    slotEl.classList.add('active-slot');
                    slotEl.innerHTML = '<span class="slot-hint">+</span>';
                    slotEl.addEventListener('click', () => handleSlotClick(i, slotIndex));
                }
            } else {
                slotEl.appendChild(renderCandyChip(slot));
            }
            layerEl.appendChild(slotEl);
        });
        stack.appendChild(layerEl);
    }
}

function renderCandyChip(candy) {
    const chip = document.createElement('div');
    chip.className = `candy-chip candy-${candy.sizeType}`;
    chip.style.background = candy.color;
    chip.textContent = candy.sizeType === 'small' ? 'S' : candy.sizeType === 'large' ? 'L' : 'M';
    return chip;
}

function renderTray() {
    const trayEl = document.getElementById('candyTray');
    if (!trayEl) return;
    trayEl.innerHTML = '';
    const disabled = candyState.isResolving || candyState.phase !== 'playing';
    candyState.tray.forEach((candy) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tray-candy';
        if (disabled) btn.classList.add('disabled');
        if (candy.id === candyState.selectedCandyId) btn.classList.add('selected');
        btn.appendChild(renderCandyChip(candy));
        const label = document.createElement('div');
        label.className = 'candy-label';
        label.textContent = `${candy.label} (${candy.weight.toFixed(1)})`;
        btn.appendChild(label);
        if (!disabled) {
            btn.addEventListener('click', () => selectTrayCandy(candy.id));
        }
        trayEl.appendChild(btn);
    });
}

function selectTrayCandy(candyId) {
    if (candyState.phase !== 'playing' || candyState.isResolving) return;
    candyState.selectedCandyId = candyId;
    renderTray();
    updateSelectedCandyInfo();
    setCandyStatus('Đã chọn kẹo, hãy đặt lên đỉnh tháp');
}

function updateSelectedCandyInfo() {
    const info = document.getElementById('selectedCandyInfo');
    if (!info) return;
    if (!candyState.selectedCandyId) {
        info.textContent = 'Chưa chọn kẹo';
        return;
    }
    const candy = candyState.tray.find((c) => c.id === candyState.selectedCandyId);
    if (candy) {
        info.textContent = `Đang chọn: ${candy.label} (${candy.weight.toFixed(1)}g)`;
    }
}

function handleSlotClick(layerIndex, slotIndex) {
    if (!candyState.selectedCandyId || candyState.isResolving) {
        showCandyToast('Chọn kẹo trước nhé!');
        return;
    }
    const candy = detachCandyFromTray(candyState.selectedCandyId);
    if (!candy) return;
    placeCandy(layerIndex, slotIndex, candy);
}

function detachCandyFromTray(candyId) {
    const index = candyState.tray.findIndex((c) => c.id === candyId);
    if (index === -1) return null;
    const [candy] = candyState.tray.splice(index, 1);
    return candy;
}

function placeCandy(layerIndex, slotIndex, candy) {
    stopCandyTimer();
    candyState.isResolving = true;
    candyState.selectedCandyId = null;
    const targetLayer = candyState.tower[layerIndex];
    targetLayer.slots[slotIndex] = { ...candy, state: 'placed' };
    renderTower();
    renderTray();
    updateSelectedCandyInfo();
    setCandyStatus(`${candyState.players[candyState.currentPlayer].name} đang đặt kẹo...`);
    setTimeout(() => resolvePlacement(), 650);
}

function resolvePlacement() {
    const balance = calculateTopBalance();
    const threshold = DIFFICULTY_SETTINGS[candyState.difficulty].threshold;
    const exceeded = Math.abs(balance) > threshold;
    if (exceeded) {
        triggerTowerFall(balance);
        setTimeout(() => {
            const loser = candyState.currentPlayer;
            const winner = loser === 'p1' ? 'p2' : 'p1';
            endCandyGame(winner, 'fall');
        }, 900);
    } else {
        triggerTowerShake(Math.abs(balance) / threshold);
        finishSafePlacement();
    }
}

function calculateTopBalance() {
    const layers = [];
    for (let i = candyState.tower.length - 1; i >= 0 && layers.length < 2; i--) {
        const layer = candyState.tower[i];
        if (layer.slots.some(Boolean)) layers.push(layer);
    }
    if (layers.length === 0) return 0;
    let totalWeight = 0;
    let weightedSum = 0;
    layers.forEach(layer => {
        layer.slots.forEach((candy, index) => {
            if (!candy) return;
            totalWeight += candy.weight;
            weightedSum += candy.weight * SLOT_POSITIONS[index];
        });
    });
    if (totalWeight === 0) return 0;
    return weightedSum / totalWeight;
}

function finishSafePlacement() {
    candyState.isResolving = false;
    setCandyStatus('✨ Vững quá! Chuyển lượt...');
    ensureActiveLayer();
    if (countCandyLayers() >= MAX_LAYERS_FOR_CELEBRATION) {
        endCandyGame(null, 'perfect');
        return;
    }
    switchTurn();
}

function ensureActiveLayer() {
    const top = candyState.tower[candyState.tower.length - 1];
    if (top && top.slots.some(slot => !slot)) return;
    candyState.tower.push(createEmptyLayer());
    renderTower();
    updateTowerHeight();
}

function countCandyLayers() {
    return candyState.tower.filter(layer => layer.slots.some(Boolean)).length;
}

function switchTurn() {
    candyState.currentPlayer = candyState.currentPlayer === 'p1' ? 'p2' : 'p1';
    candyState.selectedCandyId = null;
    candyState.tray = generateTray();
    renderCandyUI();
    setCandyStatus(`${candyState.players[candyState.currentPlayer].name}, chọn 1 viên kẹo rồi đặt lên tháp`);
    startCandyTimer();
}

function updatePlayerHeader() {
    const nameEl = document.getElementById('currentPlayerName');
    const avatar = document.getElementById('currentPlayerAvatar');
    if (!nameEl || !avatar) return;
    const player = candyState.players[candyState.currentPlayer];
    nameEl.textContent = player.name;
    if (player.avatar) {
        avatar.src = player.avatar;
        avatar.style.display = 'block';
    } else {
        avatar.style.display = 'none';
    }
}

function updateTowerHeight() {
    const el = document.getElementById('towerHeight');
    if (!el) return;
    el.textContent = countCandyLayers();
}

function getActiveLayerIndex() {
    for (let i = candyState.tower.length - 1; i >= 0; i--) {
        if (candyState.tower[i].slots.some(slot => !slot)) {
            return i;
        }
    }
    return candyState.tower.length - 1;
}

function triggerTowerShake(ratio) {
    const stack = document.getElementById('towerStack');
    if (!stack) return;
    stack.classList.remove('shake-soft', 'shake-strong');
    void stack.offsetWidth;
    stack.classList.add(ratio > 0.7 ? 'shake-strong' : 'shake-soft');
    setTimeout(() => stack.classList.remove('shake-soft', 'shake-strong'), 600);
}

function triggerTowerFall(balance) {
    const stack = document.getElementById('towerStack');
    if (!stack) return;
    stack.classList.remove('fall-left', 'fall-right');
    void stack.offsetWidth;
    stack.classList.add(balance > 0 ? 'fall-right' : 'fall-left');
    setCandyStatus('💥 Tháp đổ rồi!');
}

function startCandyTimer() {
    stopCandyTimer();
    if (candyState.phase !== 'playing') return;
    candyState.turnEndAt = Date.now() + 10000;
    updateTimerDisplay(10000);
    candyTimer = setInterval(() => {
        const remaining = candyState.turnEndAt - Date.now();
        if (remaining <= 0) {
            stopCandyTimer();
            updateTimerDisplay(0);
            handleTurnTimeout();
        } else {
            updateTimerDisplay(remaining);
        }
    }, 120);
}

function stopCandyTimer() {
    if (candyTimer) {
        clearInterval(candyTimer);
        candyTimer = null;
    }
}

function updateTimerDisplay(ms) {
    const el = document.getElementById('turnTimer');
    if (!el) return;
    const seconds = Math.max(0, ms) / 1000;
    el.textContent = `${seconds.toFixed(1)}s`;
}

function handleTurnTimeout() {
    if (candyState.phase !== 'playing' || candyState.isResolving) return;
    let candyId = candyState.selectedCandyId;
    if (!candyId && candyState.tray.length) {
        candyId = candyState.tray
            .slice()
            .sort((a, b) => a.weight - b.weight)[0].id;
    }
    if (!candyId) return;
    const candy = detachCandyFromTray(candyId);
    if (!candy) return;
    const layerIndex = getActiveLayerIndex();
    if (layerIndex < 0) return;
    const slotIndex = pickAutoSlot(layerIndex);
    if (slotIndex === -1 || slotIndex === undefined) return;
    placeCandy(layerIndex, slotIndex, candy);
}

function pickAutoSlot(layerIndex) {
    const layer = candyState.tower[layerIndex];
    if (!layer) return -1;
    for (const idx of AUTO_SLOT_ORDER) {
        if (!layer.slots[idx]) return idx;
    }
    return layer.slots.findIndex(slot => !slot);
}

function updateDifficultyButtons() {
    const buttons = document.querySelectorAll('.diff-btn');
    buttons.forEach((btn) => {
        const diff = btn.dataset.difficulty;
        btn.classList.toggle('active', diff === candyState.difficulty);
    });
}

function updateDifficultyBadge() {
    const badge = document.getElementById('difficultyBadge');
    if (badge) badge.textContent = DIFFICULTY_SETTINGS[candyState.difficulty].label;
}

function setCandyDifficulty(level) {
    if (!DIFFICULTY_SETTINGS[level]) return;
    candyState.difficulty = level;
    updateDifficultyButtons();
    updateDifficultyBadge();
}

function setCandyStatus(message) {
    const status = document.getElementById('gameStatus');
    if (status) status.textContent = message;
}

function showCandyToast(message) {
    const toast = document.getElementById('candyToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1400);
}

function endCandyGame(winnerKey, reason) {
    stopCandyTimer();
    candyState.phase = 'end';
    candyState.winner = winnerKey;
    const title = document.getElementById('endTitle');
    const subtitle = document.getElementById('endSubtitle');
    const badgeLabel = document.getElementById('endPlayerLabel');
    const badgeName = document.getElementById('endPlayerName');
    const avatar = document.getElementById('endPlayerAvatar');
    if (reason === 'perfect') {
        if (title) title.textContent = 'WOW! 10 TẦNG!';
        if (subtitle) subtitle.textContent = 'Cả hai cùng thắng 🎉';
        if (badgeLabel) badgeLabel.textContent = 'Team';
        if (badgeName) badgeName.textContent = 'Happy Builders';
        if (avatar) avatar.style.display = 'none';
    } else if (winnerKey) {
        if (title) title.textContent = 'THÁP ĐỔ RỒI!';
        if (subtitle) subtitle.textContent = `${candyState.players[winnerKey].name} WINS! 🎉`;
        if (badgeLabel) badgeLabel.textContent = 'Winner';
        if (badgeName) badgeName.textContent = candyState.players[winnerKey].name;
        if (avatar) {
            const player = candyState.players[winnerKey];
            if (player.avatar) {
                avatar.src = player.avatar;
                avatar.style.display = 'block';
            } else {
                avatar.style.display = 'none';
            }
        }
    }
    setCandyScreen('endScreen');
}

function returnCandyHomeConfirm() {
    if (confirm('Quit current game and go back to menu?')) {
        stopCandyTimer();
        candyState.phase = 'home';
        setCandyScreen('homeScreen');
    }
}

function showCandyHowTo() {
    document.getElementById('howToPlayModal').classList.add('active');
}

function closeCandyHowTo() {
    document.getElementById('howToPlayModal').classList.remove('active');
}

function goBackToHub() {
    window.location.href = 'index.html';
}

function setCandyScreen(id) {
    document.querySelectorAll('.screen').forEach((screen) => screen.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    initCandyState();
});
