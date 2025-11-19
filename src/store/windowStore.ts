import { create } from 'zustand';
import type { ReactNode } from 'react';

export interface WindowState {
    id: string;
    title: string;
    component: ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    icon?: ReactNode;
}

interface WindowStore {
    windows: WindowState[];
    activeWindowId: string | null;
    openWindow: (window: Omit<WindowState, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
    closeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    restoreWindow: (id: string) => void;
    updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
    updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
    windows: [],
    activeWindowId: null,

    openWindow: (newWindow) =>
        set((state) => {
            const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 0);
            const existingWindow = state.windows.find((w) => w.id === newWindow.id);
            if (existingWindow) {
                return {
                    windows: state.windows.map((w) =>
                        w.id === newWindow.id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w
                    ),
                    activeWindowId: newWindow.id,
                };
            }
            const windowEntry: WindowState = {
                ...newWindow,
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                zIndex: maxZ + 1,
            };
            return {
                windows: [...state.windows, windowEntry],
                activeWindowId: newWindow.id,
            };
        }),

    closeWindow: (id) =>
        set((state) => ({
            windows: state.windows.filter((w) => w.id !== id),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        })),

    focusWindow: (id) =>
        set((state) => {
            const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 0);
            return {
                windows: state.windows.map((w) =>
                    w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
                ),
                activeWindowId: id,
            };
        }),

    minimizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, isMinimized: true } : w
            ),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
        })),

    maximizeWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, isMaximized: true } : w
            ),
        })),

    restoreWindow: (id) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w
            ),
        })),

    updateWindowPosition: (id, position) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, position } : w
            ),
        })),

    updateWindowSize: (id, size) =>
        set((state) => ({
            windows: state.windows.map((w) =>
                w.id === id ? { ...w, size } : w
            ),
        })),
}));
