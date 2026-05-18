import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import MissingGrid from './components/MissingGrid.jsx'
import DuplicatesGrid from './components/DuplicatesGrid.jsx'
import StatsPage from './components/StatsPage.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/missing" element={<MissingGrid />} />
        <Route path="/duplicates" element={<DuplicatesGrid />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)