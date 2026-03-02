import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { createElement } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('sciencespire-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: ThemeMode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('sciencespire-theme', mode);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

    useEffect(() => {
        applyTheme(themeMode);
    }, [themeMode]);

    // Listen for system preference changes
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem('sciencespire-theme')) {
                setThemeMode(e.matches ? 'dark' : 'light');
            }
        };
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeMode(mode);
    }, []);

    return createElement(
        ThemeContext.Provider,
        { value: { themeMode, toggleTheme, setTheme } },
        children
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
}
