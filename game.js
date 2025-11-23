// ===== GAME STATE =====
const BOARD_SIZE = 10;
const SHIPS = [
    { length: 2, count: 1 },
    { length: 3, count: 2 },
    { length: 4, count: 1 }
];

let gameState = {
    currentScreen: 'mainMenu',
    currentPlayer: 1,
    setupPhase: 'player1',
    selectedShip: null,
    isHorizontal: true,

    player1: {
        board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)),
        ships: [],
        shipsRemaining: { 2: 1, 3: 2, 4: 1 },
        hits: 0,
        misses: 0,
        attacks: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)),
        shipsDestroyed: 0
    },

    player2: {
        board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)),
        ships: [],
        shipsRemaining: { 2: 1, 3: 2, 4: 1 },
        hits: 0,
        misses: 0,
        attacks: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0)),
        shipsDestroyed: 0
    },

    settings: {
        sound: true,
        animations: true,
        coordStyle: 'letters'
    },

    gameStartTime: null,
    turnCount: 0,
    historyShots: []  // Track all shots: {player, row, col, result, turnIndex}
};

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ===== MAIN MENU =====
function startGame() {
    gameState.currentPlayer = 1;
    gameState.setupPhase = 'player1';
    gameState.isHorizontal = true;
    gameState.selectedShip = null;
    resetPlayerData(gameState.player1);
    resetPlayerData(gameState.player2);
    gameState.turnCount = 0;
    gameState.historyShots = [];
    gameState.gameStartTime = null;
    showSetupScreen(1);
}

function showHowToPlay() {
    showModal('howToPlayModal');
}

function closeHowToPlay() {
    hideModal('howToPlayModal');
}

function showSettings() {
    showScreen('settingsScreen');
}

function closeSettings() {
    showScreen('mainMenu');
}

function goHome() {
    showScreen('mainMenu');
}

// ===== SETTINGS =====
function toggleSoundSetting() {
    gameState.settings.sound = document.getElementById('soundToggle').checked;
}

function toggleAnimationSetting() {
    gameState.settings.animations = document.getElementById('animationToggle').checked;
}

function updateCoordStyle() {
    gameState.settings.coordStyle = document.getElementById('coordStyle').value;
}

function toggleSound() {
    gameState.settings.sound = !gameState.settings.sound;
    document.getElementById('soundStatus').textContent = gameState.settings.sound ? 'ON' : 'OFF';
}

// ===== SETUP PHASE =====
function showSetupScreen(playerNum) {
    document.getElementById('setupTitle').textContent = `Setup - Player ${playerNum}`;
    updateShipCounts();
    renderSetupBoard();
    updateSetupStatus('Select a ship, hover board to preview');
    document.getElementById('readyButton').disabled = !isSetupComplete();
    showScreen('setupScreen');
}

function resetPlayerData(player) {
    player.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    player.ships = [];
    player.shipsRemaining = { 2: 1, 3: 2, 4: 1 };
    player.hits = 0;
    player.misses = 0;
    player.attacks = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    player.shipsDestroyed = 0;
}

function selectShip(length) {
    const player = getCurrentPlayer();
    if (player.shipsRemaining[length] > 0) {
        gameState.selectedShip = length;
        updateShipSelection();
        updateSetupStatus(`Selected ship: ${length} cells. Click on board to place.`);
    }
}

function updateShipSelection() {
    document.querySelectorAll('.ship-item').forEach(item => {
        item.classList.remove('selected');
        const length = parseInt(item.dataset.length);
        const player = getCurrentPlayer();
        if (player.shipsRemaining[length] === 0) {
            item.classList.add('depleted');
        } else {
            item.classList.remove('depleted');
        }
    });

    if (gameState.selectedShip) {
        const selectedItem = document.querySelector(`.ship-item[data-length="${gameState.selectedShip}"]`);
        if (selectedItem) selectedItem.classList.add('selected');
    }
}

function updateShipCounts() {
    const player = getCurrentPlayer();
    document.getElementById('ship-2-count').textContent = player.shipsRemaining[2];
    document.getElementById('ship-3-count').textContent = player.shipsRemaining[3];
    document.getElementById('ship-4-count').textContent = player.shipsRemaining[4];
    updateShipSelection();
}

