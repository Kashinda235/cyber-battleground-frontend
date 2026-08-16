import React, { useState, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {UserPlus, Target, Trophy, Info, X, Swords, Mail, AlertTriangle} from 'lucide-react';

export type ToastType = 'join' | 'mission' | 'achievement' | 'info' | 'alert' | 'mail' ;

export interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastVariants: Record<
    ToastType,
    { icon: React.ElementType; border: string; iconColor: string; bg: string; iconBg: string }
> = {
    join: {
        icon: UserPlus,
        border: 'border-yellow-500/70',
        iconColor: 'text-yellow-400',
        bg: 'from-yellow-350/90 to-yellow-950/90',
        iconBg: 'bg-yellow-950/50 border-yellow-500/30',
    },
    mission: {
        icon: Swords,
        border: 'border-rose-500/70',
        iconColor: 'text-rose-400',
        bg: 'from-rose-350/90 to-rose-950/90',
        iconBg: 'bg-rose-950/50 border-rose-700/30',
    },
    achievement: {
        icon: Trophy,
        border: 'border-emerald-500/70',
        iconColor: 'text-emerald-400',
        bg: 'from-emerald-350/90 to-emerald-950/90',
        iconBg: 'bg-emerald-950/50 border-emerald-500/30',
    },
    info: {
        icon: Info,
        border: 'border-sky-500/70',
        iconColor: 'text-sky-400',
        bg: 'from-sky-350/90 to-sky-950/90',
        iconBg: 'bg-sky-950/50 border-sky-500/30',
    },
    alert: {
        icon: AlertTriangle,
        border: 'border-red-500/70',
        iconColor: 'text-red-400',
        bg: 'from-red-450/90 to-red-950/90',
        iconBg: 'bg-red-950/50 border-red-500/30',
    },
    mail: {
        icon: Mail,
        border: 'border-amber-500/70',
        iconColor: 'text-amber-400',
        bg: 'from-amber-350/90 to-amber-950/90',
        iconBg: 'bg-amber-950/50 border-amber-500/30',
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

            {/* Positioned top-16 (~64px from top) */}
            <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-3 pointer-events-none w-full max-w-md px-4">
                <AnimatePresence>
                    {toasts.map((toast) => {
                        const variant = toastVariants[toast.type || 'info'];
                        const IconComponent = variant.icon;

                        return (
                            <motion.div
                                key={toast.id}
                                layout
                                initial={{ opacity: 0, y: -25, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                className={`pointer-events-auto flex items-center justify-between w-full p-5 rounded-2xl border-2 ${variant.border} bg-gradient-to-r ${variant.bg} backdrop-blur-md shadow-xl text-slate-100`}
                            >
                                <div className="flex items-center space-x-4 min-w-0">
                                    {/* Icon badge matching shade color */}
                                    <div className={`p-3 rounded-xl border ${variant.iconBg} ${variant.iconColor}`}>
                                        <IconComponent className="w-6 h-6 shrink-0" />
                                    </div>

                                    {/* Text content */}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-base font-bold tracking-wide text-white truncate">{toast.title}</span>
                                        {toast.description && (
                                            <span className="text-sm text-slate-200/90 font-medium truncate">{toast.description}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-3 shrink-0"
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