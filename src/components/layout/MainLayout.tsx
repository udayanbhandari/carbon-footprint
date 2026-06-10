import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useAppStore } from '../../store/appStore';
import { NAV, LANGUAGES } from '../../data/carbonData';

export function MainLayout() {
  const language = useAppStore(s => s.language);
  const setLanguage = useAppStore(s => s.setLanguage);

  return (
    <div className="flex h-screen bg-brand-50 text-gray-900 font-sans">
      {/* Desktop sidebar navigation */}
      <nav aria-label="Main navigation" className="hidden md:flex flex-col w-64 bg-brand-900 text-white flex-shrink-0">
        <div className="p-6">
          <div className="text-2xl font-bold flex items-center gap-2">
            <span aria-hidden="true">🌱</span>
            <span>CarbonSense</span>
          </div>
        </div>

        <ul role="list" className="flex-1 px-4 space-y-2 mt-4">
          {NAV.map(item => (
            <li key={item.to}>
              <NavLink 
                to={item.to} 
                aria-label={item.aria}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 min-h-[44px]',
                  isActive
                    ? 'bg-brand-700 shadow-sm text-white'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                )}
              >
                <span aria-hidden="true" className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="p-4 mt-auto">
          <label htmlFor="lang-sel" className="sr-only">Select display language</label>
          <select 
            id="lang-sel" 
            aria-label="Select display language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="w-full bg-brand-800 border-brand-700 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none min-h-[44px]"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeLabel}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* Main content area */}
      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0 bg-mesh relative">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-safe">
        {NAV.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            aria-label={item.aria}
            className={({ isActive }) => clsx(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors min-h-[44px]',
              isActive ? 'text-brand-600' : 'text-gray-500 hover:text-brand-500'
            )}
          >
            <span aria-hidden="true" className="text-xl">{item.icon}</span>
            <span className="text-[10px] leading-none font-medium">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
