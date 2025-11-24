// ===== GAME CONFIGURATION =====
const DIFFICULTY_SETTINGS = {
    easy: { gridCols: 4, gridRows: 4, pairs: 8, name: '4×4 (Easy)' },
    medium: { gridCols: 5, gridRows: 4, pairs: 10, name: '5×4 (Medium)' },
    hard: { gridCols: 6, gridRows: 6, pairs: 18, name: '6×6 (Hard)' }
};

const PREVIEW_DURATION = 10; // seconds
const TURN_DURATION = 20; // seconds
const MISS_DELAY = 1200; // milliseconds
const CIRCUMFERENCE = 2 * Math.PI * 45; // for timer circle animation

// Animal emojis - 18 different animals (enough for hardest difficulty)
const ANIMALS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊',
    '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
    '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'
];

// ===== AUDIO SYSTEM =====
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let backgroundMusic = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
}

// Play procedural sound effects
function playSound(type) {
    const settings = gameState.settings;
    if (!settings.soundEffects) return;

    initAudio();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    switch(type) {
        case 'flip':
            // Card flip sound - quick beep
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, now);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
            break;

        case 'match':
            // Match sound - cheerful ascending notes
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523, now); // C
            oscillator.frequency.setValueAtTime(659, now + 0.1); // E
            oscillator.frequency.setValueAtTime(784, now + 0.2); // G
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
            break;

        case 'miss':
            // Miss sound - descending tone
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(400, now);
            oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.2);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
            break;

        case 'win':
            // Victory fanfare
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(523, now);
            oscillator.frequency.setValueAtTime(659, now + 0.15);
            oscillator.frequency.setValueAtTime(784, now + 0.3);
            oscillator.frequency.setValueAtTime(1047, now + 0.45);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
            oscillator.start(now);
            oscillator.stop(now + 0.6);
            break;
    }
}

// Background music using Web Audio API
function startBackgroundMusic() {
    if (!gameState.settings.backgroundMusic) return;
    if (backgroundMusic) return; // Already playing

    initAudio();

    // Create a simple looping melody
    backgroundMusic = {
        isPlaying: true,
        currentNote: 0
    };

    playBackgroundLoop();
}

function playBackgroundLoop() {
    if (!backgroundMusic || !backgroundMusic.isPlaying || !gameState.settings.backgroundMusic) {
        return;
    }

    initAudio();

    // Simple melody pattern (C major scale based)
    const melody = [523, 587, 659, 698, 784, 698, 659, 587]; // C D E F G F E D
    const noteDuration = 0.4;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(melody[backgroundMusic.currentNote], audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Very quiet background
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + noteDuration);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + noteDuration);

    backgroundMusic.currentNote = (backgroundMusic.currentNote + 1) % melody.length;

    // Schedule next note
    setTimeout(() => playBackgroundLoop(), noteDuration * 1000);
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.isPlaying = false;
        backgroundMusic = null;
    }
}

function toggleBackgroundMusic() {
    if (gameState.settings.backgroundMusic) {
        startBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
}

let gameState = {
    phase: 'home', // home | preview | battle | end
    difficulty: 'medium', // easy | medium | hard
    boardCols: 5,
    boardRows: 4,
    totalPairs: 10,
    cards: [],
    currentPlayer: 1, // 1 or 2
    selectedCards: [], // indices of selected cards (0-2)
    scores: { p1: 0, p2: 0 },
    misses: { p1: 0, p2: 0 },
    matchedCount: 0,
    totalTurns: 0,
    gameStartTime: null,
    previewTimer: null,
    turnTimer: null,
    turnTimeRemaining: TURN_DURATION,
    isProcessing: false, // prevent clicks during resolution
    settings: {
        backgroundMusic: true,
        soundEffects: true
    }
};

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
    stopBackgroundMusic();
    window.location.href = 'index.html';
}

function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    const settings = DIFFICULTY_SETTINGS[difficulty];

    // Update UI
    document.querySelectorAll('.btn-difficulty').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.btn-difficulty').classList.add('active');

    // Update game info display
    document.getElementById('gameInfoGrid').textContent = `${settings.gridCols}×${settings.gridRows}`;
    document.getElementById('gameInfoPairs').textContent = settings.pairs;
}

function showSettings() {
    // Update toggles to match current settings
    document.getElementById('bgMusicToggle').checked = gameState.settings.backgroundMusic;
    document.getElementById('sfxToggle').checked = gameState.settings.soundEffects;
    showScreen('settingsScreen');
}

