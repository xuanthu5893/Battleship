# Battleship 2P - Offline Pass-Play

A classic Battleship game for 2 players in offline pass-and-play mode. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Classic Battleship Gameplay**: Traditional rules with 4 ships (1x2-cell, 2x3-cell, 1x4-cell)
- **Pass-and-Play Mode**: Perfect for 2 players sharing one device
- **Ship Placement**: Manual placement with preview or random placement option
- **Smart Validation**: Ships cannot touch each other (including corners)
- **Battle Phase**: Take turns firing at opponent's board
- **Game Statistics**: Track turns, hits, misses, accuracy, and game duration
- **Responsive Design**: Works on desktop and mobile devices
- **Settings**: Toggle sound effects, animations, and coordinate styles

## How to Play

1. **Setup Phase**:
   - Player 1 places their 4 ships on the 10x10 grid
   - Ships cannot touch each other (including diagonals)
   - Click "Ready" when all ships are placed
   - Pass device to Player 2 for their setup

2. **Battle Phase**:
   - Players take turns firing at one cell on enemy's board
   - Click on a cell in "Enemy Waters" to attack
   - Hit or miss is revealed immediately
   - Turn switches even on hits
   - Game continues until one player loses all ships

3. **Victory**:
   - First player to sink all opponent's ships wins
   - View game statistics and choose to rematch or return to main menu

## Game Controls

### Setup Screen
- **Select Ship**: Click on a ship type to select it
- **Rotate**: Change ship orientation (horizontal/vertical)
- **Random**: Automatically place all ships randomly
- **Reset**: Clear the board and start over
- **Ready**: Confirm placement and continue (enabled when all ships placed)

### Battle Screen
- **My Fleet**: View your own ships and opponent's attacks
- **Enemy Waters**: Click cells to attack opponent
- **How to Play**: View game rules
- **SFX Toggle**: Turn sound effects on/off
- **Quit**: Return to main menu

## Ship Types

- **Destroyer** (2 cells): 1 ship
- **Cruiser** (3 cells): 2 ships
- **Battleship** (4 cells): 1 ship

## Legend

- **S** (blue-gray): Your ship
- **X** (red): Hit
- **o** (gray): Miss
- **#** (dark red): Sunk ship

## Installation & Usage

1. Clone or download this repository
2. Open `index.html` in a web browser
3. No server or build process required!

```bash
# Simply open the file
open index.html

# Or use a local server (optional)
python -m http.server 8000
# Then visit http://localhost:8000
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## File Structure

```
Battleship/
├── index.html      # Main HTML structure
├── styles.css      # All styling and responsive design
├── game.js         # Game logic and interactions
└── README.md       # This file
```

## Features in Detail

### Ship Placement Rules
- Ships must be placed entirely within the 10x10 grid
- Ships cannot overlap
- Ships cannot touch each other, even at corners (diagonal)
- Preview shows green for valid placement, red for invalid

### Battle Mechanics
- Each player attacks one cell per turn
- Hits are marked with "X"
- Misses are marked with "o"
- When all cells of a ship are hit, it's marked as sunk ("#")
- Game tracks hits, misses, and accuracy for each player

### Pass-and-Play System
- Fullscreen overlay ensures privacy between turns
- Clear prompts guide device passing
- No accidental information leakage

## Responsive Design

- **Desktop**: Side-by-side boards for optimal gameplay
- **Tablet**: Optimized touch targets
- **Mobile**: Stacked vertical layout with priority on attack board

## Future Enhancements

Possible features for future versions:
- Sound effects and background music
- Different difficulty levels with AI opponent
- Custom board sizes
- More ship configurations
- Game save/load functionality
- Multiplayer over network
- Touch gesture controls for mobile

## Credits

Designed and developed based on classic Battleship board game rules.

## License

This project is open source and available for educational purposes.

---

**Version**: 1.0.0
**Last Updated**: November 2025

Enjoy playing Battleship! ⚓🎯
