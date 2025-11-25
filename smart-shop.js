// ===== GAME CONFIGURATION =====
const GRID_SIZE = 5;
const TOTAL_ROUNDS = 10;
const ROUND_DURATION = 20; // seconds
const HINT_DELAY = 1500; // ms - delay before showing hint
const HINT_DURATION = 800; // ms - how long hint shows
const P2_DELAY = 300; // ms - optional delay for P2 scoring
const ANSWER_HIGHLIGHT_DURATION = 1500; // ms

// Level progression for Progressive mode
const PROGRESSIVE_LEVELS = {
    1: [1, 2, 3],     // Rounds 1-3: Level 1
    2: [4, 5, 6, 7],  // Rounds 4-7: Level 2
    3: [8, 9, 10]     // Rounds 8-10: Level 3
};

// ===== ITEM METADATA =====
const ITEMS_DATABASE = [
    // Animals
    { id: 'cat', emoji: '🐱', category: 'animals', color: 'orange', name: 'con mèo' },
    { id: 'dog', emoji: '🐶', category: 'animals', color: 'brown', name: 'con chó' },
    { id: 'rabbit', emoji: '🐰', category: 'animals', color: 'white', name: 'con thỏ' },
    { id: 'bear', emoji: '🐻', category: 'animals', color: 'brown', name: 'con gấu' },
    { id: 'panda', emoji: '🐼', category: 'animals', color: 'black', name: 'con gấu trúc' },
    { id: 'koala', emoji: '🐨', category: 'animals', color: 'gray', name: 'con gấu túi' },
    { id: 'tiger', emoji: '🐯', category: 'animals', color: 'orange', name: 'con hổ' },
    { id: 'lion', emoji: '🦁', category: 'animals', color: 'yellow', name: 'con sư tử' },
    { id: 'cow', emoji: '🐮', category: 'animals', color: 'brown', name: 'con bò' },
    { id: 'pig', emoji: '🐷', category: 'animals', color: 'pink', name: 'con lợn' },
    { id: 'frog', emoji: '🐸', category: 'animals', color: 'green', name: 'con ếch' },
    { id: 'monkey', emoji: '🐵', category: 'animals', color: 'brown', name: 'con khỉ' },
    { id: 'chicken', emoji: '🐔', category: 'animals', color: 'white', name: 'con gà' },
    { id: 'penguin', emoji: '🐧', category: 'animals', color: 'black', name: 'con chim cánh cụt' },
    { id: 'bird', emoji: '🐦', category: 'animals', color: 'blue', name: 'con chim' },
    { id: 'fish', emoji: '🐟', category: 'animals', color: 'blue', name: 'con cá' },
    { id: 'whale', emoji: '🐋', category: 'animals', color: 'blue', name: 'con cá voi' },
    { id: 'turtle', emoji: '🐢', category: 'animals', color: 'green', name: 'con rùa' },

    // Fruits
    { id: 'apple_red', emoji: '🍎', category: 'fruits', color: 'red', name: 'quả táo' },
    { id: 'apple_green', emoji: '🍏', category: 'fruits', color: 'green', name: 'quả táo' },
    { id: 'banana', emoji: '🍌', category: 'fruits', color: 'yellow', name: 'quả chuối' },
    { id: 'orange', emoji: '🍊', category: 'fruits', color: 'orange', name: 'quả cam' },
    { id: 'watermelon', emoji: '🍉', category: 'fruits', color: 'green', name: 'quả dưa hấu' },
    { id: 'grape', emoji: '🍇', category: 'fruits', color: 'purple', name: 'quả nho' },
    { id: 'strawberry', emoji: '🍓', category: 'fruits', color: 'red', name: 'quả dâu' },
    { id: 'cherry', emoji: '🍒', category: 'fruits', color: 'red', name: 'quả cherry' },
    { id: 'lemon', emoji: '🍋', category: 'fruits', color: 'yellow', name: 'quả chanh' },
    { id: 'pineapple', emoji: '🍍', category: 'fruits', color: 'yellow', name: 'quả dứa' },
    { id: 'peach', emoji: '🍑', category: 'fruits', color: 'orange', name: 'quả đào' },
    { id: 'pear', emoji: '🍐', category: 'fruits', color: 'green', name: 'quả lê' },
    { id: 'coconut', emoji: '🥥', category: 'fruits', color: 'brown', name: 'quả dừa' },
    { id: 'kiwi', emoji: '🥝', category: 'fruits', color: 'green', name: 'quả kiwi' },

    // Vehicles
    { id: 'car_red', emoji: '🚗', category: 'vehicles', color: 'red', name: 'chiếc xe' },
    { id: 'car_blue', emoji: '🚙', category: 'vehicles', color: 'blue', name: 'chiếc xe' },
    { id: 'bus', emoji: '🚌', category: 'vehicles', color: 'yellow', name: 'chiếc xe buýt' },
    { id: 'truck', emoji: '🚚', category: 'vehicles', color: 'blue', name: 'chiếc xe tải' },
    { id: 'police', emoji: '🚓', category: 'vehicles', color: 'blue', name: 'xe cảnh sát' },
    { id: 'ambulance', emoji: '🚑', category: 'vehicles', color: 'red', name: 'xe cứu thương' },
    { id: 'fire', emoji: '🚒', category: 'vehicles', color: 'red', name: 'xe cứu hỏa' },
    { id: 'taxi', emoji: '🚕', category: 'vehicles', color: 'yellow', name: 'xe taxi' },
    { id: 'bike', emoji: '🚲', category: 'vehicles', color: 'blue', name: 'chiếc xe đạp' },
    { id: 'train', emoji: '🚂', category: 'vehicles', color: 'blue', name: 'tàu hỏa' },
    { id: 'plane', emoji: '✈️', category: 'vehicles', color: 'blue', name: 'máy bay' },
    { id: 'rocket', emoji: '🚀', category: 'vehicles', color: 'red', name: 'tên lửa' },
    { id: 'helicopter', emoji: '🚁', category: 'vehicles', color: 'blue', name: 'máy bay trực thăng' },

    // Toys/Objects
    { id: 'ball_red', emoji: '⚽', category: 'toys', color: 'red', name: 'quả bóng' },
    { id: 'ball_blue', emoji: '🏀', category: 'toys', color: 'orange', name: 'quả bóng' },
    { id: 'gift', emoji: '🎁', category: 'toys', color: 'red', name: 'hộp quà' },
    { id: 'balloon', emoji: '🎈', category: 'toys', color: 'red', name: 'quả bóng bay' },
    { id: 'star', emoji: '⭐', category: 'toys', color: 'yellow', name: 'ngôi sao' },
    { id: 'heart', emoji: '❤️', category: 'toys', color: 'red', name: 'trái tim' },
    { id: 'flower', emoji: '🌸', category: 'toys', color: 'pink', name: 'bông hoa' },
    { id: 'sun', emoji: '☀️', category: 'toys', color: 'yellow', name: 'mặt trời' },
    { id: 'moon', emoji: '🌙', category: 'toys', color: 'yellow', name: 'mặt trăng' },

    // Food/Snacks
    { id: 'cake', emoji: '🍰', category: 'food', color: 'pink', name: 'bánh kem' },
    { id: 'cookie', emoji: '🍪', category: 'food', color: 'brown', name: 'bánh quy' },
    { id: 'donut', emoji: '🍩', category: 'food', color: 'pink', name: 'bánh donut' },
    { id: 'icecream', emoji: '🍦', category: 'food', color: 'white', name: 'kem' },
    { id: 'candy', emoji: '🍬', category: 'food', color: 'red', name: 'kẹo' },
    { id: 'lollipop', emoji: '🍭', category: 'food', color: 'pink', name: 'kẹo mút' },
    { id: 'chocolate', emoji: '🍫', category: 'food', color: 'brown', name: 'sô cô la' },
    { id: 'pizza', emoji: '🍕', category: 'food', color: 'orange', name: 'bánh pizza' },
    { id: 'burger', emoji: '🍔', category: 'food', color: 'yellow', name: 'bánh hamburger' }
];

