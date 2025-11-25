// ===== GAME CONFIGURATION =====
const VIETNAMESE_LETTERS = ['A', 'Ă', 'Â', 'B', 'C', 'D', 'Đ', 'E', 'Ê', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'Ô', 'Ơ', 'P', 'Q', 'R', 'S', 'T', 'U', 'Ư', 'V', 'X', 'Y'];

// Level 2: Word vocabulary with icons and first letters
const LEVEL2_VOCABULARY = [
    { word: 'MÈO', icon: '🐱', letter: 'M', description: 'Mèo' },
    { word: 'CHÓ', icon: '🐶', letter: 'C', description: 'Chó' },
    { word: 'GÀ', icon: '🐔', letter: 'G', description: 'Gà' },
    { word: 'ÁO', icon: '👕', letter: 'Á', description: 'Áo' },
    { word: 'BÒ', icon: '🐄', letter: 'B', description: 'Bò' },
    { word: 'HOA', icon: '🌸', letter: 'H', description: 'Hoa' },
    { word: 'CÁ', icon: '🐟', letter: 'C', description: 'Cá' },
    { word: 'DÊ', icon: '🐐', letter: 'D', description: 'Dê' },
    { word: 'VỊT', icon: '🦆', letter: 'V', description: 'Vịt' },
    { word: 'CUA', icon: '🦀', letter: 'C', description: 'Cua' }
];

// Level 3: Two-letter combinations
const LEVEL3_BIGRAMS = [
    { letters: ['B', 'A'], word: 'BA', description: 'Ba' },
    { letters: ['M', 'Ẹ'], word: 'MẸ', description: 'Mẹ' },
    { letters: ['C', 'Ô'], word: 'CÔ', description: 'Cô' },
    { letters: ['B', 'Ò'], word: 'BÒ', description: 'Bò' },
    { letters: ['C', 'Á'], word: 'CÁ', description: 'Cá' },
    { letters: ['B', 'O'], word: 'BO', description: 'Bo' },
    { letters: ['G', 'À'], word: 'GÀ', description: 'Gà' },
    { letters: ['M', 'E'], word: 'ME', description: 'Me' }
];

const ROUND_DURATION = 15; // seconds
const HINT_DELAY = 1500; // 1.5 seconds
const HINT_DURATION = 800; // milliseconds
const TOTAL_ROUNDS = 10;

// Progressive mode mapping: rounds to levels
const PROGRESSIVE_MAPPING = {
    1: 1, 2: 1, 3: 1, // Rounds 1-3: Level 1
    4: 2, 5: 2, 6: 2, 7: 2, // Rounds 4-7: Level 2
    8: 3, 9: 3, 10: 3 // Rounds 8-10: Level 3
};

// ===== GAME STATE =====
let gameState = {
    phase: 'home', // home | countdown | gameplay | endgame
    mode: 'progressive', // progressive | level1 | level2 | level3
    balancedMode: true,
    roundIndex: 0,
    currentLevel: 1,
    boards: { p1: [], p2: [] }, // 5x5 array of letters for each player
    order: null, // { level, target, description, iconOrText }
    scores: { p1: 0, p2: 0 },
    roundTimer: null,
    roundTimeRemaining: ROUND_DURATION,
    hintTimer: null,
    isProcessing: false,
    levelsPlayed: [],
    progress: { p1: [], p2: [] }, // For Level 3 tracking
    players: {
        p1: { name: 'Player 1', avatar: null, isChild: false },
        p2: { name: 'Player 2', avatar: null, isChild: false }
    }
};

// ===== PLAYER MANAGEMENT =====
function loadPlayerData() {
    const selectedPlayerIds = getSelectedPlayers() || [];
    const allPlayers = getPlayers();

    if (selectedPlayerIds.length === 2) {
        const p1 = allPlayers.find(p => p.id === selectedPlayerIds[0]);
        const p2 = allPlayers.find(p => p.id === selectedPlayerIds[1]);

        if (p1) {
            gameState.players.p1 = { name: p1.name, avatar: p1.avatar, isChild: !!p1.isChild };
        }
        if (p2) {
            gameState.players.p2 = { name: p2.name, avatar: p2.avatar, isChild: !!p2.isChild };
        }
    }
}

