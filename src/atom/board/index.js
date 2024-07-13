// src/atom/board/index.js

import React from 'react';
import './board.css';

const Board = () => {
  // Configuration initiale de l'échiquier
  const initialBoardSetup = [
    [0, 1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30, 31],
    [32, 33, 34, 35, 36, 37, 38, 39],
    [40, 41, 42, 43, 44, 45, 46, 47],
    [48, 49, 50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60, 61, 62, 63],
  ];

  const resetPieces = () => {
    fetch('http://localhost:8000/reset-pieces', {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Réinitialisation des pièces réussie');
          // Rafraîchir la page ou effectuer toute autre action nécessaire après la réinitialisation
          window.location.reload(); // Recharge la page après la réinitialisation
        } else {
          throw new Error('Erreur lors de la réinitialisation des pièces');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <div className="board">
      {initialBoardSetup.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((squareNumber, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`square ${((rowIndex + colIndex) % 2 === 1) ? 'black' : 'white'}`}
            >
              {/* Vous pouvez ajouter du contenu personnalisé ici si nécessaire */}
            </div>
          ))}
        </div>
      ))}
      <button className="reset-button" onClick={resetPieces}>
        Réinitialiser les pièces
      </button>
    </div>
  );
};

export default Board;
