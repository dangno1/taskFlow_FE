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
  passwordResetLoading,
  authLoading,
  googleLoading,
  googleReady,
  handleLogin,
  handleRegister,
  handleGoogleSignIn,
  handleForgotPassword,
  handleResetPassword
}) {
  const title = authMode === 'register'
    ? 'Register a new account'
    : authMode === 'forgot'
      ? 'Forgot password'
      : authMode === 'reset'
        ? 'Reset password'
        : 'Log in';

  const submitLabel = authMode === 'register'
    ? 'Register'
    : authMode === 'forgot'
      ? 'Send reset request'
      : authMode === 'reset'
        ? 'Reset password'
        : 'Log in now';

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden font-sans animate-in fade-in duration-300 transition-colors">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-[100px] animate-pulse delay-700"></div>

      <div className="w-full max-w-md px-4 z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 font-bold text-3xl text-white shadow-xl shadow-violet-500/20 mb-4 animate-bounce">
            D
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none mb-2 transition-colors">DANGND</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Smart personal task management system</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl transition-colors">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center transition-colors">{title}</h2>

          <form onSubmit={formSubmitHandler} className="space-y-4">
            {showUsernameField && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Username</label>
                <input
                  type="text"
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Login email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="Enter your email..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                required
              />
            </div>

            {showResetTokenField && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Reset code</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Enter the reset code from email..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
                  required
                />
              </div>
            )}

            {showPasswordField && (
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">
                  {authMode === 'reset' ? 'New password' : 'Password'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder={authMode === 'reset' ? 'Enter a new password...' : 'Enter password...'}
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

            {(authMode === 'login' || authMode === 'register') && (
              <div className="mt-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></span>
                  <span>{authMode === 'login' ? 'or sign in with' : 'or sign up with'}</span>
                  <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={!googleReady || googleLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 transition-all"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M23.64 12.204c0-.74-.067-1.45-.193-2.14H12.5v4.05h6.52c-.28 1.52-1.08 2.81-2.31 3.68v3.05h3.73c2.18-2.01 3.44-4.96 3.44-8.66z"/>
                    <path fill="#34A853" d="M12.5 24c3.13 0 5.76-1.03 7.68-2.8l-3.73-3.05c-1.04.7-2.37 1.1-3.95 1.1-3.04 0-5.61-2.05-6.53-4.8H2.2v3.03C4.1 21.84 8.97 24 12.5 24z"/>
                    <path fill="#FBBC05" d="M5.97 14.43A7.59 7.59 0 0 1 5.5 12c0-.82.14-1.62.4-2.35V6.62H2.2A12.5 12.5 0 0 0 0 12c0 1.96.46 3.82 1.28 5.5l4.69-3.07z"/>
                    <path fill="#EA4335" d="M12.5 4.77c1.7 0 3.23.58 4.43 1.73l3.33-3.33C18.28 1.28 15.63 0 12.5 0 8.97 0 4.1 2.16 2.2 5.62l4.72 3.03C6.9 6.82 9.46 4.77 12.5 4.77z"/>
                  </svg>
                  {googleLoading ? 'Processing...' : authMode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 text-center space-y-3">
            {authMode === 'login' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                  }}
                  className="block mx-auto mb-2 text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                  }}
                  className="block mx-auto text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Don't have an account? Register now
                </button>
              </>
            )}

            {authMode === 'register' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                }}
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
              >
                Already have an account? Log in now
              </button>
            )}

            {authMode === 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('reset');
                  }}
                  className="block text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  I already have a reset code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                  }}
                  className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
                >
                  Back to login
                </button>
              </>
            )}

            {authMode === 'reset' && (
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                }}
                className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
              >
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
