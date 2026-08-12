import { useState } from 'react';
import {
    Search,
    Database,
    RefreshCw,
    ArrowLeft,
    Info
} from 'lucide-react';

const MaintenanceControlPanel = ({ onBack }) => {
    // State to manage the toggle switches
    const [controls, setControls] = useState({
        systemScan: true,
        backup: false,
        autoPatch: true,
    });

    const handleToggle = (key) => {
        setControls((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const controlItems = [
        {
            id: 'systemScan',
            name: 'System Scan',
            description: 'Run periodic deep scans of the file system and registries.',
            icon: <Search className="w-5 h-5" />
        },
        {
            id: 'backup',
            name: 'Automated Backup',
            description: 'Regularly snapshot system state and user data to secure storage.',
            icon: <Database className="w-5 h-5" />
        },
        {
            id: 'autoPatch',
            name: 'Auto-Patching',
            description: 'Automatically download and apply critical software updates.',
            icon: <RefreshCw className="w-5 h-5" />
        },
    ];

    return (
        <div className="w-full mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[500px]">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Maintenance
                    </h2>
                </div>
            </div>

            {/* Scrollable Content Region */}
            <div className="flex-1 overflow-y-auto box-scroll p-5 space-y-4">
                {controlItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-xl hover:border-gray-200 dark:hover:border-gray-600 transition-colors group"
                    >
                        <div className="flex items-start gap-4 pr-4">
                            <div className={`p-2 rounded-lg transition-colors ${
                                controls[item.id]
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                                    : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
                            }`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {/* Custom Tailwind Toggle Switch */}
                        <button
                            type="button"
                            onClick={() => handleToggle(item.id)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                                controls[item.id] ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                            role="switch"
                            aria-checked={controls[item.id]}
                        >
                            <span className="sr-only">Toggle {item.name}</span>
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    controls[item.id] ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                        </button>
                    </div>
                ))}

                {/* Notice Box */}
                <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                        <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-500">
                            Maintenance Info
                        </h4>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-500/80 leading-relaxed pl-6">
                        System scans and backups may temporarily reduce network throughput. Auto-patching may require an automatic reboot of the services upon completion.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default MaintenanceControlPanel;