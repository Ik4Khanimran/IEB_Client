import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation hook to access URL location
import { USER_NEW_ENTRY_URL } from '../../../utils/apiUrls';

const UserEditEntry = () => {
  const [responseData, setResponseData] = useState(null);
  const [formTable, setFormTable] = useState({}); // State to store edited data
  const location = useLocation(); // Get the current location object
  const [dropdownValue, setDropdownValue] = useState(''); // State to store dropdownValue

  useEffect(() => {
    // Parse query parameters from the location search string
    const queryParams = new URLSearchParams(location.search);
    const queryData = queryParams.get('responseData');
    const dropdownValue = queryParams.get('dropdownValue'); // Retrieve dropdownValue from query parameters

    if (queryData) {
      try {
        // Decode and parse the query parameter string to get the responseData
        const decodedData = decodeURIComponent(queryData);
        const parsedData = JSON.parse(decodedData);
        setResponseData(parsedData);
        setFormTable(parsedData); // Initialize edited data with response data
        setDropdownValue(dropdownValue); // Set the dropdownValue state
        console.log(parsedData); // Log parsedData to the console
      } catch (error) {
        console.error('Error parsing query parameter:', error);
      }
    } else {
      console.error('Query parameter not found in URL');
    }
  }, [location.search]); // Trigger effect when location.search changes

  // Handle changes to the input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormTable(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle save button click
  const handleSave = () => {
    // Include dropdown value as a separate dataset in the data to be submitted
    const dataToSubmit = {
      formData: formTable,
      tableName: {
        dropdown: dropdownValue,
      },
    };

    // Send the updated data to the server
    axios.put(USER_NEW_ENTRY_URL, dataToSubmit)
      .then(response => {
        // Handle response
        console.log('Data updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
    console.log('Updated data:', dataToSubmit);
  };

  return (
    <div className="container">
      <h2>Edit User Entry {dropdownValue}</h2>
      {responseData && (
        <div>
          {/* Render the form with editable input fields */}
          <form>
            {Object.entries(responseData).map(([key, value]) => (
              <div key={key} className="mb-3">
                <label htmlFor={key} className="form-label">{key}</label>
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  name={key}
                  value={formTable[key] || ''}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserEditEntry;
