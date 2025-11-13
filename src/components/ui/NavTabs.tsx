import { CreditCard } from 'lucide-react';

interface NavTabsProps {
  activeView?: 'home' | 'analysis' | 'cardscanner';
  onNavClick?: (view: 'home' | 'analysis' | 'cardscanner') => void;
  className?: string;
  compact?: boolean;
}

export function NavTabs({ activeView = 'home', onNavClick, className = '', compact = false }: NavTabsProps) {
  const navItems = [
    { label: 'Card Scanner', icon: <CreditCard className={compact ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5"} />, view: 'cardscanner' as const },
  ];

  if (!onNavClick) {
    return null;
  }

  return (
    <div className={`grid grid-cols-2 sm:flex sm:flex-wrap items-stretch gap-2.5 sm:gap-2.5 md:gap-3 p-3 sm:p-3 md:p-4 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-2xl shadow-sm ${className}`}>
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavClick(item.view)}
          className={`flex items-center justify-start sm:justify-center gap-2 sm:gap-2 px-3.5 sm:px-4 md:px-5 py-3 sm:py-2.5 md:py-3 rounded-xl sm:rounded-xl text-xs sm:text-sm font-medium transition-colors w-full sm:w-auto sm:flex-shrink-0 ${
            activeView === item.view
              ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-400/30'
              : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
          }`}
        >
          {item.icon}
          <span className="whitespace-nowrap text-left sm:text-center">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
