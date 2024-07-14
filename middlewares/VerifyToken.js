// Middleware VerifyToken.js
const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Accès non autorisé');
  }

  jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token invalide');
    }
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
