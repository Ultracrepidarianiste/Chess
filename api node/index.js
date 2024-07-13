const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

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


app.post("/save-pieces", (req, res) => {
    const { primaryColor, secondaryColor } = req.body;
  
    const userId1 = 1; // ID de l'utilisateur 1
    const userId2 = 2; // ID de l'utilisateur 2
  
    const pieceTypes = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'];
  
    const savePiecesPromise = new Promise((resolve, reject) => {
      const queries = [];
  
      pieceTypes.forEach((type, index) => { // Ajouter l'index pour la position
        const promise = new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO pieces (Type) VALUES (?)",
            [type],
            (error, result) => {
              if (error) {
                console.error(error);
                reject("Erreur lors de la création des pièces");
              } else {
                const pieceId = result.insertId;
                const position = index; // Position de la pièce sur le plateau
  
                db.query(
                  "INSERT INTO `user-piece` (User_ID, Piece_ID, Color, Status, Position) VALUES (?, ?, ?, ?, ?)",
                  [userId1, pieceId, primaryColor+"/"+secondaryColor, 'alive', position],
                  (error) => {
                    if (error) {
                      console.error(error);
                      reject("Erreur lors de la création des user-pieces");
                    } else {
                      db.query(
                        "INSERT INTO `user-piece` (User_ID, Piece_ID, Color, Status, Position) VALUES (?, ?, ?, ?, ?)",
                        [userId2, pieceId, primaryColor+"/"+secondaryColor, 'alive', position + 8], // Pour le deuxième utilisateur, position ajustée
                        (error) => {
                          if (error) {
                            console.error(error);
                            reject("Erreur lors de la création des user-pieces");
                          } else {
                            resolve(`Pièce ${type} enregistrée avec succès pour les utilisateurs`);
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        });
  
        queries.push(promise);
      });
  
      Promise.all(queries)
        .then(successMessages => {
          resolve(successMessages.join(", "));
        })
        .catch(error => {
          reject(error);
        });
    });
  
    savePiecesPromise
      .then(successMessage => {
        res.status(200).send(JSON.stringify(successMessage));
      })
      .catch(error => {
        console.error(error);
        res.status(500).send("Erreur lors de l'enregistrement des pièces");
      });
  });
  

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
