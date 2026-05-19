import React from 'react';

export default function TaskDetailsModal({
  isTaskDetailsOpen,
  setIsTaskDetailsOpen,
  selectedTaskDetails,
  setSelectedTaskDetails,
  editTaskTitle,
  setEditTaskTitle,
  editTaskDesc,
  setEditTaskDesc,
  editTaskDeadline,
  setEditTaskDeadline,
  editTaskPriority,
  setEditTaskPriority,
  editTaskProject,
  setEditTaskProject,
  editTaskStatus,
  setEditTaskStatus,
  projects,
  handleUpdateTaskDetails
}) {
  if (!isTaskDetailsOpen || !selectedTaskDetails) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-white transition-colors">
        <button
          onClick={() => {
            setIsTaskDetailsOpen(false);
            setSelectedTaskDetails(null);
          }}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer p-1 rounded-lg dark:hover:bg-slate-800"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-200 dark:border-slate-800 pb-3 transition-colors">
          <span className="text-xl">📝</span>
          <h3 className="font-extrabold text-base">Chi tiết nhiệm vụ</h3>
        </div>

        <form onSubmit={handleUpdateTaskDetails} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Tên nhiệm vụ</label>
            <input
              type="text"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
              placeholder="Nhập tên nhiệm vụ..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600 font-semibold"
              required
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Mô tả chi tiết</label>
            <textarea
              value={editTaskDesc}
              onChange={(e) => setEditTaskDesc(e.target.value)}
              placeholder="Nhập mô tả hoặc ghi chú của nhiệm vụ..."
              rows="4"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all placeholder-slate-400 dark:placeholder-slate-600 resize-none leading-relaxed"
            />
          </div>

          {/* Deadline & Priority Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Hạn chót</label>
              <input
                type="date"
                value={editTaskDeadline}
                onChange={(e) => setEditTaskDeadline(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Độ ưu tiên</label>
              <select
                value={editTaskPriority}
                onChange={(e) => setEditTaskPriority(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all font-semibold"
              >
                <option value="Cao" className="bg-white dark:bg-slate-900 text-rose-500 dark:text-rose-455">Cao</option>
                <option value="Trung bình" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-455">Trung bình</option>
                <option value="Thấp" className="bg-white dark:bg-slate-900 text-emerald-500 dark:text-emerald-455">Thấp</option>
              </select>
            </div>
          </div>

          {/* Project & Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Thuộc dự án</label>
              <select
                value={editTaskProject}
                onChange={(e) => setEditTaskProject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all font-semibold"
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">☁️ Tự do (Không dự án)</option>
                {projects.map(proj => (
                  <option key={proj._id} value={proj._id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                    📁 {proj.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider transition-colors">Trạng thái công việc</label>
              <select
                value={editTaskStatus}
                onChange={(e) => setEditTaskStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 transition-all font-semibold"
              >
                <option value="todo" className="bg-white dark:bg-slate-900 text-rose-500 dark:text-rose-450">🔴 Cần làm / Quá hạn</option>
                <option value="doing" className="bg-white dark:bg-slate-900 text-blue-500 dark:text-blue-450">🔵 Đang thực hiện</option>
                <option value="testing" className="bg-white dark:bg-slate-900 text-amber-500 dark:text-amber-450">🟡 Kiểm thử / Testing</option>
                <option value="done" className="bg-white dark:bg-slate-900 text-emerald-500 dark:text-emerald-450">🟢 Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800 mt-5 transition-colors">
            <button
              type="button"
              onClick={() => {
                setIsTaskDetailsOpen(false);
                setSelectedTaskDetails(null);
              }}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              HỦY BỎ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20"
            >
              LƯU THAY ĐỔI
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
