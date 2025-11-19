import React from 'react';
import { Search, Settings as SettingsIcon, User, FileText, Calculator as CalculatorIcon, Palette, Folder, Globe } from 'lucide-react';
import { useWindowStore } from '../../store/windowStore';
import Notepad from '../apps/Notepad';
import Calculator from '../apps/Calculator';
import Paint from '../apps/Paint';
import FileManager from '../apps/FileManager';
import Settings from '../apps/Settings';
import Browser from '../apps/Browser';

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
    const { openWindow } = useWindowStore();

    if (!isOpen) return null;

    return (
        <div className="absolute bottom-12 left-2 w-[600px] h-[650px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-t-xl shadow-2xl z-50 flex flex-col animate-slide-up origin-bottom-left">
            {/* Search Bar */}
            <div className="p-6 pb-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Type here to search"
                        className="w-full bg-slate-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        autoFocus
                    />
                </div>
            </div>

            {/* Pinned Apps */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-white">Pinned</h3>
                </div>

                <div className="grid grid-cols-6 gap-4">
                    {/* App Icons */}
                    <button
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors group"
                        onClick={() => {
                            openWindow({
                                id: `notepad-${Date.now()}`,
                                title: 'Notepad',
                                icon: <FileText size={16} />,
                                component: <Notepad />,
                                position: { x: 150, y: 150 },
                                size: { width: 500, height: 400 },
                            });
                            onClose();
                        }}
                    >
                        <div className="w-10 h-10 bg-blue-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">
                            <FileText size={24} />
                        </div>
                        <span className="text-xs text-white">Notepad</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors group"
                        onClick={() => {
                            openWindow({
                                id: `browser-${Date.now()}`,
                                title: 'Web Browser',
                                icon: <Globe size={16} />,
                                component: <Browser />,
                                position: { x: 50, y: 50 },
                                size: { width: 800, height: 600 },
                            });
                            onClose();
                        }}
                    >
                        <div className="w-10 h-10 bg-blue-400 rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">
                            <Globe size={24} />
                        </div>
                        <span className="text-xs text-white">Browser</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors group"
                        onClick={() => {
                            openWindow({
                                id: `settings-${Date.now()}`,
                                title: 'Settings',
                                icon: <SettingsIcon size={16} />,
                                component: <Settings />,
                                position: { x: 100, y: 100 },
                                size: { width: 600, height: 500 },
                            });
                            onClose();
                        }}
                    >
                        <div className="w-10 h-10 bg-gray-600 rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">
                            <SettingsIcon size={24} />
                        </div>
                        <span className="text-xs text-white">Settings</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors group"
                        onClick={() => {
                            openWindow({
                                id: `files-${Date.now()}`,
                                title: 'File Manager',
                                icon: <Folder size={16} />,
                                component: <FileManager />,
                                position: { x: 150, y: 150 },
                                size: { width: 600, height: 400 },
                            });
                            onClose();
                        }}
                    >
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">
                            <Folder size={24} className="text-yellow-800" />
                        </div>
                        <span className="text-xs text-white">Files</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors group"
                        onClick={() => {
                            openWindow({
                                id: `paint-${Date.now()}`,
                                title: 'Paint',
                                icon: <Palette size={16} />,
                                component: <Paint />,
                                position: { x: 100, y: 50 },
                                size: { width: 800, height: 600 },
                            });
                            onClose();
                        }}
                    >
                        <div className="w-10 h-10 bg-pink-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">
                            <Palette size={24} />
                        </div>
                        <span className="text-xs text-white">Paint</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/10 transition-colors group"
                        onClick={() => {
                            openWindow({
                                id: `calculator-${Date.now()}`,
                                title: 'Calculator',
                                icon: <CalculatorIcon size={16} />,
                                component: <Calculator />,
                                position: { x: 200, y: 200 },
                                size: { width: 300, height: 450 },
                            });
                            onClose();
                        }}
                    >
                        <div className="w-10 h-10 bg-orange-500 rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">
                            <CalculatorIcon size={24} />
                        </div>
                        <span className="text-xs text-white">Calculator</span>
                    </button>
                </div>

                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-white mb-4">Recommended</h3>
                    <div className="flex flex-col gap-1">
                        <button
                            className="flex items-center gap-3 p-2 rounded hover:bg-white/10 text-left"
                            onClick={() => {
                                openWindow({
                                    id: `notepad-welcome-${Date.now()}`,
                                    title: 'Welcome.txt - Notepad',
                                    icon: <FileText size={16} />,
                                    component: <Notepad fileId="welcome" />,
                                    position: { x: 150, y: 150 },
                                    size: { width: 500, height: 400 },
                                });
                                onClose();
                            }}
                        >
                            <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-white/50">
                                <User size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-white">Welcome.txt</span>
                                <span className="text-xs text-white/50">Recently added</span>
                            </div>
                        </button>
                        <button
                            className="flex items-center gap-3 p-2 rounded hover:bg-white/10 text-left"
                            onClick={() => {
                                openWindow({
                                    id: `settings-${Date.now()}`,
                                    title: 'Settings',
                                    icon: <SettingsIcon size={16} />,
                                    component: <Settings />,
                                    position: { x: 100, y: 100 },
                                    size: { width: 600, height: 500 },
                                });
                                onClose();
                            }}
                        >
                            <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center text-white/50">
                                <SettingsIcon size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-white">System Settings</span>
                                <span className="text-xs text-white/50">Recently used</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-950/50 border-t border-white/10 flex items-center rounded-b-xl">
                <div className="flex items-center gap-3 p-2 rounded cursor-default">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        U
                    </div>
                    <span className="text-sm text-white font-medium">User</span>
                </div>
            </div>
        </div>
    );
};

export default StartMenu;
