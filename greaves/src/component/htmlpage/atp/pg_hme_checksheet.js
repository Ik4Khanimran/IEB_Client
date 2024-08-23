import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DATA_URL, CHECKSHEET_DROPDOWNVALUE_URL } from '../../../utils/apiUrls';
import BarcodeScanner from '../common/barcodescanner.js';

const Hme_checksheet = () => {
  const [esn, setEsn] = useState('');
  const [stno, setStno] = useState('');
  const [engmodel, setEngmodel] = useState('');
  const [esn_r, setEsn_R] = useState('');
  const [stno_r, setStno_R] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [dropdownValues, setDropdownValues] = useState({ stno: [], engmodel: [] });

  useEffect(() => {
    handleGetdata();
  }, []);

  const handleOpenNewTab = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');

      const response = await axios.post(DATA_URL, {
        esn,
        stno
      },
      {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        sessionStorage.setItem('checksheetData', JSON.stringify(response.data));
        console.log(encodeURIComponent(stno))
          if (encodeURIComponent(stno) === '30') {
            console.log("Let open page for Station 30")
            window.open('/openchecksheet', '_blank');  // Replace with '/opencheckpage' or the appropriate route
          }
          if (encodeURIComponent(stno) === '35') {
            console.log("Let open page for Station 35")
            const url = `/auditchecksheet?esn=${encodeURIComponent(esn)}&stno=${encodeURIComponent(stno)}`;
            window.open(url, '_blank');
          }
          if (encodeURIComponent(stno) === '32') {
            console.log("Let open page for Station 32")
            const url = `/reworkchecksheet?esn=${encodeURIComponent(esn)}&stno=${encodeURIComponent(stno)}`;
            window.open(url, '_blank');
          }
          if(encodeURIComponent(stno) == '10'){
            console.log("Let open page for Station 10")
            const url = `/assemblyop?esn=${encodeURIComponent(esn)}&stno=${encodeURIComponent(stno)}`;
            window.open(url, '_blank');
          }
          
      } else {
        window.alert(response.data.message);
      }

      setEsn('');
      setStno('');
      setEngmodel('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGetEngResult = async (e) => {
    e.preventDefault();
    sessionStorage.setItem('esn_r', esn_r);
    sessionStorage.setItem('stno_r', stno_r);
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      window.open('/resultchecksheet', '_blank');
      setEsn_R('');
      setStno_R('');
    } catch (error) {
      console.error('Error:', error);
    }
  }; 


  const handleShowScanner = () => setShowScanner(true);
  const handleCloseScanner = () => setShowScanner(false);
  const handleBarcodeScanned = (barcode) => {
    setEsn('');
    setTimeout(() => {
      setEsn(barcode);
    }, 100);
  };

  const handleGetdata = async () => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
  
      const response = await axios.put(
        CHECKSHEET_DROPDOWNVALUE_URL,
        {},
        {
          headers: {
            'X-CSRFToken': csrfToken,  // Ensure this matches your backend's expectation
          },
          withCredentials: true
        }
      );
  
      if (response.data.status === 'success') {
        console.log('Dropdown values are:', response.data.stno);
        setDropdownValues({
          stno: response.data.stno.map(item => item.loc_id),
          engmodel: response.data.engmodel.map(item => item.engmodel),
        });
      } else {
        console.error('Dropdown values fetch failed:', response.data.message);
      }
  
    } catch (error) {
      console.error('Error fetching dropdown values:', error);
    }
  };
  

  return (
    <div>
      <h2>Checksheet</h2>
      <p>Here you will find all checksheets.</p>
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
          <select
            className="css-input"
            value={stno}
            onChange={(e) => setStno(e.target.value)}
            required
          >
            <option value="">Select Station No.</option>
            {dropdownValues.stno.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <button className="form-submit-button" onClick={handleOpenNewTab}>Open Checksheet</button>
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
          <select
            className="css-input"
            value={stno_r}
            onChange={(e) => setStno_R(e.target.value)}
            required
          >
            <option value="">Select Station No.</option>
            {dropdownValues.stno.map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
          <button className="form-submit-button" onClick={handleGetEngResult}>Get Engine Result</button>
        </div>
      </div>
      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
      <div className="col-lg-3 col-md-3 col-sm-3" style={{ padding: '0', margin: '0' }}>
        <button className="form-submit-button" onClick={handleShowScanner}>Scanner</button>
      </div>
      <BarcodeScanner show={showScanner} handleClose={handleCloseScanner} onBarcodeScanned={handleBarcodeScanned} />
      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
    </div>
  );
};

export default Hme_checksheet;