function closeSettings() {
    showScreen('homeScreen');
}

function toggleBgMusicSetting() {
    gameState.settings.backgroundMusic = document.getElementById('bgMusicToggle').checked;
    toggleBackgroundMusic();
}

function toggleSfxSetting() {
    gameState.settings.soundEffects = document.getElementById('sfxToggle').checked;
}

// ===== GAME INITIALIZATION =====
function startGame(difficulty = null) {
    // Use selected difficulty or keep current
    if (difficulty) {
        gameState.difficulty = difficulty;
    }

    const diffSettings = DIFFICULTY_SETTINGS[gameState.difficulty];
    gameState.boardCols = diffSettings.gridCols;
    gameState.boardRows = diffSettings.gridRows;
    gameState.totalPairs = diffSettings.pairs;

    // Reset game state (preserve settings and difficulty)
    const settings = gameState.settings;
    gameState = {
        phase: 'preview',
        difficulty: gameState.difficulty,
        boardCols: diffSettings.gridCols,
        boardRows: diffSettings.gridRows,
        totalPairs: diffSettings.pairs,
        cards: [],
        currentPlayer: 1,
        selectedCards: [],
        scores: { p1: 0, p2: 0 },
        misses: { p1: 0, p2: 0 },
        matchedCount: 0,
        totalTurns: 0,
        gameStartTime: Date.now(),
        previewTimer: null,
        turnTimer: null,
        turnTimeRemaining: TURN_DURATION,
        isProcessing: false,
        settings: settings
    };

    // Start background music
    startBackgroundMusic();

    // Generate cards
    generateCards();

    // Start preview phase
    startPreviewPhase();
}

function generateCards() {
    // Create pairs based on difficulty
    const pairs = [];
    for (let i = 0; i < gameState.totalPairs; i++) {
        const animal = ANIMALS[i];
        pairs.push({ pairId: i, icon: animal });
        pairs.push({ pairId: i, icon: animal });
    }

    // For odd grids (5x5 = 25), add one extra card that matches nothing (wildcard)
    // Actually, we'll just use fewer pairs for 5x5: 12 pairs = 24 cards, leaving 1 empty

    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }

    // Create card objects
    gameState.cards = pairs.map((pair, index) => ({
        id: index,
        pairId: pair.pairId,
        icon: pair.icon,
        state: 'hidden' // hidden | revealed | matched
    }));
}

// ===== PREVIEW PHASE =====
function startPreviewPhase() {
    gameState.phase = 'preview';
    showScreen('previewScreen');
    renderPreviewBoard();

    let timeLeft = PREVIEW_DURATION;
    updatePreviewTimer(timeLeft);

    gameState.previewTimer = setInterval(() => {
        timeLeft--;
        updatePreviewTimer(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(gameState.previewTimer);
            endPreviewPhase();
        }
    }, 1000);
}

function renderPreviewBoard() {
    const board = document.getElementById('previewBoard');
    board.innerHTML = '';
    board.className = `board preview-board`;
    board.style.gridTemplateColumns = `repeat(${gameState.boardCols}, 1fr)`;

    gameState.cards.forEach(card => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card revealed';
        cardEl.innerHTML = `<span class="card-icon">${card.icon}</span>`;
        board.appendChild(cardEl);
    });
}

function updatePreviewTimer(seconds) {
    const timerText = document.getElementById('previewTimerText');
    const timerCircle = document.getElementById('previewTimerCircle');

    timerText.textContent = seconds;

    const progress = seconds / PREVIEW_DURATION;
    const offset = CIRCUMFERENCE * (1 - progress);
    timerCircle.style.strokeDashoffset = offset;
}

function endPreviewPhase() {
    // Hide all cards
    gameState.cards.forEach(card => {
        card.state = 'hidden';
    });

    // Start battle phase
    startBattlePhase();
}

// ===== BATTLE PHASE =====
function startBattlePhase() {
    gameState.phase = 'battle';
    gameState.currentPlayer = 1; // P1 always goes first
    showScreen('battleScreen');
    renderBattleBoard();
    updateBattleUI();
    startTurnTimer();
}

