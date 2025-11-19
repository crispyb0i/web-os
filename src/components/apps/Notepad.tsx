import React, { useState, useEffect } from 'react';
import { useFileSystemStore } from '../../store/fsStore';
import { Save } from 'lucide-react';

interface NotepadProps {
    fileId?: string;
}

const Notepad: React.FC<NotepadProps> = ({ fileId }) => {
    const { files, updateFileContent, createFile } = useFileSystemStore();
    const [content, setContent] = useState('');
    // const [currentFileId, setCurrentFileId] = useState<string | null>(fileId || null);
    const [currentFileId, setCurrentFileId] = useState<string | null>(fileId || null);

    useEffect(() => {
        if (fileId && fileId !== currentFileId) {
            setCurrentFileId(fileId);
        }
    }, [fileId, currentFileId]);

    useEffect(() => {
        if (currentFileId) {
            const file = files.find((f) => f.id === currentFileId);
            if (file && file.content !== undefined) {
                setContent(file.content);
            }
        }
        // Only load content when switching files to avoid overwriting unsaved changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFileId]);

    const handleSave = () => {
        if (currentFileId) {
            updateFileContent(currentFileId, content);
        } else {
            const newFileName = `Untitled-${Date.now()}.txt`;
            const newId = createFile('desktop', newFileName, 'file', content);
            setCurrentFileId(newId);
            alert('Saved to Desktop as ' + newFileName);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-black dark:text-white transition-colors">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800">
                <button
                    className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded text-sm transition-colors"
                    onClick={handleSave}
                >
                    <Save size={14} />
                    <span>Save</span>
                </button>
                <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {content.length} characters
                </span>
            </div>

            {/* Editor */}
            <textarea
                className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm bg-white dark:bg-slate-900 text-black dark:text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type something..."
            />
        </div>
    );
};

export default Notepad;
