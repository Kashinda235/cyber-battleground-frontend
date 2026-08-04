const COLOR_MAP: Record<string, {
    bg: string;
    bgHover: string;
    bgDark: string;
    bgDarkHover: string;
    text: string;
    textDark: string;
    border: string;
    bgLight: string;
    shadow: string;
}> = {
    red: {
        bg: 'bg-red-600',
        bgHover: 'hover:bg-red-700',
        bgDark: 'dark:bg-red-500',
        bgDarkHover: 'dark:hover:bg-red-600',
        text: 'text-red-600',
        textDark: 'dark:text-red-400',
        border: 'border-red-500',
        bgLight: 'bg-red-50 dark:bg-red-950/60',
        shadow: 'shadow-red-500/20',
    },
    blue: {
        bg: 'bg-blue-600',
        bgHover: 'hover:bg-blue-700',
        bgDark: 'dark:bg-blue-500',
        bgDarkHover: 'dark:hover:bg-blue-600',
        text: 'text-blue-600',
        textDark: 'dark:text-blue-400',
        border: 'border-blue-500',
        bgLight: 'bg-blue-50 dark:bg-blue-950/60',
        shadow: 'shadow-blue-500/20',
    },
    amber: {
        bg: 'bg-amber-600',
        bgHover: 'hover:bg-amber-700',
        bgDark: 'dark:bg-amber-500',
        bgDarkHover: 'dark:hover:bg-amber-600',
        text: 'text-amber-600',
        textDark: 'dark:text-amber-400',
        border: 'border-amber-500',
        bgLight: 'bg-amber-50 dark:bg-amber-950/60',
        shadow: 'shadow-amber-500/20',
    },
    orange: {
        bg: 'bg-orange-600',
        bgHover: 'hover:bg-orange-700',
        bgDark: 'dark:bg-orange-500',
        bgDarkHover: 'dark:hover:bg-orange-600',
        text: 'text-orange-600',
        textDark: 'dark:text-orange-400',
        border: 'border-orange-500',
        bgLight: 'bg-orange-50 dark:bg-orange-950/60',
        shadow: 'shadow-orange-500/20',
    },
    emerald: {
        bg: 'bg-emerald-600',
        bgHover: 'hover:bg-emerald-700',
        bgDark: 'dark:bg-emerald-500',
        bgDarkHover: 'dark:hover:bg-emerald-600',
        text: 'text-emerald-600',
        textDark: 'dark:text-emerald-400',
        border: 'border-emerald-500',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/60',
        shadow: 'shadow-emerald-500/20',
    },
    indigo: {
        bg: 'bg-indigo-600',
        bgHover: 'hover:bg-indigo-700',
        bgDark: 'dark:bg-indigo-500',
        bgDarkHover: 'dark:hover:bg-indigo-600',
        text: 'text-indigo-600',
        textDark: 'dark:text-indigo-400',
        border: 'border-indigo-500',
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/60',
        shadow: 'shadow-indigo-500/20',
    },
};