import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation } from 'react-router-dom';
import { OPEN_OPS_ST10_URL } from '../../../utils/apiUrls';
import { SUBMIT_OPS_ST10_URL } from '../../../utils/apiUrls';
import { useNavigate } from 'react-router-dom';
import {HOLD_OPS_ST10_URL} from '../../../utils/apiUrls';


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
  const bom = params.get('bom');
  const [crankCaseNo, setCrankCaseNo] = useState('');
  const [fipNo, setFipNo] = useState('');
  const [turboNo, setTurboNo] = useState('');
  const [remark, setRemark] = useState('');
  const [holdRemark, setHoldRemark] = useState('');
  const [holdStatus, setHoldStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditable = stno !== '12'; 
  

  const currentTimeStamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata'
  }); 

  const navigate = useNavigate();  
  const getSessionData = useCallback(() => {
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
      if (stno === '10' || stno === '12') {
        setHoldRemark(response.data.header_data.hold_remark || '');
        setHoldStatus(response.data.header_data.hold_status || false);
        console.log(response.data.header_data.hold_status)
        setFipNo(response.data.header_data.fip_no);
        setCrankCaseNo(response.data.header_data.cranckcase_no);
        setTurboNo(response.data.header_data.turbo_no)

        // Check if station 10 is on hold
      if (stno === '10' && response.data.header_data.hold_status) {
        window.alert('Checksheet for station 10 is on hold.');
        // Optionally, you can redirect or perform other actions here
        navigate('/'); // Redirect to another page, e.g., home
      }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data');
    }
  }, [getSessionData, esn, stno]);
  

  useEffect(() => {
      document.title = "Result";
      fetchData();
  }, [fetchData]);

  const handleRollDownSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting ) return;
    setIsSubmitting(true); 

    const csrfToken = sessionStorage.getItem('csrfToken');

    const formData = {
      stno: resultData.header_data.stno,        
      esn: resultData.header_data.esn,         
      engmodel: resultData.header_data.engmodel,
      engtype: resultData.header_data.type,      
      currentTimeStamp: currentTimeStamp,
      userId: userId,
      userName: username,
      crankCaseNo: crankCaseNo ? crankCaseNo.trim() : '', // Use empty string if null
      fipNo: fipNo ? fipNo.trim() : '',                   // Use empty string if null
      turboNo: turboNo ? turboNo.trim() : '',             // Use empty string if null
      remark: remark ? remark.trim() : '',                // Use empty string if null
      bom: bom,
      status: true,
      holdRemark: resultData.header_data?.hold_remark ? resultData.header_data.hold_remark.trim() : '',
      holdStatus: resultData.header_data?.hold_status || false,
      holdCrankcaseNo: crankCaseNo ? crankCaseNo.trim() : '',
      holdFipNo: resultData.header_data?.fip_no ? resultData.header_data.fip_no.trim() : '',
      holdTurboNo: resultData.header_data?.turbo_no ? resultData.header_data.turbo_no.trim() : '',
    };
    console.log('Form data:', formData);

    if (!formData.crankCaseNo || !formData.fipNo || !formData.turboNo || !formData.remark) {
      alert('All fields must be filled out before submitting.');
      setIsSubmitting(false);
      return;
    }

    const confirmation = window.confirm('Are you sure you want to roll down?');

    if (!confirmation) {
      setIsSubmitting(false);
      return;
    }

    try {      
      const response = await axios.post(
        SUBMIT_OPS_ST10_URL,
        formData,
        {
          headers: {
            'X-CSRFToken': csrfToken
          },
          withCredentials: true
        }
      );
      if (response.data.status === 'success') {
        
        window.alert(`Roll down for ${formData.esn} successfully submitted.`); 
        window.close();
      } else {
        console.error('Error submitting roll down data:', response.data.message);
        window.alert('Roll down submission aborted, please check for errors.'); 
        window.close();
      }
    } catch (error) {
      console.error('Error submitting roll down data:', error);
      window.alert('Issue from server, please check for debug file.'); 
      window.close();
    } finally {
      setIsSubmitting(false);
    }
};


