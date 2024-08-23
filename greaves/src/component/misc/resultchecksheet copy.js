import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CHECKSHEET_RESULT_URL } from '../../utils/apiUrls';

const Resultchecksheet = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { csrfToken, esn_r, stno_r } = getSessionData();

      console.log('check token', csrfToken);
      console.log('esn_r', esn_r);
      console.log('stno_r', stno_r);

      const response = await axios.post(CHECKSHEET_RESULT_URL, {
        esn_r,
        stno_r,
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
  };

  const getSessionData = () => {
    const csrfToken = sessionStorage.getItem('csrfToken');
    const esn_r = sessionStorage.getItem('esn_r');
    const stno_r = sessionStorage.getItem('stno_r');
    return { csrfToken, esn_r, stno_r };
  };

  return (
    <div className="container">
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : resultData ? (
        <div>
          <p>Status: {resultData.status}</p>
          <p>Message: {resultData.message}</p>
          <div>
            <h4>Header Data</h4>
            <pre>{JSON.stringify(resultData.header_data, null, 2)}</pre>
          </div>
          <div>
            <h4>Checkpoint Data</h4>
            <pre>{JSON.stringify(resultData.checkpoint_data, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Resultchecksheet;
