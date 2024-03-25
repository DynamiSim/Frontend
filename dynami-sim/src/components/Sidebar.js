// Sidebar.js

import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import GraphComponent from './GraphComponent';

const Sidebar = ({ openedURDF }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="collapse-button" onClick={toggleCollapse}>
        {isCollapsed ? '»' : '«'}
      </div>
      <div>
        <GraphComponent />
      </div>
    </div>
  );
};

export default Sidebar;
