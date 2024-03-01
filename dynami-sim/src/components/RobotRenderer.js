import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LoadingManager } from 'three';
import URDFLoader from 'urdf-loader';
import simulationService from '../services/SimulationService';
import './RobotRenderer.css';

const RobotRenderer = ({ openedURDF }) => {
  const canvasRef = useRef();
  let robot;

  useEffect(() => {

    if (openedURDF) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x333333);
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasRef.current.appendChild(renderer.domElement);

      // Add grid as a background
      const gridHelper = new THREE.GridHelper(100, 10);
      scene.add(gridHelper);

      // Initialize URDF loader with custom mesh loader
      const loader = new URDFLoader(new LoadingManager());
      loader.loadMeshCb = function (path, manager, onComplete) {
        // Load mesh using appropriate loader based on file extension
        let meshLoader;
        const fileExtension = path.split('.').pop().toLowerCase();

        if (fileExtension === 'stl') {
          // Use STLLoader for .stl files
          meshLoader = new STLLoader(manager);
        } else if (fileExtension === 'dae') {
          // Use ColladaLoader for .dae files
          meshLoader = new ColladaLoader(manager);
        } else {
          console.error('Unsupported file format:', fileExtension);
          onComplete(null, new Error('Unsupported file format'));
          return;
        }

        meshLoader.load(
          path,
          result => {
            // Scale the loaded mesh appropriately
            result.scene.scale.set(1, 1, 1); // Adjust scale as needed
            onComplete(result.scene);
          },
          undefined,
          err => {
            console.error('Error loading mesh:', err);
            onComplete(null, err);
          }
        );
      };

      // Parse and load URDF with custom mesh loader
      loader.load(openedURDF, result => {
        robot = result;
        // Rotate the robot to align with the desired orientation (Y-Up to Z-Up)
        // TODO: add manual option to set if the robot is Y-Up or Z-Up.
        robot.rotation.x = -Math.PI / 2;
        scene.add(robot);
      });

      // Set up camera and lights
      camera.position.set(0, 0, 5); // Adjust camera position
      scene.add(new THREE.AmbientLight(0x404040)); // Add ambient light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5); // Adjust light position
      scene.add(directionalLight);

      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
  
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
  
        renderer.setSize(newWidth, newHeight);
      };
  
      window.addEventListener('resize', handleResize);
  
      const animate = () => {
        requestAnimationFrame(animate);
  
        // Update joint positions from the simulation service
        const jointPositions = simulationService.getJointPositions();
        if (robot && Object.keys(jointPositions).length > 0) {
          // Iterating from 1 due to Joint0 being the responsible for the base
          for(let i = 1; i < Object.keys(robot.joints).length; i++){
            robot.joints[Object.keys(robot.joints)[i]].setJointValue(jointPositions[i]);
          }
        }
        controls.update();
        renderer.render(scene, camera);
      };
  
      animate();
  
      const cleanup = () => {
        // Dispose of Three.js resources
        renderer.domElement.remove();
        renderer.dispose();
        controls.dispose();
        scene.clear();
        
        // Remove event listeners
        window.removeEventListener('resize', handleResize);
      };
  
      return cleanup;
    }
  }, [openedURDF]);

  return <div className="robot-renderer" ref={canvasRef}></div>;
};

export default RobotRenderer;
