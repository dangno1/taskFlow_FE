import React from 'react';

export default function AuthScreen({
  authMode,
  setAuthMode,
  authUsername,
  setAuthUsername,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  resetToken,
  setResetToken,
  showPassword,
  setShowPassword,
  authError,
  setAuthError,
  passwordResetMessage,
  passwordResetError,
  passwordResetLoading,
  authLoading,
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleResetPassword
}) {
  const title = authMode === 'register'
    ? 'Đăng ký tài khoản mới'
    : authMode === 'forgot'
      ? 'Quên mật khẩu'
      : authMode === 'reset'
        ? 'Đặt lại mật khẩu'
        : 'Đăng nhập tài khoản';

  const submitLabel = authMode === 'register'
    ? 'Đăng ký tài khoản'
    : authMode === 'forgot'
      ? 'Gửi yêu cầu đặt lại'
      : authMode === 'reset'
        ? 'Đặt lại mật khẩu'
        : 'Đăng nhập ngay';

  const showPasswordField = authMode !== 'forgot';
  const showUsernameField = authMode === 'register';
  const showResetTokenField = authMode === 'reset';

  const formSubmitHandler = authMode === 'login'
    ? handleLogin
    : authMode === 'register'
      ? handleRegister
      : authMode === 'forgot'
        ? handleForgotPassword
        : handleResetPassword;

  const displayError = authError || passwordResetError;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-sans animate-in fade-in duration-300 transition-colors">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-[100px] animate-pulse delay-700"></div>

      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 font-bold text-3xl text-white shadow-xl shadow-violet-500/20 mb-4 animate-bounce">
            D
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none mb-2 transition-colors">DANGND_UTC</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Hệ thống quản lý công việc cá nhân thông minh</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center transition-colors">{title}</h2>

          {displayError && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {displayError}
            </div>
          )}

          {passwordResetMessage && (
            <div className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-semibold">
              {passwordResetMessage}
            </div>
          )}

          <form onSubmit={formSubmitHandler} className="space-y-4">
            {showUsernameField && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Tên tài khoản</label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Nhập tên tài khoản..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Email đăng nhập</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Nhập địa chỉ email..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                required
              />
            </div>

            {showResetTokenField && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Mã đặt lại</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Nhập mã đặt lại từ email..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  required
                />
              </div>
            )}

            {showPasswordField && (
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">
                  {authMode === 'reset' ? 'Mật khẩu mới' : 'Mật khẩu'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={authMode === 'reset' ? 'Nhập mật khẩu mới...' : 'Nhập mật khẩu...'}
                  className="w-full px-4 pr-10 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || passwordResetLoading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-xl font-semibold shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {(authLoading || passwordResetLoading) ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                submitLabel
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            {authMode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setAuthError('');
                  }}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className="block text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Bạn chưa có tài khoản? Đăng ký ngay
                </button>
              </>
            )}

            {authMode === 'register' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
              >
                Đã có tài khoản? Đăng nhập ngay
              </button>
            )}

            {authMode === 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('reset');
                    setAuthError('');
                  }}
                  className="block text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Tôi đã có mã đặt lại
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Quay lại đăng nhập
                </button>
              </>
            )}

            {authMode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
              >
                Quay lại đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
