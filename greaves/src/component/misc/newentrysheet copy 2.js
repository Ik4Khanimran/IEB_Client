import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

import { SAVE_ENTRY_URL } from '../../utils/apiUrls';

const NewEntrySheet = () => {
  const [dropdownValue, setDropdownValue] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [formFields, setFormFields] = useState(null);
  const [tablename, setTableName] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve query parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const dropdownValue = urlParams.get('dropdownValue');
    const responseData = urlParams.get('responseData');

    // Set the retrieved data to state variables
    setDropdownValue(dropdownValue);
    setResponseData(responseData);

    // Parse response data and set form fields if available
    if (responseData) {
      try {
        const parsedResponse = JSON.parse(responseData);
        if (parsedResponse.status === 'success') {
          setFormFields(parsedResponse.fields);
          setTableName(parsedResponse.table_name);
        } else {
          console.error('Error in response:', parsedResponse);
        }
      } catch (error) {
        console.error('Error parsing response data:', error);
      }
    } else {
      console.error('Response data not found in URL');
    }
  }, []); // Run this effect only once when the component mounts

  const tableDisplayNameMap = {
    'bom_list': 'BOM List',
    'checkpoint_list': 'Checkpoints List',
    'map_checkpoint': 'Bom to add new checkpoints'
    // Add more mappings as needed
  };

  // Get the display name for the table
  const displayName = tableDisplayNameMap[tablename] || tablename;

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      setLoading(true); // Set loading state to true before making the request

      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }

      // Collect form data
      const formData = new FormData(event.target);

      // Convert formData to JSON object
      const formDataJson = {};
      formData.forEach((value, key) => {
        formDataJson[key] = value;
      });

      // Create a separate dictionary for displayName and tablename
      const formTablename = {
        displayName: displayName,
        tablename: tablename
      };
      // Create a dictionary containing both formDataJson and displayNameAndTablename
      const combinedData = {
        formData: formDataJson,
        formTable: formTablename
      };

      const response = await axios.post(SAVE_ENTRY_URL, combinedData, { // Change 'data' to 'formDataJson'
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
      if (response.data.status === 'success') {
        window.alert('Data submitted'); // Show alert for successful submission
        // window.close(); // Close the window
      } else {
        window.alert('Error: ' + response.data.message);
        console.error('Error submitting form:', response.statusText);
        // Handle other statuses if needed
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, if needed
    } finally {
      setLoading(false); // Set loading state to false after the request is complete
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginTop: '5px' }}> You are creating new entry for {displayName} </h2>
      {/* Render Dropdown Value and Response Value */}
      {/* <p>Dropdown Value: {dropdownValue}</p>
      <p>Response Value: {responseData}</p> */}
      {/* Render form fields if available */}
      {loading ? ( // Show loading message if loading state is true
        <p>Loading form...</p>
      ) : (
        <>
          {formFields ? (
            <form className="mt-4 row" onSubmit={handleSubmit}>
              {formFields.map((field, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <label className="form-label font-weight-bold text-uppercase" style={{ fontWeight: 'bold' }}>{field.name}</label>
                  {field.help_text && <p className="form-text text-muted">{field.help_text}</p>}
                  <div>
                    {field.type === 'integer' ? (
                      <input className="form-control" type="number" name={field.name} />
                    ) : field.type === 'boolean' ? (
                      <input className="form-check-input" type="checkbox" name={field.name} />
                    ) : field.type === 'datetime' ? (
                      <input className="form-control" type="datetime-local" name={field.name} />
                    ) : field.type === 'foreignkey' ? (
                      <select className="form-select" name={field.name}>
                        <option value="">Select {field.name}</option>
                        {Object.entries(field.choices).map(([value, display], choiceIndex) => (
                          <option key={choiceIndex} value={value}>{display}</option>
                        ))}
                      </select>
                    ) : field.choices ? (
                      <select className="form-select" name={field.name}>
                        <option value="">Select {field.name}</option>
                        {Object.entries(field.choices).map(([value, display], choiceIndex) => (
                          <option key={choiceIndex} value={value}>{display}</option>
                        ))}
                      </select>
                    ) : (
                      field.type === 'text' ? (
                        <textarea
                          className="form-control"
                          name={field.name}
                          rows={field.max_length !== null ? 1 : 3}
                          maxLength={field.max_length}
                        ></textarea>
                      ) : (
                        <input
                          className="form-control"
                          type="text"
                          name={field.name}
                          maxLength={field.max_length}
                        />
                      )
                    )}
                  </div>
                </div>
              ))}
              <div className="col-12">
                <button className="btn btn-primary" type="submit">Submit</button>
              </div>
            </form>
          ) : (
            <p>No form fields available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default NewEntrySheet;