// NOTE: Magic Letter Hunt is a simultaneous game (both players play at the same time)
// No turn popup needed - removed showTurnPopup() function

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ===== HOME SCREEN =====
function startGame() {
    // Get selected mode
    const selectedMode = document.querySelector('input[name="levelMode"]:checked').value;
    const balancedMode = document.getElementById('balancedToggle').checked;

    // Preserve players data
    const players = gameState.players;

    // Reset game state
    gameState = {
        phase: 'countdown',
        mode: selectedMode,
        balancedMode: balancedMode,
        roundIndex: 0,
        currentLevel: determineLevel(selectedMode, 1),
        boards: { p1: [], p2: [] },
        order: null,
        scores: { p1: 0, p2: 0 },
        roundTimer: null,
        roundTimeRemaining: ROUND_DURATION,
        hintTimer: null,
        isProcessing: false,
        levelsPlayed: [],
        progress: { p1: [], p2: [] },
        players: players
    };

    // Show countdown
    showCountdown();
}

function determineLevel(mode, roundNumber) {
    if (mode === 'progressive') {
        return PROGRESSIVE_MAPPING[roundNumber];
    } else if (mode === 'level1') {
        return 1;
    } else if (mode === 'level2') {
        return 2;
    } else if (mode === 'level3') {
        return 3;
    }
}

function showHowToPlay() {
    document.getElementById('howToPlayModal').classList.add('active');
}

function closeHowToPlay() {
    document.getElementById('howToPlayModal').classList.remove('active');
}

function goHome() {
    window.location.href = 'index.html';
}

function quitGame() {
    if (confirm('Are you sure you want to quit the current game?')) {
        clearTimers();
        showScreen('homeScreen');
    }
}

