import React from 'react';

export default function DashboardTab({
  totalTasks,
  completedCount,
  inProgressCount,
  pendingCount,
  overdueCount,
  completedPct,
  overduePct,
  pendingPct,
  strokeCompleted,
  strokeOverdue,
  strokeInProgress,
  circ,
  r,
  hoveredPieSlice,
  setHoveredPieSlice,
  hoveredLineNode,
  setHoveredLineNode,
  timeRange,
  setTimeRange,
  lineChartData,
  totalArea,
  completedArea,
  totalPath,
  completedPath,
  getX,
  getY,
  tasks,
  getProjectInfo,
  toggleTask,
  deleteTask,
  openTaskDetails,
  fetchTasks,
  token,
  todayStr,
  setActiveTab,
  setSelectedProject
}) {
  return (
    <div className="flex-1 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Title & Refresh Row */}
      {/* <div className="flex justify-between items-center">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Overview</h3>
        <button
          onClick={() => fetchTasks(token)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 transition-all cursor-pointer shadow-sm active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5"></path></svg>
          Refresh
        </button>
      </div> */}

      {/* TOP ROW: Overview Card & Statistics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Large Dashboard Overview Card (Blue gradient) */}
        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl shadow-violet-600/10 relative overflow-hidden h-[180px] lg:h-auto">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full filter blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-violet-200/80 uppercase">DASHBOARD OVERVIEW</span>
              <h4 className="text-xl font-extrabold mt-1">Total tasks</h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-black">{totalTasks}</span>
              <span className="text-xs font-bold text-violet-100">tasks</span>
            </div>
          </div>
        </div>

        {/* Statistics Grid (Nuegas-style 4 cards) */}
        <div className="grid grid-cols-2 gap-4">

          {/* Completed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Completed</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-800 mt-4 dark:text-slate-100">{completedCount}</h4>
          </div>

          {/* Đang làm */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">In progress</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm dark:bg-indigo-500/10 dark:text-indigo-400">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-800 mt-4 dark:text-slate-100">{inProgressCount}</h4>
          </div>

          {/* Pending */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Pending</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm dark:bg-amber-500/10 dark:text-amber-400">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-800 mt-4 dark:text-slate-100">{pendingCount}</h4>
          </div>

          {/* Overdue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">Overdue</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm dark:bg-rose-500/10 dark:text-rose-400">
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-800 mt-4 dark:text-slate-100">{overdueCount}</h4>
          </div>
        </div>

        {/* Pie Chart Card (Phân bổ công việc chuẩn 100% hình mẫu Nuegas) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">

          {/* Header */}
          <div className="mb-2">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Work distribution</h4>
          </div>

          {/* Chart body */}
          <div className="flex items-center justify-center relative py-2">
            {/* Premium interactive SVG Pie Chart */}
            <svg className="w-36 h-36 drop-shadow-md cursor-pointer" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="overGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
                <linearGradient id="pendGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>

              {totalTasks === 0 ? (
                /* Fallback circle if empty */
                <circle cx="60" cy="60" r={r} fill="none" stroke="#E2E8F0" strokeWidth="16" />
              ) : (
                <>
                  {/* Slice 1: Completed (Green) */}
                  {strokeCompleted > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={r}
                      fill="none"
                      stroke="url(#compGrad)"
                      strokeWidth="15"
                      strokeDasharray={`${strokeCompleted} ${circ}`}
                      strokeDashoffset={0}
                      transform="rotate(-90 60 60)"
                      className="transition-all duration-300 hover:stroke-[17px] focus:outline-none"
                      onMouseEnter={() => setHoveredPieSlice('completed')}
                      onMouseLeave={() => setHoveredPieSlice(null)}
                    />
                  )}

                  {/* Slice 2: Overdue (Red) */}
                  {strokeOverdue > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={r}
                      fill="none"
                      stroke="url(#overGrad)"
                      strokeWidth="15"
                      strokeDasharray={`${strokeOverdue} ${circ}`}
                      strokeDashoffset={-strokeCompleted}
                      transform="rotate(-90 60 60)"
                      className="transition-all duration-300 hover:stroke-[17px] focus:outline-none"
                      onMouseEnter={() => setHoveredPieSlice('overdue')}
                      onMouseLeave={() => setHoveredPieSlice(null)}
                    />
                  )}

                  {/* Slice 3: Pending / In Progress (Purple) */}
                  {strokeInProgress > 0 && (
                    <circle
                      cx="60"
                      cy="60"
                      r={r}
                      fill="none"
                      stroke="url(#pendGrad)"
                      strokeWidth="15"
                      strokeDasharray={`${strokeInProgress} ${circ}`}
                      strokeDashoffset={-(strokeCompleted + strokeOverdue)}
                      transform="rotate(-90 60 60)"
                      className="transition-all duration-300 hover:stroke-[17px] focus:outline-none"
                      onMouseEnter={() => setHoveredPieSlice('pending')}
                      onMouseLeave={() => setHoveredPieSlice(null)}
                    />
                  )}
                </>
              )}

              {/* Circular Text */}
              <text x="60" y="64" textAnchor="middle" className="font-extrabold text-[12px] fill-slate-800 dark:fill-slate-100">
                {completedPct}%
              </text>
            </svg>

            {/* SVG Custom Tooltip on Hover */}
            {hoveredPieSlice && (
              <div className="absolute bg-slate-950/90 text-white rounded-xl py-2 px-3 text-[10px] font-bold shadow-xl border border-slate-800 -top-6 backdrop-blur-sm z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                {hoveredPieSlice === 'completed' && `Completed: ${completedCount} tasks (${completedPct}%)`}
                {hoveredPieSlice === 'overdue' && `Overdue: ${overdueCount} tasks (${overduePct}%)`}
                {hoveredPieSlice === 'pending' && `Pending: ${pendingCount} tasks (${pendingPct}%)`}
              </div>
            )}
          </div>

          {/* Legends */}
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-3 dark:border-slate-800 dark:text-slate-400">
            <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                <span>Overdue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0"></span>
                <span>Pending</span>
              </div>
            </div>
            <div className="text-right flex flex-col gap-1 text-slate-800 dark:text-slate-200">
              <span>{completedCount}</span>
              <span>{overdueCount}</span>
              <span>{pendingCount}</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW: Trend Line Chart & Remaining Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Productivity Area/Line Chart (matches Nuegas template) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">

          {/* Header with Switcher Tabs */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 dark:text-slate-100">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Work progress
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Time-based statistics</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
              {['Week', 'Month', 'Year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${timeRange === range
                      ? 'bg-violet-600 text-white shadow'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                  {range}
                </button>
              ))}
              {/* Refresh */}
              <button
                onClick={() => fetchTasks(token)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-all cursor-pointer dark:text-slate-500 dark:hover:text-slate-300"
                title="Refresh chart"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5"></path></svg>
              </button>
            </div>
          </div>

          {/* Legends */}
          <div className="flex items-center gap-4 text-[10px] font-bold mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-500">Completed tasks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-500">New tasks</span>
            </div>
          </div>

          {/* Dynamic Bezier Curve Chart SVG */}
          <div className="relative py-1">
            <svg className="w-full h-[160px]" viewBox="0 0 440 160">
              <defs>
                {/* Area Fill Gradients */}
                <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 1, 2, 3].map((g) => (
                <line
                  key={g}
                  x1="40"
                  y1={40 + g * 35}
                  x2="410"
                  y2={40 + g * 35}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Gradient Fills */}
              <path d={totalArea} fill="url(#blueArea)" />
              <path d={completedArea} fill="url(#greenArea)" />

              {/* Bezier Lines */}
              <path d={totalPath} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
              <path d={completedPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

              {/* Data Point Nodes and Interactive Hover Areas */}
              {lineChartData.map((d, i) => (
                <g key={i}>
                  {/* Vertical line indicator on hover */}
                  {hoveredLineNode === i && (
                    <line
                      x1={getX(i)}
                      y1="25"
                      x2={getX(i)}
                      y2="150"
                      stroke="#8B5CF6"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Completed nodes */}
                  <circle
                    cx={getX(i)}
                    cy={getY(d.completed)}
                    r="5.5"
                    fill="white"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-150 hover:r-7"
                    onMouseEnter={() => setHoveredLineNode(i)}
                    onMouseLeave={() => setHoveredLineNode(null)}
                  />

                  {/* Total nodes */}
                  <circle
                    cx={getX(i)}
                    cy={getY(d.total)}
                    r="5.5"
                    fill="white"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all duration-150 hover:r-7"
                    onMouseEnter={() => setHoveredLineNode(i)}
                    onMouseLeave={() => setHoveredLineNode(null)}
                  />

                  {/* Hidden tall rectangles for easier hover trigger */}
                  <rect
                    x={getX(i) - 40}
                    y="10"
                    width="80"
                    height="140"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredLineNode(i)}
                    onMouseLeave={() => setHoveredLineNode(null)}
                  />
                </g>
              ))}

              {/* X-Axis labels */}
              {lineChartData.map((d, i) => (
                <text
                  key={i}
                  x={getX(i)}
                  y="158"
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500"
                >
                  {d.label.split(' - ')[0]}
                </text>
              ))}
            </svg>

            {/* Floating Interactive Hover Tooltip */}
            {hoveredLineNode !== null && (
              <div
                className="absolute bg-slate-950/90 text-white rounded-xl py-2 px-3 text-[10px] font-bold shadow-xl border border-slate-800 backdrop-blur-sm pointer-events-none z-20 animate-in fade-in zoom-in-95 duration-100"
                style={{
                  left: `${(getX(hoveredLineNode) / 440) * 100 - 15}%`,
                  top: '15px'
                }}
              >
                <div className="text-slate-400 border-b border-slate-800 pb-1 mb-1">
                  Time: {lineChartData[hoveredLineNode].label}
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Count: {lineChartData[hoveredLineNode].completed} completed tasks
                </div>
                <div className="flex items-center gap-1.5 text-blue-400 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Count: {lineChartData[hoveredLineNode].total} new tasks
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status "Đang làm" distribution card (Đúng hình mẫu Nuegas bên phải) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">In-progress status distribution</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">Excludes completed, canceled, and overdue tasks</p>
          </div>

          <div className="py-8 flex flex-col items-center justify-center border-t border-slate-100 mt-4 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">Tasks in progress:</span>
            <h4 className="text-5xl font-black text-violet-600">{inProgressCount}</h4>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-medium">
            Finish these tasks by their deadlines!
          </div>
        </div>

      </div>

      {/* TASK CHECKLIST SECTION: Today's tasks / To-do list */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 dark:text-slate-100">
              <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 00-2-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
              Today's tasks / To-do list
            </h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Tasks not yet completed with due dates today or soon</p>
          </div>
          <button
            onClick={() => {
              setActiveTab('kanban');
              setSelectedProject(null);
            }}
            className="text-xs font-bold text-violet-650 hover:text-violet-750 transition-all flex items-center gap-1 hover:underline cursor-pointer"
          >
            Go to Kanban board →
          </button>
        </div>

        {/* Checklist list */}
        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
          {tasks.filter(t => !t.completed).length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-semibold">
              Great! You have no unfinished tasks! 🎉
            </div>
          ) : (
            tasks.filter(t => !t.completed).map((task) => {
              const projInfo = getProjectInfo(task.project);
              return (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200/80 rounded-2xl transition-all group dark:bg-slate-800/50 dark:border-slate-700/80 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id, task.completed)}
                      className="w-4.5 h-4.5 rounded-md border-2 border-slate-350 text-violet-600 focus:ring-violet-500 transition-all cursor-pointer scale-105 shrink-0"
                    />
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskDetails(task)}>
                      <span className="font-bold text-sm text-slate-750 truncate block hover:text-violet-650 transition-all dark:text-slate-200">{task.title}</span>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {projInfo ? (
                          <span
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border text-white shadow-sm"
                            style={{ backgroundColor: projInfo.color, borderColor: projInfo.color }}
                          >
                            📁 {projInfo.name}
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md border bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                            ☁️ Free task
                          </span>
                        )}

                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${task.priority === 'Cao'
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : task.priority === 'Trung bình'
                              ? 'bg-amber-50 text-amber-600 border border-amber-100'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                          {task.priority === 'Cao' ? 'High' : task.priority === 'Trung bình' ? 'Medium' : 'Low'}
                        </span>

                        {task.deadline && (
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border ${task.deadline < todayStr
                              ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse font-extrabold'
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}>
                            📅 {task.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick toggle or action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
                      title="Delete task"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FOOTER (Đúng hình mẫu Nuegas) */}
      <footer className="flex flex-col md:flex-row justify-between items-center border-t border-slate-200 pt-6 text-[10px] font-bold text-slate-400 mt-8 gap-4 dark:border-slate-800">
        <div>
          © 2026 DANGND_UTC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