// Color names in Vietnamese
const COLOR_NAMES = {
    red: 'màu đỏ',
    blue: 'màu xanh dương',
    green: 'màu xanh lá',
    yellow: 'màu vàng',
    orange: 'màu cam',
    purple: 'màu tím',
    pink: 'màu hồng',
    brown: 'màu nâu',
    black: 'màu đen',
    white: 'màu trắng',
    gray: 'màu xám'
};

// Category names in Vietnamese (uppercase for display)
const CATEGORY_NAMES = {
    animals: 'ĐỘNG VẬT',
    fruits: 'TRÁI CÂY',
    vehicles: 'PHƯƠNG TIỆN',
    toys: 'ĐỒ CHƠI',
    food: 'BÁNH KẸO'
};

// ===== GAME STATE =====
let gameState = {
    phase: 'home', // home | countdown | playing | endgame
    mode: 'progressive', // progressive | level1 | level2 | level3
    balancedMode: true,
    roundIndex: 0,
    currentLevel: 1,
    shelves: {
        p1: [], // 25 items for P1
        p2: []  // 25 items for P2
    },
    order: null, // current order to fulfill
    selections: {
        p1: [],
        p2: []
    },
    scores: {
        p1: 0,
        p2: 0
    },
    roundTimer: null,
    roundTimeRemaining: ROUND_DURATION,
    hintTimer: null,
    isProcessing: false,
    levelsPlayed: [],
    players: {
        p1: { name: 'Player 1', avatar: null, isChild: false },
        p2: { name: 'Player 2', avatar: null, isChild: false }
    }
};

