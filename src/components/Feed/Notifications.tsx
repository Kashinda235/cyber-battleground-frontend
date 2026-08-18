import {useState} from 'react';
import {
    Inbox, Send, PenSquare, Mail as MailIcon, MailOpen, AlertTriangle, Gift, ArrowLeft, User, X, CheckCircle2, Sparkles
} from 'lucide-react';
import {useGame} from "../../context/GameContext.tsx";
import type {Mail} from "../../utils/types.ts";

export default function MailFeature() {
    const {
        inboxMails, sentMails, players, sendMail, updateSeen, claimReward, healthRisk,
    } = useGame();

    // Navigation & View State
    const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent'>('inbox');
    const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
    const [isComposing, setIsComposing] = useState(false);

    // Local Claim Tracking State
    const [claimedMailIds, setClaimedMailIds] = useState<Set<number>>(new Set());
    const [claimingId, setClaimingId] = useState<number | null>(null);

    // Compose Form State
    const [receiverId, setReceiverId] = useState<number | ''>('');
    const [message, setMessage] = useState('');
    const [phishingPayload, setPhishingPayload] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const unreadCount = inboxMails.filter(m => !m.isSeen).length;

    const handleClaimReward = async (mail: Mail) => {
        if (!mail.metadata?.reward || claimedMailIds.has(mail.id)) return;

        // Mark as seen if opening an unread inbox mail
        if (activeFolder === 'inbox' && !mail.isSeen) {
            setClaimingId(mail.id);
            try {
                const res = await updateSeen(mail);
                mail = {...res};
                console.log(mail.isSeen);
                await claimReward(mail.metadata?.reward);
                if (mail.phishingPayload) await healthRisk(12);
                setClaimedMailIds((prev) => new Set(prev).add(mail.id));
            } catch (error) {
                console.error("Failed to mark mail as seen", error);
                console.error("Failed to claim reward", error);
            } finally {
                setClaimingId(null);
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
            // Reset state and switch to sent folder
            setReceiverId('');
            setMessage('');
            setPhishingPayload(false);
            setIsComposing(false);
            setActiveFolder('sent');
        } catch (error) {
            console.error("Failed to send mail", error);
        } finally {
            setIsSending(false);
        }
    };

    const getPlayerName = (id: number) => {
        const player = players.find(p => p.id === id);
        return player ? player.username : `Player #${id}`;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- Render Sections ---

    // 1. HEADER
    const renderHeader = () => (
        <header className="flex min-h-[5rem] shrink-0 items-center border-b border-gray-800 bg-amber-950/20 px-6 py-3">
            <div>
                <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400">
            <MailIcon size={28} />
          </span>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                        Messages
                    </h1>
                </div>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                    {activeFolder === 'inbox'
                        ? `${inboxMails.length} Total • ${unreadCount} Unread`
                        : `${sentMails.length} Sent Messages`}
                </p>
            </div>
        </header>
    );

    // 2. FOLDER TOGGLE BAR
    const renderTopBar = () => (
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950/80 p-3 backdrop-blur-sm z-10 shrink-0">
            <div className="flex space-x-1 bg-gray-900 rounded-lg p-1 border border-gray-800">
                <button
                    onClick={() => setActiveFolder('inbox')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeFolder === 'inbox' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                    <Inbox className="w-4 h-4" />
                    Inbox
                    {unreadCount > 0 && (
                        <span className="ml-1 bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {unreadCount}
            </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveFolder('sent')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeFolder === 'sent' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                    <Send className="w-4 h-4" />
                    Sent
                </button>
            </div>

            <button
                onClick={() => setIsComposing(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-amber-900/20"
                title="Compose Mail"
            >
                <PenSquare className="w-4 h-4" />
            </button>
        </div>
    );

    // 3. MAIL LIST (With Read/Unread styling and Reward Badges)
    const renderMailList = () => {
        const mails = activeFolder === 'inbox' ? inboxMails : sentMails;

        if (mails.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-500 p-6 text-center h-full">
                    <MailOpen className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm">No {activeFolder} mails found.</p>
                </div>
            );
        }

        return (
            <div className="flex-1 box-scroll overflow-y-auto divide-y divide-gray-800/50">
                {mails.map((mail) => {
                    const isUnread = activeFolder === 'inbox' && !mail.isSeen;
                    const hasReward = (mail.metadata?.reward ?? 0) > 0;
                    const isClaimed = claimedMailIds.has(mail.id) || mail.isSeen;

                    return (
                        <div
                            key={mail.id}
                            onClick={() => setSelectedMail(mail)}
                            className={`p-4 cursor-pointer transition-all flex items-start gap-3 relative border-l-2 ${
                                isUnread
                                    ? 'bg-amber-950/20 border-l-amber-500 hover:bg-amber-950/30'
                                    : 'bg-transparent border-l-transparent hover:bg-gray-900/60'
                            }`}
                        >
                            {/* Icon */}
                            <div className="pt-0.5 shrink-0">
                                {activeFolder === 'inbox' ? (
                                    isUnread ? (
                                        <MailIcon className="w-4 h-4 text-amber-400 animate-pulse" />
                                    ) : (
                                        <MailOpen className="w-4 h-4 text-gray-600" />
                                    )
                                ) : (
                                    <Send className="w-4 h-4 text-gray-500" />
                                )}
                            </div>

                            {/* Text Body */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center gap-2 truncate">
                    <span className={`text-sm truncate ${isUnread ? 'text-white font-bold' : 'text-gray-300 font-normal'}`}>
                      {activeFolder === 'inbox'
                          ? mail.metadata?.sender || getPlayerName(mail.senderId)
                          : `To: ${getPlayerName(mail.receiverId)}`}
                    </span>
                                        {isUnread && (
                                            <span className="text-[9px] bg-amber-500/20 text-amber-400 font-semibold px-1.5 py-0.2 rounded border border-amber-500/30">
                        NEW
                      </span>
                                        )}
                                    </div>
                                    <span className={`text-[11px] whitespace-nowrap ml-2 shrink-0 ${isUnread ? 'text-amber-400/80 font-medium' : 'text-gray-500'}`}>
                    {formatDate(mail.timestamp || mail.createdAt)}
                  </span>
                                </div>

                                <p className={`text-xs truncate ${isUnread ? 'text-gray-200 font-medium' : 'text-gray-500'}`}>
                                    {mail.message}
                                </p>

                                {/* Badges / Rewards */}
                                {(mail.phishingPayload || hasReward) && (
                                    <div className="flex items-center gap-2 mt-2">
                                        {mail.phishingPayload && (
                                            <span className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[10px] px-1.5 py-0.5 rounded border border-red-500/20">
                        <AlertTriangle className="w-3 h-3" /> Payload
                      </span>
                                        )}
                                        {hasReward && activeFolder === 'inbox' && (
                                            <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                                                isClaimed
                                                    ? 'bg-gray-800 text-gray-400 border-gray-700'
                                                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30 font-semibold'
                                            }`}>
                        <Gift className="w-3 h-3" />
                                                {isClaimed ? 'Claimed' : `+${mail.metadata.reward} Reward`}
                      </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // 4. MAIL DETAIL VIEW (Includes Reward Claiming Card)
    const renderMailDetail = () => {
        if (!selectedMail) return null;

        const hasReward = (selectedMail.metadata?.reward ?? 0) > 0;
        const isClaimed = claimedMailIds.has(selectedMail.id) || selectedMail.isSeen;
        const isClaiming = claimingId === selectedMail.id;

        return (
            <div className="flex flex-col h-full bg-gray-950 animate-in fade-in slide-in-from-right-4 duration-200 absolute inset-0 z-20">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-gray-800 p-3 bg-amber-950/10">
                    <button
                        onClick={() => setSelectedMail(null)}
                        className="p-1.5 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-100 truncate">
                            {activeFolder === 'inbox'
                                ? `From: ${selectedMail.metadata?.sender || getPlayerName(selectedMail.senderId)}`
                                : `To: ${getPlayerName(selectedMail.receiverId)}`}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                            {formatDate(selectedMail.timestamp || selectedMail.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Message Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                    {/* Warnings */}
                    {selectedMail.phishingPayload && (
                        <div className="flex items-center gap-2 bg-red-500/10 text-red-400 p-2.5 rounded-lg text-xs border border-red-500/20 mb-4">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span><strong>Warning:</strong> Suspicious Payload Detected in Mail</span>
                        </div>
                    )}

                    {/* REWARD CLAIM BOX (Only for receiver inbox) */}
                    {hasReward && activeFolder === 'inbox' && (
                        <div className="flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-gray-900 border border-amber-500/30 p-3.5 rounded-xl mb-6 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
                                    <Gift className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-[11px] font-semibold text-amber-400/80 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Attached Reward
                                    </div>
                                    <div className="text-sm font-bold text-white">
                                        +{selectedMail.metadata.reward} Rewards
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={async () => await handleClaimReward(selectedMail)}
                                disabled={isClaimed || isClaiming}
                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                    isClaimed
                                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700'
                                        : 'bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-md shadow-amber-950/50'
                                }`}
                            >
                                {isClaiming ? (
                                    <span className="w-4 h-4 border-2 border-gray-950/20 border-t-gray-950 rounded-full animate-spin" />
                                ) : isClaimed ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        Claimed
                                    </>
                                ) : (
                                    'Claim'
                                )}
                            </button>
                        </div>
                    )}

                    <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedMail.message}
                    </div>
                </div>
            </div>
        );
    };

    // 5. COMPOSE VIEW
    const renderCompose = () => (
        <div className="flex flex-col h-full bg-gray-950 animate-in fade-in slide-in-from-bottom-4 duration-200 absolute inset-0 z-30">
            <div className="flex items-center justify-between border-b border-gray-800 p-3 bg-amber-950/10">
                <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <PenSquare className="w-4 h-4" /> New Message
                </h3>
                <button
                    onClick={() => setIsComposing(false)}
                    className="p-1.5 hover:bg-gray-800 rounded-md transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSendMail} className="flex flex-col flex-1 p-4 overflow-y-auto">
                <div className="space-y-4 flex-1 flex flex-col">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Recipient
                        </label>
                        <select
                            value={receiverId}
                            onChange={(e) => setReceiverId(Number(e.target.value))}
                            required
                            className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-100 rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        >
                            <option value="" disabled>Select a player...</option>
                            {players.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col">
                        <label className="text-xs font-medium text-gray-400">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            placeholder="Type your message here..."
                            className="w-full flex-1 bg-gray-900 border border-gray-800 text-sm text-gray-100 rounded-lg p-3 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none min-h-[120px]"
                        />
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col gap-4 shrink-0">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={phishingPayload}
                                onChange={(e) => setPhishingPayload(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-9 h-5 bg-gray-800 border border-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-500/20 peer-checked:border-red-500/50 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 peer-checked:after:bg-red-500 after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors flex items-center gap-1.5">
              <AlertTriangle className={`w-3.5 h-3.5 ${phishingPayload ? 'text-red-400' : 'text-gray-500'}`} />
              Attach Phishing Payload
            </span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSending || !receiverId || !message.trim()}
                        className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-800 disabled:text-gray-500 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        {isSending ? (
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Send Mail
                    </button>
                </div>
            </form>
        </div>
    );

    // --- Main Render ---
    return (
        <div className="flex flex-col h-full w-full bg-gray-950 relative overflow-hidden">
            {renderHeader()}

            {!isComposing && !selectedMail && renderTopBar()}

            <div className="flex-1 overflow-hidden flex flex-col relative">
                {renderMailList()}
            </div>

            {selectedMail && renderMailDetail()}
            {isComposing && renderCompose()}
        </div>
    );
}