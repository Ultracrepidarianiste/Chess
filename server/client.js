// client.js (ou tout autre fichier client)
const io = require('socket.io-client');
const SERVER_URL = 'http://localhost:8080'; // URL de votre serveur Socket.IO

const socket = io(SERVER_URL);

socket.on('connect', () => {
  console.log('Connecté au serveur Socket.IO');
});

socket.on('chat message', (msg) => {
  console.log('Message reçu du serveur:', msg);
});

socket.emit('chat message', 'Bonjour depuis le client');

socket.on('disconnect', () => {
  console.log('Déconnexion du serveur Socket.IO');
});
