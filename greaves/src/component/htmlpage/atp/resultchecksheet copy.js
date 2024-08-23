import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import '../../csspage/checksheetform.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { CHECKSHEET_RESULT_URL } from '../../../utils/apiUrls';
// import '../../csspage/styles.css';

const Resultchecksheet = () => {
    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(null);
    const hasFetchedData = useRef(false); // Flag to prevent double fetch
    const [userId] = useState(sessionStorage.getItem('emp_id') || '');
    const [username] = useState(sessionStorage.getItem('name') || '');
    const [role] = useState(sessionStorage.getItem('role') || '');

    const getSessionData = useCallback(() => {
        console.log('getSessionData called');
        const csrfToken = sessionStorage.getItem('csrfToken');
        const esn_r = sessionStorage.getItem('esn_r');
        const stno_r = sessionStorage.getItem('stno_r');
        return { csrfToken, esn_r, stno_r };
    }, []);

    const fetchData = useCallback(async () => {
        if (hasFetchedData.current) return; // Prevent double fetch

        console.log('fetchData called');
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
            console.error('Error:', error);
            setError('Error fetching data');
        }
    }, [getSessionData]);

    useEffect(() => {
        document.title = "Result";
        console.log('useEffect called');
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (resultData) {
            const headerData = resultData.header_data[0];
            console.log('stno:', headerData.stno);
            console.log('esn:', headerData.esn);
            console.log('engmodel:', headerData.engmodel_srno__engmodel); // Log the engmodel
        }
    }, [resultData]);

    const renderImagesInRows = () => {
        const rows = [];
        if (resultData.images) {
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
            {/* Complete result for under printable area  */}
            <div id="printableArea">
                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : resultData ? (
                    // Complete Result form 
                    <div>

                        {/* Header of result page  */}
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
                                                    <td colSpan={3}>{resultData.header_data[0].esn}</td>
                                                    <th>Station No</th>
                                                    <td>{resultData.header_data[0].stno}</td>
                                                    <th>Model</th>
                                                    <td>{resultData.header_data[0].bom_srno__model}</td>
                                                </tr>
                                                <tr>
                                                    <th>Engine Series</th>
                                                    <td>{resultData.header_data[0].bom_srno__series}</td>
                                                    <th>BOM No</th>
                                                    <td>
                                                        {resultData.header_data[0].bom_srno__bom}
                                                    </td>
                                    
                                                    <th>Operator</th>
                                                    <td>{username}</td>
                                                    <th>Operator ID</th>
                                                    <td>{userId}</td>
                                                </tr>
                                                <tr>
                                                    <th>Engine Description</th>
                                                    <td colSpan={3}>{resultData.header_data[0].bom_srno__description}</td>
                                                    <th>Status</th>
                                                    <td>Passed</td>
                                                    <th>Timestamp</th>
                                                    <td>{resultData.header_data[0].timestamp}</td>
                                                </tr>
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                        
                        {/* All checkpoint in table */}
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Seq</th>
                                        {/* <th>Checkpoint ID</th> */}
                                        <th>Checkpoint</th>
                                        {/* <th>Unit</th> */}
                                        <th>Checkpoint Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultData.checkpoint_data.map((checkpoint, index) => (
                                        <tr key={index}>
                                            <td>{checkpoint.seq_no}</td>
                                            {/* <td>{checkpoint.checkpoint__checkpoint_id}</td> */}
                                            <td>{checkpoint.checkpoint__checkpoint}</td>
                                            {/* <td>{checkpoint.checkpoint__unit}</td> */}
                                            <td>{checkpoint.checkpoint_status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
                        
                        {/* Opertaor remark of Engine Checksheet  */}
                        <div className="row justify-content-center align-items-center mt-2">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <label>Comment: {resultData.header_data[0].remark}</label>
                                </div>
                            </div>
                        </div>
                        <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
                        
                        {/* Display Imges  */}
                        <div>
                            <h4 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
                                Engine Images
                            </h4>
                            {renderImagesInRows()}
                        </div>
                    </div>
                ) : (
                    // Spinner to show loading is in process 
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
