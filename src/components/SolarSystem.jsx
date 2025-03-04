import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SolarSystem = ({ planetData, selectedPlanet, setSelectedPlanet }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const planetsRef = useRef({});
  const orbitsRef = useRef({});

  // Initialize the scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 30, 80);
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x050714);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 20;
    controls.maxDistance = 150;
    controlsRef.current = controls;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add stars background
    addStars(scene);
    
    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && mountRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of all geometries and materials
      Object.values(planetsRef.current).forEach(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      planetsRef.current = {};
      orbitsRef.current = {};
    };
  }, []);
  
  // Add stars to the background
  const addStars = (scene) => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(500);
      const y = THREE.MathUtils.randFloatSpread(500);
      const z = THREE.MathUtils.randFloatSpread(500);
      
      // Ensure stars are not too close to center
      if (Math.sqrt(x*x + y*y + z*z) > 100) {
        starsVertices.push(x, y, z);
      }
    }
    
    starsGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starsVertices, 3)
    );
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  };
  
  // Create or update planets based on planetData
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Create planets and orbit lines
    createSolarSystem();
    
    // Start animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Update planet positions
      updatePlanetPositions();
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Render scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup function for this effect only
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      
      // Remove all planets and orbits from scene
      if (sceneRef.current) {
        Object.values(planetsRef.current).forEach(planet => {
          sceneRef.current.remove(planet);
        });
        
        Object.values(orbitsRef.current).forEach(orbit => {
          sceneRef.current.remove(orbit);
        });
      }
      
      planetsRef.current = {};
      orbitsRef.current = {};
    };
  }, [planetData]);
  
  // Create the solar system
  const createSolarSystem = () => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    planetData.forEach((planet) => {
      // Remove existing planet if it exists
      if (planetsRef.current[planet.id]) {
        scene.remove(planetsRef.current[planet.id]);
        if (planetsRef.current[planet.id].geometry) {
          planetsRef.current[planet.id].geometry.dispose();
        }
        if (planetsRef.current[planet.id].material) {
          if (Array.isArray(planetsRef.current[planet.id].material)) {
            planetsRef.current[planet.id].material.forEach(m => m.dispose());
          } else {
            planetsRef.current[planet.id].material.dispose();
          }
        }
      }
      
      // Remove existing orbit if it exists
      if (orbitsRef.current[planet.id]) {
        scene.remove(orbitsRef.current[planet.id]);
        orbitsRef.current[planet.id].geometry.dispose();
        orbitsRef.current[planet.id].material.dispose();
      }
      
      // Create the planet
      let planetMesh;
      
      if (planet.id === "sun") {
        // Create sun with emissive material
        const sunGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
        const sunMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planet.color),
          emissive: new THREE.Color(planet.emissive),
          emissiveIntensity: planet.emissiveIntensity
        });
        
        planetMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        
        // Add point light at sun's position
        const sunLight = new THREE.PointLight(0xffffff, 1.5, 300);
        planetMesh.add(sunLight);
      } else {
        // Create regular planet
        const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(planet.color),
        });
        
        planetMesh = new THREE.Mesh(geometry, material);
        
        // Special case for Saturn: add rings
        if (planet.hasRings) {
          const ringsGeometry = new THREE.RingGeometry(
            planet.ringsInnerRadius, 
            planet.ringsOuterRadius, 
            64
          );
          
          // Create a material for the rings
          const ringsMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(planet.ringsColor),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
          });
          
          const rings = new THREE.Mesh(ringsGeometry, ringsMaterial);
          rings.rotation.x = Math.PI / 2;
          planetMesh.add(rings);
        }
        
        // Set initial position
        planetMesh.position.set(
          planet.orbitDistance, 
          0, 
          0
        );
        
        // Create orbit line
        const orbitGeometry = new THREE.RingGeometry(
          planet.orbitDistance - 0.1, 
          planet.orbitDistance + 0.1, 
          128
        );
        
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444444,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.2
        });
        
        const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitMesh.rotation.x = Math.PI / 2;
        scene.add(orbitMesh);
        
        // Store reference to orbit
        orbitsRef.current[planet.id] = orbitMesh;
      }
      
      // Add to scene and store reference
      scene.add(planetMesh);
      planetsRef.current[planet.id] = planetMesh;
    });
  };
  
  // Update planet positions in animation loop
  const updatePlanetPositions = () => {
    // Keep track of time for rotations and orbits
    const time = Date.now() * 0.001;
    
    planetData.forEach((planet) => {
      const planetMesh = planetsRef.current[planet.id];
      if (!planetMesh) return;
      
      // Rotate planet around its axis
      planetMesh.rotation.y += planet.rotationSpeed;
      
      // If not the sun, orbit around the sun
      if (planet.id !== "sun") {
        const angle = time * planet.orbitSpeed;
        planetMesh.position.x = Math.cos(angle) * planet.orbitDistance;
        planetMesh.position.z = Math.sin(angle) * planet.orbitDistance;
      }
    });
  };
  
  // Handle planet selection on click
  const handleCanvasClick = (event) => {
    if (!mountRef.current || !sceneRef.current || !cameraRef.current) return;
    
    // Calculate mouse position in normalized device coordinates
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Set up raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x, y }, cameraRef.current);
    
    // Get array of all planet meshes
    const planetMeshes = Object.values(planetsRef.current);
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(planetMeshes);
    
    if (intersects.length > 0) {
      // Find which planet was clicked
      const clickedPlanet = planetData.find(planet => 
        planetsRef.current[planet.id] === intersects[0].object
      );
      
      if (clickedPlanet) {
        setSelectedPlanet(clickedPlanet.id);
      }
    }
  };
  
  // Add click event listener
  useEffect(() => {
    const canvasElement = mountRef.current?.querySelector('canvas');
    if (canvasElement) {
      canvasElement.addEventListener('click', handleCanvasClick);
      
      return () => {
        canvasElement.removeEventListener('click', handleCanvasClick);
      };
    }
  }, [planetData, setSelectedPlanet]);
  
  // Focus camera on selected planet
  useEffect(() => {
    if (selectedPlanet && cameraRef.current && controlsRef.current) {
      const planet = planetsRef.current[selectedPlanet];
      if (planet) {
        // Get planet's current position
        const position = new THREE.Vector3();
        planet.getWorldPosition(position);
        
        // Animate camera to position
        const targetPosition = new THREE.Vector3(
          position.x, 
          position.y + 5, 
          position.z + 15
        );
        
        // Set controls target to planet position
        controlsRef.current.target.copy(position);
      }
    }
  }, [selectedPlanet]);
  
  return <div ref={mountRef} className="canvas-container" />;
};

export default SolarSystem;
