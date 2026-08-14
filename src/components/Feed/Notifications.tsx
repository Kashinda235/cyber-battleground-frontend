import { useState } from 'react';
import {
    Inbox,
    Send,
    PenSquare,
    Mail as MailIcon,
    MailOpen,
    AlertTriangle,
    Gift,
    ArrowLeft,
    User
} from 'lucide-react';
import {useGame} from "../../context/GameContext.tsx";

// --- Types (Assuming these are exported from your game logic) ---
export interface Mail {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    isSeen: boolean;
    phishingPayload: boolean;
    metadata: { reward: number; sender: string };
    createdAt: Date;
    timestamp: Date;
}

export interface MailRequest {
    receiverId: number;
    message: string;
    phishingPayload: boolean;
}

export interface Player {
    id: number;
    name: string;
    mail: string;
}

// Mock useGame import - replace with your actual import
// import { useGame } from '@/hooks/useGame';

export default function MailFeature() {
    // Replace this with your actual useGame hook
    const {
        inboxMails,
        sentMails,
        systems,
        sendMail,
        updateSeen
    } = useGame();

    const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
    const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

    // Compose Form State
    const [receiverId, setReceiverId] = useState<number | ''>('');
    const [message, setMessage] = useState('');
    const [phishingPayload, setPhishingPayload] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // --- Handlers ---
    const handleTabChange = (tab: 'inbox' | 'sent' | 'compose') => {
        setActiveTab(tab);
        setSelectedMail(null);
    };

    const handleOpenMail = async (mail: Mail) => {
        setSelectedMail(mail);
        // If opening an unread inbox mail, mark as seen
        if (activeTab === 'inbox' && !mail.isSeen) {
            try {
                await updateSeen(mail);
            } catch (error) {
                console.error("Failed to mark mail as seen", error);
            }
        }
    };

    const handleSendMail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiverId || !message.trim()) return;

        setIsSending(true);
        try {
            await sendMail({
                receiverId: Number(receiverId),
                message,
                phishingPayload,
            });
            // Reset form and go to sent folder on success
            setReceiverId('');
            setMessage('');
            setPhishingPayload(false);
            handleTabChange('sent');
        } catch (error) {
            console.error("Failed to send mail", error);
        } finally {
            setIsSending(false);
        }
    };

    const getPlayerName = (id: number) => {
        const player = systems.find(p => p.playerId === id);
        return player ? player.hostname : `Player #${id}`;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- Sub-components ---
    const renderMailList = () => {
        const mails = activeTab === 'inbox' ? inboxMails : sentMails;

        if (mails.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MailOpen className="w-12 h-12 mb-2 opacity-50" />
                    <p>No {activeTab} mails found.</p>
                </div>
            );
        }

        return (
            <div className="overflow-y-auto h-full divide-y divide-gray-700/50">
                {mails.map((mail) => (
                    <div
                        key={mail.id}
                        onClick={() => handleOpenMail(mail)}
                        className={`p-4 cursor-pointer hover:bg-gray-800 transition-colors flex items-center gap-4 ${
                            !mail.isSeen && activeTab === 'inbox' ? 'bg-gray-800/60' : ''
                        }`}
                    >
                        {activeTab === 'inbox' ? (
                            mail.isSeen ? <MailOpen className="w-5 h-5 text-gray-400" /> : <MailIcon className="w-5 h-5 text-blue-400" />
                        ) : (
                            <Send className="w-5 h-5 text-gray-400" />
                        )}

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                <span className={`font-medium truncate ${!mail.isSeen && activeTab === 'inbox' ? 'text-white' : 'text-gray-300'}`}>
                  {activeTab === 'inbox'
                      ? mail.metadata?.sender || getPlayerName(mail.senderId)
                      : `To: ${getPlayerName(mail.receiverId)}`}
                </span>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  {formatDate(mail.timestamp || mail.createdAt)}
                </span>
                            </div>
                            <p className={`text-sm truncate ${!mail.isSeen && activeTab === 'inbox' ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                                {mail.message}
                            </p>
                        </div>

                        {mail.phishingPayload && <AlertTriangle className="w-4 h-4 text-red-400" />}
                        {mail.metadata?.reward > 0 && <Gift className="w-4 h-4 text-green-400" />}
                    </div>
                ))}
            </div>
        );
    };

    const renderMailDetail = () => {
        if (!selectedMail) return null;

        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-200">
                {/* Detail Header */}
                <div className="p-4 border-b border-gray-700 flex items-center gap-4 bg-gray-800/30">
                    <button
                        onClick={() => setSelectedMail(null)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {activeTab === 'inbox'
                                ? `From: ${selectedMail.metadata?.sender || getPlayerName(selectedMail.senderId)}`
                                : `To: ${getPlayerName(selectedMail.receiverId)}`}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {formatDate(selectedMail.timestamp || selectedMail.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Mail Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* Status Badges */}
                    {(selectedMail.phishingPayload || selectedMail.metadata?.reward > 0) && (
                        <div className="flex gap-2 mb-6">
                            {selectedMail.phishingPayload && (
                                <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full text-sm border border-red-500/20">
                                    <AlertTriangle className="w-4 h-4" />
                                    Warning: Suspicious Payload Detected
                                </div>
                            )}
                            {selectedMail.metadata?.reward > 0 && (
                                <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full text-sm border border-green-500/20">
                                    <Gift className="w-4 h-4" />
                                    Reward Included: {selectedMail.metadata.reward}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {selectedMail.message}
                    </div>
                </div>
            </div>
        );
    };

    const renderCompose = () => (
        <div className="h-full flex flex-col p-6 animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">Compose Mail</h2>

            <form onSubmit={handleSendMail} className="flex flex-col gap-5 flex-1">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <User className="w-4 h-4" /> Recipient
                    </label>
                    <select
                        value={receiverId}
                        onChange={(e) => setReceiverId(Number(e.target.value))}
                        required
                        className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                        <option value="" disabled>Select a player...</option>
                        {systems.map(player => (
                            <option key={player.id} value={player.playerId}>
                                {player.hostname} ({player.mail})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1 flex-1 flex flex-col">
                    <label className="text-sm font-medium text-gray-300">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        placeholder="Type your message here..."
                        className="w-full flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={phishingPayload}
                                onChange={(e) => setPhishingPayload(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-10 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${phishingPayload ? 'text-red-400' : 'text-gray-500'}`} />
              Attach Phishing Payload
            </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSending || !receiverId || !message.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        {isSending ? (
                            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                        Send Mail
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div className="flex h-[600px] w-full max-w-5xl bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden font-sans">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-gray-950 flex flex-col border-r border-gray-800">
                <div className="p-4 border-b border-gray-800">
                    <button
                        onClick={() => handleTabChange('compose')}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg p-3 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <PenSquare className="w-5 h-5" />
                        Compose
                    </button>
                </div>

                <nav className="flex-1 p-2 space-y-1">
                    <button
                        onClick={() => handleTabChange('inbox')}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                            activeTab === 'inbox' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                        }`}
                    >
                        <div className="flex items-center gap-3 font-medium">
                            <Inbox className="w-5 h-5" />
                            Inbox
                        </div>
                        {inboxMails.filter(m => !m.isSeen).length > 0 && (
                            <span className="bg-blue-500 text-white text-xs py-0.5 px-2 rounded-full">
                {inboxMails.filter(m => !m.isSeen).length}
              </span>
                        )}
                    </button>

                    <button
                        onClick={() => handleTabChange('sent')}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors font-medium ${
                            activeTab === 'sent' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                        }`}
                    >
                        <Send className="w-5 h-5" />
                        Sent
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-900 relative">
                {selectedMail ? (
                    renderMailDetail()
                ) : activeTab === 'compose' ? (
                    renderCompose()
                ) : (
                    renderMailList()
                )}
            </div>
        </div>
    );
}