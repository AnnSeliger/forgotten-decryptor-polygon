import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Evolve from './pages/Evolve.jsx';

function App() {
  console.log('App rendering');
  return (
    <div className="min-h-screen bg-dark-purple text-white">
      <nav className="p-4 bg-dark-purple shadow-md text-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Home
        </NavLink> |
        <NavLink
          to="/evolve"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Evolve
        </NavLink> |
        <NavLink
          to="/about"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          About
        </NavLink>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/evolve" element={<Evolve />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;