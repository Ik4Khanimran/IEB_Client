import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ADD_CAL_AGENCY_URL,
  ADD_GAUGE_TYPE_URL,
  ADD_CAL_LOCATION_URL,
  ADD_CAL_STATUS_URL,
  ADD_GAUGE_DATA_URL,
} from '../../../utils/apiUrls';

const NewEntryForm = ({ selectedTable }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [fieldNames, setFieldNames] = useState([]);

  // Define the field sets for each table
  useEffect(() => {
    console.log("Selected Table:", selectedTable);  // Add this to check the selectedTable value
  
    switch (selectedTable) {
      case 'calibration':
        setFieldNames([
          { name: 'cal_agency', label: 'Calibration Agency' },
          { name: 'name', label: 'Name' },
          { name: 'address', label: 'Address' },
          { name: 'city', label: 'City' },
          { name: 'contact1', label: 'Contact 1' },
          { name: 'contact2', label: 'Contact 2' },
        ]);
        break;
      case 'gauge':
        setFieldNames([
          { name: 'gauge_type', label: 'Gauge Type' },
          { name: 'id', label: 'Id' }
        ]);
        break;
      case 'location':
        setFieldNames([
          { name: 'location_name', label: 'Location Name' },
          { name: 'address', label: 'Address' },
          { name: 'contact_person1', label: 'Contact Person 1' },
          { name: 'contact_person2', label: 'Contact Person 2' },
          { name: 'contactp_mai1', label: 'Contact Person Mail 1' },
          { name: 'contactp_mail2', label: 'Contact Person Mail 2' },
        ]);
        break;
      case 'status':
        setFieldNames([
          { name: 'gauge_id', label: 'Gauge Id' },
          { name: 'cal_agency', label: 'Calibration Gency' },
          { name: 'last_cal_date', label: 'Last Cal Date' },
          { name: 'cal_certificate_no', label: 'Cal Certificate No' },
          { name: 'cal_certificate_fpath', label: 'Cal Certificate File Path' },
          { name: 'calibrated_by', label: 'Calibrated By' },
          { name: 'remark', label: 'Remark' },
          { name: 'verified_by', label: 'Verified By' },
          { name: 'approved_by', label: 'Approved By' },

        ]);
        break;
      case 'data':
        setFieldNames([
          { name: 'gauge_data', label: 'Gauge Data' },
          { name: 'calibration_date', label: 'Calibration Date' },
        ]);
        break;
      default:
        setFieldNames([]);
    }
  }, [selectedTable]);
  console.log(selectedTable)
  
  // Handle input change
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
        setResponseMessage('Error: Invalid entry type selected');
        return;
    }

    try {
      const response = await axios.post(url, formData);
      if (response.status === 201) {
        setResponseMessage('Entry added successfully');
        navigate(-1); // Go back to the previous view
      }
    } catch (error) {
      setResponseMessage('Error adding entry');
      console.error('Error adding new Entry:', error);
    }
  };

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="text-center">
          {selectedTable
            ? `Add New ${selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)} Entry`
            : 'Add New Entry'}
        </h2>

        {fieldNames.length > 0 ? (
          <form onSubmit={handleSubmit}>
            {fieldNames.map((field, index) => (
              <div className="form-group mb-3" key={index}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  type="text"
                  className="form-control"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button type="submit" className="btn btn-primary w-100 mt-2">
              Submit
            </button>
          </form>
        ) : (
          <p className="text-center">Please select a valid entry type.</p>
        )}

        {responseMessage && <div className="alert alert-info mt-3 text-center">{responseMessage}</div>}
      </div>
    </div>
  );
};

export default NewEntryForm;
