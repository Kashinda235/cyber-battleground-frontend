import React, {useEffect, useState} from 'react';
import {
    User,
    Shield,
    Server,
    Network,
    Lock,
    Eye,
    EyeOff,
    Mail,
    Globe,
    Edit2,
    Check,
    X,
    Plus,
    Trash2,
    Clock,
    Calendar,
    AlertOctagon,
    ShieldAlert,
    ShieldCheck,
    CircleDollarSign, Cpu, MemoryStick, MessageSquareQuote
} from 'lucide-react';
import {useGame} from "../../context/GameContext.tsx";
import type {PlayerProfile} from "../../utils/types.ts";

interface PlayerProfileProps {
    onUpdate?: (updatedData: PlayerProfile) => void;
}

const defaultData: PlayerProfile = {
    player: {
        id: 11,
        username: "Loading...",
        role: "blue",
        status: "online",
        joinedAt: "2026-08-07T07:09:41.703Z",
        lastSeen: "2026-08-07T11:55:45.418Z"
    },
    system: {
        id: 2,
        playerId: 11,
        ip: "10.0.11.11",
        hostname: "test-machine",
        password: "new-password",
        mail: "test-player@example.com",
        createdAt: "2026-08-07T07:09:41.703Z"
    },
    defense: {
        id: 2,
        systemId: 2,
        firewallLevel: 2,
        idsStatus: true,
        honeypotActive: false,
        lockdownActive: true,
        autoPayThreshold: 100
    },
    network: [
        {
            id: 4,
            systemId: 2,
            port: 22,
            status: "open",
            metadata: {}
        },
        {
            id: 5,
            systemId: 2,
            port: 80,
            status: "open",
            metadata: {}
        },
        {
            id: 6,
            systemId: 2,
            port: 443,
            status: "open",
            metadata: {}
        }
    ]
}