// ===== PLAYER MANAGEMENT =====
function loadPlayerData() {
    const selectedPlayerIds = getSelectedPlayers() || [];
    const allPlayers = getPlayers();

    let p1 = null;
    let p2 = null;

    if (selectedPlayerIds.length === 2) {
        p1 = allPlayers.find(p => p.id === selectedPlayerIds[0]) || null;
        p2 = allPlayers.find(p => p.id === selectedPlayerIds[1]) || null;
    }

    if (!p1 || !p2) {
        const fallbackPlayers = allPlayers.slice(0, 2);
        if (!p1 && fallbackPlayers[0]) {
            p1 = fallbackPlayers[0];
        }
        if (!p2 && fallbackPlayers[1]) {
            p2 = fallbackPlayers[1];
        }
    }

    if (!p1) {
        p1 = { name: 'Player 1', avatar: null, isChild: false };
    }
    if (!p2) {
        p2 = { name: 'Player 2', avatar: null, isChild: false };
    }

    gameState.players.p1 = { name: p1.name, avatar: p1.avatar, isChild: !!p1.isChild };
    gameState.players.p2 = { name: p2.name, avatar: p2.avatar, isChild: !!p2.isChild };

    updatePlayerProfileUI();
}

function updatePlayerProfileUI() {
    updateSinglePlayerDisplay('p1', 'p1Name', 'p1Avatar', 1);
    updateSinglePlayerDisplay('p2', 'p2Name', 'p2Avatar', 2);
}

function updateSinglePlayerDisplay(playerKey, nameId, avatarId, defaultIndex) {
    const player = gameState.players[playerKey];
    const nameEl = document.getElementById(nameId);
    if (nameEl && player) {
        nameEl.textContent = player.name || `Player ${defaultIndex}`;
    }

    const avatarEl = document.getElementById(avatarId);
    if (avatarEl && player) {
        avatarEl.innerHTML = getPlayerAvatarMarkup(player, defaultIndex);
    }
}

function getPlayerAvatarMarkup(player, fallbackIndex) {
    if (player && player.avatar) {
        return `<img src="${player.avatar}" alt="${player.name}">`;
    }

    if (typeof createDefaultAvatar === 'function') {
        const defaultAvatar = createDefaultAvatar(fallbackIndex);
        if (defaultAvatar) {
            const altText = player && player.name ? player.name : `Player ${fallbackIndex}`;
            return `<img src="${defaultAvatar}" alt="${altText}">`;
        }
    }

    const initial = player && player.name ? player.name.charAt(0).toUpperCase() : '?';
    return `<div class="player-avatar-placeholder">${initial}</div>`;
}

