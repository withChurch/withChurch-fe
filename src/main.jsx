import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChurchConfigProvider } from "./contexts/ChurchConfigContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChurchConfigProvider>
      <App />
    </ChurchConfigProvider>
  </StrictMode>
)
