// 📚 LEARNING: React Hooks Import - These are special React functions
// createContext: Creates a "data container" that any component can access
// useContext: Allows components to "read" data from a context
// useState: Creates variables that can change and trigger re-renders
// useEffect: Runs code when component loads or when certain things change
import { createContext, useContext, useState, useEffect } from 'react'

// 🎨 LEARNING: Creating Theme Context - This is like a "global variable" for dark mode
// Think of it as a "box" that holds dark mode state that any component can access
// 🔄 EFFECT: This makes dark mode available throughout the entire app
const ThemeContext = createContext()

// 🪝 LEARNING: Custom Hook - A reusable function that components can use
// This hook gives components access to dark mode state and functions
// 🔄 USAGE: Any component can call useTheme() to get dark mode data
export const useTheme = () => {
  // 📖 Reading data from the ThemeContext "box"
  const context = useContext(ThemeContext)
  
  // ⚠️ LEARNING: Error Handling - Prevents bugs if hook is used incorrectly
  // If a component uses useTheme() but isn't wrapped in ThemeProvider, show error
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  // 📤 Return the context data to the component that called this hook
  return context
}

// 🎨 LEARNING: Theme Provider Component - This wraps the app and provides dark mode to all children
// { children } is a special prop that contains all the components wrapped by this provider
export const ThemeProvider = ({ children }) => {
  
  // 📊 LEARNING: State Variables - These store data that can change
  // isDarkMode: true/false - whether dark mode is currently on
  // setIsDarkMode: function to change isDarkMode value
  // useState(false): starts with dark mode OFF (false)
  // 🔄 EFFECT: Change to useState(true) to start with dark mode ON
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // 🔄 LEARNING: Render Key - Forces components to re-render when theme changes  
  // This helps ensure all components update their appearance immediately
  // setRenderKey: function to change the render key number
  const [renderKey, setRenderKey] = useState(0)

  // 🎨 LEARNING: Apply Theme Function - Actually changes the website's appearance
  // This function does the "heavy lifting" of switching between light/dark mode
  const applyTheme = (darkMode) => {
    // 🌐 Get the HTML element (the root of the entire webpage)
    const html = document.documentElement
    
    // 🎨 LEARNING: CSS Class Management - Adding/removing 'dark' class
    // Tailwind CSS looks for 'dark' class to apply dark mode styles
    // 🔄 EFFECT: The 'dark' class triggers all "dark:" prefixed CSS classes
    if (darkMode) {
      html.classList.add('dark')        // ➕ Add 'dark' class for dark mode
    } else {
      html.classList.remove('dark')     // ➖ Remove 'dark' class for light mode
    }
    
    // 💾 LEARNING: Local Storage - Saves user preference in browser
    // This remembers the user's choice even after closing the browser
    // JSON.stringify converts true/false to "true"/"false" text
    // 🔄 EFFECT: Remove this line and theme won't be remembered on page reload
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    
    // 🐛 LEARNING: Console Logging - Helps debug what's happening
    // Check browser dev tools Console tab to see these messages
    console.log('Theme applied:', darkMode ? 'dark' : 'light', 'HTML classes:', html.className)
  }

  // 🔄 LEARNING: useEffect Hook - Runs code when component first loads
  // This loads the user's saved theme preference when the app starts
  // [] at the end means "only run once when component mounts"
  useEffect(() => {
    // 🛡️ LEARNING: Try-Catch Error Handling - Prevents app crashes
    try {
      // 💾 Get saved theme from browser storage
      const savedTheme = localStorage.getItem('darkMode')
      
      // 🔄 LEARNING: Ternary Operator - Short if/else statement
      // If savedTheme exists, parse it; otherwise use false (light mode)
      // JSON.parse converts "true"/"false" text back to true/false boolean
      const shouldBeDark = savedTheme ? JSON.parse(savedTheme) : false
      
      // 📊 Update our state with the saved preference
      setIsDarkMode(shouldBeDark)
      
      // 🎨 Apply the theme to the webpage
      applyTheme(shouldBeDark)
      
    } catch (error) {
      // 🚨 If anything goes wrong, log the error but don't crash the app
      console.error('Error loading theme:', error)
    }
  }, []) // 📝 Empty dependency array = run only once when component loads

  // 🔄 LEARNING: Toggle Function - Switches between light and dark mode
  // This function is called when user clicks the dark mode toggle button
  const toggleDarkMode = () => {
    // 🔄 Calculate opposite of current mode (true becomes false, false becomes true)
    const newMode = !isDarkMode
    
    // 🐛 Debug logging to see what's happening
    console.log('Toggling dark mode from', isDarkMode, 'to', newMode)
    
    // 📊 Update state with new mode
    setIsDarkMode(newMode)
    
    // 🎨 Apply new theme to webpage
    applyTheme(newMode)
    
    // 🔄 Force re-render by changing render key (0 -> 1 -> 2 -> etc.)
    // This ensures all components update immediately
    setRenderKey(prev => prev + 1)
  }

  // 🐛 Debug logging to see theme provider state
  console.log('ThemeProvider render - isDarkMode:', isDarkMode, 'renderKey:', renderKey)

  // 📤 LEARNING: Provider Component Return - Makes data available to all children
  return (
    // 🎯 ThemeContext.Provider: This "broadcasts" theme data to all child components
    // value={} defines what data is shared with children
    // Any component wrapped by this provider can access isDarkMode, toggleDarkMode, renderKey
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, renderKey }}>
      
      {/* 👶 LEARNING: Children Prop - All components wrapped by ThemeProvider */}
      {/* This is where the entire App component (and everything inside it) goes */}
      {/* 🔄 EFFECT: These children can now access theme data using useTheme() hook */}
      {children}
      
    </ThemeContext.Provider>
  )
}