function rotateShip() {
    gameState.isHorizontal = !gameState.isHorizontal;
    updateSetupStatus(`Ship rotated to ${gameState.isHorizontal ? 'horizontal' : 'vertical'}`);
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
            for (let i = 0; i < SHIPS.find(s => s.length === parseInt(length)).count; i++) {
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

    if (success && isSetupComplete()) {
        updateShipCounts();
        renderSetupBoard();
        document.getElementById('readyButton').disabled = false;
        updateSetupStatus('Ships placed randomly! All ships ready.');
    } else {
        // This should rarely happen, but handle it gracefully
        resetBoard(player);
        updateSetupStatus('Random placement failed. Please place ships manually or try again.');
    }
}

function resetBoard(player = null) {
    if (!player) player = getCurrentPlayer();
    player.board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    player.ships = [];
    player.shipsRemaining = { 2: 1, 3: 2, 4: 1 };
    gameState.selectedShip = null;
    updateShipCounts();
    renderSetupBoard();
    document.getElementById('readyButton').disabled = true;
    updateSetupStatus('Board reset. Select a ship to start placing.');
}

function renderSetupBoard() {
    const board = document.getElementById('setupBoard');
    board.innerHTML = '';

    const player = getCurrentPlayer();

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (player.board[row][col] === 1) {
                cell.classList.add('ship');
            } else if (player.board[row][col] === -1) {
                cell.classList.add('forbidden');
            }

            cell.addEventListener('mouseenter', handleSetupHover);
            cell.addEventListener('mouseleave', handleSetupHoverEnd);
            cell.addEventListener('click', handleSetupClick);

            board.appendChild(cell);
        }
    }
}

function handleSetupHover(e) {
    if (!gameState.selectedShip) return;

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const player = getCurrentPlayer();

    const canPlace = canPlaceShip(player, row, col, gameState.selectedShip, gameState.isHorizontal);

    // Preview ship cells
    const cells = getShipCells(row, col, gameState.selectedShip, gameState.isHorizontal);
    cells.forEach(([r, c]) => {
        const cell = document.querySelector(`#setupBoard .cell[data-row="${r}"][data-col="${c}"]`);
        if (cell) {
            cell.classList.add(canPlace ? 'preview-valid' : 'preview-invalid');
        }
    });

    // Highlight forbidden zone around ship to help user understand the rule
    if (canPlace) {
        const forbiddenCells = getForbiddenZone(cells);
        forbiddenCells.forEach(([r, c]) => {
            const cell = document.querySelector(`#setupBoard .cell[data-row="${r}"][data-col="${c}"]`);
            if (cell && !cell.classList.contains('preview-valid')) {
                cell.classList.add('forbidden-preview');
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
                    const isShipCell = shipCells.some(([sr, sc]) => sr === nr && sc === nc);
                    if (!isShipCell) {
                        forbidden.add(`${nr},${nc}`);
                    }
                }
            }
        }
    });

    return Array.from(forbidden).map(key => key.split(',').map(Number));
}

function handleSetupHoverEnd(e) {
    document.querySelectorAll('#setupBoard .cell').forEach(cell => {
        cell.classList.remove('preview-valid', 'preview-invalid', 'forbidden-preview');
    });
}

function handleSetupClick(e) {
    if (!gameState.selectedShip) {
        updateSetupStatus('Please select a ship first!');
        return;
    }

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const player = getCurrentPlayer();

    if (canPlaceShip(player, row, col, gameState.selectedShip, gameState.isHorizontal)) {
        placeShip(player, row, col, gameState.selectedShip, gameState.isHorizontal);
        player.shipsRemaining[gameState.selectedShip]--;

        if (player.shipsRemaining[gameState.selectedShip] === 0) {
            gameState.selectedShip = null;
        }

        updateShipCounts();
        renderSetupBoard();
        document.getElementById('readyButton').disabled = !isSetupComplete();

        if (isSetupComplete()) {
            updateSetupStatus('All ships placed! Click Ready to continue.');
        } else {
            updateSetupStatus('Ship placed! Select another ship or continue placing.');
        }
    } else {
        updateSetupStatus('Cannot place ship here! Ships cannot touch each other.');
    }
}

