
// Default data for the solar system
const planetData = [
  {
    id: "sun",
    name: "Sun",
    radius: 5,
    color: "#FDB813",
    emissive: "#FDB813",
    emissiveIntensity: 1,
    position: [0, 0, 0],
    rotationSpeed: 0.001,
    orbitSpeed: 0,
    orbitDistance: 0,
    textureUrl: null
  },
  {
    id: "mercury",
    name: "Mercury",
    radius: 0.38,
    color: "#B5B5B5",
    position: [10, 0, 0],
    rotationSpeed: 0.004,
    orbitSpeed: 0.02,
    orbitDistance: 10,
    textureUrl: null
  },
  {
    id: "venus",
    name: "Venus",
    radius: 0.95,
    color: "#E6C073",
    position: [15, 0, 0],
    rotationSpeed: 0.002,
    orbitSpeed: 0.015,
    orbitDistance: 15,
    textureUrl: null
  },
  {
    id: "earth",
    name: "Earth",
    radius: 1,
    color: "#4B77BE",
    position: [20, 0, 0],
    rotationSpeed: 0.01,
    orbitSpeed: 0.01,
    orbitDistance: 20,
    textureUrl: null
  },
  {
    id: "mars",
    name: "Mars",
    radius: 0.53,
    color: "#C1440E",
    position: [25, 0, 0],
    rotationSpeed: 0.008,
    orbitSpeed: 0.008,
    orbitDistance: 25,
    textureUrl: null
  },
  {
    id: "jupiter",
    name: "Jupiter",
    radius: 2.5,
    color: "#E3A857",
    position: [35, 0, 0],
    rotationSpeed: 0.04,
    orbitSpeed: 0.006,
    orbitDistance: 35,
    textureUrl: null
  },
  {
    id: "saturn",
    name: "Saturn",
    radius: 2.2,
    color: "#C9AB68",
    position: [45, 0, 0],
    rotationSpeed: 0.038,
    orbitSpeed: 0.005,
    orbitDistance: 45,
    textureUrl: null,
    hasRings: true,
    ringsInnerRadius: 2.7,
    ringsOuterRadius: 5,
    ringsColor: "#A59377"
  },
  {
    id: "uranus",
    name: "Uranus",
    radius: 1.8,
    color: "#75CEE5",
    position: [55, 0, 0],
    rotationSpeed: 0.03,
    orbitSpeed: 0.004,
    orbitDistance: 55,
    textureUrl: null
  },
  {
    id: "neptune",
    name: "Neptune",
    radius: 1.7,
    color: "#3D56B2",
    position: [65, 0, 0],
    rotationSpeed: 0.032,
    orbitSpeed: 0.003,
    orbitDistance: 65,
    textureUrl: null
  }
];

export default planetData;
