# Stakeholder Sandwich Game - Modular Structure

This directory contains the modularized version of the Stakeholder Sandwich game, structured for easy Next.js conversion and maintenance.

## File Structure

```
stakeholder_sandwich/
├── stakeholder_sandwich.html          # Original monolithic file
├── index.html                         # Modular HTML structure
├── stakeholder_sandwich.css           # Extracted styles
├── stakeholder_sandwich.js            # Game logic class
├── components.js                      # Component-ready functions
└── README.md                          # This file
```

## Files Overview

### `index.html`
- Clean HTML structure with external CSS/JS references
- Semantic markup ready for component conversion
- All inline styles and scripts removed

### `stakeholder_sandwich.css`
- Complete game styling extracted from original HTML
- Organized with clear section comments
- Responsive design preserved
- CSS custom properties ready for theming

### `stakeholder_sandwich.js`
- Game logic extracted into `StakeholderSandwichGame` class
- Modular functions for initialization and utilities
- Event handling separated from DOM manipulation
- Ready for React hooks conversion

### `components.js`
- Component-ready functions for each UI section
- Utility functions for game logic
- Data structures (scenarios, game states)
- Easy conversion to React components

## Next.js Conversion Guide

### 1. Convert to React Components
Each function in `components.js` can become a React component:

```javascript
// From components.js
function createGameHeader() { ... }

// To React component
function GameHeader() {
  return (
    <div className="game-header">
      <h1 className="game-title">Stakeholder Sandwich</h1>
      {/* ... */}
    </div>
  );
}
```

### 2. Convert Game Logic to Hooks
The `StakeholderSandwichGame` class can be converted to React hooks:

```javascript
// Custom hook for game logic
function useStakeholderSandwichGame() {
  const [gameState, setGameState] = useState('loading');
  const [timeLeft, setTimeLeft] = useState(45);
  const [scenario, setScenario] = useState(null);
  // ... other state and logic
}
```

### 3. CSS Integration
- Import CSS as module: `import './stakeholder_sandwich.css'`
- Or convert to CSS-in-JS/Tailwind classes
- CSS custom properties can be used for theming

## Features Preserved

- ✅ 45-second timer with visual countdown
- ✅ 5 different PM scenarios
- ✅ Real-time response analysis
- ✅ Social sharing functionality
- ✅ User feedback collection
- ✅ Responsive design
- ✅ Accessibility features

## Usage

### Standalone HTML Version
```bash
# Serve the directory with any static server
npx serve .
# Open http://localhost:3000/index.html
```

### Next.js Integration
1. Copy component functions from `components.js`
2. Convert to React components
3. Use game logic from `stakeholder_sandwich.js` as hooks
4. Import CSS styles

## Customization

### Adding New Scenarios
Edit the `SCENARIOS` array in `components.js`:

```javascript
const SCENARIOS = [
  {
    title: "New Challenge",
    text: "Your scenario description here..."
  },
  // ... existing scenarios
];
```

### Modifying Game Logic
Update the `GameUtils.analyzeResponse()` function in `components.js` or the corresponding method in `stakeholder_sandwich.js`.

### Styling Changes
Modify `stakeholder_sandwich.css` - all styles are organized with clear section comments.

## Benefits of This Structure

1. **Separation of Concerns**: HTML, CSS, and JS are properly separated
2. **Reusability**: Components can be reused across different games
3. **Maintainability**: Easy to modify individual parts without affecting others
4. **Next.js Ready**: Structure designed for easy React conversion
5. **Scalability**: Can easily add new features or games following the same pattern