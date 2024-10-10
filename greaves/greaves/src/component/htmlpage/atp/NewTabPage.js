import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NewTabPage = () => {
  const handleCloseTab = () => {
    window.close();
  };

  return (
    <div className="container">
      <h2>New Tab Page 1111111111111111111</h2>
      <button className="btn btn-primary" onClick={handleCloseTab}>Close Tab</button>
    </div>
  );
};

export default NewTabPage;
