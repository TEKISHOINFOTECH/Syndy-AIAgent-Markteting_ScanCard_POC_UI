import {
  Home,
  BarChart3,
  Settings,
  CreditCard,
} from 'lucide-react';
import tekishoLogo from '../resources/Logo_Tekisho.png';

interface NavbarProps {
  activeView: 'home' | 'analysis' | 'cardscanner';
  onNavClick: (view: 'home' | 'analysis' | 'cardscanner') => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

interface NavButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function NavButton({ label, icon, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 ease-in-out text-xs sm:text-sm font-medium flex-shrink-0 ${
        active ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30' : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      <div className="flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-current shrink-0">{icon}</div>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function Navbar({ activeView, onNavClick }: NavbarProps) {
  const navItems: Array<{ label: string; icon: React.ReactNode; view: 'home' | 'analysis' | 'cardscanner' }> = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, view: 'home' },
    { label: 'Card Scanner', icon: <CreditCard className="w-5 h-5" />, view: 'cardscanner' },
    { label: 'Analysis', icon: <BarChart3 className="w-5 h-5" />, view: 'analysis' },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-4">
        <nav className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-2 sm:p-2.5 md:p-3 backdrop-blur-xl border shadow-sm rounded-xl sm:rounded-2xl mt-1.5 sm:mt-2 md:mt-3" style={{background: 'rgba(14, 26, 59, 0.9)', borderColor: 'rgba(14, 26, 59, 0.5)'}}>
          {/* Logo/Brand - Always on left */}
          <button
            onClick={() => onNavClick('home')}
            className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to Home"
          >
            <img 
              src={tekishoLogo} 
              alt="Tekisho Logo" 
              className="h-8 sm:h-9 md:h-10 w-auto object-contain"
            />
          </button>

          {/* Navigation Items - Scrollable from left on mobile */}
          <div className="flex-1 flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 whitespace-nowrap">
              {navItems.map((item) => (
                <NavButton
                  key={item.view}
                  label={item.label}
                  icon={item.icon}
                  active={activeView === item.view}
                  onClick={() => onNavClick(item.view)}
                />
              ))}
            </div>
          </div>

          {/* Settings Button - Always on right */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => console.log('Open settings')}
              className="px-2 sm:px-2.5 md:px-3 py-2 sm:py-2 rounded-lg text-gray-300 border shadow-sm hover:text-white transition-colors"
              style={{background: 'rgba(22, 35, 71, 0.6)', borderColor: 'rgba(22, 35, 71, 0.5)'}}
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