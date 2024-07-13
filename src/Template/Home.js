// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenue au jeu d'échecs</h1>
      <Link to="/color">Commencer à jouer</Link>
    </div>
  );
};

export default Home;
