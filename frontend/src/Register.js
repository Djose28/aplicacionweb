import React, { useState } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');  // Estado para manejar mensajes de éxito/error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');  // Resetea el mensaje al intentar nuevamente
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        setMessage('Usuario registrado con éxito.');
      } else {
        const data = await response.json();
        setMessage(`Error: ${data.message || 'No se pudo registrar el usuario.'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {message && <p>{message}</p>}  {/* Muestra el mensaje */}
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;

