import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Image as ImageIcon, Monitor } from 'lucide-react';
import clsx from 'clsx';

const Settings: React.FC = () => {
    const wallpaper = useSettingsStore((state) => state.wallpaper);
    const setWallpaper = useSettingsStore((state) => state.setWallpaper);

    const wallpapers = [
        { id: 'mountains', url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80', name: 'Mountains' },
        { id: 'ocean', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80', name: 'Ocean' },
        { id: 'forest', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80', name: 'Forest' },
        { id: 'city', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80', name: 'City' },
        { id: 'abstract', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&q=80', name: 'Abstract' },
        { id: 'david', url: '/david.jpg', name: 'David' },
    ];

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-black dark:text-white p-6 overflow-y-auto transition-colors">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Monitor className="text-blue-500" />
                System Settings
            </h2>

            {/* Wallpaper Section */}
            <section>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon size={20} />
                    Wallpaper
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wallpapers.map((wp) => (
                        <button
                            key={wp.id}
                            className={clsx(
                                "relative aspect-video rounded-lg overflow-hidden border-2 transition-all group",
                                wallpaper === wp.url
                                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900"
                                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                            )}
                            onClick={() => setWallpaper(wp.url)}
                        >
                            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                {wp.name}
                            </div>
                            {wallpaper === wp.url && (
                                <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-md">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                <p>WebOS v1.0.0</p>
                <p>Built with React & TailwindCSS</p>
            </div>
        </div>
    );
};

export default Settings;
