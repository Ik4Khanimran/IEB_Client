import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // Import your CSS file here

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8000/Users/login/', {
        username,
        password
      });
      
      // Check the response and handle accordingly
      if (response.data.status === 'success') {
        // Login successful
        console.log('Login successful:', response.data);
        // Reset fields after successful login
        setUsername('');
        setPassword('');
        setError('');
      } else {
        // Login failed
        setError(response.data.message);
        console.error('Login error:', response.data.message);
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container">
      <div className='row'>
        <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
          <h2>Login</h2>
        </div>
      </div>
      <div className='row'>
        <div className=' '>
          <form onSubmit={handleLogin} className="form-horizontal">
            <div className="form-group row mb-3">
              <label htmlFor="username" className="col-sm-2 col-form-label">Username:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row mb-3">
              <label htmlFor="password" className="col-sm-2 col-form-label">Password:</label>
              <div className="col-sm-10">
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-10 offset-sm-2">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>
    </div>
  );
  
};

export default Login;
