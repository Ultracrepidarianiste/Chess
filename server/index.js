// index.js (ou server.js)

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql'); // Importez le pilote MySQL

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuration de la connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'votre_utilisateur',
  password: 'votre_mot_de_passe',
  database: 'votre_base_de_donnees'
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connexion à la base de données réussie');
});

// Endpoint pour l'inscription (ajout d'un nouvel utilisateur)
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Vérifiez si l'utilisateur existe déjà
  db.query('SELECT * FROM users WHERE UserName = ?', [username], (error, results) => {
    if (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur:', error);
      return res.status(500).send('Erreur serveur');
    }

    if (results.length > 0) {
      return res.status(409).send('Nom d\'utilisateur déjà pris');
    }

    // Insérez le nouvel utilisateur dans la base de données
    db.query('INSERT INTO users (UserName, Password) VALUES (?, ?)', [username, password], (error) => {
      if (error) {
        console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
        return res.status(500).send('Erreur serveur');
      }
      res.status(201).send('Utilisateur enregistré avec succès');
    });
  });
});

// Endpoint pour la connexion (authentification de l'utilisateur)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Vérifiez les informations de connexion dans la base de données
  db.query('SELECT * FROM users WHERE UserName = ? AND Password = ?', [username, password], (error, results) => {
    if (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur pour la connexion:', error);
      return res.status(500).send('Erreur serveur');
    }

    if (results.length === 0) {
      return res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // Authentification réussie
    res.status(200).send('Connexion réussie');
  });
});

// Configuration supplémentaire de votre serveur Express si nécessaire

// Démarrage du serveur
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion des connexions socket.io
io.on('connection', (socket) => {
  console.log('Nouvelle connexion socket:', socket.id);

  // Exemple d'événement de chat
  socket.on('chat message', (msg) => {
    console.log(`Message reçu: ${msg}`);
    // Émettre le message à tous les clients connectés
    io.emit('chat message', msg);
  });

  // Déconnexion d'un client
  socket.on('disconnect', () => {
    console.log('Déconnexion du client:', socket.id);
  });
});