function renderBattleBoard() {
    const board = document.getElementById('battleBoard');
    board.innerHTML = '';
    board.className = `board battle-board`;
    board.style.gridTemplateColumns = `repeat(${gameState.boardCols}, 1fr)`;

    gameState.cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.dataset.index = index;

        if (card.state === 'revealed') {
            cardEl.classList.add('revealed');
            cardEl.innerHTML = `<span class="card-icon">${card.icon}</span>`;
        } else if (card.state === 'matched') {
            cardEl.classList.add('matched');
            cardEl.innerHTML = `<span class="card-icon">${card.icon}</span>`;
        }

        // Only allow clicking hidden cards
        if (card.state === 'hidden' && !gameState.isProcessing) {
            cardEl.addEventListener('click', () => handleCardClick(index));
        }

        board.appendChild(cardEl);
    });
}

function updateBattleUI() {
    // Update scores
    document.getElementById('p1Score').textContent = gameState.scores.p1;
    document.getElementById('p2Score').textContent = gameState.scores.p2;
    document.getElementById('matchedCount').textContent = gameState.matchedCount;
    document.getElementById('totalPairs').textContent = gameState.totalPairs;

    // Update turn indicator
    document.getElementById('currentTurnText').textContent = `Player ${gameState.currentPlayer}`;

    // Highlight current player
    document.querySelectorAll('.player-score').forEach(el => el.classList.remove('active'));
    document.querySelector(`.p${gameState.currentPlayer}-score`).classList.add('active');

    // Update status message
    const msg = `Player ${gameState.currentPlayer}, flip 2 cards`;
    document.getElementById('statusMessage').textContent = msg;
}

function handleCardClick(index) {
    if (gameState.isProcessing) return;
    if (gameState.cards[index].state !== 'hidden') return;
    if (gameState.selectedCards.includes(index)) return;
    if (gameState.selectedCards.length >= 2) return;

    // Play flip sound
    playSound('flip');

    // Reveal card
    gameState.cards[index].state = 'revealed';
    gameState.selectedCards.push(index);

    // Add flipping animation to the clicked card
    const cardEl = document.querySelector(`#battleBoard .card[data-index="${index}"]`);
    if (cardEl) {
        cardEl.classList.add('revealed', 'flipping');
        cardEl.innerHTML = `<span class="card-icon">${gameState.cards[index].icon}</span>`;

        // Remove flipping class after animation completes
        setTimeout(() => {
            cardEl.classList.remove('flipping');
        }, 300);
    }

    // If 2 cards selected, check for match
    if (gameState.selectedCards.length === 2) {
        gameState.isProcessing = true;
        setTimeout(() => {
            checkMatch();
        }, 300);
    }
}

function checkMatch() {
    const [index1, index2] = gameState.selectedCards;
    const card1 = gameState.cards[index1];
    const card2 = gameState.cards[index2];

    if (card1.pairId === card2.pairId) {
        // MATCH!
        handleMatch();
    } else {
        // MISS
        handleMiss();
    }
}

function handleMatch() {
    const [index1, index2] = gameState.selectedCards;

    // Mark cards as matched
    gameState.cards[index1].state = 'matched';
    gameState.cards[index2].state = 'matched';

    // Update score
    const player = `p${gameState.currentPlayer}`;
    gameState.scores[player]++;
    gameState.matchedCount++;

    // Play match sound
    playSound('match');

    // Show toast
    showToast('match', gameState.currentPlayer);

    // Reset for next turn (same player continues)
    gameState.selectedCards = [];
    gameState.isProcessing = false;

    // Restart turn timer
    resetTurnTimer();

    // Update UI
    renderBattleBoard();
    updateBattleUI();

    // Check if game over
    if (gameState.matchedCount === gameState.totalPairs) {
        clearInterval(gameState.turnTimer);
        stopBackgroundMusic();
        playSound('win');
        setTimeout(() => {
            endGame();
        }, 2000);
    }
}

function handleMiss() {
    const player = `p${gameState.currentPlayer}`;
    gameState.misses[player]++;

    // Play miss sound
    playSound('miss');

    // Show toast
    showToast('miss', gameState.currentPlayer);

    // Wait MISS_DELAY then flip cards back and switch turn
    setTimeout(() => {
        const [index1, index2] = gameState.selectedCards;
        gameState.cards[index1].state = 'hidden';
        gameState.cards[index2].state = 'hidden';

        // Switch turn
        switchTurn();

        // Reset
        gameState.selectedCards = [];
        gameState.isProcessing = false;

        // Update UI
        renderBattleBoard();
        updateBattleUI();
    }, MISS_DELAY);
}

