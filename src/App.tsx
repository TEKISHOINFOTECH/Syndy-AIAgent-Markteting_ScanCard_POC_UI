import { useState } from 'react';
import Navbar from './components/Navbar';
import DatabaseView from './components/DatabaseView';
import { HomePage } from './components/HomePage';
import { VoiceAssistant } from './components/VoiceAssistant';
import { CardScannerApp } from './components/CardScannerApp';

function App() {
  const [activeView, setActiveView] = useState<'home' | 'analysis' | 'cardscanner'>('home');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false); // Navbar collapse state
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // Side panel state


  const handleNavClick = (view: 'home' | 'analysis' | 'cardscanner') => {
    setActiveView(view);
    setIsCollapsed(false);
    setIsSidePanelOpen(false);
  };

  const toggleNavbar = () => {
    // Prevent navbar from expanding if the side panel is open
    if (!isSidePanelOpen) {
      setIsCollapsed((prev) => !prev);
    }
  }

  const openVoiceAssistant = () => {
    setIsVoiceAssistantOpen(true);
  };

  const closeVoiceAssistant = () => {
    setIsVoiceAssistantOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-y-auto" style={{background: 'linear-gradient(135deg, #0e1a3b 0%, #1a2456 50%, #0e1a3b 100%)'}}>
      {/* Dark blue background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="flex min-h-screen overflow-y-auto relative z-10">
        {/* Left Sidebar - Navigation & Features */}

        <Navbar   activeView={activeView}
          onNavClick={handleNavClick}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleNavbar}/>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative p-4 pt-24 sm:p-5 sm:pt-24 md:p-6 md:pt-28 overflow-y-auto">
          {activeView === 'home' && <HomePage onOpenVoiceAssistant={openVoiceAssistant} activeView={activeView} onNavClick={handleNavClick} />}
          {activeView === 'analysis' && (
            <DatabaseView
              toggleNavbar={toggleNavbar}
              setIsSidePanelOpen={setIsSidePanelOpen}
              activeView={activeView}
              onNavClick={handleNavClick}
            />
          )}
          {activeView === 'cardscanner' && <CardScannerApp activeView={activeView} onNavClick={handleNavClick} />}
        </main>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={closeVoiceAssistant}
      />
    </div>
  );
}

export default App;