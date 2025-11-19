import React, { useState, useEffect } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { format } from 'date-fns';
import { Monitor, Wifi, Volume2 } from 'lucide-react';
import clsx from 'clsx';

interface TaskbarProps {
    onToggleStartMenu: () => void;
    isStartMenuOpen: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ onToggleStartMenu, isStartMenuOpen }) => {
    const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleWindowClick = (windowId: string) => {
        const win = windows.find((w) => w.id === windowId);
        if (!win) return;

        if (win.isMinimized) {
            restoreWindow(windowId);
            focusWindow(windowId);
        } else if (activeWindowId === windowId) {
            minimizeWindow(windowId);
        } else {
            focusWindow(windowId);
        }
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-slate-900/90 backdrop-blur-md border-t border-white/10 flex items-center px-2 z-50 select-none">
            {/* Start Button */}
            <button
                className={clsx(
                    "p-2 rounded hover:bg-white/10 transition-colors mr-2 flex items-center justify-center",
                    isStartMenuOpen && "bg-white/10"
                )}
                onClick={onToggleStartMenu}
            >
                <div className="w-6 h-6 bg-blue-500 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                    <div className="bg-white rounded-[1px]"></div>
                    <div className="bg-white rounded-[1px]"></div>
                    <div className="bg-white rounded-[1px]"></div>
                    <div className="bg-white rounded-[1px]"></div>
                </div>
            </button>

            {/* Window List */}
            <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
                {windows.map((win) => (
                    <button
                        key={win.id}
                        className={clsx(
                            "flex items-center gap-2 px-3 py-1.5 max-w-[200px] rounded hover:bg-white/10 transition-all border-b-2",
                            activeWindowId === win.id && !win.isMinimized
                                ? "bg-white/10 border-blue-400"
                                : "border-transparent hover:border-white/20"
                        )}
                        onClick={() => handleWindowClick(win.id)}
                    >
                        <span className="w-4 h-4">{win.icon || <Monitor size={16} />}</span>
                        <span className="text-xs text-white truncate">{win.title}</span>
                    </button>
                ))}
            </div>

            {/* System Tray */}
            <div className="flex items-center gap-3 px-2 text-white/80">
                <div className="flex items-center gap-2 px-2">
                    <Wifi size={16} />
                    <Volume2 size={16} />
                </div>
                <div className="text-xs flex flex-col items-end leading-tight px-2 py-1 hover:bg-white/10 rounded cursor-default transition-colors">
                    <span>{format(time, 'h:mm aa')}</span>
                    <span>{format(time, 'M/d/yyyy')}</span>
                </div>
            </div>
        </div>
    );
};

export default Taskbar;
