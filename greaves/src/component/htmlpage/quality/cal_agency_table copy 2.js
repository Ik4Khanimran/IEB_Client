import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  GET_CAL_AGENCY_URL, 
  GET_GAUGE_TYPE_URL, 
  UPDATE_CAL_AGENCY_URL, 
  UPDATE_GAUGE_TYPE_URL, 
  DELETE_CAL_AGENCY_URL, 
  DELETE_GAUGE_TYPE_URL,
  UPDATE_CAL_LOCATION_URL,
  DELETE_CAL_LOCATION_URL,
  GET_CAL_LOCATION_URL,
  GET_CAL_STATUS_URL,
  DELETE_CAL_STATUS_URL,
  UPDATE_CAL_STATUS_URL,
  GET_GAUGE_DATA_URL,
  DELETE_GAUGE_DATA_URL,
  UPDATE_GAUGE_DATA_URL
} from '../../../utils/apiUrls';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const ITEMS_PER_PAGE = 8; // Number of items per page

const CalEntryTable = () => {
  const navigate = useNavigate();

  const [showTable, setShowTable] = useState(false);
  const [selectedTable, setSelectedTable] = useState('calibration');
  const [tableData, setTableData] = useState({ data: [], header_names: [] });
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [currentPage, setCurrentPage] = useState(1); // Current page state

  // Fetch data based on selected table
  const fetchTableData = async (tableType) => {
    let url;
    if (tableType === 'calibration') {
      url = GET_CAL_AGENCY_URL;
    } else if (tableType === 'gauge') {
      url = GET_GAUGE_TYPE_URL;
    } else if (tableType === 'location') {
      url = GET_CAL_LOCATION_URL; // New URL for Calibration Location table
    } else if (tableType === 'status'){
      url = GET_CAL_STATUS_URL; // Handle any other cases if needed
    } else if (tableType === 'data'){
      url = GET_GAUGE_DATA_URL; // Handle any other cases if needed
    }
    
    if (url) {
      try {
        const response = await axios.get(url);
        if (response.data && Array.isArray(response.data.values) && response.data.values.length > 0) {
          setTableData({
            data: response.data.values,
            header_names: response.data.header_names,
          });
        } else {
          setTableData({ data: [], header_names: [] });
        }
      } catch (error) {
        console.error(`Error fetching ${tableType} data:`, error);
        setTableData({ data: [], header_names: [] });
      }
    }
  };

  useEffect(() => {
    if (showTable) {
      fetchTableData(selectedTable);
    }
  }, [showTable, selectedTable]);

  const handleShowTable = () => setShowTable(true);
  const handleHideTable = () => setShowTable(false);
  
  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
    setCurrentPage(1); // Reset to the first page when changing table
    setEditingEntry(null); // Reset editing state
    setEditedData({}); // Clear edited data
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry.id);
    setEditedData(entry);
  };

  const handleDelete = async (id) => {
    let url;
    if (selectedTable === 'calibration') {
      url = `${DELETE_CAL_AGENCY_URL}/${id}/`;
    } else if (selectedTable === 'gauge') {
      url = `${DELETE_GAUGE_TYPE_URL}/${id}/`;
    } else if (selectedTable === 'location') {
      url = `${DELETE_CAL_LOCATION_URL}/${id}/`; // Delete URL for Calibration Location
    } else if (selectedTable === 'status') {
      url = `${DELETE_CAL_STATUS_URL}/${id}/`; // Delete URL for Calibration Location
    } else if (selectedTable === 'data') {
      url = `${DELETE_GAUGE_DATA_URL}/${id}/`; // Delete URL for Calibration Location
    } 
    
    if (url) {
      try {
        await axios.delete(url);
        setTableData((prevData) => ({
          ...prevData,
          data: prevData.data.filter((entry) => entry.id !== id), // Correctly filter out the deleted entry
        }));
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (id) => {
    let url;
    if (selectedTable === 'calibration') {
      url = `${UPDATE_CAL_AGENCY_URL}/${id}/`;
    } else if (selectedTable === 'gauge') {
      url = `${UPDATE_GAUGE_TYPE_URL}/${id}/`;
    } else if (selectedTable === 'location') {
      url = `${UPDATE_CAL_LOCATION_URL}/${id}/`; // Update URL for Calibration Location
    } else if (selectedTable === 'status') {
      url = `${UPDATE_CAL_STATUS_URL}/${id}/`; // Update URL for Calibration Location
    } else if (selectedTable === 'data') {
      url = `${UPDATE_GAUGE_DATA_URL}/${id}/`; // Update URL for Calibration Location
    }
    
    if (url) {
      try {
        const response = await axios.put(url, editedData);
        if (response.status === 200) {
          setTableData((prevData) => ({
            ...prevData,
            data: prevData.data.map((entry) => (entry.id === id ? { ...entry, ...editedData } : entry)),
          }));
          setEditingEntry(null);
          setEditedData({});
        }
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditingEntry(null);
    setEditedData({});
  };

  const handleCreateNewEntry = () => {
    let createUrl;
    // Determine the URL based on the selected table
    if (selectedTable === 'calibration') {
      createUrl = '/create-new-calibration'; // Route for creating a new calibration entry
    } else if (selectedTable === 'gauge') {
      createUrl = '/create-new-gauge'; // Route for creating a new gauge entry
    } else if (selectedTable === 'location') {
      createUrl = '/create-new-location'; // Route for creating a new location entry
    } else if (selectedTable === 'status') {
      createUrl = '/create-new-status'; // Route for creating a new status entry
    } else if (selectedTable === 'data') {
      createUrl = '/create-new-data'; // Route for creating a new data entry
    }
    
    // Navigate to the determined URL
    if (createUrl) {
      navigate(createUrl);
    }
  }

  // Filter data based on the search term
  const filteredData = tableData.data.filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => setCurrentPage(page);

  // Dynamic Table Rendering
  const renderTable = () => {
    if (paginatedData.length === 0) {
      return <p>No data available.</p>;
    }

    return (
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              {tableData.header_names.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {tableData.header_names.map((header, colIndex) => (
                  <td key={colIndex}>
                    {editingEntry === row.id ? (
                      <input
                        type="text"
                        name={header}
                        value={editedData[header] || row[header]}
                        onChange={handleChange}
                      />
                    ) : (
                      row[header]
                    )}
                  </td>
                ))}
                <td>
                  {editingEntry === row.id ? (
                    <>
                      <button onClick={() => handleSave(row.id)} className="btn btn-success">
                        Save
                      </button>
                      <button onClick={handleCancel} className="btn btn-secondary">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(row)} className="btn btn-warning">
                        <BsPencilSquare />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="btn btn-danger">
                        <BsTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="pagination-controls d-flex justify-content-between align-items-center mt-3">
          <div>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          <div>
            <button 
              className="btn btn-light" 
              onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="mx-2">{currentPage}</span>
            <button 
              className="btn btn-light" 
              onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} 
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Calibration Entry Table</h2>
      <div className="mb-3">
        <label htmlFor="table-select" className="form-label">Select Table</label>
        <select id="table-select" className="form-select" onChange={handleTableChange}>
          <option value="calibration">Calibration Agency</option>
          <option value="gauge">Gauge Type</option>
          <option value="location">Calibration Location</option>
          <option value="status">Calibration Status</option>
          <option value="data">Gauge Data</option>
        </select>
      </div>
      <button className="btn btn-primary mb-3" onClick={handleCreateNewEntry}>
        Create New Entry
      </button>
      {showTable && (
        <>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {renderTable()}
        </>
      )}
    </div>
  );
};

export default CalEntryTable;
