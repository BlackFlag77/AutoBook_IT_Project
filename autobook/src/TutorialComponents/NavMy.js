import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/TutorialStyles/NavMy.css';


function NavMy() {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/mainhome" className="nav-link">
            <h1 className="nav-title">Home</h1>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/addtutorial" className="nav-link">
            <h1 className="nav-title">Add Tutorial</h1>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavMy;
