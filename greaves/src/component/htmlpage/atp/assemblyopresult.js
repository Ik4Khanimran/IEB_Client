import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation } from 'react-router-dom';
import { OPEN_OPS_ST10_URL } from '../../../utils/apiUrls';
import { GET_ASSEMBLYOP_DATA_URL } from '../../../utils/apiUrls';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Assemblyopresult = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false); // Flag to prevent double fetch
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const esn_r = params.get('esn');
  const stno_r = params.get('stno');
  const [username] = useState(sessionStorage.getItem('name') || 'Unknown User');
  const [userId] = useState(sessionStorage.getItem('emp_id') || 'Unknown ID');
  
  console.log('ESN:', esn_r);
  console.log('Station Number:', stno_r);

  const getSessionData = useCallback(() => {
    const csrfToken = sessionStorage.getItem('csrfToken');
    return { csrfToken };
  }, []);

  const fetchData = useCallback(async () => {
    if (hasFetchedData.current) return; // Prevent double fetch

    if (!esn_r || !stno_r) {
      console.error('ESN or STNO is missing');
      return;
    }

    console.log('fetchData called');
    hasFetchedData.current = true; // Set flag to true after the first call

    try {
      const { csrfToken } = getSessionData();
      const response = await axios.post(GET_ASSEMBLYOP_DATA_URL, {
        esn_r,
        stno_r,
      }, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      console.log('Response:', response);

      if (response.data.status === 'success') {
        console.log('Result Data:', response.data.data);
        setResultData(response.data.data); // Save the result data
      } else {
        console.error('Error Message:', response.data.message);
        setError(response.data.message || 'Error fetching data');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error fetching data');
    }
  }, [getSessionData, esn_r, stno_r]);

  useEffect(() => {
    document.title = "Result";
    fetchData();
  }, [fetchData]);

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
                    <td>{resultData.esn}</td>
                    <th>Model</th>
                    <td>{resultData.header_data?.engmodel || 'N/A'}</td>
                    <th>Engine Type</th>
                    <td>{resultData.header_data?.type || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td colSpan={3}>{resultData.header_data?.description || 'N/A'}</td>
                    <th>Station No</th>
                    <td>{resultData.stno_r || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{username}</td>
                    <th>Emp Id</th>
                    <td>{userId}</td>
                    <th>Date & Time</th>
                    <td>{new Date(resultData.time_stamp).toLocaleString()}</td>
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

      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="2" className="text-center">Assembly Engine Details</th>
                </tr>
              </thead>
              <tbody>
              {resultData ? (
              <>
                {/* <tr>
                  <th>ESN</th>
                  <td>{resultData.esn || 'N/A'}</td>
                </tr> */}
                <tr>
                  <th>Crank Case No</th>
                  <td>{resultData.crankcase_no || 'N/A'}</td>
                </tr>
                <tr>
                  <th>FIP No</th>
                  <td>{resultData.fip_no || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Turbo No</th>
                  <td>{resultData.turbo_no || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Remark</th>
                  <td>{resultData.remark || 'N/A'}</td>
                </tr>
                <tr>
                  <th>BOM</th>
                  <td>{resultData.bom_id || 'N/A'}</td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="2" className="text-center">Loading...</td>
              </tr>
            )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Assemblyopresult;
