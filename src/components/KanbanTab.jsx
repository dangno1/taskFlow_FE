import React from 'react';

export default function KanbanTab({
  projects,
  showNotification,
  filteredTasks,
  kanbanProjectFilter,
  setKanbanProjectFilter,
  draggingTaskId,
  setDraggingTaskId,
  draggedOverColumn,
  setDraggedOverColumn,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  getProjectInfo,
  getTaskStatus,
  toggleTask,
  deleteTask,
  openTaskDetails,
  todayStr
}) {
  const renderAssigneeInfo = (assignee) => {
    const user = assignee && typeof assignee === 'object' ? assignee : null;
    const displayName = user ? user.username || user.email : 'Unassigned';
    const initials = user ? (user.username || user.email || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'NA';

    return (
      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {user?.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="truncate font-semibold">{displayName}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 flex flex-col h-full overflow-hidden">
      {/* Header Row */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Kanban Board</h3>
          <p className="text-xs text-slate-400 font-semibold mt-1">Track tasks and drag them between columns for instant updates.</p>
        </div>
        <button
          onClick={() => {
            showNotification('To create a new task, use the quick entry form in Projects or Dashboard.', 'info');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-all cursor-pointer shadow-sm active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Task help
        </button>
      </div>

      {/* Project Filter Selector (Conditional: Pill Bar if <=3 projects, Select Dropdown if >3 projects) */}
      {projects.length > 3 ? (
        <div className="flex items-center gap-2.5 shrink-0 bg-slate-50/60 border border-slate-200/50 rounded-2xl p-3 dark:bg-slate-800/60 dark:border-slate-700/50">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider select-none pl-1">📁 Select project:</span>
          <select
            value={kanbanProjectFilter}
            onChange={(e) => setKanbanProjectFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-extrabold text-slate-705 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all cursor-pointer shadow-sm active:scale-[0.98] outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200"
          >
            <option value="all">🌟 All projects</option>
            <option value="free">☁️ Free tasks</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>📁 {proj.name}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 shrink-0 bg-slate-50/60 border border-slate-200/50 rounded-2xl p-3 overflow-x-auto scrollbar-none dark:bg-slate-800/60 dark:border-slate-700/50">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider select-none shrink-0 pl-1">📁 Project:</span>
          <div className="flex gap-2 min-w-0">
            {/* All Projects Pill */}
            <button
              onClick={() => setKanbanProjectFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 border shrink-0 ${
                kanbanProjectFilter === 'all'
                  ? 'bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-800/10'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              🌟 All projects
            </button>

            {/* Free Tasks Pill (No project) */}
            <button
              onClick={() => setKanbanProjectFilter('free')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 border shrink-0 ${
                kanbanProjectFilter === 'free'
                  ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-600/15'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              ☁️ Free tasks
            </button>

            {/* Single Project Pills */}
            {projects.map((proj) => (
              <button
                key={proj._id}
                onClick={() => setKanbanProjectFilter(proj._id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 border flex items-center gap-1.5 shrink-0 ${
                  kanbanProjectFilter === proj._id
                    ? 'text-white'
                    : 'bg-white hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                }`}
                style={
                  kanbanProjectFilter === proj._id
                    ? { backgroundColor: proj.color, borderColor: proj.color, boxShadow: `0 4px 12px ${proj.color}25` }
                    : { borderLeftColor: proj.color, borderLeftWidth: '4px', borderColor: '#E2E8F0' }
                }
              >
                <span>{proj.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Columns Grid (4 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1 overflow-y-auto pb-8">
        
        {/* Column 1: To do / Overdue (todo) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'todo')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'todo')}
          className={`border rounded-3xl p-5 flex flex-col h-full min-h-[500px] transition-all duration-200 ${
            draggedOverColumn === 'todo'
              ? 'bg-violet-50/40 border-violet-300 ring-2 ring-violet-500/10 shadow-md shadow-violet-500/5 scale-[1.01]'
              : 'bg-slate-100/50 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/60'
          }`}
        >
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm animate-pulse"></span>
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider dark:text-slate-200">To do / Overdue</h4>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              {filteredTasks.filter(t => getTaskStatus(t) === 'todo').length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredTasks.filter(t => getTaskStatus(t) === 'todo').map((task) => {
              const projInfo = getProjectInfo(task.project);
              const isDragging = draggingTaskId === task._id;
              return (
                <div
                  key={task._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all group flex flex-col justify-between space-y-3.5 relative overflow-hidden cursor-grab active:cursor-grabbing dark:bg-slate-900 dark:border-slate-700 dark:hover:shadow-slate-800/50 ${
                    isDragging ? 'opacity-40 scale-[0.98] border-dashed border-violet-400 rotate-1' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="w-4.5 h-4.5 rounded-md border-2 border-slate-300 text-violet-650 focus:ring-violet-500 transition-all cursor-pointer mt-0.5 shrink-0 scale-105 dark:border-slate-600 dark:bg-slate-700"
                    />
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskDetails(task)}>
                      <h5 className="font-bold text-sm text-slate-750 line-clamp-2 leading-snug hover:text-violet-650 transition-all dark:text-slate-200 dark:hover:text-violet-400">{task.title}</h5>
                      {renderAssigneeInfo(task.assignee)}
                    </div>
                  </div>

                  {/* Badges Footer */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-55 shrink-0">
                    {/* Project Badge */}
                    {projInfo ? (
                      <span
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border text-white shadow-sm"
                        style={{ backgroundColor: projInfo.color, borderColor: projInfo.color }}
                      >
                        📁 {projInfo.name}
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border bg-slate-50 border-slate-150 text-slate-400">
                        ☁️ Free task
                      </span>
                    )}

                    {/* Priority Badge */}
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>

                    {/* Deadline Badge */}
                    {task.deadline && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        task.deadline < todayStr
                          ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse font-extrabold dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                          : 'bg-slate-50 border-slate-100 text-slate-550 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400'
                      }`}>
                        📅 {task.deadline}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all p-1 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0 dark:hover:bg-slate-800"
                    title="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              );
            })}
            {filteredTasks.filter(t => getTaskStatus(t) === 'todo').length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">The board is empty! ✨</div>
            )}
          </div>
        </div>

        {/* Column 2: In progress (doing) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'doing')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'doing')}
          className={`border rounded-3xl p-5 flex flex-col h-full min-h-[500px] transition-all duration-200 ${
            draggedOverColumn === 'doing'
              ? 'bg-violet-50/40 border-violet-300 ring-2 ring-violet-500/10 shadow-md shadow-violet-500/5 scale-[1.01]'
              : 'bg-slate-100/50 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/60'
          }`}
        >
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm animate-bounce"></span>
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider dark:text-slate-200">In progress</h4>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              {filteredTasks.filter(t => getTaskStatus(t) === 'doing').length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredTasks.filter(t => getTaskStatus(t) === 'doing').map((task) => {
              const projInfo = getProjectInfo(task.project);
              const isDragging = draggingTaskId === task._id;
              return (
                <div
                  key={task._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all group flex flex-col justify-between space-y-3.5 relative overflow-hidden cursor-grab active:cursor-grabbing dark:bg-slate-900 dark:border-slate-700 dark:hover:shadow-slate-800/50 ${
                    isDragging ? 'opacity-40 scale-[0.98] border-dashed border-violet-400 rotate-1' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="w-4.5 h-4.5 rounded-md border-2 border-slate-300 text-violet-655 focus:ring-violet-500 transition-all cursor-pointer mt-0.5 shrink-0 scale-105 dark:border-slate-600 dark:bg-slate-700"
                    />
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskDetails(task)}>
                      <h5 className="font-bold text-sm text-slate-750 line-clamp-2 leading-snug hover:text-violet-650 transition-all dark:text-slate-200 dark:hover:text-violet-400">{task.title}</h5>
                      {renderAssigneeInfo(task.assignee)}
                    </div>
                  </div>

                  {/* Badges Footer */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-55 shrink-0">
                    {/* Project Badge */}
                    {projInfo ? (
                      <span
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border text-white shadow-sm"
                        style={{ backgroundColor: projInfo.color, borderColor: projInfo.color }}
                      >
                        📁 {projInfo.name}
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border bg-slate-50 border-slate-150 text-slate-400">
                        ☁️ Free task
                      </span>
                    )}

                    {/* Priority Badge */}
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>

                    {/* Deadline Badge */}
                    {task.deadline && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border bg-slate-50 border-slate-100 text-slate-550 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400">
                        📅 {task.deadline}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all p-1 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0 dark:hover:bg-slate-800"
                    title="Delete task"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              );
            })}
            {filteredTasks.filter(t => getTaskStatus(t) === 'doing').length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">Everything is prepared for today! 🚀</div>
            )}
          </div>
        </div>

        {/* Column 3: Testing (testing) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'testing')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'testing')}
          className={`border rounded-3xl p-5 flex flex-col h-full min-h-[500px] transition-all duration-200 ${
            draggedOverColumn === 'testing'
              ? 'bg-violet-50/40 border-violet-300 ring-2 ring-violet-500/10 shadow-md shadow-violet-500/5 scale-[1.01]'
              : 'bg-slate-100/50 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/60'
          }`}
        >
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm animate-pulse"></span>
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider dark:text-slate-200">Testing</h4>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              {filteredTasks.filter(t => getTaskStatus(t) === 'testing').length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredTasks.filter(t => getTaskStatus(t) === 'testing').map((task) => {
              const projInfo = getProjectInfo(task.project);
              const isDragging = draggingTaskId === task._id;
              return (
                <div
                  key={task._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow transition-all group flex flex-col justify-between space-y-3.5 relative overflow-hidden cursor-grab active:cursor-grabbing dark:bg-slate-900 dark:border-slate-700 dark:hover:shadow-slate-800/50 ${
                    isDragging ? 'opacity-40 scale-[0.98] border-dashed border-violet-400 rotate-1' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="w-4.5 h-4.5 rounded-md border-2 border-slate-300 text-violet-655 focus:ring-violet-500 transition-all cursor-pointer mt-0.5 shrink-0 scale-105 dark:border-slate-600 dark:bg-slate-700"
                    />
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskDetails(task)}>
                      <h5 className="font-bold text-sm text-slate-750 line-clamp-2 leading-snug hover:text-violet-650 transition-all dark:text-slate-200 dark:hover:text-violet-400">{task.title}</h5>
                      {renderAssigneeInfo(task.assignee)}
                    </div>
                  </div>

                  {/* Badges Footer */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-55 shrink-0">
                    {/* Project Badge */}
                    {projInfo ? (
                      <span
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border text-white shadow-sm"
                        style={{ backgroundColor: projInfo.color, borderColor: projInfo.color }}
                      >
                        📁 {projInfo.name}
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border bg-slate-50 border-slate-150 text-slate-400">
                        ☁️ Free task
                      </span>
                    )}

                    {/* Priority Badge */}
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      task.priority === 'High'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                        : task.priority === 'Medium'
                        ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400'
                    }`}>
                      {task.priority}
                    </span>

                    {/* Deadline Badge */}
                    {task.deadline && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border bg-slate-50 border-slate-100 text-slate-550 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400">
                        📅 {task.deadline}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all p-1 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0 dark:hover:bg-slate-800"
                    title="Delete task"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              );
            })}
            {filteredTasks.filter(t => getTaskStatus(t) === 'testing').length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">No tasks need testing right now! 🔍</div>
            )}
          </div>
        </div>

        {/* Column 4: Done (done) */}
        <div
          onDragOver={(e) => handleDragOver(e, 'done')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'done')}
          className={`border rounded-3xl p-5 flex flex-col h-full min-h-[500px] transition-all duration-200 ${
            draggedOverColumn === 'done'
              ? 'bg-violet-50/40 border-violet-300 ring-2 ring-violet-500/10 shadow-md shadow-violet-500/5 scale-[1.01]'
              : 'bg-slate-100/50 border-slate-200/60 dark:bg-slate-800/40 dark:border-slate-700/60'
          }`}
        >
          <div className="flex justify-between items-center mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider dark:text-slate-200">Done</h4>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              {filteredTasks.filter(t => getTaskStatus(t) === 'done').length}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {filteredTasks.filter(t => getTaskStatus(t) === 'done').map((task) => {
              const projInfo = getProjectInfo(task.project);
              const isDragging = draggingTaskId === task._id;
              return (
                <div
                  key={task._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task._id)}
                  onDragEnd={handleDragEnd}
                  className={`bg-emerald-50/20 p-4.5 rounded-2xl border border-emerald-100/80 shadow-sm hover:shadow transition-all group flex flex-col justify-between space-y-3.5 relative overflow-hidden cursor-grab active:cursor-grabbing dark:bg-emerald-900/10 dark:border-emerald-800/30 dark:hover:shadow-slate-800/50 ${
                    isDragging ? 'opacity-40 scale-[0.98] border-dashed border-emerald-300 rotate-1' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="w-4.5 h-4.5 rounded-md border-2 border-emerald-400 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer mt-0.5 shrink-0 scale-105 dark:border-emerald-700 dark:bg-emerald-900/20"
                    />
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskDetails(task)}>
                      <h5 className="font-bold text-sm text-slate-400 line-through truncate hover:text-violet-650 transition-all dark:text-slate-500">{task.title}</h5>
                      {renderAssigneeInfo(task.assignee)}
                    </div>
                  </div>

                  {/* Badges Footer */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-55 shrink-0">
                    {/* Project Badge */}
                    {projInfo ? (
                      <span
                        className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border text-slate-450 bg-slate-55 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500"
                      >
                        📁 {projInfo.name}
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border bg-slate-50 border-slate-150 text-slate-455 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                        ☁️ Free task
                      </span>
                    )}

                    {/* Priority Badge */}
                    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                      {task.priority}
                    </span>

                    {/* Deadline Badge */}
                    {task.deadline && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border bg-slate-50 border-slate-150 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500">
                        📅 {task.deadline}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-slate-455 hover:text-rose-600 transition-all p-1 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0"
                    title="Delete task"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              );
            })}
            {filteredTasks.filter(t => getTaskStatus(t) === 'done').length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">No incomplete tasks. Great job! 💪</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





