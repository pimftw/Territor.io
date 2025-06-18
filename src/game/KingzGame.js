import { INVALID_MOVE } from 'boardgame.io/core';

// Game constants
const BOARD_SIZE = 50;
const TURN_TIME = 1000; // 1 second per turn
const POWERUP_SPAWN_RATE = 0.02; // 2% chance per turn
const POWERUP_TYPES = ['speed', 'strength', 'range', 'shield', 'bomb'];

// Powerup effects
const POWERUP_EFFECTS = {
  speed: { duration: 5, description: 'Move 2 tiles per turn' },
  strength: { duration: 3, description: 'Capture 2x faster' },
  range: { duration: 4, description: 'Attack from 2 tiles away' },
  shield: { duration: 3, description: 'Cannot be captured' },
  bomb: { duration: 1, description: 'Destroy adjacent tiles' }
};

export const KingzGame = {
  name: 'kingzio',
  
  setup: (ctx) => {
    const players = {};
    const powerups = {};
    
    // Initialize players
    for (let i = 0; i < ctx.numPlayers; i++) {
      const startX = i === 0 ? 5 : BOARD_SIZE - 5;
      const startY = i === 1 ? 5 : BOARD_SIZE - 5;
      
      players[i] = {
        id: i,
        x: startX,
        y: startY,
        territory: new Set([`${startX},${startY}`]),
        army: 100,
        powerups: [],
        moveQueue: [],
        color: i === 0 ? '#ff4444' : i === 1 ? '#4444ff' : i === 2 ? '#44ff44' : '#ffff44'
      };
    }
    
    return {
      players,
      powerups,
      turn: 0,
      gameOver: false,
      winner: null
    };
  },

  turn: {
    minMoves: 0,
    maxMoves: 1,
    activePlayers: { all: 'move' },
    stages: {
      move: {
        moves: { movePlayer, queueMove, usePowerup }
      }
    }
  },

  phases: {
    game: {
      turn: {
        activePlayers: { all: 'move' },
        stages: {
          move: {
            moves: { movePlayer, queueMove, usePowerup }
          }
        }
      },
      onTurnEnd: (G, ctx) => {
        // Process move queue
        processMoveQueue(G, ctx);
        
        // Spawn powerups
        if (Math.random() < POWERUP_SPAWN_RATE) {
          spawnPowerup(G);
        }
        
        // Update powerups
        updatePowerups(G, ctx);
        
        // Check win conditions
        checkWinConditions(G, ctx);
      }
    }
  },

  endIf: (G, ctx) => {
    if (G.gameOver) {
      return { winner: G.winner };
    }
  }
};

// Move functions
function movePlayer(G, ctx, direction) {
  const player = G.players[ctx.currentPlayer];
  const { x, y } = player;
  
  let newX = x;
  let newY = y;
  
  switch (direction) {
    case 'up': newY = Math.max(0, y - 1); break;
    case 'down': newY = Math.min(BOARD_SIZE - 1, y + 1); break;
    case 'left': newX = Math.max(0, x - 1); break;
    case 'right': newX = Math.min(BOARD_SIZE - 1, x + 1); break;
    default: return INVALID_MOVE;
  }
  
  // Check if move is valid
  const targetKey = `${newX},${newY}`;
  const currentKey = `${x},${y}`;
  
  // Can't move to own territory unless it's the capital
  if (player.territory.has(targetKey) && targetKey !== currentKey) {
    return INVALID_MOVE;
  }
  
  // Update player position
  player.x = newX;
  player.y = newY;
  
  // Capture territory
  captureTerritory(G, ctx.currentPlayer, newX, newY);
  
  return { move: direction };
}

function queueMove(G, ctx, direction) {
  const player = G.players[ctx.currentPlayer];
  player.moveQueue.push(direction);
  return { move: 'queued' };
}

