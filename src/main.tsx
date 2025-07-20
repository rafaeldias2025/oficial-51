import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Importar CSS na ordem correta - CSS forçado por último para máxima prioridade
import './styles/colors.css'
import './styles/globals.css'
import './styles/netflix-theme.css'
import './styles/sidebar.css'
import './index.css'
import './styles/force-netflix.css'

createRoot(document.getElementById("root")!).render(<App />);
