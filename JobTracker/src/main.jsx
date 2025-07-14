import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('🔄 main.jsx starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  document.body.innerHTML = '<div style="padding:20px;background:red;color:white;">❌ Root element not found!</div>';
  throw new Error('Root element with id "root" not found');
}

console.log('✅ Root element found, creating React root...');

try {
  const root = createRoot(rootElement);
  console.log('✅ React root created, rendering...');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log('✅ React render complete!');
} catch (error) {
  console.error('❌ Failed to create or render React:', error);
  document.body.innerHTML = '<div style="padding:20px;background:red;color:white;">❌ React failed: ' + error.message + '</div>';
}