// NOTE: Smart Shop is a simultaneous game (both players play at the same time)
// No turn popup needed - removed showTurnPopup() function

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ===== HOME SCREEN =====
function showHowToPlay() {
    showModal('howToPlayModal');
}

function closeHowToPlay() {
    hideModal('howToPlayModal');
}

function goHome() {
    // Stop any timers
    clearInterval(gameState.roundTimer);
    clearTimeout(gameState.hintTimer);

    // Preserve players data
    const players = gameState.players;

    // Reset state
    gameState = {
        phase: 'home',
        mode: 'progressive',
        balancedMode: true,
        roundIndex: 0,
        currentLevel: 1,
        shelves: { p1: [], p2: [] },
        order: null,
        selections: { p1: [], p2: [] },
        scores: { p1: 0, p2: 0 },
        roundTimer: null,
        roundTimeRemaining: ROUND_DURATION,
        hintTimer: null,
        isProcessing: false,
        levelsPlayed: [],
        players: players
    };

    window.location.href = 'index.html';
}

function startGame() {
    // Get selected mode
    const selectedMode = document.querySelector('input[name="levelMode"]:checked').value;
    gameState.mode = selectedMode;
    gameState.balancedMode = document.getElementById('balancedToggle').checked;

    // Reset scores
    gameState.scores = { p1: 0, p2: 0 };
    gameState.roundIndex = 0;
    gameState.levelsPlayed = [];

    // Determine starting level
    if (selectedMode === 'progressive') {
        gameState.currentLevel = 1;
    } else if (selectedMode === 'level1') {
        gameState.currentLevel = 1;
    } else if (selectedMode === 'level2') {
        gameState.currentLevel = 2;
    } else if (selectedMode === 'level3') {
        gameState.currentLevel = 3;
    }

    startCountdown();
}

// ===== COUNTDOWN =====
function startCountdown() {
    gameState.phase = 'countdown';
    showScreen('countdownScreen');

    let count = 3;
    document.getElementById('countdownNumber').textContent = count;

    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
            document.getElementById('countdownNumber').textContent = count;
        } else {
            clearInterval(countdownInterval);
            startRound();
        }
    }, 1000);
}

// ===== SHELF GENERATION =====
function generateShelf(order) {
    const shelf = [];

    // Ensure we have enough correct items for the order
    const correctItems = [];
    for (let i = 0; i < order.quantity; i++) {
        const matchingItems = ITEMS_DATABASE.filter(item => {
            if (order.level === 1) {
                return item.id === order.itemId;
            } else if (order.level === 2) {
                return item.id === order.itemId && item.color === order.color;
            } else if (order.level === 3) {
                return item.category === order.category;
            }
            return false;
        });

        if (matchingItems.length > 0) {
            correctItems.push(getRandomItem(matchingItems));
        }
    }

    // Add correct items
    shelf.push(...correctItems);

    // Fill rest of shelf with random items
    while (shelf.length < GRID_SIZE * GRID_SIZE) {
        const randomItem = getRandomItem(ITEMS_DATABASE);
        shelf.push(randomItem);
    }

    // Shuffle
    return shuffleArray(shelf);
}

// Generate two separate shelves
function generateBothShelves(order) {
    return {
        p1: generateShelf(order),
        p2: generateShelf(order)
    };
}

