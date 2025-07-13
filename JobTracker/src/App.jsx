import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/Navigation'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Resumes from './pages/Resumes'
import Jobs from './pages/Jobs'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-neutral-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={
              <>
                <Navigation />
                <main><Dashboard /></main>
              </>
            } />
            <Route path="/resumes" element={
              <>
                <Navigation />
                <main><Resumes /></main>
              </>
            } />
            <Route path="/jobs" element={
              <>
                <Navigation />
                <main><Jobs /></main>
              </>
            } />
            <Route path="/profile" element={
              <>
                <Navigation />
                <main><Profile /></main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
