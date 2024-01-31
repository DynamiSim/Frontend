import React, { useState, useEffect } from 'react';
import Banner from './components/Banner';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import URDFLoaderComponent from './components/URDFLoader';
import RobotRenderer from './components/RobotRenderer';
import useWebSocket from 'react-use-websocket';
import './App.css';

const WS_URL = 'ws://localhost:1234';

function App() {
  useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  });

  // Get the last loaded URDF from local storage
  const lastLoadedURDF = localStorage.getItem('lastLoadedURDF');

  // Use the last loaded URDF as the initial state
  const [openedURDF, setOpenedURDF] = useState(lastLoadedURDF);

  const handleOpenURDF = (robot) => {
    // Set the last loaded URDF to local storage
    localStorage.setItem('lastLoadedURDF', robot);

    // Update state with the loaded URDF
    setOpenedURDF(robot);
  };

  const handleStartSimulation = () => {
    // Implement simulation start logic
  };

  const handleStopSimulation = () => {
    // Implement simulation stop logic
  };


  return (
    <div className="App">
      <Banner />
      <Toolbar
        onOpenURDF={handleOpenURDF}
        onStartSimulation={handleStartSimulation}
        onStopSimulation={handleStopSimulation}
      />
      <Sidebar openedURDF={openedURDF} />
      <URDFLoaderComponent onURDFLoaded={handleOpenURDF} />
      <RobotRenderer openedURDF={openedURDF} />
    </div>
  );
}

export default App;
