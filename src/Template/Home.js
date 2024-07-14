import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../atom/login';

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Recharger la page pour effacer l'état de connexion
  };

  return (
    <div>
      <h1>Bienvenue au jeu d'échecs</h1>
      {isLoggedIn ? (
        <div>
          <p>Vous êtes connecté.</p>
          <button onClick={handleLogout}>Logout</button>
          <Link to="/color">Commencer à jouer</Link>
        </div>
      ) : (
        <Login setLoggedIn={(value) => {}} /> // Ici, on ne change pas l'état de connexion
      )}
    </div>
  );
};

export default Home;
