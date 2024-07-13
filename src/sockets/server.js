const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // L'URL de votre client React
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Nouvelle connexion :', socket.id);

  socket.on('message', (data) => {
    console.log('Message reçu :', data);
    socket.emit('message', 'Message reçu !');
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté :', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
