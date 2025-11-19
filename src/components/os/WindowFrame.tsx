import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useWindowStore, type WindowState } from '../../store/windowStore';
import clsx from 'clsx';

interface WindowFrameProps {
    window: WindowState;
}

const MIN_WIDTH = 300;
const MIN_HEIGHT = 200;

const WindowFrame: React.FC<WindowFrameProps> = ({ window: win }) => {
    const {
        focusWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        updateWindowPosition,
        updateWindowSize,
    } = useWindowStore();

    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDirection, setResizeDirection] = useState<string | null>(null);
    const [initialResizeState, setInitialResizeState] = useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        mouseX: 0,
        mouseY: 0,
    });

    const windowRef = useRef<HTMLDivElement>(null);

    // Focus on click
    const handleMouseDown = () => {
        focusWindow(win.id);
    };

    // Dragging Logic
    const handleTitleBarMouseDown = (e: React.MouseEvent) => {
        if (win.isMaximized) return;
        e.preventDefault();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - win.position.x,
            y: e.clientY - win.position.y,
        });
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            updateWindowPosition(win.id, {
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, win.id, updateWindowPosition]);

    // Resizing Logic
    const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);
        setResizeDirection(direction);
        setInitialResizeState({
            width: win.size.width,
            height: win.size.height,
            x: win.position.x,
            y: win.position.y,
            mouseX: e.clientX,
            mouseY: e.clientY,
        });
    };

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - initialResizeState.mouseX;
            const deltaY = e.clientY - initialResizeState.mouseY;

            let newWidth = initialResizeState.width;
            let newHeight = initialResizeState.height;
            let newX = initialResizeState.x;
            let newY = initialResizeState.y;

            if (resizeDirection?.includes('e')) {
                newWidth = Math.max(MIN_WIDTH, initialResizeState.width + deltaX);
            }
            if (resizeDirection?.includes('s')) {
                newHeight = Math.max(MIN_HEIGHT, initialResizeState.height + deltaY);
            }
            if (resizeDirection?.includes('w')) {
                const possibleWidth = initialResizeState.width - deltaX;
                if (possibleWidth >= MIN_WIDTH) {
                    newWidth = possibleWidth;
                    newX = initialResizeState.x + deltaX;
                }
            }
            if (resizeDirection?.includes('n')) {
                const possibleHeight = initialResizeState.height - deltaY;
                if (possibleHeight >= MIN_HEIGHT) {
                    newHeight = possibleHeight;
                    newY = initialResizeState.y + deltaY;
                }
            }

            updateWindowSize(win.id, { width: newWidth, height: newHeight });
            updateWindowPosition(win.id, { x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeDirection(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, resizeDirection, initialResizeState, win.id, updateWindowSize, updateWindowPosition]);

    if (!win.isOpen || win.isMinimized) return null;

    return (
        <div
            ref={windowRef}
            className={clsx(
                "absolute flex flex-col bg-slate-900 rounded-lg shadow-2xl border border-white/10 overflow-hidden transition-shadow",
                win.isMaximized ? "inset-0 rounded-none !transform-none !w-full !h-[calc(100vh-48px)]" : "",
                isDragging ? "cursor-grabbing" : ""
            )}
            style={{
                left: win.isMaximized ? 0 : win.position.x,
                top: win.isMaximized ? 0 : win.position.y,
                width: win.isMaximized ? '100%' : win.size.width,
                height: win.isMaximized ? 'calc(100% - 48px)' : win.size.height,
                zIndex: win.zIndex,
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Title Bar */}
            <div
                className="h-10 bg-slate-800 flex items-center justify-between px-3 select-none cursor-default"
                onMouseDown={handleTitleBarMouseDown}
                onDoubleClick={() => win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-white/60">{win.icon}</span>
                    <span className="text-sm text-white font-medium">{win.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 hover:bg-white/10 rounded text-white/80 hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
                    >
                        <Minus size={14} />
                    </button>
                    <button
                        className="p-1 hover:bg-white/10 rounded text-white/80 hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (win.isMaximized) {
                                restoreWindow(win.id);
                            } else {
                                maximizeWindow(win.id);
                            }
                        }}
                    >
                        {win.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button
                        className="p-1 hover:bg-red-500 rounded text-white/80 hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative bg-slate-950 overflow-hidden">
                {win.component}

                {/* Overlay to capture clicks when not focused (optional, but good for iframes) */}
                {/* <div className={clsx("absolute inset-0", isActive ? "hidden" : "block")} /> */}
            </div>

            {/* Resize Handles */}
            {!win.isMaximized && (
                <>
                    <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeMouseDown(e, 'nw')} />
                    <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeMouseDown(e, 'ne')} />
                    <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeMouseDown(e, 'sw')} />
                    <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-50" onMouseDown={(e) => handleResizeMouseDown(e, 'se')} />

                    <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize z-40" onMouseDown={(e) => handleResizeMouseDown(e, 'n')} />
                    <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize z-40" onMouseDown={(e) => handleResizeMouseDown(e, 's')} />
                    <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize z-40" onMouseDown={(e) => handleResizeMouseDown(e, 'w')} />
                    <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize z-40" onMouseDown={(e) => handleResizeMouseDown(e, 'e')} />
                </>
            )}
        </div>
    );
};

export default WindowFrame;