function canPlaceShip(player, row, col, length, horizontal) {
    const cells = getShipCells(row, col, length, horizontal);

    for (let [r, c] of cells) {
        if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
            return false;
        }
        if (player.board[r][c] !== 0) {
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
                    if (player.board[nr][nc] === 1) {
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
        sunk: false
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

function isSetupComplete() {
    const player = getCurrentPlayer();
    return player.shipsRemaining[2] === 0 &&
           player.shipsRemaining[3] === 0 &&
           player.shipsRemaining[4] === 0;
}

function confirmSetup() {
    if (!isSetupComplete()) return;

    if (gameState.setupPhase === 'player1') {
        gameState.setupPhase = 'player2';
        gameState.currentPlayer = 2; // Switch to player 2 for setup
        gameState.selectedShip = null; // Reset selection for player 2
        gameState.isHorizontal = true; // Reset orientation
        showPassScreen('Please hand the device to Player 2');
    } else {
        // Player 2 setup complete, ready to start battle
        gameState.setupPhase = 'battle'; // Mark setup as complete
        gameState.gameStartTime = Date.now();
        gameState.currentPlayer = 1; // Battle starts with player 1
        showPassScreen('Player 1 starts! Get ready...');
    }
}

function updateSetupStatus(message) {
    document.getElementById('setupStatus').textContent = message;
}

// ===== PASS DEVICE SCREEN =====
function showPassScreen(message) {
    document.getElementById('passMessage').textContent = message;
    showScreen('passDeviceScreen');
}

function acknowledgePass() {
    // After Player 1 ready, Player 2 needs to setup
    if (gameState.setupPhase === 'player2') {
        showSetupScreen(2);
    }
    // After Player 2 ready, or during battle turn changes
    else if (gameState.currentScreen === 'passDeviceScreen') {
        showBattleScreen();
    }
}

// ===== BATTLE PHASE =====
function showBattleScreen() {
    document.getElementById('currentTurn').textContent = `Player ${gameState.currentPlayer}`;
    updateBattleStatus(`Player ${gameState.currentPlayer}, choose a cell to fire`);
    renderBattleBoards();
    showScreen('battleScreen');
}

function renderBattleBoards() {
    const currentPlayerData = getCurrentPlayer();
    const opponentData = getOpponentPlayer();

    // Render My Fleet (current player's board with ships visible)
    const myFleetBoard = document.getElementById('myFleetBoard');
    myFleetBoard.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            // Show own ships
            if (currentPlayerData.board[row][col] === 1) {
                cell.classList.add('ship');
                cell.textContent = 'S';
            }

            // Show opponent's attacks on my board
            if (opponentData.attacks[row][col] === 1) {
                cell.classList.add('miss');
                cell.textContent = 'o';
            } else if (opponentData.attacks[row][col] === 2) {
                cell.classList.add('hit');
                cell.textContent = 'X';
            }

            // Check if ship is sunk
            const ship = currentPlayerData.ships.find(s =>
                s.cells.some(([r, c]) => r === row && c === col)
            );
            if (ship && ship.sunk) {
                cell.classList.remove('hit');
                cell.classList.add('sunk');
                cell.textContent = '#';
            }

            myFleetBoard.appendChild(cell);
        }
    }

    // Render Enemy Waters (opponent's board from attacker's perspective)
    const enemyBoard = document.getElementById('enemyWatersBoard');
    enemyBoard.innerHTML = '';

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Show my attacks on enemy board
            if (currentPlayerData.attacks[row][col] === 1) {
                cell.classList.add('miss');
                cell.textContent = 'o';
            } else if (currentPlayerData.attacks[row][col] === 2) {
                cell.classList.add('hit');
                cell.textContent = 'X';
            }

            // Check if enemy ship at this position is sunk
            const enemyShip = opponentData.ships.find(s =>
                s.cells.some(([r, c]) => r === row && c === col)
            );
            if (enemyShip && enemyShip.sunk) {
                cell.classList.remove('hit');
                cell.classList.add('sunk');
                cell.textContent = '#';
            }

            // Only clickable if not already attacked
            if (currentPlayerData.attacks[row][col] === 0) {
                cell.addEventListener('click', handleAttack);
            }

            enemyBoard.appendChild(cell);
        }
    }
}

