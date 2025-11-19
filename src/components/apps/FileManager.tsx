import React, { useState } from 'react';
import { useFileSystemStore, type FileSystemItem } from '../../store/fsStore';
import { Folder, FileText, ArrowLeft, Plus, Trash2, Video, Image, Globe } from 'lucide-react';
import { useWindowStore } from '../../store/windowStore';
import Notepad from './Notepad';
import VideoPlayer from './VideoPlayer';
import ImageViewer from './ImageViewer';
import Browser from './Browser';
import clsx from 'clsx';

interface FileManagerProps {
    initialPath?: string | null;
}

const FileManager: React.FC<FileManagerProps> = ({ initialPath = null }) => {
    const { files, createFile, deleteFile, renameFile } = useFileSystemStore();
    const { openWindow } = useWindowStore();
    const [currentPath, setCurrentPath] = useState<string | null>(initialPath); // null = root (My Computer)
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Get files in current directory
    // If currentPath is null, we show "drives" or just root folders?
    // Let's say null is "My Computer" which shows "Desktop", "Documents", etc.
    // But our fsStore has 'desktop' and 'documents' as root folders (parentId: null).
    const currentFiles = files.filter((f) => f.parentId === currentPath);

    const handleNavigate = (folderId: string | null) => {
        setCurrentPath(folderId);
        setSelectedId(null);
    };

    const handleUp = () => {
        if (currentPath === null) return;
        const currentFolder = files.find((f) => f.id === currentPath);
        handleNavigate(currentFolder?.parentId || null);
    };

    const handleOpen = (file: FileSystemItem) => {
        if (file.type === 'folder') {
            handleNavigate(file.id);
        } else {
            // Open file
            if (file.name.endsWith('.txt')) {
                openWindow({
                    id: `notepad-${file.id}`,
                    title: file.name,
                    icon: <FileText size={16} />,
                    component: <Notepad fileId={file.id} />,
                    position: { x: 100, y: 100 },
                    size: { width: 500, height: 400 },
                });
            } else if (file.name.endsWith('.mp4')) {
                openWindow({
                    id: `video-${file.id}`,
                    title: file.name,
                    icon: <Video size={16} />,
                    component: <VideoPlayer videoUrl={file.content || ''} />,
                    position: { x: 200, y: 100 },
                    size: { width: 640, height: 360 },
                });
            } else if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
                openWindow({
                    id: `image-${file.id}`,
                    title: file.name,
                    icon: <Image size={16} />,
                    component: <ImageViewer src={file.content || ''} alt={file.name} />,
                    position: { x: 150, y: 150 },
                    size: { width: 500, height: 400 },
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
            }
        }
    };

    const handleCreateFolder = () => {
        const name = prompt('Folder name:');
        if (name) {
            createFile(currentPath, name, 'folder');
        }
    };

    const handleCreateFile = () => {
        const name = prompt('File name (e.g. note.txt):');
        if (name) {
            createFile(currentPath, name, 'file', '');
        }
    };

    const handleDelete = () => {
        if (selectedId) {
            if (confirm('Are you sure you want to delete this item?')) {
                deleteFile(selectedId);
                setSelectedId(null);
            }
        }
    };

    // Breadcrumbs
    const getBreadcrumbs = () => {
        if (currentPath === null) return [{ id: null, name: 'My Computer' }];

        const path = [];
        let curr = files.find(f => f.id === currentPath);
        while (curr) {
            path.unshift({ id: curr.id, name: curr.name });
            curr = files.find(f => f.id === curr?.parentId);
        }
        path.unshift({ id: null, name: 'My Computer' });
        return path;
    };

    return (
        <div className="flex flex-col h-full bg-white text-black">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                <button
                    onClick={handleUp}
                    disabled={currentPath === null}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                >
                    <ArrowLeft size={18} />
                </button>

                <div className="flex-1 flex items-center gap-1 px-2 bg-white border border-gray-300 rounded text-sm h-8 overflow-hidden">
                    {getBreadcrumbs().map((crumb, i) => (
                        <React.Fragment key={crumb.id || 'root'}>
                            {i > 0 && <span className="text-gray-400">/</span>}
                            <button
                                onClick={() => handleNavigate(crumb.id as string | null)}
                                className="hover:underline hover:text-blue-600 truncate max-w-[100px]"
                            >
                                {crumb.name}
                            </button>
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex gap-1">
                    <button onClick={handleCreateFolder} className="p-1 hover:bg-gray-200 rounded" title="New Folder">
                        <div className="relative">
                            <Folder size={18} />
                            <Plus size={10} className="absolute -bottom-1 -right-1 bg-white rounded-full" />
                        </div>
                    </button>
                    <button onClick={handleCreateFile} className="p-1 hover:bg-gray-200 rounded" title="New File">
                        <div className="relative">
                            <FileText size={18} />
                            <Plus size={10} className="absolute -bottom-1 -right-1 bg-white rounded-full" />
                        </div>
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={!selectedId}
                        className="p-1 hover:bg-red-100 text-red-500 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                    <button
                        onClick={() => {
                            if (selectedId) {
                                const file = files.find(f => f.id === selectedId);
                                if (file) {
                                    const newName = prompt('Rename to:', file.name);
                                    if (newName) {
                                        renameFile(selectedId, newName);
                                        setSelectedId(null);
                                    }
                                }
                            }
                        }}
                        disabled={!selectedId}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded disabled:opacity-30 transition-colors"
                        title="Rename"
                    >
                        <span className="text-xs font-bold">R</span>
                    </button>
                </div>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto p-2" onClick={() => setSelectedId(null)}>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
                    {currentFiles.map((file) => (
                        <div
                            key={file.id}
                            className={clsx(
                                "flex flex-col items-center p-2 rounded hover:bg-blue-50 dark:hover:bg-white/10 cursor-pointer border border-transparent transition-colors",
                                selectedId === file.id && "bg-blue-100 dark:bg-white/20 border-blue-200 dark:border-blue-700"
                            )}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedId(file.id);
                            }}
                            onDoubleClick={() => handleOpen(file)}
                        >
                            <div className="mb-1 text-blue-500">
                                {file.type === 'folder' ? (
                                    <Folder size={40} className="text-yellow-400 fill-yellow-400" />
                                ) : file.name.endsWith('.mp4') ? (
                                    <Video size={40} className="text-purple-500" />
                                ) : file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') ? (
                                    <Image size={40} className="text-green-500" />
                                ) : (
                                    <FileText size={40} className="text-blue-400" />
                                )}
                            </div>
                            <span className="text-xs text-center w-full truncate select-none">
                                {file.name}
                            </span>
                        </div>
                    ))}

                    {currentFiles.length === 0 && (
                        <div className="col-span-full text-center text-gray-400 mt-10">
                            This folder is empty
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileManager;
