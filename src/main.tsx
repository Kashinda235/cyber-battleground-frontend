import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TestApp from "./components/Trial/TestApp.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*<TestApp />*/}
      <App />
  </StrictMode>,
)
