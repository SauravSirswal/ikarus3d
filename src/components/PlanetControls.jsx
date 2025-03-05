
import React from 'react';
import { ChevronDown, Globe, Save } from 'lucide-react';

const PlanetControls = ({ 
  planetData, 
  selectedPlanet, 
  setSelectedPlanet, 
  updatePlanetProperty,
  savingStatus,
  onSaveConfiguration
}) => {
  const selectedPlanetData = planetData.find(p => p.id === selectedPlanet);
  
  // Don't show controls for the sun
  if (selectedPlanet === 'sun') {
    return (
      <div className="glass-panel p-5 max-w-xs w-full animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse-subtle"></div>
            <h2 className="text-lg font-medium">Sun</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The Sun is the center of our solar system and provides light and heat. Select a planet to customize its properties.
        </p>
      </div>
    );
  }
  
  if (!selectedPlanetData) return null;
  
  return (
    <div className="glass-panel p-5 max-w-xs w-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: selectedPlanetData.color }}
          ></div>
          <h2 className="text-lg font-medium">{selectedPlanetData.name}</h2>
        </div>
        <div className="relative">
          <button className="button-secondary p-1 py-1 px-2">
            <ChevronDown size={16} />
          </button>
          <div className="absolute top-full right-0 mt-1 w-40 glass-panel p-1 hidden">
            {planetData
              .filter(p => p.id !== 'sun')
              .map(planet => (
                <button 
                  key={planet.id}
                  className="text-left w-full px-2 py-1 rounded hover:bg-white/5 text-sm flex items-center space-x-2"
                  onClick={() => setSelectedPlanet(planet.id)}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: planet.color }}
                  ></div>
                  <span>{planet.name}</span>
                </button>
              ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="control-card">
          <label className="control-label">Planet Size</label>
          <input 
            type="range" 
            min="0.1" 
            max={selectedPlanetData.id === "jupiter" || selectedPlanetData.id === "saturn" ? "4" : "2"} 
            step="0.1" 
            value={selectedPlanetData.radius} 
            onChange={(e) => updatePlanetProperty(
              selectedPlanetData.id, 
              'radius', 
              parseFloat(e.target.value)
            )}
            className="slider-track"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Small</span>
            <span>{selectedPlanetData.radius.toFixed(1)}x</span>
            <span>Large</span>
          </div>
        </div>
        
        <div className="control-card">
          <label className="control-label">Orbit Distance</label>
          <input 
            type="range" 
            min="10" 
            max="80" 
            step="1" 
            value={selectedPlanetData.orbitDistance} 
            onChange={(e) => updatePlanetProperty(
              selectedPlanetData.id, 
              'orbitDistance', 
              parseFloat(e.target.value)
            )}
            className="slider-track"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Close</span>
            <span>{selectedPlanetData.orbitDistance} units</span>
            <span>Far</span>
          </div>
        </div>
        
        <div className="control-card">
          <label className="control-label">Orbit Speed</label>
          <input 
            type="range" 
            min="0.001" 
            max="0.03" 
            step="0.001" 
            value={selectedPlanetData.orbitSpeed} 
            onChange={(e) => updatePlanetProperty(
              selectedPlanetData.id, 
              'orbitSpeed', 
              parseFloat(e.target.value)
            )}
            className="slider-track"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>{selectedPlanetData.orbitSpeed.toFixed(3)}</span>
            <span>Fast</span>
          </div>
        </div>
        
        <div className="control-card">
          <label className="control-label">Rotation Speed</label>
          <input 
            type="range" 
            min="0.001" 
            max="0.05" 
            step="0.001" 
            value={selectedPlanetData.rotationSpeed} 
            onChange={(e) => updatePlanetProperty(
              selectedPlanetData.id, 
              'rotationSpeed', 
              parseFloat(e.target.value)
            )}
            className="slider-track"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow</span>
            <span>{selectedPlanetData.rotationSpeed.toFixed(3)}</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-4 border-t border-white/10">
        <button 
          className="button-primary w-full"
          onClick={() => onSaveConfiguration("My Custom Config")}
          disabled={savingStatus === 'saving'}
        >
          <Save size={16} />
          <span>
            {savingStatus === 'idle' && 'Save Configuration'}
            {savingStatus === 'saving' && 'Saving...'}
            {savingStatus === 'success' && 'Saved!'}
            {savingStatus === 'error' && 'Error Saving'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlanetControls;
