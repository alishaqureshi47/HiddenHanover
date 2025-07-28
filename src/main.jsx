// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { SpotsProvider } from "./context/SpotsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SpotsProvider>
          <App />
        </SpotsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>

);