import {
  MessageSquare,
  Home,
  Camera,
  Upload,
  BarChart3,
  Settings,
  CreditCard,
} from 'lucide-react';

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
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ease-in-out text-sm font-medium ${
        active ? 'bg-green-500/10 text-green-600 ring-1 ring-green-200' : 'text-gray-600 hover:bg-white/60'
      }`}
    >
      <div className="flex items-center justify-center w-5 h-5 text-current">{icon}</div>
      <span>{label}</span>
    </button>
  );
}

function Navbar({ activeView, onNavClick, isCollapsed, toggleCollapse }: NavbarProps) {
  const navItems: Array<{ label: string; icon: React.ReactNode; view: 'home' | 'chat' | 'scan' | 'upload' | 'analysis' | 'cardscanner' }> = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, view: 'home' },
    { label: 'Chatterbox', icon: <MessageSquare className="w-5 h-5" />, view: 'chat' },
    { label: 'Scanner', icon: <Camera className="w-5 h-5" />, view: 'scan' },
    { label: 'Card Scanner', icon: <CreditCard className="w-5 h-5" />, view: 'cardscanner' },
    { label: 'Upload Files', icon: <Upload className="w-5 h-5" />, view: 'upload' },
    { label: 'Analysis', icon: <BarChart3 className="w-5 h-5" />, view: 'analysis' },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-30">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-xl border border-gray-100 shadow-sm rounded-2xl mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">T</div>
              <h1 className="text-lg font-bold text-gray-800">Tekisho</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => console.log('Open settings')}
              className="px-3 py-2 rounded-lg bg-white/60 text-gray-700 border border-gray-100 shadow-sm"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;