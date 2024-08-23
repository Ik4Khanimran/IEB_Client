import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../csspage/VerticalNavBar.css'; // Create and import a CSS file for custom styles

const NavBar = ({ activeTab }) => {
  return (
    <div className="container-fluid">
      <Navbar className="flex-column vertical-navbar">
        <Container>
          <Nav className="flex-column me-auto">
            <Nav.Link as={Link} to="/logout" className={activeTab === 'logout' ? 'active' : ''}>
              Logout
            </Nav.Link>
            <Nav.Link as={Link} to="/home" className={activeTab === 'home' ? 'active' : ''}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className={activeTab === 'about' ? 'active' : ''}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/operations" className={activeTab === 'operations' ? 'active' : ''}>
              Operations
            </Nav.Link>
            <NavDropdown title="ATP" id="basic-nav-dropdown" className={activeTab === 'atp' ? 'active' : ''} drop="end">
            <NavDropdown.Item as={Link} to="/hme_checksheet" className={activeTab === 'hme_checksheet' ? 'active' : ''}>
                Checksheet
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/updatedatabase" className={activeTab === 'updatedatabase' ? 'active' : ''}>
                Database
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/spare" className={activeTab === 'spare' ? 'active' : ''}>
                Spare12
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/spare" className={activeTab === 'spare' ? 'active' : ''}>
              Spare
            </Nav.Link>
            <Nav.Link as={Link} to="/user" className={activeTab === 'user' ? 'active' : ''}>
              User
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
