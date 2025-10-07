import React, { useEffect, useState } from 'react';
import config from '../constants.js';
import { 
    UserCircleIcon, ArrowLeftOnRectangleIcon, PlusCircleIcon, BeakerIcon, UserGroupIcon, 
    DocumentArrowUpIcon, PhotoIcon, XMarkIcon, ChevronDownIcon 
} from '@heroicons/react/24/solid';

// Feature-Aware Components
const ChoiceSelector = ({ options, selected, onSelect, colors }) => (
    <div className="flex flex-wrap gap-2">
        {options.map(option => (
            <button type="button" key={option}
                onClick={() => onSelect(option)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${selected === option ? (colors[option] || 'bg-blue-600 text-white') : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                {option}
            </button>
        ))}
    </div>
);

const ImageUploader = ({ onFileChange, preview }) => {
    const [dragActive, setDragActive] = useState(false);
    return (
        <label onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
               onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
               onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
               onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); onFileChange(e.dataTransfer.files[0]); }}
               className={`flex justify-center items-center w-full h-32 px-4 transition bg-white dark:bg-gray-900 border-2 ${dragActive ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}>
            {preview ? <img src={preview} alt="Avatar Preview" className="h-full object-contain rounded-md" /> : (
                <span className="flex items-center space-x-2">
                    <PhotoIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">Drop an avatar, or <span className="text-blue-600 underline">browse</span></span>
                </span>
            )}
            <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={e => onFileChange(e.target.files[0])} />
        </label>
    );
};

const FileUploader = ({ onFileChange, selectedFile }) => (
    <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <DocumentArrowUpIcon className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedFile ? `${selectedFile.name}` : <><span className="font-semibold">Click to upload</span> or drag and drop</>}
                </p>
            </div>
            <input type="file" className="hidden" onChange={e => onFileChange(e.target.files[0])} />
        </label>
    </div>
);

const RelationshipPicker = ({ manifest, selectedId, onSelect, selectedItem }) => {
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (query.length > 0) {
            manifest.from('AstroPrimate').find({ filter: { name: { contains: query } } }).then(res => setOptions(res.data || []));
        } else {
            setOptions([]);
        }
    }, [query, manifest]);
    
    const handleSelect = (primate) => {
        onSelect(primate.id);
        setQuery('');
        setIsOpen(false);
    };

    if (selectedId && selectedItem) {
        return (
            <div className="flex items-center justify-between p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md text-blue-800 dark:text-blue-200">
                <span>{selectedItem.name}</span>
                <button type="button" onClick={() => onSelect(null)}><XMarkIcon className="w-5 h-5" /></button>
            </div>
        );
    }

    return (
        <div className="relative">
            <input type="text" placeholder="Search for a primate..."
                   value={query} onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
                   className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
            {isOpen && options.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {options.map(primate => (
                        <li key={primate.id} onClick={() => handleSelect(primate)} 
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">{primate.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const DashboardPage = ({ user, primates, discoveries, onLogout, onLoadPrimates, onCreatePrimate, onLoadDiscoveries, onCreateDiscovery, manifest }) => {
    // State for AstroPrimate form
    const [newPrimate, setNewPrimate] = useState({ name: '', species: 'Chimpanzee', status: 'In Training' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // State for Discovery form
    const [newDiscovery, setNewDiscovery] = useState({ title: '', description: '', importance: 'Minor', primateId: null });
    const [proofFile, setProofFile] = useState(null);

    const speciesOptions = ['Chimpanzee', 'Rhesus Macaque', 'Squirrel Monkey'];
    const statusOptions = ['In Training', 'Deployed', 'Retired'];
    const statusColors = { 'In Training': 'bg-yellow-200 text-yellow-800', Deployed: 'bg-green-200 text-green-800', Retired: 'bg-gray-200 text-gray-800' };
    const importanceOptions = ['Minor', 'Significant', 'Groundbreaking'];
    const importanceColors = { Minor: 'bg-gray-200 text-gray-800', Significant: 'bg-yellow-200 text-yellow-800', Groundbreaking: 'bg-purple-200 text-purple-800' };

    useEffect(() => {
        onLoadPrimates();
        onLoadDiscoveries();
    }, []);

    const handleAvatarChange = (file) => {
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handlePrimateSubmit = async (e) => {
        e.preventDefault();
        const primateData = { ...newPrimate, handlerId: user.id };
        if (avatarFile) {
            primateData.avatar = avatarFile;
        }
        await onCreatePrimate(primateData);
        setNewPrimate({ name: '', species: 'Chimpanzee', status: 'In Training' });
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleDiscoverySubmit = async (e) => {
        e.preventDefault();
        if (!newDiscovery.primateId) {
            alert('Please select a primate for this discovery.');
            return;
        }
        const discoveryData = { ...newDiscovery, scientistId: user.id };
        if (proofFile) {
            discoveryData.proofDocument = proofFile;
        }
        await onCreateDiscovery(discoveryData);
        setNewDiscovery({ title: '', description: '', importance: 'Minor', primateId: null });
        setProofFile(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h1 className="text-xl font-bold">Project Newton</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-2">
                        <UserCircleIcon className="w-8 h-8 text-gray-500" />
                        <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                        </div>
                    </span>
                     <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 p-2 rounded-full bg-gray-100 dark:bg-gray-800">Admin</a>
                    <button onClick={onLogout} className="text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400">
                        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AstroPrimates Section */}
                <section>
                    <div className="flex items-center space-x-2 mb-4">
                        <UserGroupIcon className="w-8 h-8 text-cyan-500"/>
                        <h2 className="text-2xl font-bold">Astro-Primates</h2>
                    </div>
                    {user.role === 'Scientist' && (
                        <form onSubmit={handlePrimateSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8 space-y-4">
                            <h3 className="text-lg font-semibold flex items-center"><PlusCircleIcon className="w-6 h-6 mr-2"/>Add New Primate</h3>
                            <input type="text" placeholder="Primate Name" value={newPrimate.name} onChange={e => setNewPrimate({...newPrimate, name: e.target.value})} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" />
                            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Species</label><ChoiceSelector options={speciesOptions} selected={newPrimate.species} onSelect={species => setNewPrimate({...newPrimate, species})} /></div>
                            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label><ChoiceSelector options={statusOptions} selected={newPrimate.status} onSelect={status => setNewPrimate({...newPrimate, status})} colors={statusColors} /></div>
                            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Avatar</label><ImageUploader onFileChange={handleAvatarChange} preview={avatarPreview} /></div>
                            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition">Create Primate</button>
                        </form>
                    )}
                    <div className="space-y-4">
                        {primates && primates.length > 0 ? primates.map(primate => (
                            <div key={primate.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md flex items-center space-x-4">
                                <img src={primate.avatar?.url || 'https://via.placeholder.com/80'} alt={primate.name} className="w-20 h-20 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-grow">
                                    <h4 className="text-lg font-bold">{primate.name}</h4>
                                    <p className="text-gray-600 dark:text-gray-400">{primate.species}</p>
                                    <p className="text-sm text-gray-500">Handler: {primate.handler?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[primate.status]}`}>{primate.status}</span>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 dark:text-gray-400">No primates deployed yet.</p>}
                    </div>
                </section>

                {/* Discoveries Section */}
                <section>
                    <div className="flex items-center space-x-2 mb-4">
                         <BeakerIcon className="w-8 h-8 text-lime-500"/>
                         <h2 className="text-2xl font-bold">Discoveries</h2>
                    </div>
                     {user.role === 'Scientist' && (
                        <form onSubmit={handleDiscoverySubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8 space-y-4">
                            <h3 className="text-lg font-semibold flex items-center"><PlusCircleIcon className="w-6 h-6 mr-2"/>Log New Discovery</h3>
                            <input type="text" placeholder="Discovery Title" value={newDiscovery.title} onChange={e => setNewDiscovery({...newDiscovery, title: e.target.value})} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" />
                            <textarea placeholder="Description..." value={newDiscovery.description} onChange={e => setNewDiscovery({...newDiscovery, description: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900" />
                            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Importance</label><ChoiceSelector options={importanceOptions} selected={newDiscovery.importance} onSelect={importance => setNewDiscovery({...newDiscovery, importance})} colors={importanceColors} /></div>
                            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Discovered By</label><RelationshipPicker manifest={manifest} selectedId={newDiscovery.primateId} onSelect={primateId => setNewDiscovery({...newDiscovery, primateId})} selectedItem={primates.find(p => p.id === newDiscovery.primateId)} /></div>
                            <div><label className="text-sm font-medium text-gray-600 dark:text-gray-400">Proof Document</label><FileUploader onFileChange={setProofFile} selectedFile={proofFile} /></div>
                            <button type="submit" className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded-lg transition">Log Discovery</button>
                        </form>
                    )}
                     <div className="space-y-4">
                        {discoveries && discoveries.length > 0 ? discoveries.map(discovery => (
                            <div key={discovery.id} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg font-bold">{discovery.title}</h4>
                                        <p className="text-sm text-gray-500">By {discovery.primate?.name || 'Unknown Primate'} | Logged by {discovery.scientist?.name || 'N/A'}</p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${importanceColors[discovery.importance]}`}>{discovery.importance}</span>
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{discovery.description}</p>
                                {discovery.proofDocument?.url && <a href={discovery.proofDocument.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-2 inline-block">View Proof Document</a>}
                            </div>
                        )) : <p className="text-center text-gray-500 dark:text-gray-400">No discoveries logged yet.</p>}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;
