// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import GameList from "./pages/GameList";
import GamePlay from "./pages/GamePlay";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/play/:gameId" element={<GamePlay />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
