import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation } from 'react-router-dom';
import { OPEN_OPS_ST10_URL } from '../../../utils/apiUrls';
import { useNavigate } from 'react-router-dom';


const Assemblyop = () => {
  const [resultData, setResultData] = useState(null);
  const [username] = useState(sessionStorage.getItem('name') || 'Unknown User');
  const [userId] = useState(sessionStorage.getItem('emp_id') || 'Unknown ID');
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);    
  const location = useLocation();
  const params = new URLSearchParams(location.search);      
  const esn = params.get('esn');
  const stno = params.get('stno');
  const [crankCaseNo, setCrankCaseNo] = useState('');
  const [fipNo, setFipNo] = useState('');
  const [turboNo, setTurboNo] = useState('');
  const [rating, setRating] = useState('');
  const [remark, setRemark] = useState('');
  const currentTimeStamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata'
  });

  
  const getSessionData = useCallback(() => {
      console.log('getSessionData called');
      const csrfToken = sessionStorage.getItem('csrfToken');
      return { csrfToken, esn, stno };
  }, [esn, stno]);

  const fetchData = useCallback(async () => {
      if (hasFetchedData.current) return; // Prevent double fetch

      if (!esn || !stno) {
          console.error('ESN or STNO is missing');
          setError('ESN or STNO is missing');
          return;
      }

      console.log('fetchData called');
      hasFetchedData.current = true; // Set flag to true after the first call

      try {
          const { csrfToken } = getSessionData();
          const response = await axios.post(OPEN_OPS_ST10_URL, {
              esn,
              stno,
          }, {
              headers: {
                  'X-CSRFToken': csrfToken
              },
              withCredentials: true
          });

          setResultData(response.data);
      } catch (error) {
          console.error('Error:', error);
          setError('Error fetching data');
      }
  }, [getSessionData, esn, stno]);

  useEffect(() => {
      document.title = "Result";
      console.log('useEffect called');
      fetchData();
  }, [fetchData]);

  const navigate = useNavigate();

  const handleRollDownClick = () => {
      console.log(' Roll down clicked, Navigating to new page.');
      navigate('/new-page');
  };

  const isRollDownDisabled = !crankCaseNo || !fipNo || !turboNo || !rating || !remark;

  const handleHoldClick = () => {
      console.log('Hold button clicked. Data is on hold.');
  };

  return (
    <div className="container2">
      {/* Existing UI elements */}
      <div className="row justify-content-center align-items-center">
        <div className="col-2 greaves"> GREAVES </div>
        <div className="col-8">
          <h2 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
            Engine Operations
          </h2>
        </div>
        <div className="col-2 ieb"> Industrial Engine Unit </div>
      </div>

      {/* Submit Button */}
      <div className="row justify-content-center mt-3">
        <button className="btn btn-primary">Operation Done</button>
      </div>

      {/* Header data */}
      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="6" className="text-center">Engine Detail</th>
                </tr>
              </thead>
              <tbody>
                {resultData ? (
                  <>
                    <tr>
                      <th>Engine Sr No</th>
                      <td>{resultData.header_data?.esn || 'N/A'}</td>
                      <th>Model</th>
                      <td>{resultData.header_data?.engmodel || 'N/A'}</td>
                      <th>Engine Type</th>
                      <td>{resultData.header_data?.type || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td colSpan={3}>{resultData.header_data?.description || 'N/A'}</td>
                      <th>Station No</th>
                      <td>{resultData.header_data?.stno || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Name</th>
                      <td>{username}</td>
                      <th>Emp Id</th>
                      <td>{userId}</td>
                      <th>Date & Time</th>
                      <td>{currentTimeStamp}</td>
                    </tr>
                    <tr>
                      <th>Next Ok Station</th>
                      <td>{resultData.header_data?.pass_loc || 'N/A'}</td>
                      <th>Next Nok Station</th>
                      <td>{resultData.header_data?.fail_loc || 'N/A'}</td>
                      <th>Result Station</th>
                      <td>{resultData.header_data?.result_loc || 'N/A'}</td>
                    </tr>
                  </>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center text-danger">{error}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Input Table Section */}
      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="2" className="text-center">Input Engine Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Crank Case No</th>
                  <td><input type="text" className="form-control" placeholder="Enter Crank Case No"
                   value={crankCaseNo} onChange={(e) => setCrankCaseNo(e.target.value)}/></td>            
                </tr>
                <tr>
                  <th>FIP No</th>
                  <td><input type="text" className="form-control" placeholder="Enter FIP No"
                  value={fipNo} onChange={(e) => setFipNo(e.target.value)} /></td>
                </tr>
                <tr>
                  <th>Turbo No</th>
                  <td><input type="text" className="form-control" placeholder="Enter Turbo No" 
                  value={turboNo} onChange={(e) => setTurboNo(e.target.value)}/></td>
                </tr>
                <tr>
                  <th>Rating</th>
                  <td><input type="text" className="form-control" placeholder="Enter Rating" 
                  value={rating} onChange={(e) => setRating(e.target.value)}/></td>
                </tr>
                <tr>
                  <th>Remark</th>
                  <td><input type="text" className="form-control" placeholder="Enter Remark" 
                  value={remark} onChange={(e) => setRemark(e.target.value)}/></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Button Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-auto">
          <button className="btn btn-success" onClick={handleRollDownClick} disabled={isRollDownDisabled}>
            Roll Down
          </button>
        </div>
        <div className="col-auto">
          <button className="btn btn-warning" onClick={handleHoldClick}>
            Hold
          </button>
        </div>
      </div>

      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
    </div>
  );
}

export default Assemblyop;