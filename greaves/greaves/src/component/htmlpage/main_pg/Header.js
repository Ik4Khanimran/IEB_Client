import React, { useEffect, useState } from 'react';
import '../../csspage/styles.css';
import moment from 'moment';

const Header = () => {
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Retrieve role from session storage
    const userRole = sessionStorage.getItem('role');
    const userName = sessionStorage.getItem('name');
    if (userRole) {
      setRole(userRole);
    }
    if (userName) {
      setName(userName);
    }
  }, []);


  return (
    <header>
      <div className="row flex-grow-1">
        <div className="col-lg-4 col-md-4 col-sm-4" style={{ textAlign: 'left', fontSize: '12px' }}>
            <h1 className="brand-text">GREAVES</h1>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4">
            <h1 className="leu1-text">Industrial Engine Unit</h1>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4" style={{ textAlign: 'right', fontSize: '12px' }}>
            <div className='header-info'>{moment().format('Do MMMM YYYY, h:mm:ss a')}</div>
            {role && (
              <div className='header-info'>Welcome {name} as {role}</div>
            )}
            {/* <button className="btn btn-danger" onClick={handleLogout}>Logout</button> */}
        </div>
      </div>

      
    </header>
  );
};

export default Header;
