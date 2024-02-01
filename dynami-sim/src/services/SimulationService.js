class SimulationService {
  constructor() {
    this.jointPositions = {};
    this.socket = new WebSocket('ws://localhost:1234'); // Adjust the URL based on your backend WebSocket server

    this.socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket');
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received positions:", data.positions);

        // Iterate over incoming data
        for (let i = 0; i < data.positions.length; i++) {
          console.log(`Joint ${i + 1} position:`, data.positions[i]);
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
