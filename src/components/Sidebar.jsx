import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  setIsProfileOpen,
  setProfileUsername,
  setProfileAvatar,
  setProfilePassword,
  setProfileError,
  setProfileSuccess,
  setSelectedProject,
  handleLogout
}) {
  const handleOpenProfile = () => {
    setProfileUsername(user?.username || '');
    setProfileAvatar(user?.avatar || '');
    setProfilePassword('');
    setProfileError('');
    setProfileSuccess('');
    setIsProfileOpen(true);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col justify-between p-6 hidden md:flex transition-colors duration-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100">
      <div>
        {/* Logo Nuegas Style */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-violet-500/30">
            D
          </div>
          <div>
            <h1 className="font-extrabold text-lg leading-tight tracking-tight text-slate-800 dark:text-white">DANGND_UTC</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${activeTab === 'dashboard'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>
            Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('projects');
              setSelectedProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${activeTab === 'projects'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            Projects
          </button>
          <button
            onClick={() => {
              setActiveTab('kanban');
              setSelectedProject(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${activeTab === 'kanban'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z"></path></svg>
            Kanban
          </button>
          <button
            onClick={handleOpenProfile}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-xl text-sm font-semibold transition-all cursor-pointer dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Profile
          </button>
        </nav>
      </div>

      {/* Sidebar Bottom Widgets */}
      <div className="space-y-4">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl cursor-pointer active:scale-[0.98] transition-all font-bold text-sm shadow-sm dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-500 dark:hover:bg-rose-900/40"
          title="Đăng xuất khỏi hệ thống"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
