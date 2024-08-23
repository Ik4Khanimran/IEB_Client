import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation hook to access URL location
import { USER_NEW_ENTRY_URL } from '../../../utils/apiUrls';

const UserEditEntry = () => {
  const [responseData, setResponseData] = useState(null);
  const location = useLocation(); // Get the current location object
  
  useEffect(() => {
    // Parse query parameters from the location search string
    const queryParams = new URLSearchParams(location.search);
    const queryData = queryParams.get('responseData');

    if (queryData) {
      try {
        // Decode and parse the query parameter string to get the responseData
        const decodedData = decodeURIComponent(queryData);
        const parsedData = JSON.parse(decodedData);
        setResponseData(parsedData);
        console.log(decodedData)
      } catch (error) {
        console.error('Error parsing query parameter:', error);
      }
    } else {
      console.error('Query parameter not found in URL');
    }
  }, [location.search]); // Trigger effect when location.search changes

  return (
    <div className="container">
      <h2>Edit User Entry</h2>
      {responseData && (
        <div>
          {/* Render the selected row's data */}
          <table className="table">
            <thead>
              <tr>
                {/* Render table headers */}
                {Object.keys(responseData).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Render the selected row */}
              <tr>
                {Object.values(responseData).map((value, index) => (
                  <td key={index}>
                    {/* Render boolean values as strings */}
                    {typeof value === 'boolean' ? value.toString() : value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserEditEntry;
