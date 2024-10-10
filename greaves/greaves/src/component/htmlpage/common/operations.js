import React, { useState } from 'react';
import axios from '../../../utils/axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../csspage/operations.css';
import { GET_ESN_DETAIL_URL, UPDATE_LOCATION_URL } from '../../../utils/apiUrls';

const Operation = () => {
  const [esn, setEsn] = useState('');
  const [userId] = useState(sessionStorage.getItem('emp_id') || '');
  const [username] = useState(sessionStorage.getItem('name') || '');
  const [role] = useState(sessionStorage.getItem('role') || '');
  const [curLocationNo, setCurLocationNo] = useState('');
  const [esn_r, setEsn_R] = useState('');  // esn recived from API
  const [bom, setBom] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');
  const [series, setSeries] = useState('');
  const [loc_name, setLoc_name] = useState('');
  const [activity, setActivity] = useState('');
  const [type, setType] = useState('');
  const [pass_loc, setPass_loc] = useState('');
  const [fail, setFail] = useState('');
  const [inspection, setInspection] = useState('');
  const [conversion, setConversion] = useState('');

  const handleGetDetail = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      const response = await axios.get(`${GET_ESN_DETAIL_URL}?esn=${esn}`, {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        const data = response.data.data;
        console.log(data.description);
        console.log(data.conversion);
        console.log(conversion);

        // Update state with received data
        setCurLocationNo(data.cur_location_no);
        setEsn_R(data.esn);
        setBom(data.bom);
        setDescription(data.description);
        setModel(data.model);
        setSeries(data.series);
        setType(data.type);
        setLoc_name(data.loc_name);
        setActivity(data.activity);
        setPass_loc(data.pass_loc);
        setFail(data.fail);
        setInspection(data.conversion);
        setConversion(data.inspection);
      } else {
        window.alert(response.data.message);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFailOperation = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const confirmationMessage = loc_name === pass_loc
    ? 'You have reached the final stage, so no next operations.'
    : 'Are you sure you want to proceed with the Next Operation?';

    const confirmed = window.confirm(confirmationMessage);
    
    if (!confirmed) {
      return;
    }

    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      const response = await axios.post(UPDATE_LOCATION_URL, {
        esn,
        loc_name, 
        fail
      },
      {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        console.log('Fail operation successful');
        await handleGetDetail(e); // Ensure handleGetDetail is awaited
      } else {
        window.alert(response.data.message);
      }

    } catch (error) {
      console.error('Error in handleFailOperation:', error);
    }
  };

  const handlePassOperation = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const confirmationMessage = loc_name === pass_loc
    ? 'You have reached the final stage, so no next operations.'
    : 'Are you sure you want to proceed with the Next Operation?';

    const confirmed = window.confirm(confirmationMessage);

    if (!confirmed) {
      return;
    }

    try {
      const csrfToken = sessionStorage.getItem('csrfToken');
      const response = await axios.post(UPDATE_LOCATION_URL, {
        esn,
        loc_name, 
        pass_loc
      },
      {
        headers: {
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      });

      if (response.data.status === 'success') {
        console.log('Pass operation successful');
        await handleGetDetail(e); // Ensure handleGetDetail is awaited
      } else {
        window.alert(response.data.message);
      }

    } catch (error) {
      console.error('Error in handlePassOperation:', error);
    }
  };

  return (
    <div>
      <h2>Perform Operations</h2>
      {/* Tag to select Esn  */}
      <div className="row mt-2">
        <div className="col-lg-3 col-md-3 col-sm-3 " >
          <input
            type="text"
            className="css-input"
            placeholder="ESN"
            name="esn"
            id="esn"
            value={esn}
            onChange={(e) => setEsn(e.target.value)}
            required
          />
        </div>  
        <div className="col-lg-3 col-md-3 col-sm-3 ">
          <button className="form-submit-button" onClick={handleGetDetail}>Get Engine Detail</button>
        </div>     
        <div className="col-lg-3 col-md-3 col-sm-3">
          <button className="form-submit-button" style={{ backgroundColor: '#00e68a',}} onClick={handlePassOperation}>Next Operation</button>
        </div>     
        <div className="col-lg-3 col-md-3 col-sm-3">
          <button className="form-submit-button" style={{ backgroundColor: '#ff8080',}} onClick={handleFailOperation}>Nok Operation</button>
        </div>        
      </div>
      {/* Engine Detail */}
      <div className="row justify-content-center align-items-center mt-4 mb-4">
        <div className="row mx-4">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th colSpan="6" className="text-center">Engine Checklist Form</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Engine Sr No</th>
                  <td>{esn_r}</td>
                  <th>Engine BOM</th>
                  <td>{bom}</td>
                  <th>Model</th>
                  <td>{model}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td colSpan="3">{description}</td>
                  <th>Engine Type</th>
                  <td>{type}</td>
                </tr>
                <tr>
                  <th>Current Operation</th>
                  <td>{loc_name}</td>
                  <th>Current Operation ID</th>
                  <td>{curLocationNo}</td>
                  <th>Current Activity</th>
                  <td>{activity}</td>
                </tr>
                <tr>
                  <th className="next-ok">Next Ok Operation</th>
                  <td colSpan="2" className="next-ok">{pass_loc}</td>
                  <th className="next-nok">Next Nok Operation</th>
                  <td colSpan="2" className="next-nok">{fail}</td>
                </tr>
                <tr>
                  <th>Inspection</th>
                  <td>{inspection}</td>
                  <th>Conversion</th>
                  <td>{conversion}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operation;
