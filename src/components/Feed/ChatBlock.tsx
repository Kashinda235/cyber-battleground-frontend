import type {ChatLog, Player} from "../../utils/types.ts";
import React, {useEffect, useRef, useState} from "react";
import {MessageSquareQuote, Send, ShieldCog} from "lucide-react";

interface ChatBlockProps {
    chats: ChatLog[],
    activePlayers: number,
    currentPlayer: Player
    sendChat: (message: string) => Promise<ChatLog>
}

const ChatBlock = ( { chats, activePlayers, currentPlayer, sendChat }: ChatBlockProps) => {
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement | null>(null);
    const [inputValue, setInputValue] = useState("");

    // Fake typing animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setIsTyping((prev) => !prev)
        }, 4500)
        return () => clearInterval(interval)
    }, [])

    // Auto-scroll to bottom whenever chats array updates
    useEffect(() => {
        const container = chatEndRef.current;
        if (container) {
            // Scroll ONLY this container to the bottom
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chats]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        sendChat(inputValue);
        setInputValue("")
    }

    // @ts-ignore
    return (
        <div className="flex h-full animate-in flex-col duration-300 fade-in">
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6">
                <div className="flex items-center gap-3">

                    <div>
                        <div className='flex items-center gap-3'>
                                <span className="font-bold text-indigo-400">
                                    <MessageSquareQuote size={35}/>
                                </span>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                                Chat Room
                            </h1>
                        </div>
                            <div className="h-4">
                        <p className="text-xs md:text-sm text-slate-400 mt-1">
                                {isTyping ? (
                                    <span className="flex items-center gap-1 text-xs text-violet-400 italic">
                                      Someone is typing
                                      <span className="animate-bounce">.</span>
                                      <span className="animate-bounce delay-100">.</span>
                                      <span className="animate-bounce delay-200">.</span>
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-500">
                                      {activePlayers} Members Online
                                    </span>
                                )}
                        </p>
                            </div>
                    </div>
                </div>
            </header>

            <div ref={chatEndRef} className="flex-1 box-scroll">
                {chats.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex flex-col ${msg.senderId === currentPlayer.id ? "items-end" : "items-start"}`}
                    >
                    <span className="mb-1 px-1 text-[11px] font-medium tracking-wide text-gray-500">
                      {msg.metadata.sender}
                    </span>
                        <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                                msg.senderId === currentPlayer.id
                                    ? "rounded-tr-sm bg-indigo-600 text-white shadow-sm shadow-indigo-900/20"
                                    : "rounded-tl-sm border border-gray-700/50 bg-gray-800 text-gray-200"
                            }`}
                        >
                            {msg.message}
                        </div>
                        {/*<div ref={chatEndRef} />*/}
                    </div>
                ))}
            </div>

            <div className="shrink-0 border-t border-gray-800 bg-gray-900/80 p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type to room..."
                        className="flex-1 rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="flex w-12 items-center justify-center rounded-lg bg-indigo-600 p-2.5 text-white transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    )
}
export default ChatBlock
