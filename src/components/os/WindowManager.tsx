import React from 'react';
import { useWindowStore } from '../../store/windowStore';
import WindowFrame from './WindowFrame';
import { AnimatePresence, motion } from 'framer-motion';

const WindowManager: React.FC = () => {
    const { windows } = useWindowStore();

    return (
        <>
            <AnimatePresence>
                {windows.map((win) => (
                    win.isOpen && !win.isMinimized && (
                        <motion.div
                            key={win.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute inset-0 pointer-events-none" // Wrapper to allow animations but not block clicks
                        >
                            {/* Pointer events auto is handled inside WindowFrame or we remove pointer-events-none from wrapper and handle positioning carefully */}
                            {/* Actually, WindowFrame is absolute positioned. The wrapper might interfere if it's inset-0.
                     Let's just render WindowFrame directly but wrap in motion.div for animation.
                     However, WindowFrame handles its own positioning. 
                     We need to be careful not to double-wrap with conflicting styles.
                 */}
                            <div className="pointer-events-auto">
                                <WindowFrame window={win} />
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>
        </>
    );
};

export default WindowManager;
