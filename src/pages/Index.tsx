
import React, { useState } from 'react';
import SolarSystem from '../components/SolarSystem';
import PlanetControls from '../components/PlanetControls';
import ConfigurationPanel from '../components/ConfigurationPanel';
import { saveConfiguration } from '../utils/firebase';
import defaultPlanetData from '../utils/planetData';
import { ChevronLeft, ChevronRight, Info, Settings } from 'lucide-react';

const Index = () => {
  const [planetData, setPlanetData] = useState(defaultPlanetData);
  const [selectedPlanet, setSelectedPlanet] = useState('earth');
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [savingStatus, setSavingStatus] = useState('idle');
  
  const updatePlanetProperty = (planetId, property, value) => {
    setPlanetData(prevData => 
      prevData.map(planet => 
        planet.id === planetId 
          ? { ...planet, [property]: value } 
          : planet
      )
    );
  };
  
  const handleSaveConfiguration = async (name) => {
    setSavingStatus('saving');
    try {
      const result = await saveConfiguration(name, planetData);
      if (result.success) {
        setSavingStatus('success');
        
        // Reset status after a delay
        setTimeout(() => {
          setSavingStatus('idle');
        }, 2000);
        
        return result;
      } else {
        setSavingStatus('error');
        return { success: false };
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      setSavingStatus('error');
      return { success: false };
    }
  };
  
  const handleLoadConfiguration = (loadedPlanetData) => {
    setPlanetData(loadedPlanetData);
  };
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-space-dark relative">
      {/* Three.js Canvas */}
      <SolarSystem 
        planetData={planetData} 
        selectedPlanet={selectedPlanet}
        setSelectedPlanet={setSelectedPlanet}
      />
      
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        <div className="glass-panel px-4 py-2">
          <h1 className="text-xl font-medium">Solar System Customizer</h1>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="button-secondary"
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info size={18} />
          </button>
          <button 
            className="button-secondary"
            onClick={() => setShowControls(!showControls)}
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      {/* Controls Panel */}
      <div className={`absolute top-0 right-0 bottom-0 max-w-sm w-full p-4 transition-transform duration-500 ease-in-out flex flex-col justify-center space-y-4 ${showControls ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          className="absolute top-1/2 -left-10 transform -translate-y-1/2 button-secondary p-2 rounded-l-lg rounded-r-none"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        
        <PlanetControls 
          planetData={planetData}
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={setSelectedPlanet}
          updatePlanetProperty={updatePlanetProperty}
          savingStatus={savingStatus}
          onSaveConfiguration={() => setShowInfo(true)}
        />
        
        <ConfigurationPanel 
          onLoadConfiguration={handleLoadConfiguration}
          onSaveConfiguration={handleSaveConfiguration}
          planetData={planetData}
        />
      </div>
      
      {/* Planet Selection */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel px-2 py-2 flex space-x-1 animate-fade-in">
        {planetData
          .filter(planet => planet.id !== 'sun')
          .map(planet => (
            <button
              key={planet.id}
              className={`planet-chip ${selectedPlanet === planet.id ? 'active' : ''}`}
              onClick={() => setSelectedPlanet(planet.id)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: planet.color }}
              ></div>
              <span className="ml-1">{planet.name}</span>
            </button>
          ))}
      </div>
      
      {/* Info Modal */}
      {showInfo && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md p-6 animate-scale-in">
            <h2 className="text-xl font-medium mb-4">Save Your Solar System</h2>
            <p className="mb-6 text-muted-foreground">
              To save your custom solar system configuration, you'll need to set up Firebase first:
            </p>
            
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firebase.google.com</a></li>
              <li>Set up Firestore in your project</li>
              <li>Get your Firebase config from Project Settings</li>
              <li>Update the config in <code className="bg-secondary/50 px-2 py-1 rounded text-xs">src/utils/firebase.js</code></li>
            </ol>
            
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button 
                className="button-primary"
                onClick={() => setShowInfo(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