// ===== ORDER GENERATION =====
function generateOrder(level) {
    let order = { level };

    if (level === 1) {
        // Level 1: Count + item type
        const quantity = getRandomInt(1, 5);
        const item = getRandomItem(ITEMS_DATABASE);

        order.quantity = quantity;
        order.itemId = item.id;
        order.emoji = item.emoji;
        order.name = item.name;
        order.text = `Chọn ${quantity} ${item.name}`;

    } else if (level === 2) {
        // Level 2: Count + item + color
        const quantity = getRandomInt(1, 5);
        const item = getRandomItem(ITEMS_DATABASE);

        order.quantity = quantity;
        order.itemId = item.id;
        order.color = item.color;
        order.emoji = item.emoji;
        order.name = item.name;
        order.colorName = COLOR_NAMES[item.color];
        order.text = `Chọn ${quantity} ${item.name} ${order.colorName}`;

    } else if (level === 3) {
        // Level 3: Count + category
        const quantity = getRandomInt(2, 8);
        const categories = Object.keys(CATEGORY_NAMES);
        const category = getRandomItem(categories);

        // Get representative items from category
        const categoryItems = ITEMS_DATABASE.filter(item => item.category === category);
        const representative = getRandomItem(categoryItems);

        order.quantity = quantity;
        order.category = category;
        order.categoryName = CATEGORY_NAMES[category];
        order.emoji = representative.emoji;
        order.text = `Chọn ${quantity} món ${order.categoryName}`;
    }

    return order;
}

// ===== ROUND MANAGEMENT =====
function startRound() {
    gameState.phase = 'playing';
    gameState.roundIndex++;

    // Check for level progression in progressive mode
    if (gameState.mode === 'progressive') {
        for (const [level, rounds] of Object.entries(PROGRESSIVE_LEVELS)) {
            if (rounds.includes(gameState.roundIndex)) {
                const newLevel = parseInt(level);
                if (newLevel !== gameState.currentLevel) {
                    gameState.currentLevel = newLevel;
                    showLevelUpBanner(newLevel);
                    if (!gameState.levelsPlayed.includes(newLevel)) {
                        gameState.levelsPlayed.push(newLevel);
                    }
                }
                break;
            }
        }
    } else {
        // Add current level to played levels
        if (!gameState.levelsPlayed.includes(gameState.currentLevel)) {
            gameState.levelsPlayed.push(gameState.currentLevel);
        }
    }

    // Generate order
    gameState.order = generateOrder(gameState.currentLevel);

    // Generate TWO separate shelves
    gameState.shelves = generateBothShelves(gameState.order);

    // Reset selections
    gameState.selections = { p1: [], p2: [] };
    gameState.isProcessing = false;

    // Render
    showScreen('gameplayScreen');
    renderGameplay();

    // Auto-play order audio after a short delay
    setTimeout(() => {
        speakOrder();
    }, 800);

    // Start timer
    startRoundTimer();

    // Start hint timer if balanced mode
    if (gameState.balancedMode) {
        startHintTimer();
    }
}

function showLevelUpBanner(level) {
    const banner = document.getElementById('levelUpBanner');
    document.getElementById('levelUpText').textContent = `Level ${level}`;
    banner.classList.add('show');

    setTimeout(() => {
        banner.classList.remove('show');
    }, 2000);
}

function renderGameplay() {
    // Update UI
    document.getElementById('p1Score').textContent = gameState.scores.p1;
    document.getElementById('p2Score').textContent = gameState.scores.p2;
    document.getElementById('roundBadge').textContent = `Round ${gameState.roundIndex}/${TOTAL_ROUNDS}`;
    document.getElementById('levelBadge').textContent = `Level ${gameState.currentLevel}`;

    // Update player info + avatars
    updatePlayerProfileUI();

    // Update shelf labels with names
    const shelfLabels = document.querySelectorAll('.shelf-label');
    if (shelfLabels.length >= 2) {
        shelfLabels[0].textContent = gameState.players.p1.name;
        shelfLabels[1].textContent = gameState.players.p2.name;
    }

    // Update order card
    document.getElementById('orderIcon').textContent = gameState.order.emoji;
    document.getElementById('orderText').textContent = gameState.order.text;

    // Update picks display
    updatePicksDisplay();

    // Render shelf
    renderShelf();
}

function renderShelf() {
    renderShelfForPlayer('p1', 'shelfBoardP1');
    renderShelfForPlayer('p2', 'shelfBoardP2');
}

function renderShelfForPlayer(player, boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = '';

    gameState.shelves[player].forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'shelf-item';
        itemEl.textContent = item.emoji;
        itemEl.dataset.index = index;
        itemEl.dataset.player = player;

        // Check if selected by this player
        if (gameState.selections[player].includes(index)) {
            itemEl.classList.add(`selected-${player}`);
        }

        // Add click handler
        itemEl.addEventListener('click', () => handleItemClick(player, index));

        board.appendChild(itemEl);
    });
}

