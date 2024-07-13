// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ColorPage from './Template/Colorpage'; // Assurez-vous que ce chemin est correct
import Home from './Template/Home'; // Mettez à jour si nécessaire
import Board from './atom/board/index'; // Mettez à jour si nécessaire

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color" element={<ColorPage />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;
