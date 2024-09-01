import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import './styles.css';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="App">
      <h1>Bienvenido a la Aplicación</h1>
      <div className="form-container">
        {isRegistering ? (
          <Register />
        ) : (
          <Login onRegisterClick={() => setIsRegistering(true)} />
        )}
      </div>
    </div>
  );
}

export default App;

