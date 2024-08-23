import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { DATABASE_CON_URL, DATA_DELETE_URL, DATA_EDIT_URL } from '../../utils/apiUrls';
import axios from '../../utils/axiosConfig';
import { Pagination } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs'; // Import edit and delete icons

const itemsPerPage = 5; // Change this according to your preference

const UpdateDB = () => {
  const [dropdownValue, setDropdownValue] = useState('checkpoint_list');
  const [radioValue, setRadioValue] = useState('Edit');
  const [tableData, setTableData] = useState(null); // State to store the table data
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [action, setAction] = useState('');

  useEffect(() => {
    // Perform action-specific logic when the action state changes
    if (action === 'Create') {
      console.log('Action1:', action);
    } else {
      console.log('Action2:', action);
    }
  }, [action]); // Watch for changes in the action state

  const handleDropdownChange = (event) => {
    setDropdownValue(event.target.value);
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFormSubmit = () => {
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      if (!csrfToken) {
        console.error('CSRF token not available');
        return;
      }

      const data = {
        dropdownValue: dropdownValue,
        radioValue: radioValue
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
            setAction(response.data.operation);
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
      data: { rowdata: rowData, dropdownValue: dropdownValue}, // Pass checkpointId in the request body
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
      data: { rowdata: rowData, dropdownValue: dropdownValue}, // Pass checkpointId in the request body
    })
      .then(response => {
        // Handle successful response
        console.log('Delete request successful:', response);
        // You can update the table or perform any other actions here
      })
      .catch(error => {
        // Handle error
        console.error('Error deleting data:', error);
      });
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
      <h4>Here you can find all Tables for Create, Update, Edit</h4>

      <div className="row mb-3">
        <div className="col-lg-2 col-md-2 col-sm-2">
          <label htmlFor="dropdown" className="form-label">Select an option:</label>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <select id="dropdown" className="form-select" value={dropdownValue} onChange={handleDropdownChange}>
            <option value="checkpoint_list">Checkpoint list</option>
            <option value="map_checkpoint">Map Checkpoint</option>
            <option value="bom_list">BOM List</option>
          </select>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <p>Select operation:</p>
        </div>

        <div className="col-lg-1 col-md-1 col-sm-1">
          <div className="form-check">
            <input
              type="radio"
              id="edit"
              name="radioOptions"
              value="Edit"
              checked={radioValue === 'Edit'}
              onChange={handleRadioChange}
              className="form-check-input"
            />
            <label htmlFor="edit" className="form-check-label">Edit</label>
          </div>
        </div>

        <div className="col-lg-1 col-md-1 col-sm-1">
          <div className="form-check">
            <input
              type="radio"
              id="create"
              name="radioOptions"
              value="Create"
              checked={radioValue === 'Create'}
              onChange={handleRadioChange}
              className="form-check-input"
            />
            <label htmlFor="create" className="form-check-label">Create</label>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <div className="form-check">
            <input
              type="radio"
              id="ShowList"
              name="radioOptions"
              value="ShowList"
              checked={radioValue === 'ShowList'}
              onChange={handleRadioChange}
              className="form-check-input"
            />
            <label htmlFor="ShowList" className="form-check-label">Show List</label>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-sm-2">
          <button className="btn btn-primary" onClick={handleFormSubmit}>Submit</button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-lg-4 col-md-4 col-sm-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="card">
          <div className="card-body">
            {/* Render the table data if available */}
            {currentItems.length > 0 && (
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    {/* Render table headers */}
                    {Object.keys(currentItems[0]).map((header, index) => (
                      <th key={index}>{header}</th>
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
                          className="mr-2"
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
