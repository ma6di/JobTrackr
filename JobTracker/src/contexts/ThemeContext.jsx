import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [renderKey, setRenderKey] = useState(0)

  const applyTheme = (darkMode) => {
    const html = document.documentElement
    
    // Only use 'dark' class - remove it for light mode, add it for dark mode
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    
    console.log('Theme applied:', darkMode ? 'dark' : 'light', 'HTML classes:', html.className)
  }

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('darkMode')
      const shouldBeDark = savedTheme ? JSON.parse(savedTheme) : false
      setIsDarkMode(shouldBeDark)
      applyTheme(shouldBeDark)
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    console.log('Toggling dark mode from', isDarkMode, 'to', newMode)
    
    setIsDarkMode(newMode)
    applyTheme(newMode)
    setRenderKey(prev => prev + 1)
  }

  console.log('ThemeProvider render - isDarkMode:', isDarkMode, 'renderKey:', renderKey)

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, renderKey }}>
      {children}
    </ThemeContext.Provider>
  )
}
