import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { useFileSystemStore } from '../../store/fsStore';
import { useWindowStore } from '../../store/windowStore';
import Notepad from '../apps/Notepad';
import FileManager from '../apps/FileManager';
import VideoPlayer from '../apps/VideoPlayer';
import ImageViewer from '../apps/ImageViewer';
import Browser from '../apps/Browser';
import { FileText, Folder, Monitor, Video, Image, Globe } from 'lucide-react';
import clsx from 'clsx';

const Desktop: React.FC = () => {
    const { wallpaper } = useSettingsStore();
    const { files } = useFileSystemStore();
    const { openWindow } = useWindowStore();
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

    const desktopFiles = files.filter((f) => f.parentId === 'desktop');

    const handleDoubleClick = (fileId: string) => {
        const file = files.find(f => f.id === fileId);

        if (file) {
            if (file.type === 'folder') {
                openWindow({
                    id: `filemanager-${file.id}`,
                    title: file.name,
                    icon: <Folder size={16} />,
                    component: <FileManager initialPath={file.id} />,
                    position: { x: 150, y: 150 },
                    size: { width: 600, height: 450 },
                });
            } else if (file.name.endsWith('.mp4')) {
                openWindow({
                    id: `video-${file.id}`,
                    title: file.name,
                    icon: <Monitor size={16} />,
                    component: <VideoPlayer videoUrl={file.content || ''} />,
                    position: { x: 200, y: 100 },
                    size: { width: 640, height: 360 },
                });
            } else if (file.content === 'app:browser') {
                openWindow({
                    id: 'browser',
                    title: 'Web Browser',
                    icon: <Globe size={16} />,
                    component: <Browser />,
                    position: { x: 50, y: 50 },
                    size: { width: 800, height: 600 },
                });
            } else if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                openWindow({
                    id: `image-${file.id}`,
                    title: file.name,
                    icon: <Monitor size={16} />, // Could use Image icon
                    component: <ImageViewer src={file.content || ''} alt={file.name} />,
                    position: { x: 150, y: 150 },
                    size: { width: 500, height: 400 },
                });
            } else {
                // Default to Notepad for other files (txt, etc)
                openWindow({
                    id: `notepad-${file.id}`,
                    title: file.name,
                    icon: <FileText size={16} />,
                    component: <Notepad fileId={file.id} />,
                    position: { x: 100, y: 100 },
                    size: { width: 500, height: 400 },
                });
            }
        } else if (fileId === 'recycle-bin') {
            openWindow({
                id: 'filemanager-root',
                title: 'My Computer',
                icon: <Monitor size={16} />,
                component: <FileManager initialPath={null} />,
                position: { x: 100, y: 100 },
                size: { width: 600, height: 450 },
            });
        }
    };

    return (
        <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${wallpaper})` }}
            onClick={() => setSelectedFileId(null)}
            onContextMenu={(e) => {
                e.preventDefault();
                // TODO: Show context menu
                console.log('Right click on desktop');
            }}
        >
            <div className="p-4 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 content-start items-start w-fit h-full">
                {desktopFiles.map((file) => (
                    <div
                        key={file.id}
                        className={clsx(
                            "flex flex-col items-center justify-center w-24 h-24 rounded hover:bg-white/10 cursor-pointer transition-colors",
                            selectedFileId === file.id && "bg-white/20 border border-white/30"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFileId(file.id);
                        }}
                        onDoubleClick={() => handleDoubleClick(file.id)}
                    >
                        <div className="text-blue-400 mb-1">
                            {file.type === 'folder' ? (
                                <Folder size={40} className="text-yellow-400" />
                            ) : file.content === 'app:browser' ? (
                                <Globe size={40} className="text-blue-500" />
                            ) : file.name.endsWith('.mp4') ? (
                                <Video size={40} className="text-purple-500" />
                            ) : file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') ? (
                                <Image size={40} className="text-green-500" />
                            ) : (
                                <FileText size={40} className="text-blue-400" />
                            )}
                        </div>
                        <span className="text-white text-xs text-center drop-shadow-md px-1 truncate w-full select-none">
                            {file.name}
                        </span>
                    </div>
                ))}

                {/* Static "This PC" or "Recycle Bin" icons could go here */}
                <div
                    className={clsx(
                        "flex flex-col items-center justify-center w-24 h-24 rounded hover:bg-white/10 cursor-pointer transition-colors",
                        selectedFileId === 'recycle-bin' && "bg-white/20 border border-white/30"
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileId('recycle-bin');
                    }}
                    onDoubleClick={() => handleDoubleClick('recycle-bin')}
                >
                    <div className="text-gray-300 mb-1">
                        <Monitor size={40} />
                    </div>
                    <span className="text-white text-xs text-center drop-shadow-md px-1 truncate w-full select-none">
                        My Computer
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Desktop;
