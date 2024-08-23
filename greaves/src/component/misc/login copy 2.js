import React from 'react';

const ExampleComponent = () => {
  return (
    <div className="container">
      {/* First Row */}
      <div className="row">
        <div className="col-sm-3">
          Column 1
        </div>
        <div className="col-sm-3">
          Column 2
        </div>
        <div className="col-sm-3">
          Column 3
        </div>
        <div className="col-sm-3">
          Column 4
        </div>
      </div>

      {/* Second Row */}
      <div className="row">
        <div className="col-sm-3">
          Column 5
        </div>
        <div className="col-sm-3">
          Column 6
        </div>
        <div className="col-sm-3">
          Column 7
        </div>
        <div className="col-sm-3">
          Column 8
        </div>
      </div>

      {/* Third Row */}
      <div className="row">
        <div className="col-sm-3">
          Column 9
        </div>
        <div className="col-sm-3">
          Column 10
        </div>
        <div className="col-sm-3">
          Column 11
        </div>
        <div className="col-sm-3">
          Column 12
        </div>
      </div>
    </div>
  );
}

export default ExampleComponent;
