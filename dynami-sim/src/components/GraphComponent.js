import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import simulationService from '../services/SimulationService';

const GraphComponent = () => {
  const [chart, setChart] = useState(null);
  const [jointPositions, setJointPositions] = useState({});
  const [timestamp, setTimestamp] = useState(0); // Counter for generating timestamps

  useEffect(() => {
    const ctx = document.getElementById('chart').getContext('2d');

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Time labels will be added dynamically
        datasets: [],
      },
      options: {
        animation: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Time',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Joint Position',
            },
          },
        },
        elements: {
          point: {
            radius: 1
          }
        }
      },
    });

    setChart(newChart);

    // Clean up
    return () => {
      newChart.destroy();
    };
  }, []);

  useEffect(() => {
    const updateGraph = () => {
      const positions = simulationService.getJointPositions();
      const timePoint = timestamp.toString(); // Convert timestamp to string for label
      
      Object.keys(positions).forEach(joint => {
        if (!jointPositions[joint]) {
          setJointPositions(prevState => ({
            ...prevState,
            [joint]: {
              labels: [],
              data: [],
              color: `rgba(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200}, 0.2)`, // Random color for each joint
            },
          }));
        }
        setJointPositions(prevState => {
          const updatedJointData = {
            labels: [...prevState[joint].labels.slice(-500), timePoint], // Keep only the last 500 timestamps
            data: [...prevState[joint].data.slice(-500), positions[joint]], // Keep only the last 500 data points
            color: prevState[joint].color,
          };
          return {
            ...prevState,
            [joint]: updatedJointData,
          };
        });
      });

      if (chart) {
        const time = Object.keys(jointPositions).reduce((acc, joint) => {
          return [...acc, ...jointPositions[joint].labels];
        }, []);

        chart.data.labels = Array.from(new Set(time)); // Deduplicate timestamps
        chart.data.datasets = Object.keys(jointPositions).map(joint => ({
          label: joint,
          data: fillMissingValues(jointPositions[joint].labels, jointPositions[joint].data, chart.data.labels),
          backgroundColor: jointPositions[joint].color,
          borderColor: jointPositions[joint].color.replace('0.2', '1'), // Solid border color
          borderWidth: 1,
        }));
        chart.update({ duration: 0 }); // Disable animation when updating the chart
      }
      setTimestamp(prevTimestamp => prevTimestamp + 1); // Increment timestamp
    };

    //simulationService.startSimulation();

    const interval = setInterval(updateGraph, 100); // Update graph every 100 milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [chart, jointPositions, timestamp]);

  // Function to fill missing values for each joint
  const fillMissingValues = (labels, data, allLabels) => {
    const filledData = [];
    allLabels.forEach(label => {
      const index = labels.indexOf(label);
      filledData.push(index !== -1 ? data[index] : null); // Fill missing values with null
    });
    return filledData;
  };

  return <canvas id="chart" style={{ height: '30vh' }} />;
};

export default GraphComponent;
