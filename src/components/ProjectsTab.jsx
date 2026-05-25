import React from 'react';

export default function ProjectsTab({
  projects,
  tasks,
  selectedProject,
  setSelectedProject,
  setIsCreateProjectOpen,
  handleDeleteProject,
  handleLeaveProject,
  newTaskTitle,
  setNewTaskTitle,
  newPriority,
  setNewPriority,
  newDeadline,
  setNewDeadline,
  newTaskAssignee,
  setNewTaskAssignee,
  handleAddTask,
  toggleTask,
  deleteTask,
  openTaskDetails,
  getTodayStr,
  setNewProjectName,
  setNewProjectDesc,
  setNewProjectColor,
  user,
  handleInviteMember,
  inviteEmail,
  setInviteEmail,
  inviteLoading
}) {
  const todayStr = getTodayStr();
  const getProjectOwnerId = (project) => {
    if (!project) return null;
    return project.user && typeof project.user === 'object' ? project.user._id : project.user;
  };

  const getProjectMembers = (project) => {
    if (!project) return [];

    const owner = project.user && typeof project.user === 'object'
      ? project.user
      : getProjectOwnerId(project) === user?._id
        ? user
        : null;

    const members = Array.isArray(project.members) ? project.members : [];
    const uniqueMembers = new Map();

    [owner, ...members].filter(Boolean).forEach((member) => {
      const memberId = member._id || member.id;
      if (memberId && !uniqueMembers.has(memberId)) {
        uniqueMembers.set(memberId, member);
      }
    });

    return Array.from(uniqueMembers.values());
  };

  const isProjectOwner = getProjectOwnerId(selectedProject) === user?._id;

  const renderAssigneeInfo = (assignee) => {
    const user = assignee && typeof assignee === 'object' ? assignee : null;
    const displayName = user ? user.username || user.email : 'Unassigned';
    const initials = user ? (user.username || user.email || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'NA';
    return (
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          {user?.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <span className="truncate">{displayName}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {selectedProject === null ? (
        <>
          {/* Header Row */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">Project Management</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Organize tasks by project and collaborate with your team.</p>
            </div>
            <button
              onClick={() => {
                setNewProjectName('');
                setNewProjectDesc('');
                setNewProjectColor('#8B5CF6');
                setIsCreateProjectOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-violet-500/20 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
              Create project
            </button>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm mb-2 text-2xl dark:bg-slate-800 dark:border-slate-700">📁</div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300">No projects yet</h4>
              <p className="text-xs text-slate-400 max-w-[280px]">Create your first project to organize tasks more efficiently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((proj) => {
                const projTasks = tasks.filter(t => t.project === proj._id);
                const completedProjTasks = projTasks.filter(t => t.completed).length;
                const pct = projTasks.length ? Math.round((completedProjTasks / projTasks.length) * 100) : 0;
                const isOwnedProject = getProjectOwnerId(proj) === user?._id;
                const projectMembers = getProjectMembers(proj);

                return (
                  <div
                    key={proj._id}
                    onClick={() => setSelectedProject(proj)}
                    className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-[210px] group border-l-[10px] dark:bg-slate-900 dark:border-slate-800 dark:hover:shadow-slate-800/50"
                    style={{ borderLeftColor: proj.color }}
                  >
                    <div>
                      {/* Project Color & Name */}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-extrabold text-base text-slate-800 group-hover:text-violet-600 transition-all truncate pr-4 dark:text-slate-100 dark:group-hover:text-violet-400">{proj.name}</h4>
                        <span className="w-3.5 h-3.5 rounded-full border border-white shadow-sm shrink-0" style={{ backgroundColor: proj.color }}></span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed line-clamp-2 mb-4">
                        {proj.description || 'No description provided for this project.'}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Progress</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden dark:bg-slate-800">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: proj.color }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 pt-1.5 border-t border-slate-100 dark:border-slate-800 dark:text-slate-400">
                        <span>{completedProjTasks}/{projTasks.length} tasks</span>

                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            {projectMembers.length} members
                          </span>
                          {isOwnedProject ? (
                            <button
                              onClick={(e) => handleDeleteProject(proj._id, e)}
                              className="text-slate-400 hover:text-red-500 transition-all p-1"
                              title="Delete project"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => handleLeaveProject(proj._id, e)}
                              className="text-slate-400 hover:text-amber-600 transition-all p-1"
                              title="Leave project"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            </button>
                          )}
                          <span className="text-violet-600 group-hover:translate-x-1 transition-all inline-flex items-center gap-0.5 font-bold">
                            Details <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* selectedProject Detailed View */
        <div className="space-y-6">
          {/* Back button & Title */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer shadow-sm active:scale-95 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedProject.color }}></span>
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{selectedProject.name}</h3>
                </div>
                <p className="text-xs text-slate-400 font-semibold mt-1">{selectedProject.description || 'No description provided for this project.'}</p>
              </div>
            </div>

            {isProjectOwner ? (
              <button
                onClick={() => handleDeleteProject(selectedProject._id)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Delete project
              </button>
            ) : (
              <button
                onClick={() => handleLeaveProject(selectedProject._id)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Leave project
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="px-3 py-2 bg-slate-100 rounded-full dark:bg-slate-800">Members: {getProjectMembers(selectedProject).length}</span>
            <span className="px-3 py-2 bg-slate-100 rounded-full dark:bg-slate-800">Pending invites: {selectedProject.invites?.filter((invite) => invite.status === 'pending').length || 0}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task List of Project */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">Project tasks</h4>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 rounded-full text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {tasks.filter(t => t.project === selectedProject._id).length} tasks
                </span>
              </div>

              {tasks.filter(t => t.project === selectedProject._id).length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm mb-1 text-lg dark:bg-slate-800 dark:border-slate-700">📝</div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300">No tasks yet</h4>
                  <p className="text-xs text-slate-400 max-w-[280px]">Add tasks on the right to reach your project goals.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks
                    .filter(t => t.project === selectedProject._id)
                    .map((task) => (
                      <div
                        key={task._id}
                        className={`flex justify-between items-center p-4 bg-white border rounded-2xl shadow-sm hover:shadow transition-all group dark:bg-slate-800/50 ${
                          task.completed ? 'border-emerald-100 bg-emerald-50/10 dark:border-emerald-900/50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task._id, task.completed)}
                            className="w-5 h-5 rounded-lg border-2 border-slate-350 text-violet-600 focus:ring-violet-500 transition-all cursor-pointer scale-110 shrink-0 dark:border-slate-600 dark:bg-slate-700"
                          />
                          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openTaskDetails(task)}>
                            <h4 className={`font-bold text-sm truncate hover:text-violet-650 transition-all ${
                              task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'
                            }`}>{task.title}</h4>

                            {renderAssigneeInfo(task.assignee)}

                            <div className="flex flex-wrap items-center gap-2 mt-1">
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
                                  task.completed
                                    ? 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-500'
                                    : task.deadline < todayStr
                                    ? 'bg-rose-50 text-rose-500 border-rose-100 animate-pulse dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                                    : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50 dark:text-slate-400'
                                }`}>
                                  📅 {task.deadline}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteTask(task._id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all p-1.5 rounded-xl hover:bg-slate-50 shrink-0 cursor-pointer dark:hover:bg-slate-700/50"
                          title="Delete"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Project members</h4>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      {getProjectMembers(selectedProject).length} total
                    </span>
                  </div>

                  <div className="space-y-3">
                    {getProjectMembers(selectedProject).map((member) => {
                      const memberId = member._id || member.id;
                      const isOwnerMember = memberId === getProjectOwnerId(selectedProject);
                      const isCurrentUser = memberId === user?._id;

                      return (
                        <div key={memberId} className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800/70">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                              {member?.avatar ? (
                                <img src={member.avatar} alt={member.username || member.email} className="w-full h-full object-cover" />
                              ) : (
                                <span>{(member?.username || member?.email || 'U').slice(0, 1).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-700 dark:text-slate-100">
                                {member.username || member.email}
                                {isCurrentUser ? ' (You)' : ''}
                              </p>
                              <p className="truncate text-xs font-medium text-slate-400 dark:text-slate-500">{member.email || 'No email available'}</p>
                            </div>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                            isOwnerMember
                              ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                              : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            {isOwnerMember ? 'Owner' : 'Member'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isProjectOwner && (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Invite project member</h4>
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="Member email..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleInviteMember(selectedProject._id)}
                        disabled={inviteLoading}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white rounded-xl font-semibold shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 transition-all"
                      >
                        {inviteLoading ? 'Sending...' : 'Send invitation'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Create project task</h4>

                  {isProjectOwner ? (
                    <form onSubmit={(e) => handleAddTask(e, selectedProject._id)} className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider dark:text-slate-400">Task title</label>
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Enter task title..."
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all placeholder-slate-400 text-slate-700 font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500"
                          required
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider dark:text-slate-400">Priority</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['High', 'Medium', 'Low'].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setNewPriority(p)}
                              className={`py-2 rounded-xl text-[10px] font-extrabold tracking-wider uppercase border transition-all cursor-pointer ${
                                newPriority === p
                                  ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/20'
                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Deadline */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider dark:text-slate-400">Deadline</label>
                        <input
                          type="date"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all text-slate-700 font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider dark:text-slate-400">Assign to member</label>
                        <select
                          value={newTaskAssignee}
                          onChange={(e) => setNewTaskAssignee(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                        >
                          <option value="">Select assignee (optional)</option>
                          {getProjectMembers(selectedProject).map((member) => (
                            <option key={member._id || member.id} value={member._id || member.id}>
                              {member._id === user?._id ? `${member.username || member.email} (You)` : (member.username || member.email)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider font-extrabold"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                        Create task
                      </button>
                    </form>
                  ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Only the project owner can create tasks in this project.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