function switchTurn() {
    gameState.totalTurns++;
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    resetTurnTimer();
}

// ===== TURN TIMER =====
function startTurnTimer() {
    gameState.turnTimeRemaining = TURN_DURATION;
    updateTurnTimerUI();

    gameState.turnTimer = setInterval(() => {
        gameState.turnTimeRemaining--;
        updateTurnTimerUI();

        // Warning state when 5 seconds left
        const timerEl = document.querySelector('.turn-timer');
        if (gameState.turnTimeRemaining <= 5) {
            timerEl.classList.add('warning');
        } else {
            timerEl.classList.remove('warning');
        }

        if (gameState.turnTimeRemaining <= 0) {
            clearInterval(gameState.turnTimer);
            handleTimeout();
        }
    }, 1000);
}

function resetTurnTimer() {
    clearInterval(gameState.turnTimer);
    startTurnTimer();
}

function updateTurnTimerUI() {
    const timerText = document.getElementById('turnTimerText');
    const timerCircle = document.getElementById('turnTimerCircle');

    timerText.textContent = gameState.turnTimeRemaining;

    const progress = gameState.turnTimeRemaining / TURN_DURATION;
    const offset = CIRCUMFERENCE * (1 - progress);
    timerCircle.style.strokeDashoffset = offset;
}

function handleTimeout() {
    if (gameState.isProcessing) return;

    // Show timeout toast
    showTimeoutToast();

    // Handle based on selected cards
    if (gameState.selectedCards.length === 1) {
        // Flip back the one card
        const index = gameState.selectedCards[0];
        gameState.cards[index].state = 'hidden';
        gameState.selectedCards = [];
        renderBattleBoard();
    }

    // Switch turn
    setTimeout(() => {
        switchTurn();
        updateBattleUI();
    }, 1500);
}

// ===== TOASTS =====
function showToast(type, player) {
    const toast = document.getElementById('resultToast');
    const icon = document.getElementById('toastIcon');
    const title = document.getElementById('toastTitle');
    const message = document.getElementById('toastMessage');

    if (type === 'match') {
        icon.textContent = '✨';
        title.textContent = 'MATCH!';
        message.textContent = `+1 for Player ${player}`;
    } else {
        icon.textContent = '❌';
        title.textContent = 'NO MATCH';
        message.textContent = 'Try again!';
    }

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

function showTimeoutToast() {
    const toast = document.getElementById('timeoutToast');
    const message = document.getElementById('timeoutMessage');

    const nextPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    message.textContent = `Turn passes to Player ${nextPlayer}`;

    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

// ===== ENDGAME =====
function endGame() {
    gameState.phase = 'end';
    clearInterval(gameState.turnTimer);

    // Determine winner
    let winner = '';
    let winnerIcon = '';
    if (gameState.scores.p1 > gameState.scores.p2) {
        winner = 'Player 1 WINS!';
        winnerIcon = '🏆';
    } else if (gameState.scores.p2 > gameState.scores.p1) {
        winner = 'Player 2 WINS!';
        winnerIcon = '🏆';
    } else {
        winner = "IT'S A DRAW!";
        winnerIcon = '🤝';
    }

    // Update endgame screen
    document.getElementById('winnerIcon').textContent = winnerIcon;
    document.getElementById('winnerText').textContent = winner;
    document.getElementById('finalP1Score').textContent = `${gameState.scores.p1} pairs`;
    document.getElementById('finalP2Score').textContent = `${gameState.scores.p2} pairs`;

    // Stats
    document.getElementById('statTotalTurns').textContent = gameState.totalTurns;
    document.getElementById('statP1Misses').textContent = gameState.misses.p1;
    document.getElementById('statP2Misses').textContent = gameState.misses.p2;

    const duration = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    document.getElementById('statDuration').textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    showScreen('endgameScreen');
}

function rematch() {
    startGame();
}

function quitGame() {
    if (confirm('Are you sure you want to quit the current game?')) {
        clearInterval(gameState.previewTimer);
        clearInterval(gameState.turnTimer);
        showScreen('homeScreen');
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize timer circles
    document.querySelectorAll('.timer-progress').forEach(circle => {
        circle.style.strokeDasharray = CIRCUMFERENCE;
        circle.style.strokeDashoffset = 0;
    });

    showScreen('homeScreen');
});
