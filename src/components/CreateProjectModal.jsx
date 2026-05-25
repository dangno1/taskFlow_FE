import React from 'react';

export default function CreateProjectModal({
  isCreateProjectOpen,
  setIsCreateProjectOpen,
  newProjectName,
  setNewProjectName,
  newProjectDesc,
  setNewProjectDesc,
  newProjectColor,
  setNewProjectColor,
  handleAddProject
}) {
  if (!isCreateProjectOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-white transition-colors">
        <button
          onClick={() => setIsCreateProjectOpen(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer p-1 rounded-lg dark:hover:bg-slate-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors">
          <span className="text-xl">📁</span>
          <h3 className="font-extrabold text-base">Create new project</h3>
        </div>

        <form onSubmit={handleAddProject} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Project name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Project description</label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="Describe the goals for this project..."
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600 resize-none"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Project color</label>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {['#8B5CF6', '#3B82F6', '#10B981', '#F43F5E', '#F59E0B', '#EC4899', '#14B8A6', '#06B6D4'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewProjectColor(color)}
                  className={`w-7 h-7 rounded-full transition-all border-2 relative cursor-pointer active:scale-90 ${newProjectColor === color
                      ? 'border-white scale-110 shadow'
                      : 'border-transparent hover:scale-105'
                    }`}
                  style={{ backgroundColor: color }}
                >
                  {newProjectColor === color && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-5 transition-colors">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20"
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
