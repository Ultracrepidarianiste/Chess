import React, { useEffect, useState } from 'react';
import './board.css';

const usableArt = require.context('../../UsableArt', false, /\.(png)$/);
const usableArtImages = usableArt.keys().reduce((acc, path) => {
  acc[path.replace('./', '')] = usableArt(path);
  return acc;
}, {});

const Board = () => {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('Non-Reversed'); // 'Non-Reversed' or 'Reversed'
  const [mouseOverPiecePosition, setMouseOverPiecePosition] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false); // état pour suivre si le clic est maintenu

  useEffect(() => {
    fetch('http://localhost:8000/get-pieces')
      .then(response => response.json())
      .then(data => setPieces(data))
      .catch(error => console.error('Error fetching pieces:', error));
  }, []);

  const getPieceImage = (type, color) => {
    if (!color) return null;
    const adjustedColor = color.replace('/', '-');
    const colorFilename = `${type}${adjustedColor}.png`;
    return usableArtImages[colorFilename] || null;
  };

  const getPieceColors = (colorString) => {
    const [primaryColor, secondaryColor] = colorString.split('/');
    return { primaryColor, secondaryColor };
  };

  const resetPieces = () => {
    fetch('http://localhost:8000/reset-pieces', { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          console.log('Réinitialisation des pièces réussie');
          window.location.reload();
        } else {
          throw new Error('Erreur lors de la réinitialisation des pièces');
        }
      })
      .catch(error => console.error('Error resetting pieces:', error));
  };

  const isPieceAt = (pos) => pieces.some(p => p.Position === pos);

  const getValidMoves = (piece, position) => {
    const moves = [];
    const row = Math.floor(position / 8);
    const col = position % 8;

    switch (piece.Type) {
      case 'pawn':
        let direction = piece.Reversed ? -1 : 1;
        const forwardMove = position + 8 * direction;
        if (!isPieceAt(forwardMove)) {
          moves.push(forwardMove);
          if ((row === 6 && !piece.Reversed) || (row === 1 && piece.Reversed)) {
            const doubleForwardMove = forwardMove + 8 * direction;
            if (!isPieceAt(doubleForwardMove)) {
              moves.push(doubleForwardMove);
            }
          }
        }
        const leftDiagonal = position + 7 * direction;
        if (leftDiagonal >= 0 && leftDiagonal < 64 && isPieceAt(leftDiagonal) && pieces.find(p => p.Position === leftDiagonal).Color !== piece.Color) {
          moves.push(leftDiagonal);
        }
        const rightDiagonal = position + 9 * direction;
        if (rightDiagonal >= 0 && rightDiagonal < 64 && isPieceAt(rightDiagonal) && pieces.find(p => p.Position === rightDiagonal).Color !== piece.Color) {
          moves.push(rightDiagonal);
        }
        break;

      case 'rook':
        for (let i = row + 1; i < 8; i++) {
          const move = i * 8 + col;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = row - 1; i >= 0; i--) {
          const move = i * 8 + col;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = col + 1; i < 8; i++) {
          const move = row * 8 + i;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = col - 1; i >= 0; i--) {
          const move = row * 8 + i;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        break;

      case 'bishop':
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
          const move = (row + i) * 8 + (col + i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
          const move = (row + i) * 8 + (col - i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
          const move = (row - i) * 8 + (col + i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
          const move = (row - i) * 8 + (col - i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        break;

      case 'queen':
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
          const move = (row + i) * 8 + (col + i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
          const move = (row + i) * 8 + (col - i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
          const move = (row - i) * 8 + (col + i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
          const move = (row - i) * 8 + (col - i);
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = row + 1; i < 8; i++) {
          const move = i * 8 + col;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = row - 1; i >= 0; i--) {
          const move = i * 8 + col;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = col + 1; i < 8; i++) {
          const move = row * 8 + i;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        for (let i = col - 1; i >= 0; i--) {
          const move = row * 8 + i;
          if (!isPieceAt(move)) {
            moves.push(move);
          } else {
            if (pieces.find(p => p.Position === move).Color !== piece.Color) {
              moves.push(move);
            }
            break;
          }
        }
        break;

      case 'king':
        if (row < 7 && !isPieceAt((row + 1) * 8 + col)) moves.push((row + 1) * 8 + col);
        if (row > 0 && !isPieceAt((row - 1) * 8 + col)) moves.push((row - 1) * 8 + col);
        if (col < 7 && !isPieceAt(row * 8 + col + 1)) moves.push(row * 8 + col + 1);
        if (col > 0 && !isPieceAt(row * 8 + col - 1)) moves.push(row * 8 + col - 1);
        break;

      case 'knight':
        moves.push(position + 17, position + 15, position - 17, position - 15);
        moves.push(position + 10, position - 10, position + 6, position - 6);
        break;

      default:
        break;
    }

    return moves.filter(move => move >= 0 && move < 64);
  };

  const handlePieceClick = (e, piece) => {
    e.stopPropagation();
  
    if (selectedPiece && selectedPiece.ID === piece.ID) {
      setSelectedPiece(null);
      setValidMoves([]);
    } else {
      if ((piece.Reversed && currentTurn === 'Reversed') || (!piece.Reversed && currentTurn === 'Non-Reversed')) {
        setSelectedPiece(piece);
        const moves = getValidMoves(piece, piece.Position);
        setValidMoves(moves);
      } else {
        console.log('Ce n\'est pas votre tour de déplacer cette pièce.');
      }
    }
  };

  const handleSquareClick = (squareNumber) => {
    if (selectedPiece && validMoves.includes(squareNumber)) {
      movePiece(selectedPiece.ID, squareNumber);
    }
  };

  const handleMouseDown = (e, piece) => {
    e.stopPropagation();
    setIsMouseDown(true);
    setSelectedPiece(piece);
    const moves = getValidMoves(piece, piece.Position);
    setValidMoves(moves);
  };

  const handleMouseUp = (e, squareNumber) => {
    e.stopPropagation();
    setIsMouseDown(false);
    if (selectedPiece && validMoves.includes(squareNumber)) {
      movePiece(selectedPiece.ID, squareNumber);
    }
    setSelectedPiece(null);
    setValidMoves([]);
  };

  const handleMouseOverPiece = (piecePosition) => {
    if (isMouseDown) {
      setMouseOverPiecePosition(piecePosition);
    }
  };

  const handleMouseOutPiece = () => {
    if (isMouseDown) {
      setMouseOverPiecePosition(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'g' && mouseOverPiecePosition !== null && selectedPiece) {
      const capturedPiece = pieces.find(p => p.Position === mouseOverPiecePosition);
      if (capturedPiece) {
        movePiece(selectedPiece.ID, mouseOverPiecePosition, capturedPiece);
      }
    }
  };

  const movePiece = (pieceId, newPosition, capturedPiece = null) => {
    fetch('http://localhost:8000/update-piece', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pieceId: pieceId, newPosition: newPosition }),
    })
      .then(response => {
        if (response.ok) {
          setPieces(prevPieces => {
            const updatedPieces = prevPieces.map(p =>
              p.ID === pieceId ? { ...p, Position: newPosition } : p
            );
            if (capturedPiece) {
              return updatedPieces.filter(p => p.ID !== capturedPiece.ID);
            } else {
              return updatedPieces;
            }
          });

          setCurrentTurn(currentTurn === 'Non-Reversed' ? 'Reversed' : 'Non-Reversed');
          setSelectedPiece(null);
          setValidMoves([]);
        } else {
          throw new Error('Erreur lors de la mise à jour de la position');
        }
      })
      .catch(error => console.error('Erreur:', error));
  };

  const squareSize = 50;

  return (
    <div className="board" tabIndex="0" onKeyDown={handleKeyDown}>
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: 8 }, (_, colIndex) => {
            const squareNumber = rowIndex * 8 + colIndex;
            const piece = pieces.find(p => p.Position === squareNumber);
            const isValidMove = validMoves.includes(squareNumber);
            const style = {
              top: `${rowIndex * squareSize}px`,
              left: `${colIndex * squareSize}px`,
              width: `${squareSize}px`,
              height: `${squareSize}px`,
              backgroundColor: isValidMove ? 'green' : (rowIndex + colIndex) % 2 === 1 ? '#b58863' : '#f0d9b5',
            };

            return (
              <div
                key={squareNumber}
                className={`square ${(rowIndex + colIndex) % 2 === 1 ? 'black' : 'white'}`}
                style={style}
                onClick={() => handleSquareClick(squareNumber)}
                onMouseDown={(e) => handleMouseDown(e, piece)}
                onMouseUp={(e) => handleMouseUp(e, squareNumber)}
              >
                {piece && (
                  <img
                    src={getPieceImage(piece.Type, piece.Color)}
                    alt={piece.Type}
                    className="piece"
                    onClick={(e) => handlePieceClick(e, piece)}
                    onMouseOver={() => handleMouseOverPiece(squareNumber)}
                    onMouseOut={handleMouseOutPiece}
                    style={{
                      filter: `drop-shadow(0 0 0 ${getPieceColors(piece.Color).primaryColor})`,
                      boxShadow: `0 0 10px ${getPieceColors(piece.Color).secondaryColor}`,
                    }}
                  />
                )}
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
