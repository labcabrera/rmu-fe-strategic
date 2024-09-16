import React from "react";
import { Route, Routes } from "react-router-dom";
import StrategicGameList from "./components/StrategicGameList";
import StrategicGameView from "./components/StrategicGameView";
import StrategicGameCreation from "./components/StrategicGameCreation";
import "./index.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StrategicGameList />} />
      <Route path="/view/:gameId" element={<StrategicGameView />} />
      <Route path="/creation" element={<StrategicGameCreation />} />
    </Routes>
  );
};

export default App;
