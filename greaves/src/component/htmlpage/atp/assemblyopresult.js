import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';

const Assemblyopresult = () => {
  const { esn, stno } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (esn && stno) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/assemblyop/display/${esn}/${stno}/`);
          setData(response.data);
        } catch (error) {
          setError('Error fetching data');
          console.error('Error:', error);
        }
      };

      fetchData();
    } else {
      setError('Invalid parameters');
    }
  }, [esn, stno]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Assembly Operation Details</h2>

      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="thead-dark">
              <tr>
                <th colSpan="2" className="text-center">Engine Details</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <th>Crank Case No</th>
                    <td>{item.crankcase_no || 'N/A'}</td>
                    <th>FIP No</th>
                    <td>{item.fip_no || 'N/A'}</td>
                    <th>Turbo No</th>
                    <td>{item.turbo_no || 'N/A'}</td>
                    <th>Remark</th>
                    <td>{item.remark || 'N/A'}</td>
                    <th>Operator ID</th>
                    <td>{item.operator_id || 'N/A'}</td>
                    <th>Time Stamp</th>
                    <td>{item.time_stamp ? new Date(item.time_stamp).toLocaleString() : 'N/A'}</td>
                    <th>BOM</th>
                    <td>{item.bom || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">Loading...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Assemblyopresult;
