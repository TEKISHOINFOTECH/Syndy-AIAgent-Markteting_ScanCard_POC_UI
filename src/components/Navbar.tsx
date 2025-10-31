import {
  MessageSquare,
  Home,
  Camera,
  Upload,
  BarChart3,
  Settings,
  CreditCard,
} from 'lucide-react';
import tekishoLogo from '../resources/Logo_Tekisho.png';

interface NavbarProps {
  activeView: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner';
  onNavClick: (view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner') => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function NavButton({ label, icon, active, collapsed, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-2 sm:px-3 md:px-4 py-2 sm:py-2 rounded-xl transition-all duration-200 ease-in-out text-xs sm:text-sm font-medium flex-shrink-0 ${
        active ? 'bg-green-500/10 text-green-600 ring-1 ring-green-200' : 'text-gray-600 hover:bg-white/60'
      }`}
    >
      <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-current shrink-0">{icon}</div>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function Navbar({ activeView, onNavClick }: NavbarProps) {
  const navItems: Array<{ label: string; icon: React.ReactNode; view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner' }> = [
    { label: 'Card Scanner', icon: <CreditCard className="w-5 h-5" />, view: 'cardscanner' },
    { label: 'Home', icon: <Home className="w-5 h-5" />, view: 'home' },
    { label: 'Chatterbox', icon: <MessageSquare className="w-5 h-5" />, view: 'chat' },
    { label: 'Scanner', icon: <Camera className="w-5 h-5" />, view: 'scan' },
    { label: 'Upload Files', icon: <Upload className="w-5 h-5" />, view: 'upload' },
    { label: 'Analysis', icon: <BarChart3 className="w-5 h-5" />, view: 'analysis' },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4">
        <nav className="flex items-center gap-2 sm:gap-3 p-3 sm:p-2.5 md:p-3 bg-white/70 backdrop-blur-xl border border-gray-100 shadow-sm rounded-2xl mt-2 sm:mt-3 md:mt-4">
          {/* Logo/Brand - Always on left */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img 
              src={tekishoLogo} 
              alt="Tekisho Logo" 
              className="h-9 sm:h-9 md:h-10 w-auto object-contain"
            />
            <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 hidden sm:block">Tekisho</h1>
          </div>

          {/* Navigation Items - Scrollable from left on mobile */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 whitespace-nowrap">
              {navItems.map((item) => (
                <NavButton
                  key={item.view}
                  label={item.label}
                  icon={item.icon}
                  active={activeView === item.view}
                  collapsed={false}
                  onClick={() => onNavClick(item.view)}
                />
              ))}
            </div>
          </div>

          {/* Settings Button - Always on right */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => console.log('Open settings')}
              className="px-2 sm:px-2.5 md:px-3 py-2 sm:py-2 rounded-lg bg-white/60 text-gray-700 border border-gray-100 shadow-sm hover:bg-white/80 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 sm:w-4 md:w-4" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;