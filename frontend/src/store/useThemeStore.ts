import { create } from 'zustand';

// NAYA: TypeScript ko batane ke liye ki store mein kya-kya hai
interface ThemeState {
  theme: string;
  setTheme: (newTheme: string) => void;
}

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme-preference') || 'system';
  }
  return 'system';
};

// <ThemeState> add kiya hai
export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  
  setTheme: (newTheme: string) => {
    set({ theme: newTheme });
    localStorage.setItem('theme-preference', newTheme);
    
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(newTheme);
    }
  },
}));