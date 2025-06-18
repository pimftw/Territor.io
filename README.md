# Kingz.io - Territory Control Game

A real-time territory control game with powerups, built using boardgame.io for multiplayer functionality.

## Features

- **Real-time Territory Control**: Capture territory by moving your player across the board
- **Powerups**: Collect and use strategic powerups to gain advantages
- **Multiplayer**: Play with friends using boardgame.io's lobby system
- **Move Queuing**: Queue moves for strategic planning
- **Multiple Input Methods**: Use WASD, arrow keys, or mouse clicks to move
- **Beautiful UI**: Modern, responsive design with animations

## Powerups

- ⚡ **Speed**: Move 2 tiles per turn for 5 turns
- 💪 **Strength**: Capture territory 2x faster for 3 turns
- 🎯 **Range**: Attack from 2 tiles away for 4 turns
- 🛡️ **Shield**: Cannot be captured for 3 turns
- 💣 **Bomb**: Destroy adjacent tiles instantly

## Controls

- **WASD** or **Arrow Keys**: Move player
- **Q**: Queue move (for strategic planning)
- **1-5**: Use powerup (number corresponds to powerup slot)
- **Mouse Click**: Click anywhere on the board to move towards that location

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kingzio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. In a separate terminal, start the game server:
```bash
node server.js
```

5. Open your browser and navigate to `http://localhost:1234`

## How to Play

1. **Join a Game**: Use the lobby to create or join a game
2. **Start Position**: Each player starts in opposite corners
3. **Capture Territory**: Move to capture neutral or enemy territory
4. **Collect Powerups**: Move over powerup tiles to collect them
5. **Use Strategy**: Queue moves and use powerups strategically
6. **Win**: Eliminate all other players by capturing their territory

## Game Rules

- Each turn lasts 1 second
- Players can move one tile per turn (unless they have speed powerup)
- Moving over a tile captures it for your team
- Powerups spawn randomly on the board
- The last player with territory wins

## Development

### Project Structure

```
src/
├── components/
│   └── KingzBoard.js      # Main game board component
├── game/
│   └── KingzGame.js       # Game logic and rules
├── styles/
│   └── main.scss          # Game styles
├── index.html             # HTML entry point
└── index.js              # React app entry point
```

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm start`: Start production server

## Technologies Used

- **boardgame.io**: Game engine and multiplayer functionality
- **React**: UI framework
- **SCSS**: Styling with modern CSS features
- **Parcel**: Build tool and development server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes. 