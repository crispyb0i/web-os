import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export type FileType = 'file' | 'folder';

export interface FileSystemItem {
    id: string;
    parentId: string | null;
    name: string;
    type: FileType;
    content?: string; // For text files
    createdAt: number;
}

interface FileSystemStore {
    files: FileSystemItem[];
    createFile: (parentId: string | null, name: string, type: FileType, content?: string) => string;
    deleteFile: (id: string) => void;
    renameFile: (id: string, newName: string) => void;
    updateFileContent: (id: string, content: string) => void;
    getFiles: (parentId: string | null) => FileSystemItem[];
}

const initialFiles: FileSystemItem[] = [
    { id: 'desktop', parentId: null, name: 'Desktop', type: 'folder', createdAt: Date.now() },
    { id: 'documents', parentId: null, name: 'Documents', type: 'folder', createdAt: Date.now() },
    { id: 'welcome', parentId: 'desktop', name: 'Welcome.txt', type: 'file', content: 'Welcome to WebOS! This is a David Shin project. Look around and enjoy!', createdAt: Date.now() },
    { id: 'david-folder', parentId: 'desktop', name: 'David Shin', type: 'folder', createdAt: Date.now() },
    { id: 'david-bio', parentId: 'david-folder', name: 'Bio.txt', type: 'file', content: 'David Shin is a developer building cool things.', createdAt: Date.now() },
    { id: 'david-pic', parentId: 'david-folder', name: 'Me.png', type: 'file', content: '/david-fun.png', createdAt: Date.now() },
    { id: 'secret-video', parentId: 'desktop', name: 'Secret Video.mp4', type: 'file', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1', createdAt: Date.now() },
    { id: 'browser-shortcut', parentId: 'desktop', name: 'Internet', type: 'file', content: 'app:browser', createdAt: Date.now() },
];

export const useFileSystemStore = create<FileSystemStore>()(
    persist(
        (set, get) => ({
            files: initialFiles,

            createFile: (parentId, name, type, content = '') => {
                const id = uuidv4();
                set((state) => ({
                    files: [
                        ...state.files,
                        {
                            id,
                            parentId,
                            name,
                            type,
                            content,
                            createdAt: Date.now(),
                        },
                    ],
                }));
                return id;
            },

            deleteFile: (id) =>
                set((state) => ({
                    files: state.files.filter((f) => f.id !== id && f.parentId !== id),
                })),

            renameFile: (id, newName) =>
                set((state) => ({
                    files: state.files.map((f) => (f.id === id ? { ...f, name: newName } : f)),
                })),

            updateFileContent: (id, content) =>
                set((state) => ({
                    files: state.files.map((f) => (f.id === id ? { ...f, content } : f)),
                })),

            getFiles: (parentId) => {
                return get().files.filter((f) => f.parentId === parentId);
            },
        }),
        {
            name: 'webos-filesystem',
        }
    )
);
