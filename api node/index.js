const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const sharp = require('sharp');
const fs = require('fs');
const verifyToken = require('../middlewares/VerifyToken');


const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({
    credentials: true,
}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chessyannou",
});

db.connect((error) => {
    if (error) throw error;
    console.log("Connexion à la BDD réussie");
});


app.post('/save-pieces', (req, res) => {
  const { primaryColor, secondaryColor } = req.body;
  const userId = 1; // Utilisation de l'UserId 1 de manière statique

  const pieceTypes = [
    { type: 'pawn', count: 8 },
    { type: 'rook', count: 2 },
    { type: 'knight', count: 2 },
    { type: 'bishop', count: 2 },
    { type: 'queen', count: 1 },
    { type: 'king', count: 1 }
  ];

  // Promesse pour vérifier si la table `pieces` est vide
  const checkPiecesTablePromise = new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) as count FROM pieces', (error, results) => {
      if (error) {
        console.error(error);
        reject('Erreur lors de la vérification de la base de données');
      } else {
        const isEmpty = results[0].count === 0;
        resolve(isEmpty);
      }
    });
  });

  // Promesse pour insérer les pièces dans la base de données
  checkPiecesTablePromise.then(isEmpty => {
    const savePiecesPromises = [];
    const reversed = isEmpty ? true : false;

    pieceTypes.forEach(pieceType => {
      for (let i = 0; i < pieceType.count; i++) {
        let position = null;

        if (isEmpty) {
          switch (pieceType.type) {
            case 'pawn':
              position = i + 48;
              break;
            case 'rook':
              position = i === 0 ? 56 : 63;
              break;
            case 'knight':
              position = i === 0 ? 57 : 62;
              break;
            case 'bishop':
              position = i === 0 ? 58 : 61;
              break;
            case 'queen':
              position = 59;
              break;
            case 'king':
              position = 60;
              break;
            default:
              position = null;
              break;
          }
        } else {
          switch (pieceType.type) {
            case 'pawn':
              position = i + 8;
              break;
            case 'rook':
              position = i === 0 ? 0 : 7;
              break;
            case 'knight':
              position = i === 0 ? 1 : 6;
              break;
            case 'bishop':
              position = i === 0 ? 2 : 5;
              break;
            case 'queen':
              position = 3;
              break;
            case 'king':
              position = 4;
              break;
            default:
              position = null;
              break;
          }
        }

        // Création de la promesse pour chaque insertion de pièce
        const savePiecePromise = new Promise((resolve, reject) => {
          db.query(
            'INSERT INTO pieces (Type) VALUES (?)',
            [pieceType.type],
            (error, result) => {
              if (error) {
                console.error(error);
                reject(`Erreur lors de la création des pièces de type ${pieceType.type}`);
              } else {
                const pieceId = result.insertId;
                const colorFilename = `${pieceType.type}#${primaryColor.replace('#', '')}_#${secondaryColor.replace('#', '')}.png`;
                console.log('Nom de fichier généré:', colorFilename);
                const outputPath = `../src/UsableArt/${colorFilename}`;

                // Utilisation de sharp pour traiter l'image
                sharp(`../src/Art/${pieceType.type}Skin.png`)
                  .tint(primaryColor)  // Utilisez .tint pour ajouter la couleur principale
                  .toFile(outputPath, (err, info) => {
                    if (err) {
                      console.error(err);
                      reject(`Erreur lors du traitement de l'image pour la pièce ${pieceType.type}`);
                    } else {
                      db.query(
                        'INSERT INTO `user-piece` (User_ID, Piece_ID, Color, Status, Position, Reversed) VALUES (?, ?, ?, ?, ?, ?)',
                        [userId, pieceId, `${primaryColor}_${secondaryColor}`, 'alive', position, reversed],
                        (error) => {
                          if (error) {
                            console.error(error);
                            reject(`Erreur lors de la création des user-pieces pour la pièce ${pieceType.type}`);
                          } else {
                            resolve(`Pièce ${pieceType.type} enregistrée avec succès`);
                          }
                        }
                      );
                    }
                  });
              }
            }
          );
        });

        savePiecesPromises.push(savePiecePromise);
      }
    });

    // Exécuter toutes les promesses d'insertion de pièces
    Promise.all(savePiecesPromises)
      .then(successMessages => {
        res.status(200).json({ message: successMessages.join(', ') });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Erreur lors de l\'enregistrement des pièces');
      });
  });
});





app.get('/get-pieces', (req, res) => {
  db.query('SELECT p.ID, p.Type, up.Color, up.Status, up.Position, up.Reversed FROM pieces p JOIN `user-piece` up ON p.ID = up.Piece_ID', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la récupération des pièces');
      return;
    }
    res.json(results);
  });
});


app.post('/api/login', (req, res) => {
  const { UserName, Password } = req.body; 
  console.log('Received login request for UserName:', UserName); 

  // Recherche de l'utilisateur dans la base de données
  db.query('SELECT * FROM user WHERE UserName = ?', [UserName], (error, results) => { 
    if (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la recherche de l\'utilisateur' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        
        if (Password === user.Password) { // Modifier ici
          const token = 'fake-jwt-token'; 
          res.status(200).json({ success: true, token });
        } else {
          res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
        }
      } else {
        res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
    }
  });
});


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

app.delete("/reset-pieces", (req, res) => {
  // Supprimer d'abord toutes les entrées dans la table `user-piece`
  db.query("DELETE FROM `user-piece`", (error, result) => {
      if (error) {
          console.error(error);
          res.status(500).send("Erreur lors de la suppression des user-piece");
          return;
      }
      // Ensuite, supprimer toutes les pièces de la table `pieces`
      db.query("DELETE FROM pieces", (error, result) => {
          if (error) {
              console.error(error);
              res.status(500).send("Erreur lors de la suppression des pièces");
              return;
          }
          res.status(200).send("Toutes les pièces ont été supprimées avec succès");
      });
  });
});

app.post('/update-piece', (req, res) => {
  const { pieceId, newPosition } = req.body;

  db.query(
    'UPDATE `user-piece` SET Position = ? WHERE Piece_ID = ?',
    [newPosition, pieceId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la mise à jour de la position de la pièce');
        return;
      }
      res.status(200).send('Position de la pièce mise à jour avec succès');
    }
  );
});
app.post('/update-piece', (req, res) => {
  const { pieceId, newPosition } = req.body;

  db.query('UPDATE `user-piece` SET Position = ? WHERE Piece_ID = ?', [newPosition, pieceId], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur lors de la mise à jour de la position de la pièce');
    } else {
      res.status(200).send('Position de la pièce mise à jour avec succès');
    }
  });
});