function updatePicksDisplay() {
    const order = gameState.order;
    document.getElementById('p1Picks').textContent = `${gameState.selections.p1.length}/${order.quantity}`;
    document.getElementById('p2Picks').textContent = `${gameState.selections.p2.length}/${order.quantity}`;
}

// ===== TIMER =====
function startRoundTimer() {
    gameState.roundTimeRemaining = ROUND_DURATION;
    updateTimerDisplay();

    gameState.roundTimer = setInterval(() => {
        gameState.roundTimeRemaining--;
        updateTimerDisplay();

        if (gameState.roundTimeRemaining <= 5) {
            document.getElementById('timerFill').classList.add('warning');
        }

        if (gameState.roundTimeRemaining <= 0) {
            clearInterval(gameState.roundTimer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const percentage = (gameState.roundTimeRemaining / ROUND_DURATION) * 100;
    document.getElementById('timerFill').style.width = percentage + '%';
    document.getElementById('timerText').textContent = gameState.roundTimeRemaining + 's';
}

function handleTimeout() {
    gameState.isProcessing = true;

    // Highlight correct answers
    highlightCorrectAnswers();

    // Show toast
    showToast('⏰', 'HẾT GIỜ!', 'Không ai được điểm', false);

    setTimeout(() => {
        nextRound();
    }, ANSWER_HIGHLIGHT_DURATION + 500);
}

// ===== HINT SYSTEM =====
function getHintTargetPlayer() {
    const { p1, p2 } = gameState.players;

    // Prefer whichever player is marked as child
    if (p1.isChild && !p2.isChild) return 'p1';
    if (p2.isChild && !p1.isChild) return 'p2';

    // If both (or none) are marked as child, default to Player 1 to keep legacy behavior
    return 'p1';
}

function startHintTimer() {
    gameState.hintTimer = setTimeout(() => {
        const hintPlayer = getHintTargetPlayer();
        // Only show hint if target player hasn't selected anything yet
        if (gameState.selections[hintPlayer].length === 0 && !gameState.isProcessing) {
            showHint(hintPlayer);
        }
    }, HINT_DELAY);
}

function showHint(player) {
    const hintPlayer = player || getHintTargetPlayer();
    const selectionClass = `selected-${hintPlayer}`;
    const correctIndices = getCorrectIndices(hintPlayer);

    correctIndices.forEach(index => {
        const itemEl = document.querySelector(`.shelf-item[data-player="${hintPlayer}"][data-index="${index}"]`);
        if (itemEl && !itemEl.classList.contains(selectionClass)) {
            itemEl.classList.add('hint-highlight');
            setTimeout(() => {
                itemEl.classList.remove('hint-highlight');
            }, HINT_DURATION);
        }
    });
}

// ===== SELECTION & CHECKING =====
function handleItemClick(player, index) {
    if (gameState.isProcessing) return;

    // Toggle selection
    const playerSelections = gameState.selections[player];
    const indexPos = playerSelections.indexOf(index);

    if (indexPos > -1) {
        // Deselect
        playerSelections.splice(indexPos, 1);
    } else {
        // Select (if not at limit)
        if (playerSelections.length < gameState.order.quantity) {
            playerSelections.push(index);
        }
    }

    // Update UI
    renderShelf();
    updatePicksDisplay();

    // Check if player completed selection
    if (playerSelections.length === gameState.order.quantity) {
        setTimeout(() => checkAnswer(player), 100);
    }
}

function checkAnswer(player) {
    if (gameState.isProcessing) return;

    gameState.isProcessing = true;

    const selections = gameState.selections[player];
    const order = gameState.order;

    // Check if all selections are correct
    const allCorrect = selections.every(index => {
        const item = gameState.shelves[player][index];

        if (order.level === 1) {
            return item.id === order.itemId;
        } else if (order.level === 2) {
            return item.id === order.itemId && item.color === order.color;
        } else if (order.level === 3) {
            return item.category === order.category;
        }

        return false;
    });

    if (allCorrect) {
        // Correct!
        handleCorrectAnswer(player);
    } else {
        // Incorrect
        handleIncorrectAnswer(player);
    }
}

function handleCorrectAnswer(player) {
    // Add point
    gameState.scores[player]++;

    // Stop timers
    clearInterval(gameState.roundTimer);
    clearTimeout(gameState.hintTimer);

    // Show toast
    const playerName = gameState.players[player].name;
    showToast('✨', 'ĐÚNG RỒI!', `+1 điểm cho ${playerName}`, true);

    setTimeout(() => {
        nextRound();
    }, 1500);
}

function handleIncorrectAnswer(player) {
    // Reset this player's selections
    gameState.selections[player] = [];

    // Show toast
    showToast('❌', 'CHƯA ĐÚNG RỒI!', 'Lựa chọn của bạn bị reset', false);

    // Allow game to continue
    gameState.isProcessing = false;

    // Re-render
    renderShelf();
    updatePicksDisplay();
}

function getCorrectIndices(player) {
    const order = gameState.order;
    const correctIndices = [];

    gameState.shelves[player].forEach((item, index) => {
        let isCorrect = false;

        if (order.level === 1) {
            isCorrect = item.id === order.itemId;
        } else if (order.level === 2) {
            isCorrect = item.id === order.itemId && item.color === order.color;
        } else if (order.level === 3) {
            isCorrect = item.category === order.category;
        }

        if (isCorrect) {
            correctIndices.push(index);
        }
    });

    return correctIndices;
}

function highlightCorrectAnswers() {
    // Highlight correct answers on both boards
    ['p1', 'p2'].forEach(player => {
        const correctIndices = getCorrectIndices(player);
        correctIndices.slice(0, gameState.order.quantity).forEach(index => {
            const itemEl = document.querySelector(`.shelf-item[data-player="${player}"][data-index="${index}"]`);
            if (itemEl) {
                itemEl.classList.add('answer-highlight');
            }
        });
    });
}

// ===== TOAST =====
function showToast(icon, title, message, isCorrect) {
    const toast = document.getElementById('resultToast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    if (isCorrect) {
        toast.classList.remove('incorrect');
    } else {
        toast.classList.add('incorrect');
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 1400);
}

// ===== NEXT ROUND / END GAME =====
function nextRound() {
    clearInterval(gameState.roundTimer);
    clearTimeout(gameState.hintTimer);

    if (gameState.roundIndex >= TOTAL_ROUNDS) {
        endGame();
    } else {
        startRound();
    }
}

function endGame() {
    gameState.phase = 'endgame';

    // Determine winner
    let winner = '';
    let winnerIcon = '';
    if (gameState.scores.p1 > gameState.scores.p2) {
        winner = `${gameState.players.p1.name} WINS!`;
        winnerIcon = '🏆';
    } else if (gameState.scores.p2 > gameState.scores.p1) {
        winner = `${gameState.players.p2.name} WINS!`;
        winnerIcon = '🏆';
    } else {
        winner = "HÒA!";
        winnerIcon = '🤝';
    }

    // Update UI
    document.getElementById('winnerIcon').textContent = winnerIcon;
    document.getElementById('winnerText').textContent = winner;

    // Update player names in score rows
    const scoreRows = document.querySelectorAll('#endgameScreen .score-row .player-name');
    if (scoreRows.length >= 2) {
        scoreRows[0].textContent = `${gameState.players.p1.name}:`;
        scoreRows[1].textContent = `${gameState.players.p2.name}:`;
    }

    document.getElementById('finalP1Score').textContent = gameState.scores.p1;
    document.getElementById('finalP2Score').textContent = gameState.scores.p2;

    // Levels played
    const levelsText = gameState.levelsPlayed.sort().join(' → ');
    document.getElementById('levelsPlayed').textContent = levelsText;

    showScreen('endgameScreen');
}

function rematch() {
    startGame();
}

// ===== TEXT TO SPEECH =====
function speakOrder() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(gameState.order.text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Load player data from localStorage
    loadPlayerData();

    showScreen('homeScreen');
});
