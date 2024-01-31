import React, { useState } from 'react';
import Modal from 'react-modal';
import './Toolbar.css';

const Toolbar = ({ onOpenURDF, onStartSimulation, onStopSimulation }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState('');

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLoadURDF = () => {
    onOpenURDF(url);
    closeModal();
  };

  return (
    <div className="toolbar">
      <button onClick={openModal}>Load URDF</button>
      <input type="file" id="urdfFileInput" accept=".urdf" style={{ display: 'none' }} />
      <button onClick={onStartSimulation}>Start</button>
      <button onClick={onStopSimulation}>Stop</button>

      {/* Modal Dialog for Opening URDF */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Load URDF"
        ariaHideApp={false} // Disable aria-hide for better accessibility
        style={{
          content: {
            width: '50%',
            height: '50%',
            margin: 'auto',
          },
        }}
      >
        <h2>Load URDF</h2>
        <label>
          Enter URDF URL:
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
        </label>
        <button onClick={handleLoadURDF}>Load</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Toolbar;
