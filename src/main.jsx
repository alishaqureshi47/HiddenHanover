// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { SpotsProvider } from "./context/SpotsContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SpotsProvider>         {/* ✅ wrap the whole app */}
        <App />
      </SpotsProvider>
    </BrowserRouter>
  </React.StrictMode>
);