function handleAttack(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    const currentPlayerData = getCurrentPlayer();
    const opponentData = getOpponentPlayer();

    // Validate: cannot shoot already attacked cell
    if (currentPlayerData.attacks[row][col] !== 0) {
        updateBattleStatus('You already attacked this cell! Choose another target.');
        return;
    }

    // Disable all cells during attack processing
    document.querySelectorAll('#enemyWatersBoard .cell').forEach(cell => {
        cell.style.pointerEvents = 'none';
    });

    gameState.turnCount++;

    // Check if hit or miss
    const isHit = opponentData.board[row][col] === 1;
    let result = 'miss';
    let toastMessage = '';

    if (isHit) {
        currentPlayerData.attacks[row][col] = 2; // Hit
        currentPlayerData.hits++;
        result = 'hit';

        // Find which ship was hit
        const hitShip = opponentData.ships.find(ship =>
            ship.cells.some(([r, c]) => r === row && c === col)
        );

        if (hitShip) {
            hitShip.hits++;

            // Check if ship is sunk
            if (hitShip.hits === hitShip.length) {
                hitShip.sunk = true;
                currentPlayerData.shipsDestroyed++;
                result = 'sunk';

                const shipName = getShipName(hitShip.length);
                toastMessage = `You destroyed opponent's ${shipName}!`;
                showToast('HIT!', toastMessage);

                // Check if all ships sunk (game over)
                if (opponentData.ships.every(ship => ship.sunk)) {
                    // Record shot history
                    gameState.historyShots.push({
                        player: gameState.currentPlayer,
                        row: row,
                        col: col,
                        result: result,
                        turnIndex: gameState.turnCount
                    });

                    renderBattleBoards();

                    setTimeout(() => {
                        endGame(gameState.currentPlayer);
                    }, 2500);
                    return;
                }
            } else {
                showToast('HIT!', 'Direct hit!');
            }
        }
    } else {
        currentPlayerData.attacks[row][col] = 1; // Miss
        currentPlayerData.misses++;
        showToast('MISS', 'You missed!');
    }

    // Record shot history
    gameState.historyShots.push({
        player: gameState.currentPlayer,
        row: row,
        col: col,
        result: result,
        turnIndex: gameState.turnCount
    });

    renderBattleBoards();

    // Switch turn after delay
    setTimeout(() => {
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        showPassScreen(`Please hand the device to Player ${gameState.currentPlayer}`);
    }, 2500);
}

function getShipName(length) {
    switch(length) {
        case 2: return 'Destroyer (2 cells)';
        case 3: return 'Cruiser (3 cells)';
        case 4: return 'Battleship (4 cells)';
        default: return 'Ship';
    }
}

function showToast(title, message) {
    const toast = document.getElementById('battleToast');
    document.getElementById('toastTitle').textContent = title;
    document.getElementById('toastMessage').textContent = message;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
}

function updateBattleStatus(message) {
    document.getElementById('battleStatus').textContent = message;
}

// ===== ENDGAME =====
function endGame(winner) {
    const winnerData = winner === 1 ? gameState.player1 : gameState.player2;

    document.getElementById('winnerText').textContent = `Player ${winner} WINS!`;
    document.getElementById('statTurns').textContent = gameState.turnCount;
    document.getElementById('statHits').textContent = winnerData.hits;
    document.getElementById('statMisses').textContent = winnerData.misses;

    const accuracy = winnerData.hits + winnerData.misses > 0
        ? ((winnerData.hits / (winnerData.hits + winnerData.misses)) * 100).toFixed(1)
        : 0;
    document.getElementById('statAccuracy').textContent = accuracy + '%';

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
        goHome();
    }
}

// ===== HELPER FUNCTIONS =====
function getCurrentPlayer() {
    return gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2;
}

function getOpponentPlayer() {
    return gameState.currentPlayer === 1 ? gameState.player2 : gameState.player1;
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', (e) => {
    // Only handle keyboard in setup screen
    if (gameState.currentScreen === 'setupScreen') {
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            rotateShip();
            // Re-render preview if hovering
            const hoverCell = document.querySelector('#setupBoard .cell:hover');
            if (hoverCell) {
                handleSetupHoverEnd();
                handleSetupHover({ target: hoverCell });
            }
        }
    }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    showScreen('mainMenu');
});
