import React from 'react';

export default function Header({
  user,
  setIsProfileOpen,
  setProfileUsername,
  setProfileAvatar,
  setProfilePassword,
  handleLogout,
  isDarkMode,
  toggleDarkMode,
  showNotification
}) {
  const handleOpenProfile = () => {
    setProfileUsername(user?.username || '');
    setProfileAvatar(user?.avatar || '');
    setProfilePassword('');
    setIsProfileOpen(true);
  };

  const currentPlan = user?.plan || 'Free';
  const planBadgeClassName = currentPlan === 'VIP'
    ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
    : currentPlan === 'Premium'
      ? 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800'
      : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm z-10 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-800">
      <div>
        <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 dark:text-slate-100">
          Hi, {user?.username || 'User'} 👋
          <span className={`ml-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${planBadgeClassName}`}>
            {currentPlan}
          </span>
        </h2>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5 dark:text-slate-500">Finish your tasks today!</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark mode button */}
        <button 
          onClick={toggleDarkMode}
          className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-600 cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300" 
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>

        {/* Notification bell button */}
        <button 
          onClick={() => showNotification('You have no new notifications!', 'info')}
          className="relative p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-600 cursor-pointer dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300" 
          title="Notifications"
        >
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

        {/* User Dropdown Profile Menu */}
        <div
          onClick={handleOpenProfile}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-full cursor-pointer transition-all active:scale-[0.98] dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600"
        >
          {user?.avatar ? (
            <img src={user.avatar} className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" alt="Avatar" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs dark:bg-violet-900/50 dark:text-violet-400">
              {user?.username ? user.username[0].toUpperCase() : 'H'}
            </div>
          )}
          <span className="text-xs font-bold text-slate-600 hidden md:block dark:text-slate-300">
            {user?.username ? user.username.substring(0, 5) : 'User'}
          </span>
          <svg className="w-3 h-3 text-slate-400 hidden md:block dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>

        {/* Logout Mobile */}
        <button
          onClick={handleLogout}
          className="p-2 bg-slate-100 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all md:hidden dark:bg-slate-800 dark:hover:bg-rose-900/20"
          title="Log out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </header>
  );
}