// ===== COUNTDOWN =====
function showCountdown() {
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

// ===== GAMEPLAY =====
function startRound() {
    gameState.roundIndex++;
    gameState.phase = 'gameplay';
    gameState.isProcessing = false;
    gameState.progress = { p1: [], p2: [] };

    // Determine current level
    gameState.currentLevel = determineLevel(gameState.mode, gameState.roundIndex);

    // Track levels played
    if (!gameState.levelsPlayed.includes(gameState.currentLevel)) {
        gameState.levelsPlayed.push(gameState.currentLevel);
    }

    // Generate board and order
    generateBoardAndOrder();

    // Update UI
    updateGameplayUI();
    renderBoard();

    // Auto-speak order
    speakOrder();

    // Start timer
    gameState.roundTimeRemaining = ROUND_DURATION;
    startRoundTimer();

    // Start hint timer if balanced mode
    if (gameState.balancedMode) {
        startHintTimer();
    }

    showScreen('gameplayScreen');
}

function generateBoardAndOrder() {
    const level = gameState.currentLevel;

    if (level === 1) {
        // Level 1: Find a single letter
        const targetLetter = VIETNAMESE_LETTERS[Math.floor(Math.random() * VIETNAMESE_LETTERS.length)];
        gameState.order = {
            level: 1,
            target: targetLetter,
            description: `Tìm chữ ${targetLetter}`,
            iconOrText: targetLetter
        };

        // Generate 5x5 board for each player with random letters
        ['p1', 'p2'].forEach(player => {
            gameState.boards[player] = [];
            for (let i = 0; i < 25; i++) {
                const randomLetter = VIETNAMESE_LETTERS[Math.floor(Math.random() * VIETNAMESE_LETTERS.length)];
                gameState.boards[player].push(randomLetter);
            }

            // Ensure at least one target letter exists
            const hasTarget = gameState.boards[player].some(letter => letter === targetLetter);
            if (!hasTarget) {
                const randomIndex = Math.floor(Math.random() * 25);
                gameState.boards[player][randomIndex] = targetLetter;
            }
        });

    } else if (level === 2) {
        // Level 2: Find first letter of a word
        const vocabItem = LEVEL2_VOCABULARY[Math.floor(Math.random() * LEVEL2_VOCABULARY.length)];
        const targetLetter = vocabItem.letter;

        gameState.order = {
            level: 2,
            target: targetLetter,
            description: `Tìm chữ đầu của ${vocabItem.description}`,
            iconOrText: vocabItem.icon
        };

        // Generate board for each player
        ['p1', 'p2'].forEach(player => {
            gameState.boards[player] = [];
            for (let i = 0; i < 25; i++) {
                const randomLetter = VIETNAMESE_LETTERS[Math.floor(Math.random() * VIETNAMESE_LETTERS.length)];
                gameState.boards[player].push(randomLetter);
            }

            // Ensure target letter exists
            const hasTarget = gameState.boards[player].some(letter => letter === targetLetter);
            if (!hasTarget) {
                const randomIndex = Math.floor(Math.random() * 25);
                gameState.boards[player][randomIndex] = targetLetter;
            }
        });

    } else if (level === 3) {
        // Level 3: Find two letters in sequence
        const bigramItem = LEVEL3_BIGRAMS[Math.floor(Math.random() * LEVEL3_BIGRAMS.length)];

        gameState.order = {
            level: 3,
            target: bigramItem.letters,
            description: `Ghép 2 chữ: ${bigramItem.word}`,
            iconOrText: bigramItem.word
        };

        // Generate board for each player with both letters guaranteed
        ['p1', 'p2'].forEach(player => {
            gameState.boards[player] = [];
            for (let i = 0; i < 25; i++) {
                const randomLetter = VIETNAMESE_LETTERS[Math.floor(Math.random() * VIETNAMESE_LETTERS.length)];
                gameState.boards[player].push(randomLetter);
            }

            // Ensure both target letters exist
            bigramItem.letters.forEach(letter => {
                const hasLetter = gameState.boards[player].some(l => l === letter);
                if (!hasLetter) {
                    const randomIndex = Math.floor(Math.random() * 25);
                    gameState.boards[player][randomIndex] = letter;
                }
            });
        });
    }
}

function updateGameplayUI() {
    // Update scores
    document.getElementById('p1Score').textContent = gameState.scores.p1;
    document.getElementById('p2Score').textContent = gameState.scores.p2;

    // Update player labels with names
    const p1Label = document.querySelector('.p1-info .player-name');
    const p2Label = document.querySelector('.p2-info .player-name');
    if (p1Label) p1Label.textContent = gameState.players.p1.name;
    if (p2Label) p2Label.textContent = gameState.players.p2.name;

    // Update board labels with names
    const boardLabels = document.querySelectorAll('.board-label');
    if (boardLabels.length >= 2) {
        boardLabels[0].textContent = gameState.players.p1.name;
        boardLabels[1].textContent = gameState.players.p2.name;
    }

    // Update round and level badges
    document.getElementById('roundBadge').textContent = `Round ${gameState.roundIndex}/${TOTAL_ROUNDS}`;
    document.getElementById('levelBadge').textContent = `Level ${gameState.currentLevel}`;

    // Update order card
    document.getElementById('orderIcon').textContent = gameState.order.iconOrText;
    document.getElementById('orderText').textContent = gameState.order.description;

    // Show/hide progress display for Level 3
    const progressDisplay = document.getElementById('progressDisplay');
    if (gameState.currentLevel === 3) {
        progressDisplay.classList.add('active');
        updateProgressDisplay();
    } else {
        progressDisplay.classList.remove('active');
    }
}

function updateProgressDisplay() {
    const p1Text = gameState.progress.p1.length > 0 ? gameState.progress.p1.join(' ') : '_ _';
    const p2Text = gameState.progress.p2.length > 0 ? gameState.progress.p2.join(' ') : '_ _';

    document.getElementById('p1Progress').textContent = p1Text;
    document.getElementById('p2Progress').textContent = p2Text;
}

function renderBoard() {
    renderBoardForPlayer('p1', 'letterBoardP1');
    renderBoardForPlayer('p2', 'letterBoardP2');
}

function renderBoardForPlayer(player, boardId) {
    const board = document.getElementById(boardId);
    board.innerHTML = '';

    gameState.boards[player].forEach((letter, index) => {
        const cell = document.createElement('div');
        cell.className = 'letter-cell';
        cell.textContent = letter;
        cell.dataset.index = index;
        cell.dataset.player = player;

        cell.addEventListener('click', () => handleCellClick(player, index));

        board.appendChild(cell);
    });
}

function handleCellClick(player, index) {
    if (gameState.isProcessing) return;

    const letter = gameState.boards[player][index];
    const cell = document.querySelector(`.letter-cell[data-player="${player}"][data-index="${index}"]`);

    // Mark cell as clicked
    cell.classList.add(`clicked-${player}`);

    // Check answer based on level
    if (gameState.currentLevel === 1 || gameState.currentLevel === 2) {
        // Level 1 & 2: Single letter match
        checkAnswerSingleLetter(player, letter, cell);
    } else if (gameState.currentLevel === 3) {
        // Level 3: Two-letter sequence
        checkAnswerBigram(player, letter, cell);
    }
}

function checkAnswerSingleLetter(player, clickedLetter, cell) {
    const correctLetter = gameState.order.target;

    if (clickedLetter === correctLetter) {
        // CORRECT!
        gameState.isProcessing = true;
        clearTimers();

        // Mark cell as correct
        cell.classList.add('correct-answer');

        // Award point
        gameState.scores[player]++;

        // Show toast
        const playerName = gameState.players[player].name;
        showToast('✨', 'ĐÚNG RỒI!', `${playerName} wins round!`, true);

        setTimeout(() => {
            proceedToNextRound();
        }, 2000);
    }
    // Wrong answers don't do anything (no penalty)
}

function checkAnswerBigram(player, clickedLetter, cell) {
    const targetLetters = gameState.order.target;
    const currentProgress = gameState.progress[player];

    // Add letter to player's progress
    currentProgress.push(clickedLetter);

    // Update progress display
    updateProgressDisplay();

    // Check if completed (2 letters)
    if (currentProgress.length === 2) {
        // Check if matches target sequence
        const isCorrect = currentProgress[0] === targetLetters[0] && currentProgress[1] === targetLetters[1];

        if (isCorrect) {
            // CORRECT!
            gameState.isProcessing = true;
            clearTimers();

            // Mark cells as correct
            document.querySelectorAll(`.letter-cell.clicked-${player}`).forEach(c => {
                c.classList.add('correct-answer');
            });

            // Award point
            gameState.scores[player]++;

            // Show toast
            const playerName = gameState.players[player].name;
            showToast('✨', 'ĐÚNG RỒI!', `${playerName} wins round!`, true);

            setTimeout(() => {
                proceedToNextRound();
            }, 2000);
        } else {
            // WRONG - Reset this player's progress
            const playerName = gameState.players[player].name;
            showToast('❌', 'SAI RỒI!', `${playerName} - thử lại!`, false);

            setTimeout(() => {
                // Clear player's clicked cells
                document.querySelectorAll(`.letter-cell.clicked-${player}`).forEach(c => {
                    c.classList.remove(`clicked-${player}`);
                });

                // Reset progress
                gameState.progress[player] = [];
                updateProgressDisplay();
            }, 1200);
        }
    }
}

function proceedToNextRound() {
    // Check if need to show level up
    if (gameState.mode === 'progressive') {
        const nextRoundNumber = gameState.roundIndex + 1;
        if (nextRoundNumber <= TOTAL_ROUNDS) {
            const nextLevel = determineLevel(gameState.mode, nextRoundNumber);
            if (nextLevel > gameState.currentLevel) {
                showLevelUpBanner(nextLevel);
                setTimeout(() => {
                    hideLevelUpBanner();
                    continueGame();
                }, 2500);
                return;
            }
        }
    }

    continueGame();
}

function continueGame() {
    if (gameState.roundIndex >= TOTAL_ROUNDS) {
        endGame();
    } else {
        startRound();
    }
}

// ===== TIMER =====
function startRoundTimer() {
    const timerFill = document.getElementById('timerFill');
    const timerText = document.getElementById('timerText');

    gameState.roundTimer = setInterval(() => {
        gameState.roundTimeRemaining--;

        // Update UI
        timerText.textContent = `${gameState.roundTimeRemaining}s`;
        const percentage = (gameState.roundTimeRemaining / ROUND_DURATION) * 100;
        timerFill.style.width = `${percentage}%`;

        // Change color when low
        if (gameState.roundTimeRemaining <= 5) {
            timerFill.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ee5a6f 50%, #c92a2a 100%)';
        }

        // Time's up
        if (gameState.roundTimeRemaining <= 0) {
            clearInterval(gameState.roundTimer);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    gameState.isProcessing = true;

    // Show toast
    showToast('⏰', 'HẾT GIỜ!', 'No one wins this round', false);

    // Highlight correct answers
    highlightCorrectAnswers();

    setTimeout(() => {
        proceedToNextRound();
    }, 2500);
}

function highlightCorrectAnswers() {
    const level = gameState.currentLevel;

    if (level === 1 || level === 2) {
        const target = gameState.order.target;
        ['p1', 'p2'].forEach(player => {
            gameState.boards[player].forEach((letter, index) => {
                if (letter === target) {
                    const cell = document.querySelector(`.letter-cell[data-player="${player}"][data-index="${index}"]`);
                    if (cell) {
                        cell.classList.add('correct-answer');
                    }
                }
            });
        });
    } else if (level === 3) {
        // Just show the target word
        // Don't highlight - too complex for bigrams
    }
}

function clearTimers() {
    if (gameState.roundTimer) {
        clearInterval(gameState.roundTimer);
        gameState.roundTimer = null;
    }
    if (gameState.hintTimer) {
        clearTimeout(gameState.hintTimer);
        gameState.hintTimer = null;
    }
}

// ===== HINT SYSTEM (BALANCED MODE) =====
function startHintTimer() {
    gameState.hintTimer = setTimeout(() => {
        // Only show hint if P1 hasn't made any clicks yet
        const p1HasClicked = document.querySelector('.letter-cell[data-player="p1"].clicked-p1');
        if (!p1HasClicked && !gameState.isProcessing) {
            showHint();
        }
    }, HINT_DELAY);
}

function showHint() {
    const level = gameState.currentLevel;

    if (level === 1 || level === 2) {
        // Highlight one correct letter on P1's board
        const target = gameState.order.target;
        const correctIndices = [];

        gameState.boards.p1.forEach((letter, index) => {
            if (letter === target) {
                correctIndices.push(index);
            }
        });

        if (correctIndices.length > 0) {
            const randomIndex = correctIndices[Math.floor(Math.random() * correctIndices.length)];
            const cell = document.querySelector(`.letter-cell[data-player="p1"][data-index="${randomIndex}"]`);

            if (cell && !cell.classList.contains('clicked-p1')) {
                cell.classList.add('hint-highlight');
                setTimeout(() => {
                    cell.classList.remove('hint-highlight');
                }, HINT_DURATION);
            }
        }
    } else if (level === 3) {
        // Highlight first letter of bigram on P1's board
        const firstLetter = gameState.order.target[0];
        const correctIndices = [];

        gameState.boards.p1.forEach((letter, index) => {
            if (letter === firstLetter) {
                correctIndices.push(index);
            }
        });

        if (correctIndices.length > 0) {
            const randomIndex = correctIndices[Math.floor(Math.random() * correctIndices.length)];
            const cell = document.querySelector(`.letter-cell[data-player="p1"][data-index="${randomIndex}"]`);

            if (cell && !cell.classList.contains('clicked-p1')) {
                cell.classList.add('hint-highlight');
                setTimeout(() => {
                    cell.classList.remove('hint-highlight');
                }, HINT_DURATION);
            }
        }
    }
}

// ===== TOAST =====
function showToast(icon, title, message, isCorrect) {
    const toast = document.getElementById('resultToast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 1800);
}

// ===== LEVEL UP BANNER =====
function showLevelUpBanner(level) {
    const banner = document.getElementById('levelUpBanner');
    document.getElementById('levelUpText').textContent = `Level ${level}`;
    banner.classList.add('show');
}

function hideLevelUpBanner() {
    document.getElementById('levelUpBanner').classList.remove('show');
}

// ===== ENDGAME =====
function endGame() {
    gameState.phase = 'endgame';

    // Determine winner
    let winnerText = '';
    let winnerIcon = '🏆';

    if (gameState.scores.p1 > gameState.scores.p2) {
        winnerText = `${gameState.players.p1.name} WINS!`;
    } else if (gameState.scores.p2 > gameState.scores.p1) {
        winnerText = `${gameState.players.p2.name} WINS!`;
    } else {
        winnerText = "IT'S A TIE!";
        winnerIcon = '🤝';
    }

    document.getElementById('winnerIcon').textContent = winnerIcon;
    document.getElementById('winnerText').textContent = winnerText;

    // Update player names in score rows
    const scoreRows = document.querySelectorAll('#endgameScreen .score-row .player-name');
    if (scoreRows.length >= 2) {
        scoreRows[0].textContent = `${gameState.players.p1.name}:`;
        scoreRows[1].textContent = `${gameState.players.p2.name}:`;
    }

    // Update final scores
    document.getElementById('finalP1Score').textContent = gameState.scores.p1;
    document.getElementById('finalP2Score').textContent = gameState.scores.p2;

    // Update levels played
    const levelsText = gameState.levelsPlayed.sort().join(' → ');
    document.getElementById('levelsPlayed').textContent = levelsText;

    showScreen('endgameScreen');
}

function rematch() {
    startGame();
}

// ===== TEXT-TO-SPEECH =====
function speakOrder() {
    const text = gameState.order.description;

    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'vi-VN';
        utterance.rate = 0.85;
        speechSynthesis.speak(utterance);
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Load player data from localStorage
    loadPlayerData();

    showScreen('homeScreen');
});
