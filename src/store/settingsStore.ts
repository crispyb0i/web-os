import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
    theme: 'light' | 'dark';
    wallpaper: string;
    setTheme: (theme: 'light' | 'dark') => void;
    setWallpaper: (url: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            theme: 'dark',
            wallpaper: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80', // Dark mountains
            setTheme: (theme) => set({ theme }),
            setWallpaper: (wallpaper) => set({ wallpaper }),
        }),
        {
            name: 'webos-settings',
        }
    )
);
