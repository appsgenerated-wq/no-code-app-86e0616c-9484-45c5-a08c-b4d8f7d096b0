import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [primates, setPrimates] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const manifest = new Manifest(config.BACKEND_URL);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
        } catch (error) {
          console.log('No active session found.');
          setUser(null);
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const login = async (email, password) => {
    try {
      await manifest.login(email, password);
      const currentUser = await manifest.from('User').me();
      setUser(currentUser);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setPrimates([]);
    setDiscoveries([]);
  };

  const loadPrimates = async () => {
    try {
      const response = await manifest.from('AstroPrimate').find({ include: ['handler'] });
      setPrimates(response.data || []);
    } catch (error) {
      console.error('Failed to load primates:', error);
    }
  };

  const createPrimate = async (primateData) => {
    try {
      const newPrimate = await manifest.from('AstroPrimate').create(primateData);
      setPrimates([newPrimate, ...primates]);
    } catch (error) {
      console.error('Failed to create primate:', error);
    }
  };

  const loadDiscoveries = async () => {
    try {
      const response = await manifest.from('Discovery').find({ include: ['primate', 'scientist'] });
      setDiscoveries(response.data || []);
    } catch (error) {
      console.error('Failed to load discoveries:', error);
    }
  };

  const createDiscovery = async (discoveryData) => {
    try {
      const newDiscovery = await manifest.from('Discovery').create(discoveryData);
      const enrichedDiscovery = await manifest.from('Discovery').read(newDiscovery.id, { include: ['primate', 'scientist']});
      setDiscoveries([enrichedDiscovery, ...discoveries]);
    } catch (error) {
      console.error('Failed to create discovery:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>Initializing Lunar Mission Control...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${backendConnected ? 'text-green-400' : 'text-red-400'}`}>
                {backendConnected ? 'System Online' : 'Connection Lost'}
            </span>
        </div>

      {user ? (
        <DashboardPage
          user={user}
          primates={primates}
          discoveries={discoveries}
          onLogout={logout}
          onLoadPrimates={loadPrimates}
          onCreatePrimate={createPrimate}
          onLoadDiscoveries={loadDiscoveries}
          onCreateDiscovery={createDiscovery}
          manifest={manifest}
        />
      ) : (
        <LandingPage onLogin={login} />
      )}
    </div>
  );
}

export default App;
