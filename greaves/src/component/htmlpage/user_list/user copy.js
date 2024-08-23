import React, { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import { DATABASE_USER_URL, USER_NEW_ENTRY_URL, USER_DATA_DELETE_URL, USER_DATA_EDIT_URL } from '../../../utils/apiUrls';
import { BsPencilSquare, BsTrash } from 'react-icons/bs'; // Import edit and delete icons from Bootstrap

const User = () => {
  const [dropdownValue, setDropdownValue] = useState('user_list');
  const [tableData, setTableData] = useState(null); // State to store the table data
  const [formData, setFormData] = useState({}); // State to store form data for creating/editing

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const fetchData = () => {
    axios.get(DATABASE_USER_URL, {
      params: { dropdownValue },
      withCredentials: true
    })
      .then(response => {
        if (response.data.status === 'success') {
          setTableData(response.data.table_data);
        } else {
          window.alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error retrieving data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [dropdownValue]);

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

  const handleNewEntry = () => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }

      axios.get(USER_NEW_ENTRY_URL, {
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
            const queryParams = new URLSearchParams({
              csrfToken: csrfToken,
              dropdownValue: dropdownValue,
              responseData: JSON.stringify(response.data) // Include response data as a query parameter
            }).toString();

            // Open the form in a new tab with the URL containing query parameters
            window.open(`/user_newentry?${queryParams}`, '_blank');
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

  const handleEdit = (rowData) => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }

      // Open the edit form with pre-filled data
      const queryParams = new URLSearchParams({
        csrfToken: csrfToken,
        dropdownValue: dropdownValue,
        responseData: JSON.stringify(rowData) // Include row data as a query parameter
      }).toString();

      window.open(`/user_editentry?${queryParams}`, '_blank');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = (rowData) => {
    const csrfToken = sessionStorage.getItem('csrfToken');
    if (!csrfToken) {
      console.error('CSRF token not available');
      return;
    }

    // Extract the first value of the row
    const firstValue = Object.values(rowData)[1];

    // Open an alert window stating the first value of the row
    window.alert(`Deleting row with value: ${firstValue}`);

    axios.delete(USER_NEW_ENTRY_URL, {
      data: {
        dropdownValue: dropdownValue, // Include the dropdown value in the request body
        rowData: rowData // Include the data you want to delete
      },
    }, {
      headers: {
        'X-CSRFToken': csrfToken
      },
      withCredentials: true
    })
      .then(response => {
        if (response.data.status === 'success') {
          fetchData(); // Refresh table data after deleting an entry
        } else {
          window.alert(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting entry:', error);
      });
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
                <th>Actions</th>
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
                  <td>
                    <BsPencilSquare
                      className="mr-2"
                      onClick={() => handleEdit(rowData)}
                      style={{ cursor: 'pointer' }}
                    />
                    <BsTrash
                      onClick={() => handleDelete(rowData)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
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
