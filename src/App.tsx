import React, { useState } from 'react';
import Desktop from './components/os/Desktop';
import Taskbar from './components/os/Taskbar';
import StartMenu from './components/os/StartMenu';
import WindowManager from './components/os/WindowManager';

function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  React.useEffect(() => {
    // Always use dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const toggleStartMenu = () => setIsStartMenuOpen(!isStartMenuOpen);
  const closeStartMenu = () => setIsStartMenuOpen(false);

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-black" onClick={() => isStartMenuOpen && closeStartMenu()}>
      <Desktop />

      {/* Window Manager */}
      <WindowManager />

      <StartMenu isOpen={isStartMenuOpen} onClose={closeStartMenu} />

      <Taskbar
        onToggleStartMenu={() => {
          toggleStartMenu();
        }}
        isStartMenuOpen={isStartMenuOpen}
      />
    </div>
  );
}

export default App;
