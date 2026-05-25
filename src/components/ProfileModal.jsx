import React from 'react';

export default function ProfileModal({
  isProfileOpen,
  setIsProfileOpen,
  profileUsername,
  setProfileUsername,
  profilePassword,
  setProfilePassword,
  profileAvatar,
  setProfileAvatar,
  profileLoading,
  user,
  handleAvatarChange,
  handleUpdateProfile
}) {
  if (!isProfileOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 transition-colors">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center transition-colors">Update account</h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Avatar Uploader */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer w-24 h-24">
              {profileAvatar ? (
                <img
                  src={profileAvatar}
                  className="w-24 h-24 rounded-full object-cover border-4 border-violet-500/30"
                  alt="Avatar Preview"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center font-bold text-3xl text-white border-4 border-violet-500/30">
                  {user?.username ? user.username[0].toUpperCase() : 'U'}
                </div>
              )}
              <label className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-all cursor-pointer font-bold gap-1 border border-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center transition-colors">Maximum size 2MB (Upload from your device)</span>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Username</label>
            <input
              type="text"
              value={profileUsername}
              onChange={(e) => setProfileUsername(e.target.value)}
              placeholder="Enter a new username..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
              required
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Email (cannot change)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900 rounded-xl text-sm text-slate-400 dark:text-slate-500 cursor-not-allowed transition-colors"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">New password (leave blank to keep current)</label>
            <input
              type="password"
              value={profilePassword}
              onChange={(e) => setProfilePassword(e.target.value)}
              placeholder="Enter new password..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
            />
          </div>

          {/* Actions Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsProfileOpen(false)}
              disabled={profileLoading}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 dark:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={profileLoading}
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {profileLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
