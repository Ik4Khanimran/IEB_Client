import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_NEW_ENTRY_URL } from '../../../utils/apiUrls';

const UserNewEntry = () => {
  const [dropdownValue, setDropdownValue] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [formFields, setFormFields] = useState(null);
  const [tableName, setTableName] = useState(null);
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
          setTableName(parsedResponse.dropdown_value);
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
    'role_list': 'Role List',
    'control_list': 'Control List',
    'user_list': 'User List',
    'department_list': 'Department List',
    // Add more mappings as needed
  };

  // Get the display name for the table
  const displayName = tableDisplayNameMap[tableName] || tableName;

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
  
      // Check if all fields are not empty
      const allFieldsNotEmpty = Object.values(formDataJson).every(value => value !== '');
      if (!allFieldsNotEmpty) {
        window.alert('Please fill in all fields.');
        setLoading(false);
        return;
      }
  
// Validate email field if tableName is 'user_list'
if (tableName === 'user_list') {
  const email = formDataJson['email'];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    window.alert('Please enter a valid email address.');
    setLoading(false);
    return;
  }
}
  
      // Create a separate dictionary for displayName and tableName
      const formTable = {
        displayName: displayName,
        tableName: tableName
      };
  
      // Create a dictionary containing both formDataJson and formTable
      const combinedData = {
        formData: formDataJson,
        formTable: formTable
      };
  
      const response = await axios.post(USER_NEW_ENTRY_URL, combinedData, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });
  
      if (response.data.status === 'success') {
        window.alert('Data submitted'); // Show alert for successful submission
        console.log(response.data)
        // window.close;
      } else {
        window.alert('Error: ' + JSON.stringify(response.data.message));
        console.error('Error submitting form:', response.data.message);
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
      {loading ? (
        <p>Loading form...</p>
      ) : (
        <>
          {formFields && (
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
                    ) : field.type === 'foreignkey' && field.choices ? (
                      <select className="form-select" name={field.name}>
                        <option value="">Select {field.name}</option>
                        {field.choices.map((choice, choiceIndex) => (
                          <option key={choiceIndex} value={choice[Object.keys(choice)[0]]}>{choice[Object.keys(choice)[1]]}</option>
                        ))}
                      </select>
                    ) : field.type === 'email' ? (
                      <input className="form-control" type="email" name={field.name} required />
                    ) : field.type === 'password' ? (
                      <input className="form-control" type="password" name={field.name} required />
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
          )}
        </>
      )}
    </div>
  );
};

export default UserNewEntry;
