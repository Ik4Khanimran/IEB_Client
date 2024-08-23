import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import '../../csspage/checksheetform.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CHECKSHEET_RESULT_URL } from '../../../utils/apiUrls';

const Resultchecksheet = () => {
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false); // Flag to prevent double fetch
  const [userId] = useState(sessionStorage.getItem('emp_id') || '');
  const [username] = useState(sessionStorage.getItem('name') || '');

  const getSessionData = useCallback(() => {
    const csrfToken = sessionStorage.getItem('csrfToken');
    const esn_r = sessionStorage.getItem('esn_r');
    const stno_r = sessionStorage.getItem('stno_r');
    return { csrfToken, esn_r, stno_r };
  }, []);

  const fetchData = useCallback(async () => {
    if (hasFetchedData.current) return; // Prevent double fetch

    hasFetchedData.current = true; // Set flag to true after the first call

    try {
      const { csrfToken, esn_r, stno_r } = getSessionData();
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
      setError('Error fetching data');
      console.error('Error:', error);
    }
  }, [getSessionData]);

  useEffect(() => {
    document.title = "Result";
    fetchData();
  }, [fetchData]);

  const headerData = resultData?.header_data?.[0] || {};

  const renderImagesInRows = () => {
    const rows = [];
    if (resultData?.images) {
      const totalRows = Math.ceil(resultData.images.length / 2);
      for (let i = 0; i < totalRows; i++) {
        const startIndex = i * 2;
        const endIndex = Math.min(startIndex + 2, resultData.images.length);
        const rowImages = resultData.images.slice(startIndex, endIndex);
        rows.push(
          <div className="row justify-content-center align-items-center mt-3" key={i}>
            {rowImages.map((base64Image, index) => (
              <div key={index} className="col-lg-6 col-md-6 col-sm-6 d-flex justify-content-center align-items-center">
                <img src={`data:image/jpeg;base64,${base64Image}`} alt={`Image ${index}`} className="img-fluid image-padding" />
              </div>
            ))}
            <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
          </div>
        );
      }
    }
    return rows;
  };

  const handlePrint = () => {
    const printContents = document.getElementById('printableArea').innerHTML;
    const printWindow = window.open('', '', 'height=800,width=600');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<link rel="stylesheet" type="text/css" href="styles.css" />'); // Assuming your CSS file is named styles.css
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container2">
      <div className="row justify-content-center align-items-center">
        <div className="col-lg-10 col-md-10 col-sm-10">
          <h3 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
            Engine Checklist Form
          </h3>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <button className="btn btn-primary" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
      <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
      <div id="printableArea">
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : resultData ? (
          <div>
            <div className="row justify-content-center align-items-center mt-4 mb-4">
              <div className="row mx-4">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="thead-dark">
                      <tr>
                        <th colSpan="8" className="text-center">Engine Checksheet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Engine No</th>
                        <td colSpan={3}>{headerData.esn || 'N/A'}</td>
                        <th>Station No</th>
                        <td>{headerData.stno || 'N/A'}</td>
                        <th>Model</th>
                        <td>{headerData.bom_srno__model || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Engine Series</th>
                        <td>{headerData.bom_srno__series || 'N/A'}</td>
                        <th>BOM No</th>
                        <td>{headerData.bom_srno__bom || 'N/A'}</td>
                        <th>Operator</th>
                        <td>{username || 'N/A'}</td>
                        <th>Operator ID</th>
                        <td>{userId || 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Engine Description</th>
                        <td colSpan={3}>{headerData.bom_srno__description || 'N/A'}</td>
                        <th>Status</th>
                        <td>Passed</td>
                        <th>Timestamp</th>
                        <td>{headerData.timestamp ? new Date(headerData.timestamp).toLocaleString() : 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Seq</th>
                    <th>Checkpoint</th>
                    <th>Checkpoint Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resultData.checkpoint_data?.map((checkpoint, index) => (
                    <tr key={index}>
                      <td>{checkpoint.seq_no || 'N/A'}</td>
                      <td>{checkpoint.checkpoint__checkpoint || 'N/A'}</td>
                      <td>{checkpoint.checkpoint_status || 'N/A'}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="3" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />

            <div className="row justify-content-center align-items-center mt-2">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="form-group">
                  <label>Comment: {headerData.remark || 'N/A'}</label>
                </div>
              </div>
            </div>
            <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />

            <div>
              <h4 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
                Engine Images
              </h4>
              {renderImagesInRows()}
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resultchecksheet;