function usePowerup(G, ctx, powerupIndex) {
  const player = G.players[ctx.currentPlayer];
  
  if (powerupIndex >= player.powerups.length) {
    return INVALID_MOVE;
  }
  
  const powerup = player.powerups[powerupIndex];
  
  // Apply powerup effect
  switch (powerup.type) {
    case 'bomb':
      // Destroy adjacent tiles
      const adjacent = getAdjacentTiles(player.x, player.y);
      adjacent.forEach(([x, y]) => {
        const key = `${x},${y}`;
        // Remove from all territories
        Object.values(G.players).forEach(p => {
          p.territory.delete(key);
        });
      });
      break;
      
    case 'shield':
      // Shield effect is handled in capture logic
      break;
  }
  
  // Remove powerup
  player.powerups.splice(powerupIndex, 1);
  
  return { move: 'powerup' };
}

// Helper functions
function processMoveQueue(G, ctx) {
  Object.values(G.players).forEach(player => {
    if (player.moveQueue.length > 0) {
      const direction = player.moveQueue.shift();
      const { x, y } = player;
      
      let newX = x;
      let newY = y;
      
      switch (direction) {
        case 'up': newY = Math.max(0, y - 1); break;
        case 'down': newY = Math.min(BOARD_SIZE - 1, y + 1); break;
        case 'left': newX = Math.max(0, x - 1); break;
        case 'right': newX = Math.min(BOARD_SIZE - 1, x + 1); break;
      }
      
      player.x = newX;
      player.y = newY;
      captureTerritory(G, ctx.currentPlayer, newX, newY);
    }
  });
}

function captureTerritory(G, playerId, x, y) {
  const player = G.players[playerId];
  const key = `${x},${y}`;
  
  // Check if player has shield powerup
  const hasShield = player.powerups.some(p => p.type === 'shield' && p.active);
  
  // Remove from other players' territories
  Object.values(G.players).forEach(p => {
    if (p.id !== playerId && !hasShield) {
      p.territory.delete(key);
    }
  });
  
  // Add to current player's territory
  player.territory.add(key);
  
  // Increase army size
  player.army += 10;
}

function spawnPowerup(G) {
  let attempts = 0;
  let x, y;
  
  do {
    x = Math.floor(Math.random() * BOARD_SIZE);
    y = Math.floor(Math.random() * BOARD_SIZE);
    attempts++;
  } while (isPowerupAt(G, x, y) && attempts < 100);
  
  if (attempts < 100) {
    const type = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    G.powerups[`${x},${y}`] = {
      type,
      x,
      y,
      duration: POWERUP_EFFECTS[type].duration
    };
  }
}

function isPowerupAt(G, x, y) {
  return G.powerups[`${x},${y}`] !== undefined;
}

function updatePowerups(G, ctx) {
  // Update player powerups
  Object.values(G.players).forEach(player => {
    player.powerups.forEach(powerup => {
      if (powerup.active) {
        powerup.duration--;
        if (powerup.duration <= 0) {
          powerup.active = false;
        }
      }
    });
    
    // Remove expired powerups
    player.powerups = player.powerups.filter(p => p.duration > 0 || !p.active);
  });
  
  // Check for powerup collection
  Object.values(G.players).forEach(player => {
    const key = `${player.x},${player.y}`;
    if (G.powerups[key]) {
      const powerup = G.powerups[key];
      player.powerups.push({
        type: powerup.type,
        duration: POWERUP_EFFECTS[powerup.type].duration,
        active: false
      });
      delete G.powerups[key];
    }
  });
}

function getAdjacentTiles(x, y) {
  const adjacent = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < BOARD_SIZE && newY >= 0 && newY < BOARD_SIZE) {
        adjacent.push([newX, newY]);
      }
    }
  }
  return adjacent;
}

function checkWinConditions(G, ctx) {
  const activePlayers = Object.values(G.players).filter(p => p.territory.size > 0);
  
  if (activePlayers.length === 1) {
    G.gameOver = true;
    G.winner = activePlayers[0].id;
  } else if (activePlayers.length === 0) {
    G.gameOver = true;
    G.winner = null; // Draw
  }
} 