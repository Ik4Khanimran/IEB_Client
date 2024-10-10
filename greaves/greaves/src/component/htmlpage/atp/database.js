import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { DATABASE_CON_URL, DATA_DELETE_URL, DATA_EDIT_URL, NEW_ENTRY_URL } from '../../../utils/apiUrls';
import axios from '../../../utils/axiosConfig';
import { Pagination } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs'; // Import edit and delete icons

const itemsPerPage = 10; // Change this according to your preference

const UpdateDB = () => {
  const [dropdownValue, setDropdownValue] = useState('checkpoint_list');
  const [tableData, setTableData] = useState(null); // State to store the table data
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');


  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleShowTable = () => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      console.log('token:', csrfToken);
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }

      const data = {
        dropdownValue: dropdownValue

      };

      axios.post(DATABASE_CON_URL, data, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      })
        .then(response => {
          console.log('Data sent successfully:', response.data);
          if (response.data.status === 'success') {
            setTableData(response.data.table_data);
          } else {
            window.alert(response.data.message);
          }
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredData = tableData
    ? tableData.filter(row =>
      Object.values(row).some(value => {
        if (typeof value === 'boolean') {
          return value.toString().toLowerCase() === searchQuery.toLowerCase();
        } else {
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        }
      })
    )
    : [];

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (rowData) => {
    // Delete action logic
    console.log('Edit:', rowData);
    // Make a DELETE request to the server
    axios.post(DATA_EDIT_URL, {
      data: { rowdata: rowData, dropdownValue: dropdownValue }, // Pass checkpointId in the request body
    })
      .then(response => {
        // Handle successful response
        console.log('Edied data successfully:', response);
        // You can update the table or perform any other actions here
      })
      .catch(error => {
        // Handle error
        console.error('Error editing data:', error);
      });
  };

  const handleDelete = (rowData) => {
    // Delete action logic
    console.log('Delete:', rowData);
    // Make a DELETE request to the server
    axios.post(DATA_DELETE_URL, {
      data: { rowdata: rowData, dropdownValue: dropdownValue }, // Pass checkpointId in the request body
    })
      .then(response => {
        const { status, message } = response.data; // Destructure response data
  
        // Handle successful response
        console.log('Delete request successful:', response);
  
        // Open alert window based on response status
        if (status === 'success') {
          alert(message); // Display success message
          // You can update the table or perform any other actions here
        } else {
          alert(message); // Display error message
        }
      })
      .catch(error => {
        // Handle error
        console.error('Error deleting data:', error);
      });
  };

  const handleNewEntry = () => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }
  
      const data = {
        dropdownValue: dropdownValue
      };
  
      axios.post(NEW_ENTRY_URL, data, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      })
        .then(response => {
          console.log('Data sent successfully:', response.data);
          if (response.data.status === 'success') {
            // Open the form in a new tab
            const queryParams = new URLSearchParams({
              csrfToken: csrfToken,
              dropdownValue: dropdownValue,              
              responseData: JSON.stringify(response.data) // Include response data as a query parameter
          }).toString();
          // Open the form in a new tab with the URL containing query parameters
          window.open(`/new_entrysheet?${queryParams}`, '_blank');
          } else {
            window.alert(response.data.message);
          }
        })
        .catch(error => {
          console.error('Error sending data:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const renderPaginationItems = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

    let startPage = Math.max(currentPage - halfMaxPageNumbersToShow, 1);
    let endPage = Math.min(currentPage + halfMaxPageNumbersToShow, totalPages);

    if (currentPage - halfMaxPageNumbersToShow <= 0) {
      endPage = Math.min(maxPageNumbersToShow, totalPages);
    }

    if (currentPage + halfMaxPageNumbersToShow > totalPages) {
      startPage = Math.max(totalPages - maxPageNumbersToShow + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <Pagination.Item key={1} onClick={() => paginate(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pageNumbers.push(<Pagination.Ellipsis key="startEllipsis" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<Pagination.Ellipsis key="endEllipsis" />);
      }
      pageNumbers.push(
        <Pagination.Item key={totalPages} onClick={() => paginate(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="container">

      <div className="row mb-4 align-items-center" >
        <div className="col-lg-2 col-md-2 col-sm-12 mb-2">
          <label htmlFor="dropdown" className="form-label">Select an option:</label>
        </div>

        <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
          <select id="dropdown" className="form-select" value={dropdownValue} onChange={handleDropdownChange} style={{ height: '40px', fontSize: '16px' }}>
          <label htmlFor="dropdown" className="form-label">Select an option:</label>
            <option value="checkpoint_list">Checkpoint list</option>
            <option value="map_checkpoint">Map Checkpoint</option>
            <option value="engmodel_list">Engine Model</option>
          </select>
        </div>


        <div className="col-lg-2 col-md-3 col-sm-6 mb-2">
          <button className="btn btn-primary " onClick={handleShowTable} style={{ height: '40px', width: '100%' }}>Show Table</button>
        </div>

        <div className="col-lg-2 col-md-3 col-sm-6 mb-2">
          <button className="btn btn-primary " onClick={handleNewEntry} style={{ height: '40px', width: '130%', marginRight: '10px' }}>Create New Point</button>
        </div>

        <div className="col-lg-3 col-md-4 col-sm-12 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ height: '40px', fontSize: '16px', marginLeft: '40px' }}
          />
        </div>
        
      </div>

      

      <div className="row">
        <div className="card">
          <div className="card-body">
            {/* Render the table data if available */}
            {currentItems.length > 0 && (
              <table className="table table-hover">
                <thead className="thead-dark">
                  <tr>
                    {/* Render table headers */}
                    {Object.keys(currentItems[0]).map((header, index) => (
                      <th key={index}>{header.replace(/_/g, ' ').toUpperCase()}</th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Render each row of data */}
                  {currentItems.map((rowData, index) => (
                    <tr key={index}>
                      {Object.entries(rowData).map(([key, value], index) => (
                        <td key={index}>{typeof value === 'boolean' ? value.toString() : value}</td>
                      ))}

                      <td>
                        {/* Edit icon */}
                        <BsPencilSquare
                          className="text-primary mr-2"
                          onClick={() => handleEdit(rowData)}
                          style={{ cursor: 'pointer' }}
                        />
                        {/* Delete icon */}
                        <BsTrash
                          onClick={() => handleDelete(rowData)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <Pagination>
              <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />
              {renderPaginationItems()}
              <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDB;
