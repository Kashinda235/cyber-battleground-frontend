import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame,
    ArrowLeft,
    ShieldCheck,
    ShieldAlert,
    Ban,
    Key,
    Filter,
    SlidersHorizontal,
    Plus,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Lock,
    Globe,
    Activity,
    Zap,
    RefreshCw,
    Search,
    Check,
    X,
    Layers,
    FileText
} from 'lucide-react';

export default function FirewallPanel({ onBack }: { onBack?: () => void }) {
    // ---------------------------------------------------------------------------
    // STATE MANAGEMENT
    // ---------------------------------------------------------------------------

    // Global Firewall Switch & Default Policy
    const [firewallActive, setFirewallActive] = useState(true);
    const [defaultInboundPolicy, setDefaultInboundPolicy] = useState<'DROP' | 'ALLOW'>('DROP');
    const [defaultOutboundPolicy, setDefaultOutboundPolicy] = useState<'ALLOW' | 'DROP'>('ALLOW');

    // 1. Traffic Rules Filter State
    const [rules, setRules] = useState([
        { id: 'RULE-101', name: 'Allow Web Traffic (HTTP/HTTPS)', protocol: 'TCP', port: '80, 443', direction: 'INBOUND', action: 'ALLOW', enabled: true },
        { id: 'RULE-102', name: 'Restrict SSH Access', protocol: 'TCP', port: '22', direction: 'INBOUND', action: 'DROP', enabled: true },
        { id: 'RULE-103', name: 'Block ICMP Ping Requests', protocol: 'ICMP', port: 'ANY', direction: 'INBOUND', action: 'DROP', enabled: false },
        { id: 'RULE-104', name: 'DNS Ingress Query Layer', protocol: 'UDP', port: '53', direction: 'INBOUND', action: 'ALLOW', enabled: true },
    ]);

    const [newRule, setNewRule] = useState({ name: '', protocol: 'TCP', port: '', direction: 'INBOUND', action: 'DROP' });
    const [showAddRuleModal, setShowAddRuleModal] = useState(false);

    // 2. Rate Limiter State
    const [rateLimiter, setRateLimiter] = useState({
        enabled: true,
        maxReqPerSec: 1500,
        burstLimit: 250,
        banDurationMin: 30,
        actionOnExceed: 'CHALLENGE_CAPTCHA', // 'THROTTLE' | 'DROP' | 'CHALLENGE_CAPTCHA'
    });

    // 3. IP Blacklist & Whitelist State
    const [ipSearch, setIpSearch] = useState('');
    const [blockedIPs, setBlockedIPs] = useState([
        { ip: '192.168.1.105', reason: 'Repeated SSH Auth Failures', date: '2026-04-06 12:10', type: 'PERMANENT' },
        { ip: '45.33.18.9', reason: 'Decoy Honeypot Trigger', date: '2026-04-06 11:45', type: 'AUTO_BAN' },
        { ip: '185.220.101.4', reason: 'Known Malicious Tor Exit Node', date: '2026-04-05 22:30', type: 'PERMANENT' },
    ]);
    const [ipToBlock, setIpToBlock] = useState('');
    const [blockReason, setBlockReason] = useState('');

    // 4. MFA & Security Admin Access Controls
    const [mfaSettings, setMfaSettings] = useState({
        requireMFAForChanges: true,
        mfaMethod: 'TOTP_HARDWARE_KEY',
        adminSubnet: '10.0.0.0/24',
        sessionTimeoutMin: 15,
    });

    // ---------------------------------------------------------------------------
    // HANDLERS
    // ---------------------------------------------------------------------------

    const toggleRule = (id: string) => {
        setRules((prev) =>
            prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
        );
    };

    const deleteRule = (id: string) => {
        setRules((prev) => prev.filter((r) => r.id !== id));
    };

    const addRule = () => {
        if (!newRule.name || !newRule.port) return;
        const ruleObj = {
            id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
            ...newRule,
            enabled: true,
        };
        setRules((prev) => [ruleObj, ...prev]);
        setNewRule({ name: '', protocol: 'TCP', port: '', direction: 'INBOUND', action: 'DROP' });
        setShowAddRuleModal(false);
    };

    const blockIP = () => {
        if (!ipToBlock) return;
        setBlockedIPs((prev) => [
            {
                ip: ipToBlock,
                reason: blockReason || 'Manual Administrator Ban',
                date: new Date().toISOString().substring(0, 16).replace('T', ' '),
                type: 'PERMANENT',
            },
            ...prev,
        ]);
        setIpToBlock('');
        setBlockReason('');
    };

    const unblockIP = (ipToUnblock: string) => {
        setBlockedIPs((prev) => prev.filter((item) => item.ip !== ipToUnblock));
    };

    const filteredBlockedIPs = blockedIPs.filter(
        (item) => item.ip.includes(ipSearch) || item.reason.toLowerCase().includes(ipSearch.toLowerCase())
    );

    // ---------------------------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans antialiased selection:bg-orange-500/30">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER & GLOBAL FIREWALL TOGGLE */}
                <header className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md gap-4">
                    <div className="flex items-center space-x-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                                title="Return to Defense Dashboard"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400">
                            <Flame className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-xl font-bold tracking-wide text-white">FIREWALL CONTROL SUBSYSTEM</h1>
                                <span className={`border text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                    firewallActive
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}>
                  {firewallActive ? 'ACTIVE SURVEILLANCE' : 'BYPASS MODE'}
                </span>
                            </div>
                            <p className="text-xs text-slate-400">Packet Filtering, Rate Enforcement, MFA Lock, & Dynamic IP Blocking</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center space-x-3 bg-slate-950/60 px-4 py-2.5 rounded-lg border border-slate-800">
                            <div className="text-right">
                                <p className="text-[10px] uppercase text-slate-400 font-semibold">Firewall Master Power</p>
                                <p className="text-xs font-mono text-slate-300">{firewallActive ? 'ENGAGED' : 'DISENGAGED'}</p>
                            </div>
                            <button
                                onClick={() => setFirewallActive(!firewallActive)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    firewallActive ? 'bg-orange-500' : 'bg-slate-800'
                                }`}
                            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    firewallActive ? 'translate-x-6' : 'translate-x-1'
                }`} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* STATS OVERVIEW METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-orange-400" /> Active Rules</span>
                            <span className="font-mono text-slate-200">{rules.filter(r => r.enabled).length} / {rules.length}</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-slate-100">{rules.filter(r => r.enabled).length}</p>
                        <p className="text-[10px] text-slate-500">Inbound & Outbound Filters</p>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-cyan-400" /> Throughput</span>
                            <span className="font-mono text-slate-200">99.8%</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-cyan-400">1.24 GB/s</p>
                        <p className="text-[10px] text-slate-500">Deep Packet Inspection Active</p>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Ban className="w-4 h-4 text-rose-400" /> Blocked IPs</span>
                            <span className="font-mono text-rose-400">+3 today</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-rose-400">{blockedIPs.length}</p>
                        <p className="text-[10px] text-slate-500">Blacklisted Subnets & Hosts</p>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Key className="w-4 h-4 text-purple-400" /> MFA Security</span>
                            <span className="font-mono text-emerald-400">ENFORCED</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-purple-400">TOTP / Hardware</p>
                        <p className="text-[10px] text-slate-500">Admin Bypass Locked</p>
                    </div>
                </div>

                {/* 2x2 MAIN CONFIGURATION MODULES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ================================================================= */}
                    {/* FEATURE 1: TRAFFIC FILTER & PORT RULES */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400">
                                        <Filter className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">Traffic Filter & Port Rules</h2>
                                        <p className="text-[11px] text-slate-400">Packet inspection policies & port bindings</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowAddRuleModal(true)}
                                    className="py-1.5 px-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Rule</span>
                                </button>
                            </div>

                            {/* Default Policies Bar */}
                            <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
                                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                                    <span className="text-slate-400">Default Inbound:</span>
                                    <button
                                        onClick={() => setDefaultInboundPolicy(defaultInboundPolicy === 'DROP' ? 'ALLOW' : 'DROP')}
                                        className={`px-2 py-0.5 rounded font-bold ${
                                            defaultInboundPolicy === 'DROP' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400'
                                        }`}
                                    >
                                        {defaultInboundPolicy}
                                    </button>
                                </div>
                                <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                                    <span className="text-slate-400">Default Outbound:</span>
                                    <button
                                        onClick={() => setDefaultOutboundPolicy(defaultOutboundPolicy === 'ALLOW' ? 'DROP' : 'ALLOW')}
                                        className={`px-2 py-0.5 rounded font-bold ${
                                            defaultOutboundPolicy === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400'
                                        }`}
                                    >
                                        {defaultOutboundPolicy}
                                    </button>
                                </div>
                            </div>

                            {/* Rules Table */}
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                {rules.map((rule) => (
                                    <div
                                        key={rule.id}
                                        className={`p-3 rounded-lg border transition-all ${
                                            rule.enabled
                                                ? 'bg-slate-950/60 border-slate-800'
                                                : 'bg-slate-950/20 border-slate-900 opacity-60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => toggleRule(rule.id)}
                                                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                                                        rule.enabled ? 'bg-orange-500' : 'bg-slate-800'
                                                    }`}
                                                >
                          <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                              rule.enabled ? 'translate-x-3.5' : 'translate-x-0.5'
                          }`} />
                                                </button>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-mono text-xs font-bold text-slate-200">{rule.name}</span>
                                                        <span className="text-[10px] text-slate-500 font-mono">({rule.id})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-400 mt-0.5">
                                                        <span className="bg-slate-800 px-1.5 py-0.2 rounded">{rule.protocol}</span>
                                                        <span>Port: {rule.port}</span>
                                                        <span>•</span>
                                                        <span>{rule.direction}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            rule.action === 'ALLOW'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {rule.action}
                        </span>
                                                <button
                                                    onClick={() => deleteRule(rule.id)}
                                                    className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inline Add Rule Form Trigger / Modal */}
                        {showAddRuleModal && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 bg-slate-950 border border-orange-500/40 rounded-lg space-y-3"
                            >
                                <div className="flex justify-between items-center text-xs font-bold text-orange-400">
                                    <span>Create New Traffic Filter Rule</span>
                                    <button onClick={() => setShowAddRuleModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <input
                                        type="text"
                                        placeholder="Rule Label / Description"
                                        value={newRule.name}
                                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                        className="col-span-2 bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:outline-none focus:border-orange-500"
                                    />
                                    <select
                                        value={newRule.protocol}
                                        onChange={(e) => setNewRule({ ...newRule, protocol: e.target.value })}
                                        className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                                    >
                                        <option value="TCP">TCP</option>
                                        <option value="UDP">UDP</option>
                                        <option value="ICMP">ICMP</option>
                                        <option value="ANY">ALL PROTOCOLS</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Port Range (e.g. 8080)"
                                        value={newRule.port}
                                        onChange={(e) => setNewRule({ ...newRule, port: e.target.value })}
                                        className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                                    />
                                    <select
                                        value={newRule.direction}
                                        onChange={(e) => setNewRule({ ...newRule, direction: e.target.value })}
                                        className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                                    >
                                        <option value="INBOUND font-mono">INBOUND</option>
                                        <option value="OUTBOUND font-mono">OUTBOUND</option>
                                    </select>
                                    <select
                                        value={newRule.action}
                                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                                        className="bg-slate-900 border border-slate-800 p-2 rounded text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                                    >
                                        <option value="DROP">DROP</option>
                                        <option value="ALLOW">ALLOW</option>
                                    </select>
                                </div>
                                <button
                                    onClick={addRule}
                                    className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded transition-colors"
                                >
                                    Save & Deploy Rule
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* ================================================================= */}
                    {/* FEATURE 2: RATE LIMITER & THROTTLING */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                                        <SlidersHorizontal className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">Rate Limiter & DDoS Mitigator</h2>
                                        <p className="text-[11px] text-slate-400">Connection velocity & burst request bounds</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setRateLimiter({ ...rateLimiter, enabled: !rateLimiter.enabled })}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                        rateLimiter.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                                    }`}
                                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      rateLimiter.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                                </button>
                            </div>

                            {/* Controls */}
                            <div className="space-y-4 text-xs font-mono">
                                {/* Max Req Slider */}
                                <div className="space-y-2 p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Global Threshold (Req/Sec)</span>
                                        <span className="text-cyan-400 font-bold">{rateLimiter.maxReqPerSec} req/s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="100"
                                        max="5000"
                                        step="100"
                                        value={rateLimiter.maxReqPerSec}
                                        onChange={(e) => setRateLimiter({ ...rateLimiter, maxReqPerSec: Number(e.target.value) })}
                                        className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                                    />
                                </div>

                                {/* Burst Limit Slider */}
                                <div className="space-y-2 p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                                    <div className="flex justify-between items-center text-slate-300">
                                        <span>Burst Tolerance Capacity</span>
                                        <span className="text-cyan-400 font-bold">{rateLimiter.burstLimit} req</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="1000"
                                        step="10"
                                        value={rateLimiter.burstLimit}
                                        onChange={(e) => setRateLimiter({ ...rateLimiter, burstLimit: Number(e.target.value) })}
                                        className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer"
                                    />
                                </div>

                                {/* Action on Exceed */}
                                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-2">
                                    <span className="text-slate-400 block">Mitigation Action On Breach:</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'THROTTLE', label: 'THROTTLE' },
                                            { id: 'CHALLENGE_CAPTCHA', label: 'CAPTCHA' },
                                            { id: 'DROP', label: 'AUTO DROP' },
                                        ].map((act) => (
                                            <button
                                                key={act.id}
                                                onClick={() => setRateLimiter({ ...rateLimiter, actionOnExceed: act.id })}
                                                className={`py-1.5 rounded border text-[10px] font-bold transition-all ${
                                                    rateLimiter.actionOnExceed === act.id
                                                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                                                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                                                }`}
                                            >
                                                {act.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex items-center justify-between text-xs">
              <span className="text-cyan-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" /> Dynamic Leaky Bucket Engine
              </span>
                            <span className="text-emerald-400 font-mono font-bold">ACTIVE</span>
                        </div>
                    </div>

                    {/* ================================================================= */}
                    {/* FEATURE 3: IP BLOCKING & BLACKLIST */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
                                        <Ban className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">IP Blacklist & Access Denial</h2>
                                        <p className="text-[11px] text-slate-400">Explicit host ban & threat isolation</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-rose-400 font-bold">{blockedIPs.length} Banned</span>
                            </div>

                            {/* Quick Ban Input */}
                            <div className="space-y-2 mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter IP to block (e.g. 192.168.1.10)"
                                        value={ipToBlock}
                                        onChange={(e) => setIpToBlock(e.target.value)}
                                        className="flex-1 bg-slate-950 border border-slate-800 p-2 rounded text-xs text-slate-200 font-mono focus:outline-none focus:border-rose-500"
                                    />
                                    <button
                                        onClick={blockIP}
                                        className="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded transition-colors flex items-center space-x-1"
                                    >
                                        <Ban className="w-3.5 h-3.5" />
                                        <span>Block IP</span>
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Reason for restriction (Optional)"
                                    value={blockReason}
                                    onChange={(e) => setBlockReason(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 p-1.5 rounded text-[11px] text-slate-300 focus:outline-none focus:border-rose-500"
                                />
                            </div>

                            {/* Search & List */}
                            <div className="space-y-2">
                                <div className="relative">
                                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Filter blacklisted IPs..."
                                        value={ipSearch}
                                        onChange={(e) => setIpSearch(e.target.value)}
                                        className="w-full bg-slate-950/60 border border-slate-800 pl-8 pr-3 py-1.5 rounded text-xs text-slate-300 focus:outline-none focus:border-slate-700"
                                    />
                                </div>

                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                    {filteredBlockedIPs.map((item) => (
                                        <div
                                            key={item.ip}
                                            className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80 text-xs font-mono"
                                        >
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-bold text-rose-400">{item.ip}</span>
                                                    <span className="text-[9px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1 rounded">
                            {item.type}
                          </span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-0.5">{item.reason}</p>
                                            </div>

                                            <button
                                                onClick={() => unblockIP(item.ip)}
                                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition-colors"
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs text-slate-400">
                            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-slate-500" /> Geo-IP Sync</span>
                            <span className="text-slate-300 font-mono">AUTOMATIC</span>
                        </div>
                    </div>

                    {/* ================================================================= */}
                    {/* FEATURE 4: MFA & ADMIN SECURITY ACCESS */}
                    {/* ================================================================= */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                                <div className="flex items-center space-x-2.5">
                                    <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-100 text-sm">MFA & Administrative Access</h2>
                                        <p className="text-[11px] text-slate-400">Multi-Factor authentication policy & access subnets</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        setMfaSettings({
                                            ...mfaSettings,
                                            requireMFAForChanges: !mfaSettings.requireMFAForChanges,
                                        })
                                    }
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                        mfaSettings.requireMFAForChanges ? 'bg-purple-500' : 'bg-slate-800'
                                    }`}
                                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      mfaSettings.requireMFAForChanges ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                                </button>
                            </div>

                            <div className="space-y-3 text-xs font-mono">
                                {/* Require MFA Toggle */}
                                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-200 font-bold">Require MFA for Policy Changes</p>
                                        <p className="text-[10px] text-slate-400">Hardware token or TOTP prompt on save</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                        mfaSettings.requireMFAForChanges
                                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                            : 'bg-slate-800 text-slate-500'
                                    }`}>
                    {mfaSettings.requireMFAForChanges ? 'ENABLED' : 'DISABLED'}
                  </span>
                                </div>

                                {/* Whitelisted Admin Subnet */}
                                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
                                    <label className="text-slate-400 text-[11px] block">Allowed Admin Management Subnet</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={mfaSettings.adminSubnet}
                                            onChange={(e) => setMfaSettings({ ...mfaSettings, adminSubnet: e.target.value })}
                                            className="flex-1 bg-slate-900 border border-slate-800 p-1.5 rounded text-slate-200 focus:outline-none focus:border-purple-500"
                                        />
                                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* Session Timeout */}
                                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
                                    <span className="text-slate-400">Admin Session Timeout:</span>
                                    <select
                                        value={mfaSettings.sessionTimeoutMin}
                                        onChange={(e) => setMfaSettings({ ...mfaSettings, sessionTimeoutMin: Number(e.target.value) })}
                                        className="bg-slate-900 border border-slate-800 p-1 rounded text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                                    >
                                        <option value={5}>5 Minutes</option>
                                        <option value={15}>15 Minutes</option>
                                        <option value={30}>30 Minutes</option>
                                        <option value={60}>60 Minutes</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => alert('Firewall Configuration Saved & Signed with Master Key.')}
                            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/20"
                        >
                            <Lock className="w-4 h-4" />
                            <span>Commit & Apply Firewall Policy</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}