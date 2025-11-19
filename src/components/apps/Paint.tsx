import React, { useRef, useState, useEffect } from 'react';
import { Paintbrush, Eraser, Square, Circle, Download, Trash2 } from 'lucide-react';
import clsx from 'clsx';

type Tool = 'brush' | 'eraser' | 'rect' | 'circle';

const Paint: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<Tool>('brush');
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [snapshot, setSnapshot] = useState<ImageData | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 600;
            const context = canvas.getContext('2d');
            if (context) {
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.fillStyle = 'white';
                context.fillRect(0, 0, canvas.width, canvas.height);
                ctxRef.current = context;
            }
        }
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        const ctx = ctxRef.current;
        if (!ctx || !canvasRef.current) return;
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setStartPos({ x, y });
        setSnapshot(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = brushSize;
    };

    const draw = (e: React.MouseEvent) => {
        const ctx = ctxRef.current;
        if (!isDrawing || !ctx || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'brush' || tool === 'eraser') {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (tool === 'rect' || tool === 'circle') {
            if (snapshot) {
                ctx.putImageData(snapshot, 0, 0);
            }
            ctx.beginPath();
            const w = x - startPos.x;
            const h = y - startPos.y;

            if (tool === 'rect') {
                ctx.strokeRect(startPos.x, startPos.y, w, h);
            } else {
                ctx.beginPath();
                const r = Math.sqrt(w * w + h * h);
                ctx.arc(startPos.x, startPos.y, r, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        const ctx = ctxRef.current;
        if (isDrawing && ctx) {
            ctx.closePath();
            setIsDrawing(false);
        }
    };

    const clearCanvas = () => {
        const ctx = ctxRef.current;
        if (ctx && canvasRef.current) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    const downloadImage = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = `drawing-${Date.now()}.png`;
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    const tools = [
        { id: 'brush', icon: <Paintbrush size={18} /> },
        { id: 'eraser', icon: <Eraser size={18} /> },
        { id: 'rect', icon: <Square size={18} /> },
        { id: 'circle', icon: <Circle size={18} /> },
    ];

    const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'];

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-slate-900 transition-colors">
            {/* Toolbar */}
            <div className="flex items-center gap-4 p-2 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex bg-gray-100 rounded p-1 gap-1">
                    {tools.map((t) => (
                        <button
                            key={t.id}
                            className={clsx(
                                "p-2 rounded transition-colors",
                                tool === t.id
                                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                                    : "hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                            )}
                            onClick={() => setTool(t.id as Tool)}
                        >
                            {t.icon}
                        </button>
                    ))}
                </div>

                <div className="h-8 w-[1px] bg-gray-300" />

                <div className="flex gap-1">
                    {colors.map((c) => (
                        <button
                            key={c}
                            className={clsx(
                                "w-6 h-6 rounded-full border border-gray-300 shadow-sm",
                                color === c && tool !== 'eraser' ? "ring-2 ring-blue-500 ring-offset-1" : ""
                            )}
                            style={{ backgroundColor: c }}
                            onClick={() => setColor(c)}
                        />
                    ))}
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                    />
                </div>

                <div className="h-8 w-[1px] bg-gray-300" />

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Size:</span>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-24"
                    />
                </div>

                <div className="flex-1" />

                <div className="flex gap-2">
                    <button onClick={clearCanvas} className="p-2 text-red-500 hover:bg-red-50 rounded" title="Clear">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={downloadImage} className="p-2 text-blue-500 hover:bg-blue-50 rounded" title="Save">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-hidden relative cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="block"
                />
            </div>
        </div>
    );
};

export default Paint;
