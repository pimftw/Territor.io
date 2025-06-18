import React, { useState, useEffect } from 'react';
import type { BoardProps } from 'boardgame.io/react';

const BOARD_SIZE = 50;
const CELL_SIZE = 12; // pixels

interface MousePosition {
  x: number;
  y: number;
}

interface Powerup {
  type: 'speed' | 'strength' | 'range' | 'shield' | 'bomb';
  duration: number;
  active?: boolean;
}

interface Player {
  id: string;
  x: number;
  y: number;
  territory: Set<string>;
  army: number;
  powerups: Powerup[];
  moveQueue: string[];
  color: string;
}

interface GameState {
  players: Record<string, Player>;
  powerups: Record<string, Powerup & { x: number; y: number }>;
  turn: number;
  gameOver: boolean;
  winner: string | null;
}

interface Moves {
  movePlayer: (direction: string) => void;
  queueMove: (direction: string) => void;
  usePowerup: (index: number) => void;
}

export const KingzBoard: React.FC<BoardProps<GameState>> = ({ G, ctx, moves, playerID, isActive }) => {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!G.gameOver && isActive) {
        switch (e.key.toLowerCase()) {
          case 'w':
          case 'arrowup':
            moves.movePlayer('up');
            break;
          case 's':
          case 'arrowdown':
            moves.movePlayer('down');
            break;
          case 'a':
          case 'arrowleft':
            moves.movePlayer('left');
            break;
          case 'd':
          case 'arrowright':
            moves.movePlayer('right');
            break;
          case 'q':
            // Queue move with last direction (not implemented)
            break;
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
            const powerupIndex = parseInt(e.key) - 1;
            if (playerID && G.players[playerID]?.powerups[powerupIndex]) {
              moves.usePowerup(powerupIndex);
            }
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moves, G.gameOver, playerID, G.players, isActive]);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    setMousePos({ x, y });
  };

  // Handle mouse click for movement
  const handleMouseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (G.gameOver || !G.players[playerID!] || !isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const clickY = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    const player = G.players[playerID!];
    const dx = clickX - player.x;
    const dy = clickY - player.y;
    // Determine direction based on click position
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) moves.movePlayer('right');
      else if (dx < 0) moves.movePlayer('left');
    } else {
      if (dy > 0) moves.movePlayer('down');
      else if (dy < 0) moves.movePlayer('up');
    }
  };

  // Get cell color based on territory ownership
  const getCellColor = (x: number, y: number): string => {
    const key = `${x},${y}`;
    // Check if there's a powerup
    if (G.powerups[key]) {
      return getPowerupColor(G.powerups[key].type);
    }
    // Check territory ownership
    for (const [playerId, player] of Object.entries(G.players)) {
      if (player.territory.has(key)) {
        return player.color;
      }
    }
    return '#333'; // Neutral territory
  };

  const getPowerupColor = (type: string): string => {
    const colors: Record<string, string> = {
      speed: '#ffff00',
      strength: '#ff8800',
      range: '#8800ff',
      shield: '#00ffff',
      bomb: '#ff0000'
    };
    return colors[type] || '#ffffff';
  };

  const getPowerupIcon = (type: string): string => {
    const icons: Record<string, string> = {
      speed: '⚡',
      strength: '💪',
      range: '🎯',
      shield: '🛡️',
      bomb: '💣'
    };
    return icons[type] || '?';
  };

  // Render game board
  const renderBoard = () => {
    const cells: JSX.Element[] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isPlayerHere = Object.values(G.players).some(p => p.x === x && p.y === y);
        const isHovered = mousePos.x === x && mousePos.y === y;
        cells.push(
          <div
            key={`${x},${y}`}
            className={`cell ${isPlayerHere ? 'player' : ''} ${isHovered ? 'hovered' : ''}`}
            style={{
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: getCellColor(x, y),
              border: isPlayerHere ? '2px solid white' : '1px solid #555'
            }}
          >
            {isPlayerHere && (
              <div className="player-indicator">
                {Object.values(G.players).find(p => p.x === x && p.y === y)?.id + 1}
              </div>
            )}
            {G.powerups[`${x},${y}`] && (
              <div className="powerup-indicator">
                {getPowerupIcon(G.powerups[`${x},${y}`].type)}
              </div>
            )}
          </div>
        );
      }
    }
    return cells;
  };

  // Render player info
  const renderPlayerInfo = () => {
    return Object.values(G.players).map(player => (
      <div key={player.id} className="player-info" style={{ borderColor: player.color }}>
        <h3>Player {player.id + 1}</h3>
        <p>Territory: {player.territory.size}</p>
        <p>Army: {player.army}</p>
        <p>Position: ({player.x}, {player.y})</p>
        <div className="powerups">
          <h4>Powerups:</h4>
          {player.powerups.map((powerup, index) => (
            <div key={index} className="powerup-item">
              <span>{getPowerupIcon(powerup.type)}</span>
              <span>{powerup.duration}</span>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Render controls
  const renderControls = () => {
    if (!G.players[playerID!]) return null;
    const player = G.players[playerID!];
    return (
      <div className="controls">
        <h3>Controls</h3>
        <p>WASD or Arrow Keys: Move</p>
        <p>Q: Queue Move</p>
        <p>1-5: Use Powerup</p>
        <p>Mouse: Click to move</p>
        <div className="move-queue">
          <h4>Move Queue:</h4>
          {player.moveQueue.map((move, index) => (
            <span key={index} className="queued-move">{move}</span>
          ))}
        </div>
        <div className="powerup-controls">
          <h4>Use Powerup:</h4>
          {player.powerups.map((powerup, index) => (
            <button
              key={index}
              onClick={() => moves.usePowerup(index)}
              className="powerup-button"
              style={{ backgroundColor: getPowerupColor(powerup.type) }}
            >
              {index + 1}: {getPowerupIcon(powerup.type)} ({powerup.duration})
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (G.gameOver) {
    return (
      <div className="game-over">
        <h1>Game Over!</h1>
        {G.winner !== null ? (
          <h2>Player {G.winner + 1} wins!</h2>
        ) : (
          <h2>It's a draw!</h2>
        )}
        <button onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="kingz-board">
      <div className="game-container">
        <div className="board-container">
          <div
            className="board"
            style={{
              width: BOARD_SIZE * CELL_SIZE,
              height: BOARD_SIZE * CELL_SIZE
            }}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
          >
            {renderBoard()}
          </div>
        </div>
        <div className="sidebar">
          <div className="player-info-container">
            {renderPlayerInfo()}
          </div>
          {playerID !== null && (
            <div className="controls-container">
              {renderControls()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 