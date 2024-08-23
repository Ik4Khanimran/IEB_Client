import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../csspage/checksheetform.css';
import { CHECKSHEET_FORM2_SUBMIT_URL } from '../../../utils/apiUrls';
import axios from '../../../utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faLightbulb } from '@fortawesome/free-solid-svg-icons'; // Added faLightbulb for torch icon
import Webcam from 'react-webcam';

const OpenChecksheet = () => {
  const [checksheetData, setChecksheetData] = useState(null);
  const currentTimeStamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata'
  });
  const [userId] = useState(sessionStorage.getItem('emp_id') || '');
  const [username] = useState(sessionStorage.getItem('name') || '');
  const [role] = useState(sessionStorage.getItem('role') || '');
  const [checkpointStatus, setCheckpointStatus] = useState({});
  const [imageData, setImageData] = useState(Array.from({ length: 1 }, () => Array(1).fill('photo')));                                                                                                                                                        
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(null);
  const webcamRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remark, setRemark] = useState('');
  const [torchOn, setTorchOn] = useState(false); // State to track torch on/off
  const imageCounter = useRef(1);

  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const data = sessionStorage.getItem('checksheetData');
    if (data) {
      setChecksheetData(JSON.parse(data));
    }
  }, []);

  // Log header_data.stno, header_data.esn, and header_data.engmodel to console
  useEffect(() => {
    if (checksheetData && checksheetData.header_data) {
      console.log('Station No:', checksheetData.header_data.stno);
      console.log('Engine Serial No:', checksheetData.header_data.esn);
      console.log('Engine Model:', checksheetData.header_data.engmodel);
      console.log('Engine Type:', checksheetData.header_data.type);
      console.log('Activity Type:', checksheetData.header_data.activity);
    }
  }, [checksheetData]);

  // Function to toggle torch on/off
  const toggleTorch = () => {
    const track = webcamRef.current.videoStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    if (!('torch' in capabilities)) {
      alert('Torch control is not supported on this device.');
      return;
    }
    const mode = torchOn ? 'off' : 'torch';
    track.applyConstraints({
      advanced: [{ torch: mode }]
    })
      .then(() => setTorchOn(!torchOn))
      .catch((error) => console.error('Failed to set torch mode:', error));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const csrfToken = sessionStorage.getItem('csrfToken');
    console.log('check token', csrfToken);
    const allImagesTaken = imageData.every(row => row.every(image => image !== 'photo'));
    const esn = checksheetData.header_data.esn;
    const formData = {
      stno: checksheetData.header_data.stno,
      esn: checksheetData.header_data.esn,
      engmodel: checksheetData.header_data.engmodel,
      engtype: checksheetData.header_data.type,
      currentTime: currentTimeStamp,
      userId: userId,
      userName: username,
      checkpointData: [],
      images: [],
      remark: remark
    };

    sortedCheckpoints.forEach((checkpoint, index) => {
      const checkpointId = checkpoint.checkpoint__checkpoint_id;
      const checkpointId_Status = checkpointStatus[checkpointId]?.status || '';
    
      formData.checkpointData.push({ index: index + 1, checkpointId, checkpointId_Status });
    });

    if (formData.checkpointData.some(item => item.checkpointId_Status === '' || item.checkpointId_Status === false)) {
      alert('Some checkpoints have empty or false status. Please complete all checkpoints before submitting.');
      setIsSubmitting(false);
      return;
    }

    if (!allImagesTaken) {
      alert('Complete pic are not taken');
      setIsSubmitting(false);
      return;
    }

    if (!remark.trim()) {
      alert('Comment box is empty, need Input.');
      setIsSubmitting(false);
      return;
    }

    imageData.forEach((row, rowIndex) => {
      row.forEach((image, colIndex) => {
        const imageId = `img${header_data.esn}_${header_data.stno}_${currentTimeStamp}_${imageCounter.current++}`;
        formData.images.push({ imageId, image });
      });
    });

    const confirmation = window.confirm('Are you sure you want to submit the form?');

    if (!confirmation) {
      setIsSubmitting(false);
      return;
    }

    try {      
      const response = await axios.post(
        CHECKSHEET_FORM2_SUBMIT_URL,
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
        window.alert(`Result for ${esn} successfully submitted.`); // Display an info pop-up
        window.close();
      } else {
        console.error('Error submitting data:', response.data.message);
        window.alert('Result submission abborted, pls check for error.'); // Display an info pop-up
        window.close();
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      window.alert('Issue from server, pls check for dubug file.'); // Display an info pop-up
      window.close();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (checkpointId, status) => {
    setCheckpointStatus(prevStatus => ({
      ...prevStatus,
      [checkpointId]: {
        status: status,
        userId: userId,
        currentTime: currentTimeStamp,
        stno: checksheetData.header_data.stno,
        esn: checksheetData.header_data.esn,
        engmodel: checksheetData.header_data.engmodel,
        engtype: checksheetData.header_data.type
      }
    }));
  };

  const renderActionCell = (checkpoint) => {
    switch (checkpoint.checkpoint__type) {
      case 'Checkbox':
        return <input type="checkbox" onChange={(e) => handleStatusChange(checkpoint.checkpoint__checkpoint_id, e.target.checked)} />;
      case 'Textbox':
        return <input type="text" className="form-control" onChange={(e) => handleStatusChange(checkpoint.checkpoint__checkpoint_id, e.target.value)} />;
      case 'Dropdown':
        return (
          <select className="form-control" onChange={(e) => handleStatusChange(checkpoint.checkpoint__checkpoint_id, e.target.value)}>
            <option value=""> </option>
            {checkpoint.checkpoint__options.split(' / ').map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  if (!checksheetData) {
    return (
      <div className="container">
        <h2>Checksheet Data</h2>
        <p>No data available</p>
        <button className="btn btn-primary" onClick={handleFormSubmit}>Close Tab</button>
      </div>
    );
  }

  const handleImageUpload = (rowIndex, colIndex) => {
    setCurrentRow(rowIndex);
    setCurrentCol(colIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageData(prevData => {
      const newData = [...prevData];
      newData[currentRow] = [...newData[currentRow]];
      newData[currentRow][currentCol] = imageSrc;
      return newData;
    });
    closeModal();
  };

  const handleImageDelete = (rowIndex, colIndex) => {
    setImageData(prevData => {
      const newData = [...prevData];
      newData[rowIndex] = [...newData[rowIndex]];
      newData[rowIndex][colIndex] = 'photo';
      return newData;
    });
  };

  const { header_data, checkpoints } = checksheetData;
  const sortedCheckpoints = [...checkpoints].sort((a, b) => a.seq_no - b.seq_no);

  return (
    <div className='container2'>
      {/* Header of check sheet */}
      <div className="row justify-content-center align-items-center">
        <div className="col-2 greaves"> GREAVES </div>
        <div className="col-8">
          <h2 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
          Engine Checklist Form
          </h2>
        </div>
        <div className="col-2 ieb"> Industrial Engine Unit </div>
      </div>

      {/* Submit Button */}
      <div className="row justify-content-center mt-3">
        <button className="btn btn-primary" onClick={handleFormSubmit} disabled={isSubmitting}>Submit Checksheet</button>
      </div>

      {/* Header data */}
      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="6" className="text-center">Engine Checklist Form</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Engine Sr No</th>
                  <td>{header_data.esn}</td>
                  <th>Model</th>
                  <td>{header_data.engmodel}</td>
                  <th>Engine Type</th>
                  <td>{header_data.type}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{header_data.description}</td>
                  <th>Station No</th>
                  <td>{header_data.stno}</td>
                  <th>BOM No</th>
                  <td>{header_data.bom}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{username}</td>
                  <th>Emp Id</th>
                  <td>{userId}</td>
                  <th>Date & Time</th>
                  <td>{currentTimeStamp}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Checksheet points */}
      <div className="row mr-4 ml-4">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Sr no</th>
                {/* <th>ID</th>
                <th>Seq No</th> */}
                <th>Checkpoint</th>
                {/* <th>Unit</th>
                <th>Type</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedCheckpoints.map((checkpoint, index) => (
                <tr key={checkpoint.checkpoint__checkpoint_id}>
                  <td>{index + 1}</td>
                  {/* <td>{checkpoint.checkpoint__checkpoint_id}</td>
                  <td>{checkpoint.seq_no}</td> */}
                  <td>{checkpoint.checkpoint__checkpoint}</td>
                  {/* <td>{checkpoint.checkpoint__unit}</td>
                  <td>{checkpoint.checkpoint__type}</td> */}
                  <td>{renderActionCell(checkpoint)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image capturing  */}
      {isModalOpen && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg"> {/* modal-lg for large size */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Capture Photo</h5>
                <button type="button" className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  width="100%"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: 'environment' // Rear camera
                  }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={capturePhoto}>
                  Capture Photo
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button className="btn btn-info" onClick={toggleTorch}>
                  <FontAwesomeIcon icon={faLightbulb} /> {torchOn ? 'Turn Off Torch' : 'Turn On Torch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            {imageData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((image, colIndex) => {
                  const imageId = `img${header_data.esn}_${header_data.stno}_${currentTimeStamp}_${imageCounter.current++}`;
                  return (
                    <td key={`${rowIndex}-${colIndex}`} style={{ position: 'relative' }}>
                      {image !== 'photo' && (
                        <div style={{ position: 'relative' }}>
                          <img src={image} alt={`Cell ${rowIndex}-${colIndex}`} style={{ width: '100%', height: '100%' }} />
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            fontSize: '10px'
                          }}>
                            {imageId}
                          </div>
                        </div>
                      )}
                      <div>
                        <FontAwesomeIcon icon={faUpload} className="btn btn-primary" onClick={() => handleImageUpload(rowIndex, colIndex)} />
                        <FontAwesomeIcon icon={faTrash} className="btn btn-danger" onClick={() => handleImageDelete(rowIndex, colIndex)} />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Final remark points */}
      <div className="form-group">
        <label htmlFor="comment">Comment:</label>
        <textarea
          className="form-control"
          rows="5"
          id="remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)} // Update remark state
        ></textarea>
      </div>
    </div>
  );
};

export default OpenChecksheet;