const PlayerProfileCard: React.FC<PlayerProfileProps> = ({ onUpdate }) => {
    const { profile } = useGame();
    const [data, setData] = useState<PlayerProfile>(profile ?? defaultData);
    useEffect(() => {
        setData(profile ?? defaultData);
    }, [profile])

    // System credentials editing state
    const [isEditingHost, setIsEditingHost] = useState(false);
    const [hostname, setHostname] = useState(data.system.hostname);

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [password, setPassword] = useState(data.system.password);
    const [showPassword, setShowPassword] = useState(false);

    // Port management state
    const [newPort, setNewPort] = useState<string>('');

    // Save updated state and trigger callback
    const updateData = (newData: PlayerProfile) => {
        setData(newData);
        if (onUpdate) onUpdate(newData);
    };

    // Handlers for Hostname & Password
    const handleSaveHostname = () => {
        const updated = { ...data, system: { ...data.system, hostname } };
        updateData(updated);
        setIsEditingHost(false);
    };

    const handleSavePassword = () => {
        const updated = { ...data, system: { ...data.system, password } };
        updateData(updated);
        setIsEditingPassword(false);
    };

    // Handlers for Defense Toggles
    const toggleDefense = (key: keyof Omit<PlayerProfile['defense'], 'id' | 'systemId' | 'firewallLevel' | 'autoPayThreshold'>) => {
        const updated = {
            ...data,
            defense: {
                ...data.defense,
                [key]: !data.defense[key]
            }
        };
        updateData(updated);
    };

    // Handlers for Network Ports
    const togglePortStatus = (portId: number) => {
        const updated = {
            ...data,
            network: data.network.map(p => {
                if (p.id === portId) {
                    return { ...p, status: p.status === 'open' ? 'closed' : 'open' };
                }
                return p;
            })
        };
        updateData(updated);
    };

    const handleAddPort = (e: React.FormEvent) => {
        e.preventDefault();
        const portNum = parseInt(newPort, 10);
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) return;
        if (data.network.some(p => p.port === portNum)) return;

        const newPortEntry = {
            id: Date.now(),
            systemId: data.system.id,
            port: portNum,
            status: 'open',
            metadata: {}
        };

        const updated = { ...data, network: [...data.network, newPortEntry] };
        updateData(updated);
        setNewPort('');
    };

    const handleRemovePort = (portId: number) => {
        const updated = {
            ...data,
            network: data.network.filter(p => p.id !== portId)
        };
        updateData(updated);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="flex h-full animate-in flex-col duration-300 fade-in w-full max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden font-sans text-zinc-200">
                <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
                    <div className="flex items-center gap-3">

                        <div>
                            <div className='flex items-center gap-3'>
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-400 font-semibold text-lg">
                                        <User size={32} />
                                    </div>
                                <span
                                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-zinc-900 ${
                                        data.player.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-600'
                                    }`}
                                />
                                </div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">{data.player.username}</h1>
                                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/40 capitalize">
                        {data.player.role}
                    </span>
                                </div>
                            </div>
                            <div className="h-4">
                                <p className="text-xs md:text-sm text-slate-400 mt-1">
                                        <span className="text-xs text-gray-500">
                                       ID: #{data.player.id}
                                    </span>

                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Stats Box - synchronized with sm: breakpoint */}
                    <div className="flex flex-wrap flex-col items-start gap-1.5 text-xs text-zinc-400 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800 self-start sm:self-auto shrink-0">
                        <div className='flex items-center gap-1.5'>
                            <Server size={15} className="text-zinc-500 shrink-0" />
                            <span>System ID: <strong className="text-zinc-200 font-medium">1.{data.system.id}</strong></span>
                        </div>

                        <div className='flex items-center gap-1.5'>
                            <Cpu size={15} className="text-zinc-500 shrink-0" />
                            <span>Cores: <strong className="text-zinc-200 font-medium">2</strong></span>
                        </div>

                        <div className='flex items-center gap-1.5'>
                            <MemoryStick size={15} className="text-zinc-500 shrink-0" />
                            <span>RAM: <strong className="text-zinc-200 font-medium">8 GB</strong></span>
                        </div>
                    </div>
                </header>

            {/* Main Grid */}
            <div className="flex-1 overflow-y-auto p-2 grid grid-cols-1 gap-2 scrollbar-thin scrollbar-thumb-zinc-700">

                {/* Section 1: System Credentials */}
                <div className="bg-zinc-950/60 rounded-xl border border-zinc-800/80 p-5 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                        <h2 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                            <Server size={16} className="text-indigo-400" /> System Credentials
                        </h2>
                        <span className="text-xs text-zinc-500">Manage Host</span>

                    </div>

                    <div className="space-y-3.5 text-sm">
                        {/* Hostname Field */}
                        <div className="flex justify-between items-center h-8">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <Globe size={14} className="text-zinc-500" /> Hostname
              </span>
                            {isEditingHost ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={hostname}
                                        onChange={(e) => setHostname(e.target.value)}
                                        className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                                    />
                                    <button onClick={handleSaveHostname} className="p-1 text-emerald-400 hover:bg-zinc-800 rounded">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => { setHostname(data.system.hostname); setIsEditingHost(false); }} className="p-1 text-zinc-400 hover:bg-zinc-800 rounded">
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-zinc-200 text-xs">{data.system.hostname}</span>
                                    <button onClick={() => setIsEditingHost(true)} className="p-1 text-zinc-500 hover:text-zinc-300 rounded">
                                        <Edit2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* IP Address */}
                        <div className="flex justify-between items-center h-8">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <Globe size={14} className="text-zinc-500" /> IP Address
              </span>
                            <span className="font-mono text-xs font-medium text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {data.system.ip}
              </span>
                        </div>

                        {/* Email */}
                        <div className="flex justify-between items-center h-8">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <Mail size={14} className="text-zinc-500" /> Email
              </span>
                            <span className="text-xs text-zinc-300 truncate max-w-[160px]">{data.system.mail}</span>
                        </div>

                        {/* Password Field */}
                        <div className="flex justify-between items-center h-8">
              <span className="text-xs text-zinc-400 flex items-center gap-2">
                <Lock size={14} className="text-zinc-500" /> Password
              </span>
                            {isEditingPassword ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                                    />
                                    <button onClick={handleSavePassword} className="p-1 text-emerald-400 hover:bg-zinc-800 rounded">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => { setPassword(data.system.password); setIsEditingPassword(false); }} className="p-1 text-zinc-400 hover:bg-zinc-800 rounded">
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-zinc-300">
                    {showPassword ? data.system.password : '••••••••••••'}
                  </span>
                                    <button onClick={() => setShowPassword(!showPassword)} className="p-1 text-zinc-500 hover:text-zinc-300 rounded">
                                        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                                    </button>
                                    <button onClick={() => setIsEditingPassword(true)} className="p-1 text-zinc-500 hover:text-zinc-300 rounded">
                                        <Edit2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 2: Defense Controls */}
                <div className="bg-zinc-950/60 rounded-xl border border-zinc-800/80 p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                        <h2 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                            <Shield size={16} className="text-emerald-400" /> Defense Controls
                        </h2>
                        <span className="text-xs bg-emerald-950/80 text-emerald-300 font-medium px-2.5 py-0.5 rounded-full border border-emerald-800/40">
              Firewall Lvl {data.defense.firewallLevel}
            </span>
                    </div>

                    <div className="space-y-3">
                        {/* IDS Toggle */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {data.defense.idsStatus ? <ShieldCheck size={16} className="text-emerald-400" /> : <ShieldAlert size={16} className="text-zinc-500" />}
                                <div>
                                    <p className="text-xs font-medium text-zinc-200">IDS Status</p>
                                    <p className="text-[10px] text-zinc-500">Intrusion Detection</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleDefense('idsStatus')}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    data.defense.idsStatus ? 'bg-indigo-600' : 'bg-zinc-700'
                                }`}
                            >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    data.defense.idsStatus ? 'translate-x-4.5' : 'translate-x-1'
                }`} />
                            </button>
                        </div>

                        {/* Honeypot Toggle */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className={data.defense.honeypotActive ? "text-amber-400" : "text-zinc-500"} />
                                <div>
                                    <p className="text-xs font-medium text-zinc-200">Honeypot Active</p>
                                    <p className="text-[10px] text-zinc-500">Decoy System Trap</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleDefense('honeypotActive')}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    data.defense.honeypotActive ? 'bg-indigo-600' : 'bg-zinc-700'
                                }`}
                            >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    data.defense.honeypotActive ? 'translate-x-4.5' : 'translate-x-1'
                }`} />
                            </button>
                        </div>

                        {/* Lockdown Toggle */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <AlertOctagon size={16} className={data.defense.lockdownActive ? "text-rose-400" : "text-zinc-500"} />
                                <div>
                                    <p className="text-xs font-medium text-zinc-200">Lockdown Active</p>
                                    <p className="text-[10px] text-zinc-500">Emergency Protocol</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleDefense('lockdownActive')}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    data.defense.lockdownActive ? 'bg-rose-600' : 'bg-zinc-700'
                                }`}
                            >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    data.defense.lockdownActive ? 'translate-x-4.5' : 'translate-x-1'
                }`} />
                            </button>
                        </div>

                        {/* Auto Pay Threshold */}
                        <div className="pt-2 border-t border-zinc-800/50 flex justify-between items-center text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <CircleDollarSign size={14} className="text-zinc-500" /> Auto-Pay Threshold
              </span>
                            <span className="font-semibold text-zinc-200">${data.defense.autoPayThreshold}</span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Network Port Manager */}
                <div className="bg-zinc-950/60 rounded-xl border border-zinc-800/80 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
                        <div>
                            <h2 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                                <Network size={16} className="text-indigo-400" /> Network Ports
                            </h2>
                            <p className="text-xs text-zinc-500 mt-0.5">Toggle status or manage open ports</p>
                        </div>

                        {/* Add Port Form */}
                        <form onSubmit={handleAddPort} className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Port #"
                                value={newPort}
                                onChange={(e) => setNewPort(e.target.value)}
                                className="w-24 px-3 py-1 text-xs bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 placeholder-zinc-500"
                            />
                            <button
                                type="submit"
                                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
                            >
                                <Plus size={14} /> Add Port
                            </button>
                        </form>
                    </div>

                    {/* Port Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.network.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className={`w-2 h-2 rounded-full ${item.status === 'open' ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                                    <div>
                                        <span className="font-mono text-xs font-semibold text-zinc-200">Port {item.port}</span>
                                        <p className="text-[10px] text-zinc-500 uppercase font-medium">{item.status}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => togglePortStatus(item.id)}
                                        className={`px-2 py-1 text-[10px] font-medium rounded transition-colors ${
                                            item.status === 'open'
                                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40 hover:bg-amber-900/60'
                                                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60'
                                        }`}
                                    >
                                        {item.status === 'open' ? 'Close' : 'Open'}
                                    </button>
                                    <button
                                        onClick={() => handleRemovePort(item.id)}
                                        className="p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer Timestamps */}
            <div className="shrink-0 bg-zinc-950 border-t border-zinc-800 px-6 py-3 flex flex-wrap justify-between items-center text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                    <Clock size={13} /> Last Seen: {formatDate(data.player.lastSeen)}
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar size={13} /> Joined: {formatDate(data.player.joinedAt)}
                </div>
            </div>
        </div>
    );
};

export default PlayerProfileCard;