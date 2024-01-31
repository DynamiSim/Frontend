import React, { useState } from 'react';
import URDFLoader from 'urdf-loader';
import './URDFLoader.css';

const URDFLoaderComponent = ({ onURDFLoaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const urdfText = e.target.result;
      // Parse URDF and send it to the sidebar
      parseAndSendURDF(urdfText);
    };

    reader.readAsText(file);
  };

  const parseAndSendURDF = (urdfText) => {
    // Parse URDF using urdf-loader
    URDFLoader().load(urdfText, (robot) => {
      // Send the parsed URDF to the parent component
      onURDFLoaded(robot);
    });
    // TODO: Send the URDF to the backend (leave a todo here)
  };

  return (
    <div className="urdf-loader">
      <input type="file" accept=".urdf" onChange={handleFileChange} />
      {selectedFile && <div>Selected URDF: {selectedFile.name}</div>}
    </div>
  );
};

export default URDFLoaderComponent;
