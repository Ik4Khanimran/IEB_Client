import React, { useState } from 'react';
// import axios from 'axios';
import axios from '../../../utils/axiosConfig'
import 'bootstrap/dist/css/bootstrap.min.css';
import { DATA_URL } from '../../../utils/apiUrls'; // Adjust the import path as needed

const Hme_checksheet = () => {
  const [esn, setEsn] = useState('');
  const [stno, setStno] = useState('');
  const [bom, setBom] = useState('');
  const [esn_r, setEsn_R] = useState('');
  const [stno_r, setStno_R] = useState('');

  const handleOpenNewTab = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = sessionStorage.getItem('csrfToken'); // Retrieve CSRF token

      console.log('check tokane', csrfToken)
      const response = await axios.post(DATA_URL, {
        esn,
        stno,
        bom
      },
        {
          headers: {
            'X-CSRFToken': csrfToken // Include CSRF token in request headers
          },
          withCredentials: true
        });


    // Check the status of the response data
    if (response.data.status === 'success') {
      // Store the response data in session storage
      sessionStorage.setItem('checksheetData', JSON.stringify(response.data));
      // Open the new tab
      window.open('/openchecksheet', '_blank');
    } else {
      // If status is error, display an alert with the message
      window.alert(response.data.message);
    }


      // Clear the form fields
        setEsn('');
        setStno('');
        setBom('');
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const handleGetEngResult = async (e) => {
    e.preventDefault();
    // Save esn_r to sessionStorage
    sessionStorage.setItem('esn_r', esn_r);
    sessionStorage.setItem('stno_r', stno_r);
    console.log('Get Engine Result');
    try {
      const csrfToken = sessionStorage.getItem('csrfToken'); // Retrieve CSRF token
      console.log('check token', csrfToken);
      window.open('/resultchecksheet', '_blank');
      
      // Clear the form fields
      setEsn_R('');
      setStno_R('');
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const buttonStyle = {
    padding: '0',
    margin: '0',
    fontSize: '14px'
  };

  const handleOpenBOMChecksheet = () => {
    console.log('Open BOM Checksheet clicked');
    // Add your logic here for opening BOM checksheet
  };

  const handleCreateNewBOMChecksheet = () => {
    console.log('Create New BOM Checksheet clicked');
    // Add your logic here for creating a new BOM checksheet
  };

  return (
    <div>
      <h2>Checksheet</h2>
      <p>Here you will find all checksheets.</p>

      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
      <div align="center">Checksheets</div>

      <div className="row">
        <div className="col-lg-3 col-md-3 col-sm-3 offset-lg-1 offset-md-1 offset-sm-1" style={buttonStyle}>
          <button className="form-submit-button" type="button" onClick={handleOpenBOMChecksheet}>Open BOM Checksheet</button>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={buttonStyle}>
          <button className="form-submit-button" type="button" onClick={handleCreateNewBOMChecksheet}>Create New BOM Checksheet</button>
        </div>
      </div>
      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />

      <div align="center">Fill up Checksheet</div>
      <div className="row mt-2">
        <div className="col-lg-3 col-md-3 col-sm-3 offset-lg-1 offset-md-1 offset-sm-1" style={{ padding: '0', margin: '0' }}>
          <input
            type="text"
            className="css-input"
            placeholder="ESN"
            name="esn"
            id="esn"
            value={esn}
            onChange={(e) => setEsn(e.target.value)}
            required
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <input
            type="text"
            className="css-input"
            placeholder="Station No."
            name="stno"
            id="stno"
            value={stno}
            onChange={(e) => setStno(e.target.value)}
            required
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <input
            type="text"
            className="css-input"
            placeholder="BOM"
            name="bom"
            id="bom"
            value={bom}
            onChange={(e) => setBom(e.target.value)}
            required
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <button className="form-submit-button" onClick={handleOpenNewTab}>Open New Tab</button>
        </div>
      </div>
      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />

      <div align="center">Get Engine Result</div>
      <div className="row mt-2">
        <div className="col-lg-3 col-md-3 col-sm-3 offset-lg-1 offset-md-1 offset-sm-1" style={{ padding: '0', margin: '0' }}>
          <input
            type="text"
            className="css-input"
            placeholder="ESN"
            name="esn_r"
            id="esn_r"
            value={esn_r}
            onChange={(e) => setEsn_R(e.target.value)}
            required
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <input
            type="text"
            className="css-input"
            placeholder="Station No."
            name="stno_r"
            id="stno_r"
            value={stno_r}
            onChange={(e) => setStno_R(e.target.value)}
            required
          />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <button className="form-submit-button" onClick={handleGetEngResult}>Get Engine Result</button>
        </div>
      </div>
      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
    </div>
  );
};

export default Hme_checksheet;
