import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  ADD_CAL_AGENCY_URL,
  ADD_GAUGE_TYPE_URL,
  ADD_CAL_LOCATION_URL,
  ADD_CAL_STATUS_URL,
  ADD_GAUGE_DATA_URL,
} from '../../../utils/apiUrls';

const NewEntryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedTable } = location.state || {};  // Access selectedTable from state

  const [formData, setFormData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [fieldNames, setFieldNames] = useState([]);

  useEffect(() => {
    console.log("Selected Table:", selectedTable);  // Check if selectedTable is received

    switch (selectedTable) {
      case 'calibration':
        setFieldNames([
          { name: 'cal_agency', label: 'Calibration Agency' },
          { name: 'agency_address', label: 'Agency Address' },
          { name: 'agency_contact', label: 'Agency Contact' }
        ]);
        break;
      case 'gauge':
        setFieldNames([
          { name: 'gauge_type', label: 'Gauge Type' },
          { name: 'gauge_spec', label: 'Gauge Specification' }
        ]);
        break;
      case 'location':
        setFieldNames([
          { name: 'location_name', label: 'Location Name' },
          { name: 'location_code', label: 'Location Code' }
        ]);
        break;
      case 'status':
        setFieldNames([
          { name: 'status_name', label: 'Status Name' }
        ]);
        break;
      case 'data':
        setFieldNames([
          { name: 'gauge_id', label: 'Gauge ID' },
          { name: 'gauge_value', label: 'Gauge Value' }
        ]);
        break;
      default:
        setFieldNames([]);
        break;
    }
  }, [selectedTable]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url;
    switch (selectedTable) {
      case 'calibration':
        url = ADD_CAL_AGENCY_URL;
        break;
      case 'gauge':
        url = ADD_GAUGE_TYPE_URL;
        break;
      case 'location':
        url = ADD_CAL_LOCATION_URL;
        break;
      case 'status':
        url = ADD_CAL_STATUS_URL;
        break;
      case 'data':
        url = ADD_GAUGE_DATA_URL;
        break;
      default:
        console.error('Invalid table selected');
        return;
    }

    try {
      const response = await axios.post(url, formData);
      setResponseMessage('Entry successfully added.');
      navigate(-1);  // Navigate back after successful submission
    } catch (error) {
      console.error('Error adding new entry:', error);
      setResponseMessage('Failed to add the entry.');
    }
  };

  return (
    <div className="container mt-3">
      <h3>Create New Entry for {selectedTable}</h3>
      <form onSubmit={handleSubmit}>
        {fieldNames.map((field, index) => (
          <div className="mb-3" key={index}>
            <label className="form-label">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Submit</button>
        {responseMessage && <p>{responseMessage}</p>}
      </form>
    </div>
  );
};

export default NewEntryForm;
