import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Simple test function components
function TestLogin() {
  return <div className="p-8"><h1 className="text-xl">Login Test Page</h1></div>
}

function TestRegister() {
  return <div className="p-8"><h1 className="text-xl">Register Test Page</h1></div>
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<TestLogin />} />
          <Route path="/login" element={<TestLogin />} />
          <Route path="/register" element={<TestRegister />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
