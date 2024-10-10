import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { OPN_CHECKSHEET_REWORK_URL } from '../../../utils/apiUrls';
import { REWORK_REMARK_URL } from '../../../utils/apiUrls';
import { useLocation } from 'react-router-dom';
import '../../csspage/styles.css';

const Reworkchecksheet = () => {
    const [resultData, setResultData] = useState(null);
    const [error, setError] = useState(null);
    const hasFetchedData = useRef(false); // Flag to prevent double fetch
    const [remark, setRemark] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const esn = params.get('esn');
    const stno = params.get('stno');
    const [userId] = useState(sessionStorage.getItem('emp_id') || '');
    const [username] = useState(sessionStorage.getItem('username') || '');

    const getSessionData = useCallback(() => {
        console.log('getSessionData called');
        const csrfToken = sessionStorage.getItem('csrfToken');
        return { csrfToken, esn, stno };
    }, []); 

    const fetchData = useCallback(async () => {
        if (hasFetchedData.current) return; // Prevent double fetch

        if (!esn || !stno) {
            console.error('ESN or STNO is missing');
            return;
        }

        console.log('fetchData called');
        hasFetchedData.current = true; // Set flag to true after the first call

        try {
            const { csrfToken} = getSessionData();
            const response = await axios.post(OPN_CHECKSHEET_REWORK_URL, {
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
            console.log('engmodel:', headerData.bom_srno__model); // Log the engmodel
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
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
    
        const csrfToken = sessionStorage.getItem('csrfToken');
        const currentTimeStamp = new Date().toISOString();

        // Construct formData object
        
        const formData = {
            stno: resultData.header_data[0].stno,
            esn: resultData.header_data[0].esn,
            currentTime: currentTimeStamp,
            userId: sessionStorage.getItem('emp_id'),
            username: sessionStorage.getItem('username'),
            remark: remark,
        };
        if (!remark.trim()) {
            alert('Comment box is empty. Please input a remark.');
            setIsSubmitting(false);
            return;
        }// Confirmation dialog
        const confirmation = window.confirm('Are you sure you want to submit the form?');
        if (!confirmation) {
            setIsSubmitting(false);
            return;
        }

        // Send data to backend
        try {
            const response = await axios.post(
                REWORK_REMARK_URL,
                formData,
                {
                    headers: {
                        'X-CSRFToken': csrfToken
                    },
                    withCredentials: true
                }
            );

            if (response.data.status === 'success') {
                const formDataSize = JSON.stringify(formData).length;
                console.log('Data successfully submitted. Form data size:', formDataSize, 'bytes');
                console.log('Server response:', response.data);
                window.alert(`Result for ${formData.esn} successfully submitted.`);
                window.close();
            } else {
                console.error('Error submitting data:', response.data.message);
                window.alert('Result submission aborted. Please check for errors.');
                window.close();
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            window.alert('Issue submitting data to the server. Please check server logs.');
            window.close();
        } finally {
            setIsSubmitting(false);
        }
    };   
    

    return (
        <div className="container2">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-10 col-md-10 col-sm-10">
                    <h3 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
                        Recheck of Engine Checksheet
                    </h3>
                </div>
                <div className="col-lg-8 col-md-8 col-sm-8">
                    <button className="btn btn-primary" onClick={handleFormSubmit} disabled={isSubmitting}>Submit Checksheet</button>
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
                        <div className="row mt-2">
                            <div className="col-lg-2 col-md-2 col-sm-2">
                                <div className="form-group">
                                    <label>Engine No: {resultData.header_data[0].esn}</label>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-2">
                                <div className="form-group">
                                    <label>Station No: {resultData.header_data[0].stno}</label>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3">
                                <div className="form-group">
                                    <label>Model: {resultData.header_data[0].bom_srno__model}</label>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3">
                                <div className="form-group">
                                    <label>Description: {resultData.header_data[0].bom_srno__description}</label>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-2 mr-2 ml-2">
                            <div className="col-lg-2 col-md-2 col-sm-2">
                                <div className="form-group">
                                    <label>Result_ID: {resultData.header_data[0].result_id}</label>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-2">
                                <div className="form-group">
                                    <label>Operator: {username}</label>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-2">
                                <div className="form-group">
                                    <label>Emp ID: {userId}</label>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 col-sm-2">
                                <div className="form-group">
                                    <label>Status: Passed</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <div className="form-group">
                                    <label>Timestamp: {resultData.header_data[0].timestamp}</label>
                                </div>
                            </div>
                        </div>
                        <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
                        <div className="row justify-content-center align-items-center">
                            <h3 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
                                Checkpoint Data
                            </h3>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Seq</th>
                                        {/* <th>Checkpoint ID</th> */}
                                        <th>Checkpoint</th>
                                        <th>Checkpoint Status</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        {resultData.checkpoint_data
                                            .sort((a, b) => a.seq_no - b.seq_no) // Sort the array by seq_no in ascending order
                                            .map((checkpoint, index) => (
                                                <tr key={index}>
                                                    <td>{checkpoint.seq_no}</td>
                                                    {/* <td>{checkpoint.checkpoint__checkpoint_id}</td> */}
                                                    <td>{checkpoint.checkpoint__checkpoint}</td>
                                                    <td>{checkpoint.checkpoint_status}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                            </table>
                        </div>
                        <div className="row justify-content-center align-items-center mt-2">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <label>Operator Remark: {resultData.header_data[0].remark}</label>
                                </div>
                            </div>
                        </div>

                        <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />              
                        <div className="row justify-content-center align-items-center mt-2">
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <div className="form-group">
                                    <label>Auditor: {resultData.audit_comment[0].username}</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <div className="form-group">
                                    <label>Emp ID: {resultData.audit_comment[0].emp_id}</label>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4">
                                <div className="form-group">
                                    <label>Timestamp: {resultData.audit_comment[0].timestamp}</label>
                                </div>
                            </div>
                        </div>                        
                        <div className="row justify-content-center align-items-center mt-2">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <label>Auditor Remark: {resultData.audit_comment[0].remark}</label>
                                </div>
                            </div>
                        </div>
                        <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} /> 
                        <div className="row justify-content-center align-items-center mt-2">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="form-group">
                                    <label htmlFor="comment">Rework Operator:</label>
                                    <textarea
                                    className="form-control"
                                    rows="3"
                                    id="remark"
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)} // Update remark state
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div>
                            <hr className="hr2" style={{ padding: '0', marginTop: '10px', marginBottom: '0px' }} />
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

export default Reworkchecksheet;
