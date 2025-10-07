import React from 'react';
import config from '../constants.js';
import { BeakerIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/solid';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1446776811953-b23d579a24de?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
          Project Newton: LunarMonkeys
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Tracking the groundbreaking discoveries of our primate pioneers on the lunar surface. Join the mission as a Scientist or Observer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <UserGroupIcon className="h-8 w-8 text-cyan-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Astro-Primates</h3>
                <p className="text-gray-400 text-sm">Manage and monitor our elite team of primate astronauts.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <BeakerIcon className="h-8 w-8 text-lime-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Discoveries</h3>
                <p className="text-gray-400 text-sm">Log and categorize all scientific findings from lunar missions.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20">
                <StarIcon className="h-8 w-8 text-yellow-400 mb-3" />
                <h3 className="font-semibold text-lg mb-2">Mission Control</h3>
                <p className="text-gray-400 text-sm">A robust admin panel for full oversight of the project.</p>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onLogin('scientist@manifest.build', 'password')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Login as Scientist
          </button>
          <button
            onClick={() => onLogin('observer@manifest.build', 'password')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Login as Observer
          </button>
          <a
            href={`${config.BACKEND_URL}/admin`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Admin Panel
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
