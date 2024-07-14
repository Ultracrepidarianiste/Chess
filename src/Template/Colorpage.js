// ColorPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Colorpage.css';
import kingSkin from '../Art/kingSkin.png';
import queenSkin from '../Art/queenSkin.png';
import bishopSkin from '../Art/bishopSkin.png';
import knightSkin from '../Art/knightSkin.png';
import rookSkin from '../Art/rookSkin.png';
import pawnSkin from '../Art/pawnSkin.png';

const ColorPage = () => {
  const [primaryColor, setPrimaryColor] = useState('#ffffff');
  const [secondaryColor, setSecondaryColor] = useState('#A9A9AB');
  const navigate = useNavigate();

  const handlePrimaryColorChange = (event) => {
    setPrimaryColor(event.target.value);
  };

  const handleSecondaryColorChange = (event) => {
    setSecondaryColor(event.target.value);
  };

  const savePiecesAndNavigate = () => {
    const token = 'fake-jwt-token'; // Récupérer le token JWT depuis localStorage

    fetch('http://localhost:8000/save-pieces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Envoyer le token dans l'en-tête Authorization
      },
      body: JSON.stringify({ primaryColor, secondaryColor }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Erreur lors de l\'enregistrement des pièces');
        }
      })
      .then(data => {
        console.log('Pièces enregistrées avec succès:', data);
        navigate('/board', { state: { primaryColor, secondaryColor } });
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'enregistrement des pièces');
      });
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const createPieceImage = (src, alt, primaryColor, secondaryColor) => {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
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
          <filter id="colorize">
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
              floodOpacity="0.8"
            />
          </filter>
          <image
            xlinkHref={src}
            width="100"
            height="100"
            style={{ filter: 'url(#colorize)' }}
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="color-page">
      <h1>Choisissez les couleurs pour vos pièces</h1>
      <div>
        <label>Couleur principale: </label>
        <input
          type="color"
          value={primaryColor}
          onChange={handlePrimaryColorChange}
        />
      </div>
      <div>
        <label>Couleur secondaire: </label>
        <input
          type="color"
          value={secondaryColor}
          onChange={handleSecondaryColorChange}
        />
      </div>
      <div className="piece-preview">
        {createPieceImage(kingSkin, "king", primaryColor, secondaryColor)}
        {createPieceImage(queenSkin, "queen", primaryColor, secondaryColor)}
        {createPieceImage(bishopSkin, "bishop", primaryColor, secondaryColor)}
        {createPieceImage(knightSkin, "Knight", primaryColor, secondaryColor)}
        {createPieceImage(rookSkin, "rook", primaryColor, secondaryColor)}
        {createPieceImage(pawnSkin, "pawn", primaryColor, secondaryColor)}
      </div>
      <button
        className="play-button"
        onClick={savePiecesAndNavigate}
      >
        Play
      </button>
    </div>
  );
};

export default ColorPage;