const handleHoldClick = async () => {
  if (isSubmitting ) return;
  setIsSubmitting(true);

  const csrfToken = sessionStorage.getItem('csrfToken');

  const formData = {
    stno: resultData.header_data.stno,        
    esn: resultData.header_data.esn,         
    engmodel: resultData.header_data.engmodel,
    engtype: resultData.header_data.type,      
    currentTimeStamp: currentTimeStamp,
    userId: userId,
    userName: username,
    crankCaseNo: crankCaseNo ? crankCaseNo.trim() : '',
    fipNo: fipNo ? fipNo.trim() : '',
    turboNo: turboNo ? turboNo.trim() : '',
    remark: remark ? remark.trim() : '',
    bom: bom,
    status: false,
    holdRemark: holdRemark ? holdRemark.trim() : '',
    holdStatus: holdStatus || false,
    holdCrankcaseNo: crankCaseNo ? crankCaseNo.trim() : '',
    holdFipNo: resultData.header_data?.fip_no ? resultData.header_data.fip_no.trim() : '',
    holdTurboNo: resultData.header_data?.turbo_no ? resultData.header_data.turbo_no.trim() : '',
    
  };
  console.log('Form data:', formData);

  if (!formData.holdRemark || !formData.holdStatus ) {
    alert('All fields must be filled out before submitting.');
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await axios.post(
      HOLD_OPS_ST10_URL,
      formData,
      {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      }
    );
    if (response.data.status === 'success') {
      window.alert(`Engine ${formData.esn} on hold.`);
      window.close();
    } else {
      console.error('Error submitting hold data:', response.data.message);
      window.alert('Hold submission aborted, please check for errors.');
      window.close();
    }
  } catch (error) {
    console.error('Error submitting hold data:', error);
    window.alert('Issue from server, please check for debug file.');
    window.close();
  } finally {
    setIsSubmitting(false);
  }
};


const handleHoldStatusChange = (event) => {
  const isChecked = event.target.checked;
  setHoldStatus(isChecked);
}

if (!resultData) {
  return <div className="container2">Loading...</div>;
}

  return (
    <div className="container2">
      <div className="row justify-content-center align-items-center">
        <div className="col-2 greaves"> GREAVES </div>
        <div className="col-8">
          <h2 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
            Assembly Engine Roll Down Operation
          </h2>
        </div>
        <div className="col-2 ieb"> Industrial Engine Unit </div>
      </div>

      <div className="row justify-content-center mt-3">
        <button className="btn btn-primary">Operation Done</button>
      </div>

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
                      <td >{resultData.header_data?.description || 'N/A'}</td>
                      <th>Bom No</th>
                      <td >{resultData.header_data?.bom || 'N/A'}</td>
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

      {stno === '12' && (
  <div className="row justify-content-center align-items-center mt-4 mb-4">
    <div className="row mx-4">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th colSpan="6" className="text-center">Engine Hold Details</th>
            </tr>
          </thead>
          <tbody>
            {resultData ? (
              <>
                <tr>
                  <th>Hold Status</th>
                  <td>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={resultData.header_data?.hold_status === true}
                      disabled
                    />
                  </td>
                </tr>
                <tr>
                  <th>Hold Remark</th>
                  <td>{resultData.header_data?.hold_remark || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Hold Operator ID</th>
                  <td>{userId || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Hold Date and Time</th>
                  <td>{currentTimeStamp || 'N/A'}</td>
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
)}


      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="2" className="text-center">Input Assembly Engine Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Crank Case No</th>
                  <td><input type="text" className="form-control" placeholder="Enter Crank Case No" 
                  value={crankCaseNo} onChange={(e) => setCrankCaseNo(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <th>FIP No</th>
                  <td><input type="text" className="form-control" placeholder="Enter FIP No"
                  value={fipNo} onChange={(e) => setFipNo(e.target.value)}/>
                  </td>
                </tr>
                <tr>
                  <th>Turbo No</th>
                  <td><input type="text" className="form-control" placeholder="Enter Turbo No"
                  value={turboNo} onChange={(e) => setTurboNo(e.target.value)}/>
                  </td>
                </tr>
                <tr>
                  <th>Remark</th>
                  <td><input type="text" className="form-control" placeholder="Enter Remark"
                  value={remark} onChange={(e) => setRemark(e.target.value)}/>
                  </td>
                  <tr>
                </tr>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-3">
        <button className="btn btn-success" onClick={handleRollDownSubmit}>Roll Down</button>
      </div>

      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
          <table className="table table-bordered">
          <tbody>
          {isEditable && (
            <>
              <tr>
                <th>Hold Remark</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Hold Remark"
                    value={holdRemark}
                    onChange={(e) => setHoldRemark(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th>Hold Status</th>
                <td>
                  <input
                    type="checkbox"
                    checked={holdStatus}
                    onChange={handleHoldStatusChange}
                  />
                </td>
              </tr>
            </>
          )}
              </tbody>
              </table>    
          </div>
        </div>
      </div>

      {stno !== '12' && (
        <div className="row justify-content-center mt-3">
          <button className="btn btn-warning" onClick={handleHoldClick}>Hold</button>
        </div>
      )}

      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
    </div>
  );
}

export default Assemblyop;