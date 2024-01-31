import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="collapse-button" onClick={toggleCollapse}>
        {isCollapsed ? '»' : '«'}
      </div>
      {/* Add menu items and actions */}
      <div>Menu Item 1</div>
      <div>Menu Item 2</div>
    </div>
  );
};

export default Sidebar;
