import React, { useState } from 'react';

function Login({ onRegisterClick }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor, ingrese su usuario y contraseña.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      console.log('Login exitoso:', data);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Username:
        <input 
          type="text" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          disabled={loading}
        />
      </label>
      <label>
        Password:
        <input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          disabled={loading}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Login'}
      </button>
      {/* Botón de registro añadido */}
      <button type="button" onClick={onRegisterClick} disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Cargando...' : 'Register'}
      </button>
    </form>
  );
}

export default Login;


