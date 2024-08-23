import React, { useState } from 'react';
import axios from '../../../utils/axiosConfig';
import { DATABASE_USER_URL } from '../../../utils/apiUrls';

const User = () => {
  const [dropdownValue, setDropdownValue] = useState('user_list');
  const [tableData, setTableData] = useState(null); // State to store the table data

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleShowTable = () => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }

      axios.get(DATABASE_USER_URL, {
        params: {
          dropdownValue: dropdownValue
        },
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      })
        .then(response => {
          console.log('Data retrieved successfully:', response.data);
          if (response.data.status === 'success') {
            setTableData(response.data.table_data);
          } else {
            window.alert(response.data.message);
          }
        })
        .catch(error => {
          console.error('Error retrieving data:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNewEntry = (event) => {
    // Implement the logic for creating a new entry
  };

  return (
    <div className="container">
      <h4>Here you can find all Tables for Create, Update, Edit</h4>
      <h2>User Page</h2>
      <p>Welcome to the User!</p>

      <div className="row mb-3">
        <div className="col-lg-2 col-md-2 col-sm-2">
          <label htmlFor="dropdown" className="form-label">Select an option:</label>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <select id="dropdown" className="form-select" value={dropdownValue} onChange={handleDropdownChange}>
            <option value="user_list">User list</option>
            <option value="department_list">Department list</option>
            <option value="role_list">Role list</option>
            <option value="control_list">Control list</option>
          </select>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <button className="btn btn-primary" onClick={handleShowTable}>Show Table</button>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <button className="btn btn-primary" onClick={handleNewEntry}>Create New Point</button>
        </div>
      </div>

      {tableData && (
        <div>
          {/* Render the table data */}
          <table className="table">
            <thead>
              <tr>
                {/* Render table headers */}
                {Object.keys(tableData[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render each row of data */}
              {tableData.map((rowData, index) => (
                <tr key={index}>
                  {Object.entries(rowData).map(([key, value], index) => (
                    <td key={index}>
                      {/* Render boolean values as strings */}
                      {typeof value === 'boolean' ? value.toString() : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


    </div>
  );
};

export default User;
