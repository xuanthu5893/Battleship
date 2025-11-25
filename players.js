// ===== PLAYER MANAGEMENT SYSTEM =====

// Default players
const DEFAULT_PLAYERS = [
    { id: 'p1', name: 'Player 1', avatar: null, isChild: false },
    { id: 'p2', name: 'Player 2', avatar: null, isChild: false }
];

function normalizePlayers(players = []) {
    const source = Array.isArray(players) ? players : DEFAULT_PLAYERS;
    return source.map((player, index) => {
        const hasAvatarProp = Object.prototype.hasOwnProperty.call(player, 'avatar');
        let avatarValue = hasAvatarProp ? player.avatar : null;
        if (avatarValue === undefined) avatarValue = null;
        return {
            id: player.id || `p${index + 1}`,
            name: player.name || `Player ${index + 1}`,
            avatar: avatarValue,
            isChild: typeof player.isChild === 'boolean' ? player.isChild : false
        };
    });
}

// Get players from localStorage or use defaults
function getPlayers() {
    const stored = localStorage.getItem('gamePlayers');
    if (stored) {
        try {
            return normalizePlayers(JSON.parse(stored));
        } catch (e) {
            console.error('Error parsing players:', e);
            return normalizePlayers(DEFAULT_PLAYERS);
        }
    }
    return normalizePlayers(DEFAULT_PLAYERS);
}

// Save players to localStorage
function savePlayers(players) {
    localStorage.setItem('gamePlayers', JSON.stringify(normalizePlayers(players)));
}

// Get selected players for current game
function getSelectedPlayers() {
    const stored = localStorage.getItem('selectedPlayers');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing selected players:', e);
            return null;
        }
    }
    return null;
}

// Save selected players for current game
function saveSelectedPlayers(playerIds) {
    localStorage.setItem('selectedPlayers', JSON.stringify(playerIds));
}

// Clear selected players
function clearSelectedPlayers() {
    localStorage.removeItem('selectedPlayers');
}

// Add new player
function addPlayer(name, avatar = null, isChild = false) {
    const players = getPlayers();
    const newId = 'p' + Date.now();
    players.push({
        id: newId,
        name: name,
        avatar: avatar,
        isChild: !!isChild
    });
    savePlayers(players);
    return newId;
}

// Update player
function updatePlayer(id, name, avatar, isChild) {
    const players = getPlayers();
    const index = players.findIndex(p => p.id === id);
    if (index !== -1) {
        players[index].name = name;
        if (avatar !== undefined) {
            players[index].avatar = avatar;
        }
        if (typeof isChild === 'boolean') {
            players[index].isChild = isChild;
        }
        savePlayers(players);
        return true;
    }
    return false;
}

// Delete player
function deletePlayer(id) {
    const players = getPlayers();
    const filtered = players.filter(p => p.id !== id);
    if (filtered.length < players.length) {
        savePlayers(filtered);
        return true;
    }
    return false;
}

// Get player by ID
function getPlayerById(id) {
    const players = getPlayers();
    return players.find(p => p.id === id);
}

// Convert image file to base64 (handles HEIC via heic2any when available)
function imageToBase64(file, callback) {
    convertImageFile(file)
        .then(callback)
        .catch(err => {
            console.error('Image conversion failed, using raw file', err);
            const reader = new FileReader();
            reader.onload = (e) => callback(e.target.result);
            reader.readAsDataURL(file);
        });
}

async function convertImageFile(file) {
    const processedBlob = await convertHeicIfNeeded(file);
    return await resizeAndEncode(processedBlob);
}

function convertHeicIfNeeded(file) {
    const type = (file.type || '').toLowerCase();
    const name = (file.name || '').toLowerCase();
    const isHeic =
        type.includes('heic') ||
        type.includes('heif') ||
        name.endsWith('.heic') ||
        name.endsWith('.heif');

    if (isHeic && typeof window.heic2any === 'function') {
        return window.heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.9
        })
            .then((result) => {
                if (Array.isArray(result)) {
                    return result[0];
                }
                return result;
            })
            .catch((err) => {
                console.warn('HEIC conversion failed, using original file', err);
                return file;
            });
    }

    return Promise.resolve(file);
}

function resizeAndEncode(blob) {
    const MAX_SIZE = 600;
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;
            if (width > height && width > MAX_SIZE) {
                height = Math.round((height * MAX_SIZE) / width);
                width = MAX_SIZE;
            } else if (height > MAX_SIZE) {
                width = Math.round((width * MAX_SIZE) / height);
                height = MAX_SIZE;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            try {
                const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                resolve(dataUrl);
            } catch (err) {
                reject(err);
            } finally {
                URL.revokeObjectURL(objectUrl);
            }
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        };
        img.src = objectUrl;
    });
}

// Create default avatar SVG
function createDefaultAvatar(playerNumber) {
    const colors = ['#4dd0e1', '#ff6b6b', '#66bb6a', '#ffd93d', '#9c27b0'];
    let seed = playerNumber;
    if (typeof seed === 'string' && seed.length > 0) {
        seed = seed.toUpperCase().charCodeAt(0) - 64;
    }
    if (typeof seed !== 'number' || Number.isNaN(seed)) {
        seed = 1;
    }
    const color = colors[(Math.abs(Math.floor(seed) - 1)) % colors.length];

    return `data:image/svg+xml,${encodeURIComponent(`
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="${color}"/>
            <circle cx="50" cy="40" r="18" fill="#ffffff"/>
            <path d="M 25 75 Q 25 55, 50 55 Q 75 55, 75 75 Q 75 85, 50 90 Q 25 85, 25 75" fill="#ffffff"/>
        </svg>
    `)}`;
}
