import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Evolve from './pages/Evolve.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Staking from './pages/Staking.jsx';
import Loyalty from './pages/Loyalty.jsx';
import Airdrop from './pages/Airdrop.jsx';
import Presale from './pages/Presale.jsx';
import Security from './pages/Security.jsx'; // ← Добавляем импорт Security

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
        {/* Presale теперь идет вторым */}
        <NavLink
          to="/presale"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Presale
        </NavLink> |
        <NavLink
          to="/evolve"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Evolve
        </NavLink> |
        <NavLink
          to="/airdrop"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Airdrop
        </NavLink> |
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Dashboard
        </NavLink> |
        <NavLink
          to="/staking"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Staking
        </NavLink> |
        <NavLink
          to="/loyalty"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          Loyalty
        </NavLink> |
        <NavLink
          to="/about"
          className={({ isActive }) => `mx-2 hover:text-pink ${isActive ? 'text-pink font-bold' : ''}`}
        >
          About
        </NavLink> |
        {/* Добавляем Security после About с красным цветом */}
        <NavLink
          to="/security"
          className={({ isActive }) => `mx-2 hover:text-red-400 ${isActive ? 'text-red-400 font-bold' : ''}`}
        >
          Security
        </NavLink>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/evolve" element={<Evolve />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/airdrop" element={<Airdrop />} />
          <Route path="/presale" element={<Presale />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/security" element={<Security />} /> {/* ← Добавляем маршрут Security */}
        </Routes>
      </div>
    </div>
  );
}

export default App;