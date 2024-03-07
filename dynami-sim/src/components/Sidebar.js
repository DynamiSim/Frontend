// Sidebar.js

import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Sidebar = ({ openedURDF }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [urdfData, setUrdfData] = useState('');

  useEffect(() => {
    // Fetch the URDF content from the provided URL
    axios.get(openedURDF)
      .then((response) => {
        setUrdfData(response.data); // Assuming response.data contains the entire URDF
      })
      .catch((error) => {
        console.error('Error fetching URDF:', error);
      });
  }, [openedURDF]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="collapse-button" onClick={toggleCollapse}>
        {isCollapsed ? '»' : '«'}
      </div>
      {/* Display fetched URDF data with syntax highlighting */}
      <div className='urdf-container'>
        <SyntaxHighlighter language="xml" style={prism}>
          {urdfData}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default Sidebar;
