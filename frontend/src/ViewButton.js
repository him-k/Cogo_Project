import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './ViewButton.css'; // Import your CSS file

const ViewButton = ({ to, text }) => {
  return (
    <Link to={to} className="view-button">
      {text}
    </Link>
  );
};

export default ViewButton;
