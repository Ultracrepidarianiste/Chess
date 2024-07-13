// index.js (ou server.js, selon votre structure)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuration supplémentaire de votre serveur Express si nécessaire

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

// Démarrage du serveur
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Serveur Socket.IO démarré sur le port ${PORT}`);
});
