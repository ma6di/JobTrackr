import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function DebugLogin() {
  const { login, loading, error: authError, clearError } = useAuth()
  const [formData, setFormData] = useState({ email: 'test@test.com', password: 'wrongpassword' })
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!formData.email || !formData.password) {
      setLocalError('Please enter both email and password')
      return
    }

    try {
      console.log('🚀 Debug Login: Starting login attempt')
      await login(formData.email, formData.password)
      console.log('✅ Debug Login: Login successful')
    } catch (err) {
      console.error('❌ Debug Login: Login failed:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  console.log('🔍 Debug Login Render:', { localError, authError, loading })

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Login</h1>
      
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
        <strong>Debug Info:</strong><br />
        Local Error: {localError || 'None'}<br />
        Auth Error: {authError || 'None'}<br />
        Loading: {loading ? 'Yes' : 'No'}
      </div>

      {(localError || authError) && (
        <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', color: '#a00', padding: '10px', margin: '10px 0', borderRadius: '4px' }}>
          {localError || authError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

export default DebugLogin
