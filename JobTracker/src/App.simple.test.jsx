function SimpleApp() {
  return (
    <div style={{ 
      padding: '40px', 
      background: '#f0f9ff', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#0066cc', marginBottom: '20px' }}>
          🎉 JobTracker App Loading Test
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
          This is a simple test to verify the app is loading correctly.
        </p>
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{ 
              padding: '12px 24px', 
              background: '#0066cc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            Go to Login
          </button>
          
          <button 
            onClick={() => alert('Frontend is working!')}
            style={{ 
              padding: '12px 24px', 
              background: '#22c55e', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Test Click
          </button>
        </div>
        
        <div style={{ 
          background: '#f8fafc', 
          padding: '20px', 
          borderRadius: '6px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '10px' }}>Status:</h3>
          <p>✅ React is working</p>
          <p>✅ Vite dev server is running</p>
          <p>✅ Basic styling is applied</p>
          <p>⏰ Current time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;
