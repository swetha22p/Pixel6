import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Table from './Table';
import MapData from './MapData';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/mapdata" element={<MapData />} />
      </Routes>
    </Router>
  );
}

export default App;
