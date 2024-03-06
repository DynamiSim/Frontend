class SimulationService {
  constructor() {
    this.jointPositions = {};
    this.socket = new WebSocket('ws://localhost:1235'); // Adjust the URL based on your backend WebSocket server

    this.socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket');
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        //console.log("Received positions:", data.positions);

        // Iterate over incoming data
        for (let i = 0; i < data.positions.length; i++) {
          //console.log(`Joint ${i + 1} position:`, data.positions[i]);
        }

        this.updateJointPositions(data.positions);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.socket.addEventListener('close', (event) => {
      console.log('WebSocket connection closed');
    });

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Bind the WebSocket methods to the instance
    this.startSimulation = this.startSimulation.bind(this);
    this.stopSimulation = this.stopSimulation.bind(this);
    this.resetSimulation = this.resetSimulation.bind(this);
    this.closeWebSocket = this.closeWebSocket.bind(this);
  }

  startSimulation() {
    if (this.socket) {
      console.log('Starting simulation...');
      const message = {
        "__MESSAGE__": 'start',
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket connection not initialized');
    }
  }

  stopSimulation() {
    if (this.socket) {
      console.log('Stopping simulation...');
      const message = {
        "__MESSAGE__": 'stop',
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket connection not initialized');
    }
  }

  resetSimulation() {
    if (this.socket) {
      console.log('Resetting simulation...');
      const message = {
        "__MESSAGE__": 'reset',
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket connection not initialized');
    }
  }

  closeWebSocket() {
    if(this.socket) {
      this.socket.close();
      console.log('WebSocket connection closed');
    } else {
      console.warn('Websocket connection could not be closed, because it was not initialized');
    }
  }

  updateJointPositions(positions) {
    this.jointPositions = positions;
  }

  getJointPositions() {
    return this.jointPositions;
  }
}

const simulationService = new SimulationService();

export default simulationService;
