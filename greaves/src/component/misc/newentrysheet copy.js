import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { SAVE_ENTRY_URL } from '../../../utils/apiUrls';

const NewEntrySheet = () => {
  const [dropdownValue, setDropdownValue] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [formFields, setFormFields] = useState(null);
  const [tablename, setTableName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dropdownValue = urlParams.get('dropdownValue');
    const responseData = urlParams.get('responseData');

    setDropdownValue(dropdownValue);
    setResponseData(responseData);

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
  }, []);

  const tableDisplayNameMap = {
    'bom_list': 'BOM List',
    'checkpoint_list': 'Checkpoints List',
    'map_checkpoint': 'Bom to add new checkpoints'
  };

  const displayName = tableDisplayNameMap[tablename] || tablename;

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        setErrorMessage('CSRF token not available');
        setShowModal(true);
        return;
      }

      const formData = new FormData(event.target);
      const formDataJson = {};
      formData.forEach((value, key) => {
        formDataJson[key] = value;
      });

      const combinedData = {
        formData: formDataJson,
        formTable: {
          tablename: tablename
        }
      };

      const response = await axios.post(SAVE_ENTRY_URL, combinedData, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        window.alert('Data submitted');
      } else {
        setErrorMessage(response.data.message || 'An error occurred');
        setShowModal(true);
        console.error('Error submitting form:', response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred');
      setShowModal(true);
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <h2>You are creating wwwwwww a new entry for111111111 {displayName}</h2>
      {/* Render Dropdown Value and Response Value */}
      {/* <p>Dropdown Value: {dropdownValue}</p>
      <p>Response Value: {responseData}</p> */}
      {/* Render form fields if available */}
      {loading ? (
        <p>Loading form...</p>
      ) : (
        <>
          {formFields ? (
            <form className="mt-4 row" onSubmit={handleSubmit}>
              {formFields.map((field, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <label className="form-label font-weight-bold text-uppercase" style={{ fontWeight: 'bold' }}>
                    {field.name}
                  </label>
                  {field.help_text && <p className="form-text text-muted">{field.help_text}</p>}
                  <div>
                    {field.type === 'password' ? (
                      <input
                        className="form-control"
                        type="password" // Use 'password' for password field
                        name={field.name}
                        autoComplete="off" // Disable auto-completion for security
                      />
                    ) :field.type === 'email' ? (
                      <input
                        className="form-control"
                        type="email" // Use 'email' for email field
                        name={field.name}
                        required // Add 'required' attribute for validation
                      />
                    ) : field.type === 'integer' ? (
                      <input className="form-control" type="number" name={field.name} />
                    ) : field.type === 'boolean' ? (
                      <input className="form-check-input" type="checkbox" name={field.name} />
                    ) : field.type === 'datetime' ? (
                      <input className="form-control" type="datetime-local" name={field.name} />
                    ) : field.type === 'foreignkey' ? (
                      <select className="form-select" name={field.name}>
                        <option value="">Select {field.name}</option>
                        {Object.entries(field.choices).map(([display], choiceIndex) => (
                          <option key={choiceIndex} value={display}>
                            {display}
                          </option>
                        ))}
                      </select>
                    ) : field.choices ? (
                      <select className="form-select" name={field.name}>
                        <option value="">Select {field.name}</option>
                        {Object.entries(field.choices).map(([value, display], choiceIndex) => (
                          <option key={choiceIndex} value={value}>
                            {display}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'text' ? (
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
                    )}
                  </div>
                </div>
              ))}
              <div className="col-12">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
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
