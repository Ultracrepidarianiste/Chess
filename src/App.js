import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Template/Home';
import ColorPage from './Template/Colorpage';
import Board from './atom/board/index';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color" element={<PrivateRoute element={<ColorPage />} />} />
        <Route path="/board" element={<PrivateRoute element={<Board />} />} />
      </Routes>
    </Router>
  );
}

export default App;
