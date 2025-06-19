import React, { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  timestamp: string;
}

function App() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchHello = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/hello');
      if (!response.ok) {
        throw new Error('Failed to fetch from API');
      }
      const data: ApiResponse = await response.json();
      setApiMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHello();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          🚀 Vercel Koa React App
        </h1>
        
        <p style={{ color: '#666', marginBottom: '30px' }}>
          A simple TypeScript app with Koa backend and React frontend
        </p>

        <div style={{ marginBottom: '20px' }}>
          <h3>Frontend Message:</h3>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>
            Hello World from React! 👋
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Backend API Response:</h3>
          {loading && <p style={{ color: '#007bff' }}>Loading...</p>}
          {error && <p style={{ color: '#dc3545' }}>Error: {error}</p>}
          {apiMessage && <p style={{ color: '#28a745', fontWeight: 'bold' }}>{apiMessage}</p>}
        </div>

        <button 
          onClick={fetchHello}
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Refresh API'}
        </button>
      </div>
    </div>
  );
}

export default App; 