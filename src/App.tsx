import { useState } from 'react';
import { HomePage } from './components/HomePage';
import { CardScannerApp } from './components/CardScannerApp';

function App() {
  const [activeView, setActiveView] = useState<'home' | 'cardscanner'>('home');

  const handleNavClick = (view: 'home' | 'cardscanner') => {
    setActiveView(view);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 relative overflow-y-auto">
      {/* Light glassmorphism background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="flex min-h-screen overflow-y-auto relative z-10">
        <main className={`flex-1 flex flex-col relative overflow-y-auto ${activeView === 'cardscanner' ? 'p-0' : ''}`}>
          {activeView === 'home' && <HomePage onNavClick={handleNavClick} />}
          {activeView === 'cardscanner' && <CardScannerApp onNavClick={handleNavClick} />}
        </main>
      </div>
    </div>
  );
}

export default App;