import React, { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Target, Trophy, Info, X } from 'lucide-react';

export type ToastType = 'join' | 'mission' | 'achievement' | 'info';

export interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastVariants: Record<ToastType, { icon: React.ElementType; border: string; iconColor: string; bg: string }> = {
    join: {
        icon: UserPlus,
        border: 'border-blue-500/30',
        iconColor: 'text-blue-400',
        bg: 'from-blue-950/20',
    },
    mission: {
        icon: Target,
        border: 'border-amber-500/30',
        iconColor: 'text-amber-400',
        bg: 'from-amber-950/20',
    },
    achievement: {
        icon: Trophy,
        border: 'border-emerald-500/30',
        iconColor: 'text-emerald-400',
        bg: 'from-emerald-950/20',
    },
    info: {
        icon: Info,
        border: 'border-slate-500/30',
        iconColor: 'text-slate-400',
        bg: 'from-slate-900/20',
    },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(({ title, description, type = 'info', duration = 4000 }: Omit<ToastMessage, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Positioned slightly lower: top-16 (~64px from top) */}
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-3 pointer-events-none w-full max-w-md px-4">
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const variant = toastVariants[toast.type];
                        const IconComponent = variant.icon;

                        return (
                            <motion.div
                                key={toast.id}
                                layout
                                initial={{ opacity: 0, y: -25, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                /* Larger padding (p-5), transparent background (bg-slate-950/40), and soft backdrop blur */
                                className={`pointer-events-auto flex items-center justify-between w-full p-5 rounded-2xl border ${variant.border} bg-gradient-to-r ${variant.bg} to-slate-950/40 bg-slate-950/40 backdrop-blur-lg shadow-2xl shadow-black/40 text-slate-100`}
                            >
                                <div className="flex items-center space-x-4 min-w-0">
                                    {/* Icon badge */}
                                    <div className={`p-3 rounded-xl bg-slate-900/40 border border-white/10 ${variant.iconColor}`}>
                                        <IconComponent className="w-6 h-6 shrink-0" />
                                    </div>

                                    {/* Text content */}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-base font-bold tracking-wide text-white truncate">{toast.title}</span>
                                        {toast.description && (
                                            <span className="text-sm text-slate-300/90 font-medium truncate">{toast.description}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-3 shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};