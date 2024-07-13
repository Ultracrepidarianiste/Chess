// src/atom/board/index.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './board.css';
import KingSkin from '../../Art/KingSkin.png';
import QueenSkin from '../../Art/QueenSkin.png';
import FouSkin from '../../Art/FouSkin.png';
import HorseSkin from '../../Art/HorseSkin.png';
import TowerSkin from '../../Art/TowerSkin.png';
import PionSkin from '../../Art/PionSkin.png';

const pieceImages = {
  king: KingSkin,
  queen: QueenSkin,
  bishop: FouSkin,
  knight: HorseSkin,
  rook: TowerSkin,
  pawn: PionSkin,
};

const initialBoardSetup = [
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
  Array(8).fill('pawn'),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill('pawn'),
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
];

const Board = () => {
  const location = useLocation();
  const primaryColor = location.state?.primaryColor || '#ffffff';
  const secondaryColor = location.state?.secondaryColor || '#A9A9AB';

  // Fonction pour déterminer si la case est une case du bas (les deux dernières rangées)
  const isBottomPiece = (rowIndex) => {
    return rowIndex >= 6;
  };

  // Fonction pour réinitialiser les pièces
  const resetPieces = async () => {
    try {
      const response = await fetch('http://localhost:8000/reset-pieces', {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Les pièces ont été réinitialisées avec succès.');
      } else {
        alert('Une erreur est survenue lors de la réinitialisation des pièces.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la réinitialisation des pièces.');
    }
  };

  return (
    <div className="board">
      <button onClick={resetPieces}>Reset</button>
      {initialBoardSetup.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((piece, colIndex) => {
            const pieceImage = pieceImages[piece];
            const isBlackSquare = (rowIndex + colIndex) % 2 === 1;
            let pieceStyle = {};

            // Appliquer le filtre uniquement aux pièces du bas
            if (piece && isBottomPiece(rowIndex)) {
              pieceStyle = {
                filter: `url(#colorize-${rowIndex}-${colIndex})`,
                position: 'relative',
              };
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`square ${isBlackSquare ? 'black' : 'white'}`}
              >
                {pieceImage && (
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: -1,
                    }}
                  >
                    {piece && isBottomPiece(rowIndex) && (
                      <filter id={`colorize-${rowIndex}-${colIndex}`}>
                        <feColorMatrix
                          type="matrix"
                          values={`0 0 0 0 ${hexToRgb(primaryColor).r / 255}
                                   0 0 0 0 ${hexToRgb(primaryColor).g / 255}
                                   0 0 0 0 ${hexToRgb(primaryColor).b / 255}
                                   0 0 0 1 0`}
                        />
                        <feDropShadow
                          dx="0"
                          dy="0"
                          stdDeviation="5"
                          floodColor={secondaryColor}
                          floodOpacity="0.8" // Augmentez l'opacité de l'ombre ici
                        />
                      </filter>
                    )}
                  </svg>
                )}
                {pieceImage && (
                  <img src={pieceImage} alt={piece} style={pieceStyle} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Fonction utilitaire pour convertir une couleur hexadécimale en RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

export default Board;
