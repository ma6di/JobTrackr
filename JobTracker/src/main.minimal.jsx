import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function MinimalApp() {
  return (
    <div>
      <h1>Minimal Test - No CSS</h1>
      <p>If you see this, React is working!</p>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MinimalApp />
  </StrictMode>,
)
