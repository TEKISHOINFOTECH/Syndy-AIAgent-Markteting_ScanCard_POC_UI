import { motion } from 'framer-motion';

interface TopNavbarProps {
  activeView: 'home' | 'cardscanner';
  onNavClick: (view: 'home' | 'cardscanner') => void;
}

export function TopNavbar({ activeView, onNavClick }: TopNavbarProps) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'cardscanner', label: 'Card Scanner' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Tekisho
            </span>
          </div>

          {/* Navigation Items */}
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavClick(item.key as 'home' | 'cardscanner')}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  activeView === item.key
                    ? 'text-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {activeView === item.key && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <div className="flex items-center">
            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}