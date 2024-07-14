import React, { useEffect, useState } from 'react';
import './board.css';

// Utilisation de require.context pour importer toutes les images d'un répertoire
const usableArt = require.context('../../UsableArt', false, /\.(png)$/);
const usableArtImages = usableArt.keys().reduce((acc, path) => {
  acc[path.replace('./', '')] = usableArt(path);
  return acc;
}, {});

const Board = () => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    // Fonction pour récupérer les pièces depuis l'API
    fetch('http://localhost:8000/get-pieces')
      .then(response => response.json())
      .then(data => setPieces(data))
      .catch(error => console.error('Erreur:', error));
  }, []);

  // Fonction pour obtenir l'image d'une pièce en fonction de son type
  const getPieceImage = (type, Color) => {
    // Vérification de la nullité ou de l'undefined de Color
    if (!Color) {
      return null;
    }
  
    // Utilisation de l'objet contenant toutes les images importées
    const colorFilename = `${type}${Color.replace('/', '-')}.png`; // Utilisation de '-' pour remplacer '/'
    return usableArtImages[colorFilename] || null;
  };
  

  // Fonction pour obtenir les couleurs à partir de la chaîne Color
  const getPieceColors = (colorString) => {
    const [primaryColor, secondaryColor] = colorString.split('/');
    return { primaryColor, secondaryColor };
  };

  // Fonction pour réinitialiser les pièces
  const resetPieces = () => {
    fetch('http://localhost:8000/reset-pieces', {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Réinitialisation des pièces réussie');
          window.location.reload();
        } else {
          throw new Error('Erreur lors de la réinitialisation des pièces');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  // Taille de chaque case de l'échiquier en pixels
  const squareSize = 50;

  return (
    <div className="board">
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: 8 }, (_, colIndex) => {
            const squareNumber = rowIndex * 8 + colIndex;
            const piece = pieces.find(p => p.Position === squareNumber);

            // Calcul des positions de style en fonction des indices de ligne et de colonne
            const style = {
              top: `${rowIndex * squareSize}px`,
              left: `${colIndex * squareSize}px`,
              width: `${squareSize}px`,
              height: `${squareSize}px`,
            };

            if (!piece) return <div key={squareNumber} className={`square ${(rowIndex + colIndex) % 2 === 1 ? 'black' : 'white'}`} style={style}></div>;

            const { primaryColor, secondaryColor } = getPieceColors(piece.Color);

            return (
              <div
                key={squareNumber}
                className={`square ${(rowIndex + colIndex) % 2 === 1 ? 'black' : 'white'}`}
                style={style}
              >
                <img
                  src={getPieceImage(piece.Type)}
                  alt={piece.Type}
                  className="piece"
                  style={{
                    filter: `drop-shadow(0 0 0 ${primaryColor})`,
                    boxShadow: `0 0 10px ${secondaryColor}`,
                    background: 'none', // Supprime le fond par défaut de l'image
                    width: '100%', // Ajustement de la taille de l'image
                    height: '100%',
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
      <button className="reset-button" onClick={resetPieces}>
        Réinitialiser les pièces
      </button>
    </div>
  );
};

export default Board;
