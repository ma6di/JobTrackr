// 📚 LEARNING: Import statements bring code from other files into this file
// 🔄 React Router: Handles navigation between different pages (like dashboard, jobs, etc.)
// "as Router" renames BrowserRouter to just "Router" for shorter code
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// 🎨 LEARNING: Context Providers - These wrap the entire app to share data globally
// AuthProvider: Manages user authentication and login state across ALL components
// ThemeProvider: Manages dark/light mode across ALL components
// ResumesProvider: Manages resume data that any component can access
// JobsProvider: Manages job application data globally
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ResumesProvider } from './contexts/ResumesContext'
import { JobsProvider } from './contexts/JobsContext'

// 🧩 LEARNING: Component imports - These are our custom React components
// Each import brings in a different page or reusable piece of UI
import Navigation from './components/Navigation'  // Top navigation bar
import Login from './pages/Login'                 // Login page
import Register from './pages/Register'           // Registration page
import Dashboard from './pages/Dashboard'         // Main dashboard page  
import Resumes from './pages/Resumes'             // Resume management page
import Jobs from './pages/Jobs'                   // Job applications page
import Profile from './pages/Profile'             // User profile/settings page

// 🎨 LEARNING: CSS import - Global styles that apply to the entire app
import './App.css'

// 🏗️ LEARNING: Function Component - This is the main App component
// "function App()" creates a React component that returns JSX (HTML-like code)
// This is the ROOT component - everything else lives inside this
function App() {
  
  // 📤 LEARNING: Return statement - Everything inside return() becomes the actual webpage
  return (
    
    /* 🌍 LEARNING: Context Provider Nesting - These provide global data to all child components
       Think of these like "wrappers" that give superpowers to everything inside them */
    
    /* 🔐 AuthProvider: Makes authentication state available everywhere
       🔄 EFFECT: Remove this and login/logout won't work globally */
    <Router>
      <AuthProvider>
        
        {/* 🎨 ThemeProvider: Makes dark/light mode available everywhere
           🔄 EFFECT: Remove this and dark mode won't work anywhere in the app */}
        <ThemeProvider>
          
          {/* 📁 ResumesProvider: Makes resume data available everywhere  
              🔄 EFFECT: Remove this and components can't share resume data */}
          <ResumesProvider>
            
            {/* 💼 JobsProvider: Makes job application data available everywhere
                🔄 EFFECT: Remove this and job data won't be shared between components */}
            <JobsProvider>
            
              {/* 🎨 LEARNING: Main Container Div - This wraps the entire visible app
                  📏 SIZING: "min-h-screen" = minimum height is full screen height
                  🎨 BACKGROUND: Complex gradient that changes based on light/dark mode
                  🔄 EFFECT: Change "min-h-screen" to "h-64" to see a shorter container */}
              <div className="
                min-h-screen
                bg-gradient-to-br
                from-slate-50 via-gray-50 to-neutral-100
                dark:from-gray-900 dark:via-slate-900 dark:to-gray-800
              transition-colors duration-300
            ">
              
              {/* 🧭 LEARNING: Routes Container - Defines which component shows for which URL
                  Only ONE route shows at a time based on the current URL */}
              <Routes>
                
                {/* 🏠 LEARNING: Individual Routes - Each connects a URL to a component
                    path="/" means the home page (website.com/)
                    element={} defines what component to show
                    🔄 EFFECT: Change path="/login" to see login page at /login instead of / */}
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* 📊 Dashboard Route - Shows navigation + dashboard content
                    path="/dashboard" means website.com/dashboard
                    <> is a React Fragment - groups components without extra HTML */}
                <Route path="/dashboard" element={
                  <>
                    <Navigation />       {/* 🧭 Navigation bar at top */}
                    <main><Dashboard /></main>  {/* 📊 Main dashboard content */}
                  </>
                } />
                
                {/* 📄 Resumes Route - Resume management page
                    🔄 EFFECT: Change path to "/my-resumes" to access at website.com/my-resumes */}
                <Route path="/resumes" element={
                  <>
                    <Navigation />       {/* 🧭 Navigation bar (consistent across pages) */}
                    <main><Resumes /></main>    {/* 📄 Resume management content */}
                  </>
                } />
                
                {/* 💼 Jobs Route - Job application tracking page */}
                <Route path="/jobs" element={
                  <>
                    <Navigation />       {/* 🧭 Navigation bar */}
                    <main><Jobs /></main>       {/* 💼 Job applications content */}
                  </>
                } />
                
                {/* 👤 Profile Route - User settings and profile page */}
                <Route path="/profile" element={
                  <>
                    <Navigation />       {/* 🧭 Navigation bar */}
                    <main><Profile /></main>    {/* 👤 Profile/settings content */}
                  </>
                } />
                
              </Routes>
              </div>
            </JobsProvider>
          </ResumesProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

// 📤 LEARNING: Export Statement - Makes this component available to other files
// "export default" means this is the main thing this file provides
// Other files can import this with: import App from './App'
// 🔄 EFFECT: Remove this and no other file can use the App component
export default App
