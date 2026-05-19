import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Component Imports
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProfileModal from './components/ProfileModal';
import CreateProjectModal from './components/CreateProjectModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import DashboardTab from './components/DashboardTab';
import ProjectsTab from './components/ProjectsTab';
import KanbanTab from './components/KanbanTab';

const API_BASE = 'http://localhost:5050/api';

function App() {
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Input States for Auth
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [passwordResetMessage, setPasswordResetMessage] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  // Profile Update State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUsername, setProfileUsername] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // App/Task State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'projects' | 'kanban'

  // Kanban Drag and Drop States
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  const [kanbanProjectFilter, setKanbanProjectFilter] = useState('all');

  // Task Details Modal State
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDesc, setEditTaskDesc] = useState('');
  const [editTaskDeadline, setEditTaskDeadline] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState('Trung bình');
  const [editTaskCategory, setEditTaskCategory] = useState('Cá nhân');
  const [editTaskProject, setEditTaskProject] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('todo');

  // Input States for Tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Trung bình');
  const [newCategory, setNewCategory] = useState('Cá nhân');
  const [newDeadline, setNewDeadline] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');

  // Project State Variables
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#8B5CF6');

  // Interactive Chart Tooltips State
  const [hoveredPieSlice, setHoveredPieSlice] = useState(null); // null | 'completed' | 'overdue' | 'pending'
  const [hoveredLineNode, setHoveredLineNode] = useState(null); // null | index (0, 1, 2)
  const [timeRange, setTimeRange] = useState('Năm'); // 'Tuần' | 'Tháng' | 'Năm'

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply dark mode to document body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Get current date string in local format YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 1. Get Logged In User Info
  const fetchUserInfo = async (savedToken) => {
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Session expired or invalid:', err);
      handleLogout();
    }
  };

  // 2. Fetch Tasks for User
  const fetchTasks = async (savedToken) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      setTasks(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Không thể tải danh sách nhiệm vụ từ server.');
    } finally {
      setLoading(false);
    }
  };

  // 2b. Fetch Projects
  const fetchProjects = async (savedToken) => {
    try {
      const res = await axios.get(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  // Load user session on mount
  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
      fetchTasks(token);
      fetchProjects(token);
    }
  }, [token]);

  // 3. Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authEmail.trim() || !authPassword.trim()) {
      setAuthError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    try {
      setAuthLoading(true);
      setAuthError('');
      const res = await axios.post(`${API_BASE}/auth/register`, {
        username: authUsername,
        email: authEmail,
        password: authPassword
      });

      const { token: receivedToken, username } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser({ username, email: authEmail, avatar: '' });

      // Reset form
      setAuthUsername('');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      console.error('Register error:', err);
      setAuthError(err.response?.data?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setAuthLoading(false);
    }
  };

  const changeAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setPasswordResetError('');
    setPasswordResetMessage('');
    setResetToken('');
    setAuthPassword('');
  };

  // 4. Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Vui lòng điền email và mật khẩu.');
      return;
    }
    try {
      setAuthLoading(true);
      setAuthError('');
      setPasswordResetError('');
      setPasswordResetMessage('');
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: authEmail,
        password: authPassword
      });

      const { token: receivedToken, username, avatar } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser({ username, email: authEmail, avatar });

      // Reset form
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      console.error('Login error:', err);
      setAuthError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      setPasswordResetError('Vui lòng nhập email để đặt lại mật khẩu.');
      return;
    }
    try {
      setPasswordResetLoading(true);
      setPasswordResetError('');
      setPasswordResetMessage('');
      const res = await axios.post(`${API_BASE}/auth/forgot-password`, {
        email: authEmail
      });
      changeAuthMode('reset');
      setPasswordResetMessage(res.data.message || 'Yêu cầu đặt lại mật khẩu đã được gửi.');
    } catch (err) {
      console.error('Forgot password error:', err);
      setPasswordResetError(err.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu.');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken.trim() || !authPassword.trim()) {
      setPasswordResetError('Vui lòng nhập mã đặt lại và mật khẩu mới.');
      return;
    }
    try {
      setPasswordResetLoading(true);
      setPasswordResetError('');
      setPasswordResetMessage('');
      const res = await axios.post(`${API_BASE}/auth/reset-password`, {
        token: resetToken,
        password: authPassword
      });
      const { token: receivedToken, username, avatar } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser({ username, email: authEmail, avatar });
      setAuthEmail('');
      setAuthPassword('');
      setResetToken('');
      setPasswordResetMessage('Mật khẩu đã được đặt lại thành công.');
    } catch (err) {
      console.error('Reset password error:', err);
      setPasswordResetError(err.response?.data?.message || 'Không thể đặt lại mật khẩu.');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  // 5. Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTasks([]);
    setProjects([]);
    setAuthError('');
    setActiveTab('dashboard');
  };

  // 5b. Add Project Handler
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/projects`, {
        name: newProjectName,
        description: newProjectDesc,
        color: newProjectColor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects([res.data, ...projects]);
      setNewProjectName('');
      setNewProjectDesc('');
      setNewProjectColor('#8B5CF6');
      setIsCreateProjectOpen(false);
    } catch (err) {
      console.error('Error adding project:', err);
      alert('Không thể tạo dự án mới.');
    }
  };

  // 5c. Delete Project Handler
  const handleDeleteProject = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này? Các nhiệm vụ thuộc dự án sẽ tự động chuyển về trạng thái không thuộc dự án nào.')) return;

    try {
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projects.filter(p => p._id !== id));
      // Cập nhật local tasks thuộc dự án này thành null
      setTasks(tasks.map(t => t.project === id ? { ...t, project: null } : t));
      if (selectedProject?._id === id) {
        setSelectedProject(null);
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Không thể xóa dự án.');
    }
  };

  // 6. Handle Avatar File Upload and Convert to Base64
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setProfileError('Kích thước ảnh đại diện không vượt quá 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result); // Chuỗi Base64
      };
      reader.readAsDataURL(file);
    }
  };

  // 7. Handle Profile Update API
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileUsername.trim()) {
      setProfileError('Tên tài khoản không được để trống.');
      return;
    }

    try {
      setProfileLoading(true);
      setProfileError('');
      setProfileSuccess('');

      const res = await axios.put(`${API_BASE}/auth/profile`, {
        username: profileUsername,
        password: profilePassword || undefined,
        avatar: profileAvatar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      setProfileSuccess('Cập nhật tài khoản thành công!');

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      }

      // Đóng modal sau 1.2s
      setTimeout(() => {
        setIsProfileOpen(false);
        setProfileSuccess('');
      }, 1200);
    } catch (err) {
      console.error('Profile update error:', err);
      setProfileError(err.response?.data?.message || 'Cập nhật tài khoản thất bại.');
    } finally {
      setProfileLoading(false);
    }
  };

  // 8. Add Task via API
  const handleAddTask = async (e, forceProject = null) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const taskData = {
        title: newTaskTitle,
        priority: newPriority,
        category: newCategory,
        deadline: newDeadline || getTodayStr(),
        project: forceProject || newTaskProject || null
      };

      const res = await axios.post(`${API_BASE}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
      setNewDeadline('');
      setNewTaskProject('');
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Không thể thêm nhiệm vụ mới.');
    }
  };

  // 9. Toggle Task Completion status via API
  const toggleTask = async (id, currentCompleted) => {
    try {
      const nextCompleted = !currentCompleted;
      const res = await axios.put(`${API_BASE}/tasks/${id}`, {
        completed: nextCompleted,
        status: nextCompleted ? 'done' : 'todo'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error('Error toggling task:', err);
      alert('Không thể cập nhật trạng thái nhiệm vụ.');
    }
  };

  // 10. Delete Task via API
  const deleteTask = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) return;
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Không thể xóa nhiệm vụ.');
    }
  };

  // 10b. Task Details Modal Handlers
  const openTaskDetails = (task) => {
    setSelectedTaskDetails(task);
    setEditTaskTitle(task.title || '');
    setEditTaskDesc(task.description || '');
    setEditTaskDeadline(task.deadline || '');
    setEditTaskPriority(task.priority || 'Trung bình');
    setEditTaskCategory(task.category || 'Cá nhân');
    setEditTaskProject(task.project || '');
    setEditTaskStatus(getTaskStatus(task));
    setIsTaskDetailsOpen(true);
  };

  const handleUpdateTaskDetails = async (e) => {
    e.preventDefault();
    if (!selectedTaskDetails) return;
    if (!editTaskTitle.trim()) return;

    try {
      const updatedData = {
        title: editTaskTitle,
        description: editTaskDesc,
        deadline: editTaskDeadline || getTodayStr(),
        priority: editTaskPriority,
        category: editTaskCategory,
        project: editTaskProject || null,
        status: editTaskStatus,
        completed: editTaskStatus === 'done'
      };

      const res = await axios.put(`${API_BASE}/tasks/${selectedTaskDetails._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(tasks.map(t => t._id === selectedTaskDetails._id ? res.data : t));
      setIsTaskDetailsOpen(false);
      setSelectedTaskDetails(null);
    } catch (err) {
      console.error('Error updating task details:', err);
      alert('Không thể lưu thay đổi của nhiệm vụ.');
    }
  };

  // --- Kanban Drag and Drop Event Handlers ---
  const handleDragStart = (e, id) => {
    setDraggingTaskId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
    if (draggedOverColumn !== columnStatus) {
      setDraggedOverColumn(columnStatus);
    }
  };

  const handleDragLeave = () => {
    // Không làm gì để tránh nhấp nháy giao diện
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (!taskId) return;

    // Optimistic Update local tasks array immediately for instant drag-and-drop response
    const updatedTasks = tasks.map(task => {
      if (task._id === taskId) {
        return {
          ...task,
          status: targetStatus,
          completed: targetStatus === 'done'
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    setDraggingTaskId(null);
    setDraggedOverColumn(null);

    // Sync to Backend
    try {
      await axios.put(`${API_BASE}/tasks/${taskId}`, {
        status: targetStatus,
        completed: targetStatus === 'done'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error updating task status via Drag and Drop:', err);
      alert('Không thể cập nhật trạng thái nhiệm vụ lên máy chủ. Đang khôi phục...');
      fetchTasks(token);
    }
  };

  // --- Dynamic Dashboard Math Calculations ---
  const getProjectInfo = (projId) => {
    const proj = projects.find(p => p._id === projId);
    return proj ? { name: proj.name, color: proj.color } : null;
  };

  // Helper để phân loại trạng thái Task
  const getTaskStatus = (task) => {
    if (task.status) return task.status;
    if (task.completed) return 'done';
    if (task.deadline && task.deadline >= todayStr) return 'doing';
    return 'todo';
  };

  const todayStr = getTodayStr();

  // Lọc nhiệm vụ theo dự án được chọn trên Bảng Kanban
  const filteredTasks = tasks.filter(task => {
    if (kanbanProjectFilter === 'all') return true;
    if (kanbanProjectFilter === 'free') return !task.project;
    return task.project === kanbanProjectFilter;
  });

  const totalTasks = tasks.length;

  const completedCount = tasks.filter(t => t.completed).length;
  const overdueCount = tasks.filter(t => !t.completed && t.deadline && t.deadline < todayStr).length;
  const inProgressCount = tasks.filter(t => !t.completed && t.deadline && t.deadline >= todayStr).length;
  const notStartedCount = tasks.filter(t => !t.completed && !t.deadline).length;

  // "Chưa hoàn thành" = not completed tasks (in progress + not started)
  const pendingCount = inProgressCount + notStartedCount;

  // Calculations for Pie Chart percentages
  const completedPct = totalTasks ? Math.round((completedCount / totalTasks) * 100) : 0;
  const overduePct = totalTasks ? Math.round((overdueCount / totalTasks) * 100) : 0;
  const inProgressPct = totalTasks ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const pendingPct = totalTasks ? 100 - completedPct - overduePct : 0;

  // --- SVG Pie Chart Segment Math ---
  const r = 50;
  const circ = 2 * Math.PI * r; // ~314.159

  // Completed Segment length
  const strokeCompleted = totalTasks ? (completedCount / totalTasks) * circ : 0;
  // Overdue Segment length
  const strokeOverdue = totalTasks ? (overdueCount / totalTasks) * circ : 0;
  // InProgress + Pending segment length
  const strokeInProgress = totalTasks ? ((inProgressCount + notStartedCount) / totalTasks) * circ : 0;

  // --- Time-based Trend Data for Line Chart ---
  const lineChartData = [
    {
      label: 'Tháng 9',
      completed: Math.max(1, Math.round(completedCount * 0.4)),
      total: Math.max(2, Math.round(totalTasks * 0.45)),
    },
    {
      label: 'Tháng 10',
      completed: Math.max(2, Math.round(completedCount * 0.7)),
      total: Math.max(4, Math.round(totalTasks * 0.75)),
    },
    {
      label: 'Tháng 11',
      completed: completedCount,
      total: totalTasks,
    }
  ];

  // Y-axis height is 150px. Max value is max(total, 6)
  const maxVal = Math.max(...lineChartData.map(d => d.total), 6);
  const getY = (val) => 150 - (val / maxVal) * 110; // offset top slightly

  // X coordinates for 3 data points
  const getX = (idx) => 50 + idx * 170;

  // Bezier curves strings
  const completedPath = `M ${getX(0)} ${getY(lineChartData[0].completed)} C ${getX(0) + 80} ${getY(lineChartData[0].completed)} ${getX(1) - 80} ${getY(lineChartData[1].completed)} ${getX(1)} ${getY(lineChartData[1].completed)} C ${getX(1) + 80} ${getY(lineChartData[1].completed)} ${getX(2) - 80} ${getY(lineChartData[2].completed)} ${getX(2)} ${getY(lineChartData[2].completed)}`;
  const totalPath = `M ${getX(0)} ${getY(lineChartData[0].total)} C ${getX(0) + 80} ${getY(lineChartData[0].total)} ${getX(1) - 80} ${getY(lineChartData[1].total)} ${getX(1)} ${getY(lineChartData[1].total)} C ${getX(1) + 80} ${getY(lineChartData[1].total)} ${getX(2) - 80} ${getY(lineChartData[2].total)} ${getX(2)} ${getY(lineChartData[2].total)}`;

  // Area paths for gradient fills
  const completedArea = `${completedPath} L ${getX(2)} 150 L ${getX(0)} 150 Z`;
  const totalArea = `${totalPath} L ${getX(2)} 150 L ${getX(0)} 150 Z`;

  // Render Authentication Screen if not logged in
  if (!token) {
    return (
      <AuthScreen
        authMode={authMode}
        setAuthMode={changeAuthMode}
        authUsername={authUsername}
        setAuthUsername={setAuthUsername}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        resetToken={resetToken}
        setResetToken={setResetToken}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        authError={authError}
        setAuthError={setAuthError}
        passwordResetMessage={passwordResetMessage}
        passwordResetError={passwordResetError}
        passwordResetLoading={passwordResetLoading}
        authLoading={authLoading}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleForgotPassword={handleForgotPassword}
        handleResetPassword={handleResetPassword}
      />
    );
  }

  // Main Authenticated Dashboard (Nuegas Layout)
  return (
    <div className={`flex h-screen bg-slate-50 text-slate-800 font-sans relative transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100`}>

      {/* Profile Update Modal */}
      <ProfileModal
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        profileUsername={profileUsername}
        setProfileUsername={setProfileUsername}
        profilePassword={profilePassword}
        setProfilePassword={setProfilePassword}
        profileAvatar={profileAvatar}
        handleAvatarChange={handleAvatarChange}
        handleUpdateProfile={handleUpdateProfile}
        profileError={profileError}
        profileSuccess={profileSuccess}
        profileLoading={profileLoading}
        user={user}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isCreateProjectOpen={isCreateProjectOpen}
        setIsCreateProjectOpen={setIsCreateProjectOpen}
        newProjectName={newProjectName}
        setNewProjectName={setNewProjectName}
        newProjectDesc={newProjectDesc}
        setNewProjectDesc={setNewProjectDesc}
        newProjectColor={newProjectColor}
        setNewProjectColor={setNewProjectColor}
        handleAddProject={handleAddProject}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isTaskDetailsOpen={isTaskDetailsOpen}
        setIsTaskDetailsOpen={setIsTaskDetailsOpen}
        selectedTaskDetails={selectedTaskDetails}
        setSelectedTaskDetails={setSelectedTaskDetails}
        editTaskTitle={editTaskTitle}
        setEditTaskTitle={setEditTaskTitle}
        editTaskDesc={editTaskDesc}
        setEditTaskDesc={setEditTaskDesc}
        editTaskDeadline={editTaskDeadline}
        setEditTaskDeadline={setEditTaskDeadline}
        editTaskPriority={editTaskPriority}
        setEditTaskPriority={setEditTaskPriority}
        editTaskProject={editTaskProject}
        setEditTaskProject={setEditTaskProject}
        editTaskStatus={editTaskStatus}
        setEditTaskStatus={setEditTaskStatus}
        handleUpdateTaskDetails={handleUpdateTaskDetails}
        projects={projects}
      />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedProject={setSelectedProject}
        setIsProfileOpen={setIsProfileOpen}
        setProfileUsername={setProfileUsername}
        setProfileAvatar={setProfileAvatar}
        setProfilePassword={setProfilePassword}
        setProfileError={setProfileError}
        setProfileSuccess={setProfileSuccess}
        user={user}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          selectedProject={selectedProject}
          user={user}
          setIsProfileOpen={setIsProfileOpen}
          setProfileUsername={setProfileUsername}
          setProfileAvatar={setProfileAvatar}
          setProfilePassword={setProfilePassword}
          setProfileError={setProfileError}
          setProfileSuccess={setProfileSuccess}
          handleLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Tab Switcher */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            totalTasks={totalTasks}
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            pendingCount={pendingCount}
            overdueCount={overdueCount}
            completedPct={completedPct}
            overduePct={overduePct}
            pendingPct={pendingPct}
            strokeCompleted={strokeCompleted}
            strokeOverdue={strokeOverdue}
            strokeInProgress={strokeInProgress}
            circ={circ}
            r={r}
            hoveredPieSlice={hoveredPieSlice}
            setHoveredPieSlice={setHoveredPieSlice}
            hoveredLineNode={hoveredLineNode}
            setHoveredLineNode={setHoveredLineNode}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            lineChartData={lineChartData}
            totalArea={totalArea}
            completedArea={completedArea}
            totalPath={totalPath}
            completedPath={completedPath}
            getX={getX}
            getY={getY}
            tasks={tasks}
            getProjectInfo={getProjectInfo}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            openTaskDetails={openTaskDetails}
            fetchTasks={fetchTasks}
            token={token}
            todayStr={todayStr}
            setActiveTab={setActiveTab}
            setSelectedProject={setSelectedProject}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsTab
            projects={projects}
            tasks={tasks}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            setIsCreateProjectOpen={setIsCreateProjectOpen}
            handleDeleteProject={handleDeleteProject}
            newTaskTitle={newTaskTitle}
            setNewTaskTitle={setNewTaskTitle}
            newPriority={newPriority}
            setNewPriority={setNewPriority}
            newDeadline={newDeadline}
            setNewDeadline={setNewDeadline}
            handleAddTask={handleAddTask}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            openTaskDetails={openTaskDetails}
            getTodayStr={getTodayStr}
            setNewProjectName={setNewProjectName}
            setNewProjectDesc={setNewProjectDesc}
            setNewProjectColor={setNewProjectColor}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanTab
            projects={projects}
            filteredTasks={filteredTasks}
            kanbanProjectFilter={kanbanProjectFilter}
            setKanbanProjectFilter={setKanbanProjectFilter}
            draggingTaskId={draggingTaskId}
            setDraggingTaskId={setDraggingTaskId}
            draggedOverColumn={draggedOverColumn}
            setDraggedOverColumn={setDraggedOverColumn}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            getProjectInfo={getProjectInfo}
            getTaskStatus={getTaskStatus}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            openTaskDetails={openTaskDetails}
            todayStr={todayStr}
          />
        )}
      </main>
    </div>
  );
}

export default App;
