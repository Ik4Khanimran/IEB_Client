import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';
import NavBar from '../common/Nav_Bar';
import Home from '../htmlpage/common/home';
import About from '../htmlpage/common/about';
import Spare from '../htmlpage/common/spare_01';
import Hmechecksheet from '../htmlpage/atp/pg_hme_checksheet';
import UpdateDB from '../htmlpage/atp/database_update';
import '../../csspage/styles.css';

const Layout = () => {
  const location = useLocation();
  const { pathname } = location;

  const pages = {
    '/home': <Home />,
    '/about': <About />,
    '/hme_checksheet': <Hmechecksheet />,
    '/spare': <Spare />,
    '/updatedatabase': <UpdateDB />,
    // Add more routes here
  };

  const activeTab = pages[pathname] ? pathname : '/home'; // Default to '/home' if the path is not recognized

  return (
    <div className="container-fluid">
      <div className="row header" style={{ textAlign: 'center' }}>
        <Header />
      </div>
      <div className="row flex-grow-1 main-content separator">
        <div className="col-lg-2 col-md-2 col-sm-2 separator_vt">
          <NavBar />
        </div>
        <div className="col-lg-10 col-md-10 col-sm-10" style={{ paddingLeft: 0 }}>
          <div className="content-wrapper" style={{ textAlign: 'center' }}>
            {pages[activeTab]}
          </div>
        </div>
      </div>
      <div className="row footer separator" style={{ textAlign: 'center' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
