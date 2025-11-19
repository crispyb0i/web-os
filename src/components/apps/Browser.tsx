import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, Home } from 'lucide-react';

const Browser: React.FC = () => {
    const [url, setUrl] = useState('https://www.google.com/webhp?igu=1'); // Google with iframe permission
    const [inputUrl, setInputUrl] = useState('https://www.google.com/webhp?igu=1');
    const [history, setHistory] = useState<string[]>(['https://www.google.com/webhp?igu=1']);
    const [historyIndex, setHistoryIndex] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let targetUrl = inputUrl;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
            targetUrl = 'https://' + targetUrl;
        }
        navigateTo(targetUrl);
    };

    const navigateTo = (newUrl: string) => {
        setUrl(newUrl);
        setInputUrl(newUrl);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newUrl);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
            setInputUrl(history[newIndex]);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
            setInputUrl(history[newIndex]);
        }
    };

    const refresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = url;
        }
    };

    const goHome = () => {
        navigateTo('https://www.google.com/webhp?igu=1');
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-black dark:text-white transition-colors">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-slate-800 border-b border-gray-300 dark:border-gray-700">
                <div className="flex gap-1">
                    <button onClick={goBack} disabled={historyIndex === 0} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded disabled:opacity-30 transition-colors">
                        <ArrowLeft size={16} />
                    </button>
                    <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded disabled:opacity-30 transition-colors">
                        <ArrowRight size={16} />
                    </button>
                    <button onClick={refresh} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <RotateCw size={16} />
                    </button>
                    <button onClick={goHome} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors">
                        <Home size={16} />
                    </button>
                </div>

                <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus-within:ring-2 focus-within:ring-blue-400">
                    <Search size={14} className="text-gray-400" />
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="flex-1 outline-none text-gray-700 dark:text-gray-200 bg-transparent"
                        placeholder="Enter URL..."
                    />
                </form>
            </div>

            {/* Content */}
            <div className="flex-1 relative bg-white">
                <iframe
                    ref={iframeRef}
                    src={url}
                    className="w-full h-full border-0"
                    title="Browser"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
                {/* Overlay for when dragging windows over iframe to prevent pointer capture loss */}
                {/* This is a common issue with iframes in window managers, but we'll skip for now or add if needed */}
            </div>
        </div>
    );
};

export default Browser;
