import React from 'react';
import './style.css'; // Import your CSS file here

const ExampleComponent = () => {
  return (
    <div className="container">
      {/* First Row */}
      <div className="row">
        <div className="col">
          Column 1
        </div>
        <div className="col">
          Column 2
        </div>
        <div className="col">
          Column 3
        </div>
      </div>
      
      {/* Second Row */}
      <div className="row">
        <div className="col">
          Column 1
        </div>
        <div className="col">
          Column 2
        </div>
      </div>

      {/* Third Row */}
      <div className="row">
        <div className="col">
          Column 1
        </div>
        <div className="col">
          Column 2
        </div>
        <div className="col">
          Column 3
        </div>
        <div className="col">
          Column 4
        </div>
      </div>
    </div>
  );
}

export default ExampleComponent;
