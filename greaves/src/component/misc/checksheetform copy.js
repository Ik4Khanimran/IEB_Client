import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../../csspage/checksheetform.css';
import { CHECKSHEET_FORM2_SUBMIT_URL } from '../../utils/apiUrls';
import axios from '../../utils/axiosConfig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import Webcam from 'react-webcam';

const OpenChecksheet = () => {
  const [checksheetData, setChecksheetData] = useState(null);
  const currentTimeStamp = new Date().toISOString();
  const [userName] = useState(sessionStorage.getItem('username') || '');
  const [userId] = useState(sessionStorage.getItem('emp_id') || '');
  const [checkpointStatus, setCheckpointStatus] = useState({});
  const [imageData, setImageData] = useState(Array.from({ length: 2 }, () => Array(2).fill('photo')));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(null);
  const webcamRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remark, setRemark] = useState('');
  let imageCounter = 1;


  useEffect(() => {
    const data = sessionStorage.getItem('checksheetData');
    if (data) {
      setChecksheetData(JSON.parse(data));
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    // Retrieve CSRF token from session storage
    const csrfToken = sessionStorage.getItem('csrfToken');
    console.log('check tokane', csrfToken)
    const allImagesTaken = imageData.every(row => row.every(image => image !== 'photo'));

    const formData = {
      stno: checksheetData.header_data.stno,
      esn: checksheetData.header_data.esn,
      bom: checksheetData.header_data.bom,
      currentTime: currentTimeStamp,
      userId: userId,
      userName: userName,
      checkpointData: [],
      images: [], // Add an array to store image data and IDs
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

    // Iterate through imageData to push images and their IDs into formData
    imageData.forEach((row, rowIndex) => {
      row.forEach((image, colIndex) => {
        const imageId = `img${header_data.esn}_${header_data.stno}_${currentTimeStamp}_${imageCounter++}`;
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
            'X-CSRFToken': csrfToken // Include CSRF token in request headers
          },
          withCredentials: true
        }
      );
      if (response.data.status === 'success') {
        const formDataSize = JSON.stringify(formData).length;
        console.log('Data successfully submitted. Form data size:', formDataSize, 'bytes');
        console.log('Server response:', response.data);
      } else {
        console.error('Error submitting data:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }

    window.close(); // Uncomment this line if you want to close the window after submission


  };

  const handleStatusChange = (checkpointId, status) => {
    setCheckpointStatus(prevStatus => ({
      ...prevStatus,
      [checkpointId]: {
        status: status,
        userId: userId,
        currentTime: currentTimeStamp,
        stno: checksheetData.header_data.stno,
        esn: checksheetData.header_data.esn
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
    <div className='container'>
      <div className="row justify-content-center align-items-center">
        <h2 align="center" style={{ padding: '0', marginTop: '5px', marginBottom: '5px' }}>
          Engine Checklist Form
        </h2>
      </div>
      <div className="row justify-content-center align-items-center">
        <p align="center" style={{ fontSize: '16px' }}>
          Checksheet form for Eng Sr No. {header_data.esn}, {header_data.bom} at
          Station No. {header_data.stno} is started at {currentTimeStamp} by {userName} (Emp Id :{userId})
        </p>
      </div>
      <div className="row mr-4 ml-4">
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Sr no</th>
                <th>ID</th>
                <th>Seq No</th>
                <th>Checkpoint</th>
                <th>Unit</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedCheckpoints.map((checkpoint, index) => (
                <tr key={checkpoint.checkpoint__checkpoint_id}>
                  <td>{index + 1}</td>
                  <td>{checkpoint.checkpoint__checkpoint_id}</td>
                  <td>{checkpoint.seq_no}</td>
                  <td>{checkpoint.checkpoint__checkpoint}</td>
                  <td>{checkpoint.checkpoint__unit}</td>
                  <td>{checkpoint.checkpoint__type}</td>
                  <td>{renderActionCell(checkpoint)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Capture Photo</h5>
                <button type="button" className="close" onClick={closeModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" width="100%" />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={capturePhoto}>
                  Capture Photo
                </button>
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
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
                  const imageId = `img${header_data.esn}_${header_data.stno}_${currentTimeStamp}_${imageCounter++}`;
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

      <div class="form-group">
        <label for="comment">Comment:</label>
        <textarea
          className="form-control"
          rows="5"
          id="remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)} // Update remark state
        ></textarea>
      </div>
      <div className="row justify-content-center">
        <button className="btn btn-primary" onClick={handleFormSubmit} disabled={isSubmitting}>Submit Checksheet</button>
      </div>
    </div>
  );
};

export default OpenChecksheet;
