import React, { useState } from 'react';
import axios from 'axios';
import '../../csspage/login.css';
import { LOGIN_URL } from '../../../utils/apiUrls';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, {
        username,
        password,
      });
      const data = response.data; // Access the data object from the response

      if (data.status === 'success') {
        sessionStorage.setItem('csrfToken', data.csrfToken);
        sessionStorage.setItem('role', data.role); // Save role
        sessionStorage.setItem('name', data.name); // Save name
        sessionStorage.setItem('emp_id', data.emp_id); // Save emp_id
        console.log('Login successful:', data);
        // Reset fields after successful login
        setUsername('');
        setPassword('');
        setError('');
        onLogin(); // Trigger the onLogin callback
      } else {
        setError(data.message);
        console.error('Login error:', data.message);
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
        <div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
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
