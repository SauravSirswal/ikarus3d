
import React, { useState, useEffect } from 'react';
import { getAllConfigurations, getConfigurationById } from '../utils/firebase';
import { ChevronDown, ChevronUp, Folder, RefreshCw, Save } from 'lucide-react';

const ConfigurationPanel = ({ 
  onLoadConfiguration, 
  onSaveConfiguration,
  planetData 
}) => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [savingStatus, setSavingStatus] = useState('idle');
  
  // Fetch all saved configurations on mount
  useEffect(() => {
    fetchConfigurations();
  }, []);
  
  const fetchConfigurations = async () => {
    setLoading(true);
    try {
      const result = await getAllConfigurations();
      if (result.success) {
        setConfigurations(result.configurations);
      } else {
        console.error("Failed to fetch configurations:", result.error);
      }
    } catch (error) {
      console.error("Error fetching configurations:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadConfiguration = async (id) => {
    setLoading(true);
    try {
      const result = await getConfigurationById(id);
      if (result.success) {
        onLoadConfiguration(result.configuration.planetData);
      } else {
        console.error("Failed to load configuration:", result.error);
      }
    } catch (error) {
      console.error("Error loading configuration:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveConfiguration = async () => {
    if (!newConfigName.trim()) {
      alert("Please enter a name for your configuration");
      return;
    }
    
    setSavingStatus('saving');
    try {
      const result = await onSaveConfiguration(newConfigName, planetData);
      if (result.success) {
        setSavingStatus('success');
        setNewConfigName('');
        fetchConfigurations();
        
        // Reset status after a delay
        setTimeout(() => {
          setSavingStatus('idle');
        }, 2000);
      } else {
        setSavingStatus('error');
      }
    } catch (error) {
      setSavingStatus('error');
      console.error("Error saving configuration:", error);
    }
  };
  
  return (
    <div className="glass-panel p-5 animate-fade-in">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <Folder size={18} />
          <h2 className="text-lg font-medium">Saved Configurations</h2>
        </div>
        <button className="text-white/80 hover:text-white">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div className="flex space-x-2">
            <input
              type="text"
              className="flex-1 bg-secondary/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Name your configuration..."
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
            />
            <button 
              className="button-primary whitespace-nowrap"
              onClick={handleSaveConfiguration}
              disabled={savingStatus === 'saving' || !newConfigName.trim()}
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex justify-center py-4">
                <RefreshCw size={20} className="animate-spin text-white/50" />
              </div>
            ) : configurations.length > 0 ? (
              configurations.map((config) => (
                <div 
                  key={config.id}
                  className="glass-panel p-3 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => handleLoadConfiguration(config.id)}
                >
                  <div>
                    <div className="text-sm font-medium">{config.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(config.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80 text-xs">
                    Load
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No saved configurations yet
              </div>
            )}
          </div>
          
          <div className="flex justify-center pt-2">
            <button 
              className="text-xs text-primary hover:text-primary/80 flex items-center space-x-1"
              onClick={fetchConfigurations}
            >
              <RefreshCw size={12} />
              <span>Refresh List</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationPanel;
