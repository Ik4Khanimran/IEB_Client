import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all data from session storage
    sessionStorage.clear();

    // Clear all data from local storage
    localStorage.clear();

    // Clear all cookies
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.host.replace('www.', '');
    }

    // Call the logout function if it's defined
    if (typeof onLogout === 'function') {
      onLogout();
    }

    // Redirect the user to the login page
    navigate('/login');
  }, [onLogout, navigate]);

  return (
    <div>
      <h2>Logged out successfully</h2>
      {/* You can add any additional content or messages here */}
    </div>
  );
};

export default Logout;
