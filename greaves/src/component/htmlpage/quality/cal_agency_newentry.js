import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API requests
import { ADD_CAL_AGENCY_URL } from '../../../utils/apiUrls';

const CalAgencyNewEntry = () => {
  const navigate = useNavigate();
  const [calAgency, setCalAgency] = useState(''); // Ensure you're using calAgency here
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [responseMessage, setResponseMessage] = useState(''); // Optional for feedback

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing page on submit
    try {
      const newEntry = {
        cal_agency: calAgency, // Use calAgency instead of agency
        name,
        address,
        city,
        contact1,
        contact2,
      };

      // Use the correct API URL for the POST request
      const response = await axios.post(ADD_CAL_AGENCY_URL, newEntry);

      console.log('New entry added successfully:', response.data);
      setResponseMessage('New entry added successfully!');

      // Wait for 2 seconds before redirecting to the cal_agency_table page
      setTimeout(() => {
        navigate('/cal_agency_table');
      }, 2000); // 2000 ms = 2 seconds
    } catch (error) {
      console.error('Error submitting new entry:', error);
      setResponseMessage('Error submitting new entry.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add New Calibration Agency Entry</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="calAgency" className="form-label">Cal Agency</label>
          <input
            type="text"
            className="form-control"
            id="calAgency"
            value={calAgency} // Bind input value to calAgency state
            onChange={(e) => setCalAgency(e.target.value)} // Update state on change
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact1" className="form-label">Contact 1</label>
          <input
            type="text"
            className="form-control"
            id="contact1"
            value={contact1}
            onChange={(e) => setContact1(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact2" className="form-label">Contact 2</label>
          <input
            type="text"
            className="form-control"
            id="contact2"
            value={contact2}
            onChange={(e) => setContact2(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Entry</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>} {/* Display response message */}
    </div>
  );
};

export default CalAgencyNewEntry;
