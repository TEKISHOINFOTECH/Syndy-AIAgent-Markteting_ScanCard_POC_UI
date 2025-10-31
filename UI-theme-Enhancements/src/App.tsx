import { useState } from 'react';
import Navbar from './components/Navbar';
import { HomePage } from './components/HomePage';
import { CardScannerApp } from './components/CardScannerApp';
import ChatView from './components/ChatView';
import UploadView from './components/UploadView';
import ScanView from './components/ScanView';
import DatabaseView from './components/DatabaseView';

function App() {
  const [activeView, setActiveView] = useState<'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner'>('home');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => {
    setActiveView(view);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Additional state for components
  const [analysisSubsection, setAnalysisSubsection] = useState<'overview' | 'stats' | 'database' | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <Navbar 
        isCollapsed={isCollapsed} 
        toggleCollapse={toggleCollapse} 
        activeView={activeView} 
        onNavClick={handleNavClick} 
      />
      <main className="relative">
        {/* Glassmorphic background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-6 pt-24">
          {activeView === 'home' && <HomePage />}
          {activeView === 'scan' && <ScanView />}
          {activeView === 'cardscanner' && <CardScannerApp />}
          {activeView === 'upload' && <UploadView />}
          {activeView === 'analysis' && (
            <DatabaseView 
              toggleNavbar={toggleNavbar}
              setIsSidePanelOpen={setIsSidePanelOpen}
            />
          )}
          {activeView === 'chat' && (
            <ChatView 
              activeView="chat"
              analysisSubsection={analysisSubsection}
              setAnalysisSubsection={setAnalysisSubsection}
              setActiveView={(view) => handleNavClick(view as any)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;