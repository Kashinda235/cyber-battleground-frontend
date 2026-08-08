import React, { useState } from 'react';
import {
    Activity,
    Route,
    Lock,
    ArrowLeft,
    AlertOctagon
} from 'lucide-react';

const IDSControlPanel = ({ onBack }) => {
    // State to manage the toggle switches
    const [controls, setControls] = useState({
        ids: true,
        traceback: false,
        emergencyLockdown: false,
    });

    const handleToggle = (key) => {
        setControls((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const controlItems = [
        {
            id: 'ids',
            name: 'Intrusion Detection',
            description: 'Monitor network traffic for malicious activity and policy violations.',
            icon: <Activity className="w-5 h-5" />,
            activeColor: 'blue'
        },
        {
            id: 'traceback',
            name: 'Active Traceback',
            description: 'Automatically trace malicious packets back to their origin node.',
            icon: <Route className="w-5 h-5" />,
            activeColor: 'blue'
        },
        {
            id: 'emergencyLockdown',
            name: 'Emergency Lockdown',
            description: 'Instantly sever all external connections and isolate the system.',
            icon: <Lock className="w-5 h-5" />,
            activeColor: 'red' // Critical action gets a danger color
        },
    ];

    // Helper to dynamically apply colors based on the item's config
    const getActiveStyles = (color, isActive) => {
        if (!isActive) return 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700';

        if (color === 'red') return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
        return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
    };

    const getToggleBg = (color, isActive) => {
        if (!isActive) return 'bg-gray-200 dark:bg-gray-700';

        if (color === 'red') return 'bg-red-600';
        return 'bg-blue-600';
    };

    const getFocusRing = (color) => {
        if (color === 'red') return 'focus:ring-red-500';
        return 'focus:ring-blue-500';
    };

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
                        IDS Controls
                    </h2>
                </div>
            </div>

            {/* Scrollable Content Region */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {controlItems.map((item) => (
                    <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 border rounded-xl transition-colors group ${
                            controls[item.id] && item.activeColor === 'red'
                                ? 'border-red-200 dark:border-red-900/50'
                                : 'border-gray-100 dark:border-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600'
                        }`}
                    >
                        <div className="flex items-start gap-4 pr-4">
                            <div className={`p-2 rounded-lg transition-colors ${getActiveStyles(item.activeColor, controls[item.id])}`}>
                                {item.icon}
                            </div>
                            <div>
                                <h3 className={`text-sm font-medium ${
                                    controls[item.id] && item.activeColor === 'red' ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-white'
                                }`}>
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
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${getToggleBg(item.activeColor, controls[item.id])} ${getFocusRing(item.activeColor)}`}
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
                <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-500" />
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-500">
                            Critical Warning
                        </h4>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-500/80 leading-relaxed pl-6">
                        Engaging the Emergency Lockdown will immediately drop all incoming and outgoing connections. Physical console access may be required to restore network functionality.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default IDSControlPanel;