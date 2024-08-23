
// greaves/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Add this line
import Layout from './component/htmlpage/common/master_layout';
import Home from './component/htmlpage/common/home';
import About from './component/htmlpage/common/about';
import Login from './component/htmlpage/common/login';
import Spare from './component/htmlpage/common/spare_01';
import User from './component/htmlpage/user_list/user';
import Hmechecksheet from './component/htmlpage/atp/pg_hme_checksheet'; // Import your existing component
import OpenChecksheet from './component/htmlpage/atp/checksheetform'; // Import the new component
import Resultchecksheet from './component/htmlpage/atp/resultchecksheet';
import UpdateBD from './component/htmlpage/atp/database';
import NewTabPage from './component/htmlpage/atp/NewTabPage'; // Adjust the path as needed
import NewEntrySheet from './component/htmlpage/atp/newentrysheet'; // Adjust the path as needed


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/master_layout" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route path="/master_layout" element={<Layout><Home /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/spare" element={<Layout><Spare /></Layout>} />
        <Route path="/hme_checksheet" element={<Layout><Hmechecksheet /></Layout>} />
        <Route path="/updatedatabase" element={<Layout><UpdateBD /></Layout>} />
        <Route path="/user" element={<Layout><User /></Layout>} />

        


        <Route path="/newtab" element={<NewTabPage/>} />
        <Route path="/openchecksheet" element={<OpenChecksheet />} />
        <Route path="/resultchecksheet" element={<Resultchecksheet />} />
        <Route path="/new_entrysheet" element={<NewEntrySheet />} />


        {/* <Route path="/newpage" element={<NewPage />} /> */}
        {/* <Route path="/hme_checksheet" element={<HmeChecksheet />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
