import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'

function ThemeDebug() {
  const { isDarkMode, toggleDarkMode, renderKey } = useTheme()
  const [domClass, setDomClass] = useState('')
  const [storageValue, setStorageValue] = useState('')
  
  // Update DOM and storage info regularly
  useEffect(() => {
    const updateInfo = () => {
      const html = document.documentElement
      setDomClass(html.classList.contains('dark') ? 'dark' : 'light')
      setStorageValue(localStorage.getItem('darkMode') || 'null')
    }
    
    updateInfo()
    const interval = setInterval(updateInfo, 100) // Update every 100ms
    
    return () => clearInterval(interval)
  }, [isDarkMode, renderKey])
  
  const clearStorage = () => {
    localStorage.removeItem('darkMode')
    window.location.reload()
  }
  
  const forceLight = () => {
    localStorage.setItem('darkMode', 'false')
    document.documentElement.classList.remove('dark')
    window.location.reload()
  }
  
  const forceDark = () => {
    localStorage.setItem('darkMode', 'true')
    document.documentElement.classList.add('dark')
    window.location.reload()
  }
  
  return (
    <div className="fixed top-4 right-4 bg-red-100 dark:bg-red-900 p-4 rounded-lg border z-50 text-black dark:text-white">
      {/* Simple test element */}
      <div className="test-dark-mode p-2 mb-2 rounded">TEST: Should be white bg/black text in light, black bg/white text in dark</div>
      
      {/* Tailwind dark mode test */}
      <div className="p-2 mb-2 rounded bg-white dark:bg-black text-black dark:text-white border">
        TAILWIND TEST: Should be white bg in light, black bg in dark
      </div>
      
      <div className="text-sm">
        <p><strong>React State:</strong> {isDarkMode ? 'ON' : 'OFF'}</p>
        <p><strong>HTML Class:</strong> {domClass}</p>
        <p><strong>LocalStorage:</strong> {storageValue}</p>
        <p><strong>Render Key:</strong> {renderKey}</p>
        <p><strong>HTML Classes:</strong> {document.documentElement.className}</p>
        <p><strong>Match:</strong> {isDarkMode === (domClass === 'dark') ? '✅' : '❌'}</p>
      </div>
      <div className="flex gap-1 mt-2 flex-wrap">
        <button 
          onClick={toggleDarkMode}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
        >
          Toggle
        </button>
        <button 
          onClick={forceDark}
          className="px-2 py-1 bg-gray-800 text-white text-xs rounded"
        >
          Force Dark
        </button>
        <button 
          onClick={forceLight}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded"
        >
          Force Light
        </button>
        <button 
          onClick={clearStorage}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default ThemeDebug
