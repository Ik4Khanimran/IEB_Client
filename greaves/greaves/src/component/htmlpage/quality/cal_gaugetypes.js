// import React, { useEffect, useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { GET_CAL_AGENCY_URL } from '../../../utils/apiUrls'; // Make sure this path is correct
// import { BsPencilSquare, BsTrash } from 'react-icons/bs'; // Import edit and delete icons
// import { UPDATE_CAL_AGENCY_URL } from '../../../utils/apiUrls';

// const GaugeTypes = () => {
//   const navigate = useNavigate();

//   const [showTable, setShowTable] = useState(false);
//   const [tableData, setTableData] = useState([]);
//   const [editingAgency, setEditingAgency] = useState(null); // State to track which agency is being edited
//   const [editedData, setEditedData] = useState({}); // State for holding edited data

//   // Fetch data from the backend when the component mounts or when the table is shown
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(GET_CAL_AGENCY_URL);
//         setTableData(response.data); // Set the fetched data in state
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     if (showTable) {
//       fetchData();
//     }
//   }, [showTable]); // Fetch data when showTable state changes

//   const handleShowTable = () => {
//     setShowTable(true); // Set showTable to true to display the table
//   };

//   const handleHideTable = () => {
//     setShowTable(false);
//   };

//   const handleEdit = (agency) => {
//     setEditingAgency(agency.id); // Set the editing agency ID
//     setEditedData(agency); // Populate the editedData state with the agency's current data
//   };

//   const handleDelete = async (agencyId) => {
//     // Call the delete API endpoint
//     try {
//       await axios.delete(`http://127.0.0.1:8000/Quality/delete_cal_agency/${agencyId}/`);
//       // Refresh the table data after deletion
//       setTableData((prevData) => prevData.filter(agency => agency.id !== agencyId));
//     } catch (error) {
//       console.error('Error deleting agency:', error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSave = async (id) => {
//     try {
//       await axios.put(`${UPDATE_CAL_AGENCY_URL}/${id}/`, editedData); // Update the agency
//       setTableData((prevData) =>
//         prevData.map((agency) => (agency.id === id ? editedData : agency))
//       ); // Update the table data
//       setEditingAgency(null); // Exit editing mode
//     } catch (error) {
//       console.error('Error updating agency:', error);
//     }
//   };

//   return (
//     <div className="d-flex flex-column align-items-center mt-4">
//       {/* Dropdown and Button container */}
//       <div className="d-flex align-items-center mb-3">
//         <select className="form-select form-select-sm me-2" aria-label="Select Table" style={{ width: '150px' }}>
//           <option value="calibration">Calibration Table</option>
//           {/* Add more options as needed */}
//         </select>
//         <button className="btn btn-primary btn-sm me-2" onClick={handleShowTable}>
//           Show Table
//         </button>
//         <button className="btn btn-secondary btn-sm me-2" onClick={handleHideTable}>
//           Hide Table
//         </button>
//         <button className="btn btn-success btn-sm" onClick={() => navigate('/cal_agency_newentry')}>
//           Create New Point
//         </button>
//       </div>

//       {/* Container for the table */}
//       {showTable && (
//         <div className="border border-secondary rounded p-3" style={{ width: '90%', maxWidth: '800px', backgroundColor: '#f8f9fa' }}>
//           <table className="table table-bordered table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>Cal Agency</th>
//                 <th>Name</th>
//                 {/* <th>Address</th>
//                 <th>City</th>
//                 <th>Contact 1</th>
//                 <th>Contact 2</th>
//                 <th>Actions</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {tableData.length > 0 ? (
//                 tableData.map((agency) => (
//                   <tr key={agency.id}>
//                     {editingAgency === agency.id ? ( // Check if this agency is in edit mode
//                       <>
//                         <td>
//                           <input
//                             type="text"
//                             name="cal_agency"
//                             value={editedData.cal_agency}
//                             onChange={handleChange}
//                             className="form-control"
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="text"
//                             name="name"
//                             value={editedData.name}
//                             onChange={handleChange}
//                             className="form-control"
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="text"
//                             name="address"
//                             value={editedData.address}
//                             onChange={handleChange}
//                             className="form-control"
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="text"
//                             name="city"
//                             value={editedData.city}
//                             onChange={handleChange}
//                             className="form-control"
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="text"
//                             name="contact1"
//                             value={editedData.contact1}
//                             onChange={handleChange}
//                             className="form-control"
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="text"
//                             name="contact2"
//                             value={editedData.contact2}
//                             onChange={handleChange}
//                             className="form-control"
//                           />
//                         </td>
//                         <td>
//                           <button className="btn btn-success btn-sm" onClick={() => handleSave(agency.id)}>
//                             Save
//                           </button>
//                           <button className="btn btn-secondary btn-sm ms-2" onClick={() => setEditingAgency(null)}>
//                             Cancel
//                           </button>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>{agency.cal_agency}</td>
//                         <td>{agency.name}</td>
//                         <td>{agency.address}</td>
//                         <td>{agency.city}</td>
//                         <td>{agency.contact1}</td>
//                         <td>{agency.contact2}</td>
//                         <td>
//                           <BsPencilSquare
//                             className="text-primary mr-2"
//                             onClick={() => handleEdit(agency)}
//                             style={{ cursor: 'pointer', fontSize: '1.2rem' }}
//                           />
//                           <BsTrash
//                             onClick={() => handleDelete(agency.id)}
//                             style={{ cursor: 'pointer', fontSize: '1.2rem' }}
//                           />
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center">No data available</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GaugeTypes;
