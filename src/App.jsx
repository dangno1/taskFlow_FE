import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import BillingTab from './components/BillingTab';
import NotificationBanner from './components/NotificationBanner';

const API_BASE = "https://task-flow-be-iota.vercel.app/api" || 'http://localhost:5050/api';

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
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const googleInitRef = useRef(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const [declineToken, setDeclineToken] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    type: 'info',
    visible: false,
    actionLabel: '',
    cancelLabel: '',
    onAction: null,
    onCancel: null
  });
  const notificationTimerRef = useRef(null);
  const processedInviteRequestRef = useRef('');

  const hideNotification = () => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }
    setNotification((prev) => ({
      ...prev,
      visible: false,
      actionLabel: '',
      cancelLabel: '',
      onAction: null,
      onCancel: null
    }));
  };

  const showNotification = (messageOrOptions, type = 'info') => {
    const options = typeof messageOrOptions === 'string'
      ? { message: messageOrOptions, type }
      : messageOrOptions;

    if (!options?.message) return;

    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    const onCancel = () => {
      hideNotification();
      if (typeof options.onCancel === 'function') {
        options.onCancel();
      }
    };

    const onAction = async () => {
      hideNotification();
      if (typeof options.onAction === 'function') {
        await options.onAction();
      }
    };

    setNotification({
      message: options.message,
      type: options.type || 'info',
      visible: true,
      actionLabel: options.actionLabel || '',
      cancelLabel: options.cancelLabel || '',
      onAction: options.onAction ? onAction : null,
      onCancel: options.cancelLabel ? onCancel : null
    });

    notificationTimerRef.current = setTimeout(() => {
      hideNotification();
    }, 20000);
  };

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // Profile Update State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUsername, setProfileUsername] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
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
  const [editTaskPriority, setEditTaskPriority] = useState('Medium');
  const [editTaskCategory, setEditTaskCategory] = useState('Personal');
  const [editTaskProject, setEditTaskProject] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('todo');
  const [editTaskAssignee, setEditTaskAssignee] = useState('');

  // Input States for Tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDeadline, setNewDeadline] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

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
  const [timeRange, setTimeRange] = useState('Year'); // 'Week' | 'Month' | 'Year'

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

  useEffect(() => {
    if (!googleClientId) return;

    if (window.google?.accounts?.id) {
      setGoogleReady(true);
      return;
    }

    const existingScript = document.getElementById('google-client-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.google?.accounts?.id) {
          setGoogleReady(true);
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.id = 'google-client-script';
    script.onload = () => {
      if (window.google?.accounts?.id) {
        setGoogleReady(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [googleClientId]);

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
  const fetchTasks = async (savedToken, options = {}) => {
    const { silent = false } = options;
    try {
      if (!silent) {
        setLoading(true);
      }
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      });
      setTasks(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Unable to load task list from server.');
    } finally {
      if (!silent) {
        setLoading(false);
      }
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

  useEffect(() => {
    if (!token) return undefined;

    const syncAppData = () => {
      if (document.hidden) return;
      fetchProjects(token);
      fetchTasks(token, { silent: true });
    };

    const intervalId = setInterval(syncAppData, 5000);
    window.addEventListener('focus', syncAppData);
    document.addEventListener('visibilitychange', syncAppData);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', syncAppData);
      document.removeEventListener('visibilitychange', syncAppData);
    };
  }, [token]);

  useEffect(() => {
    if (!selectedProject) return;

    const latestSelectedProject = projects.find((project) => project._id === selectedProject._id);

    if (!latestSelectedProject) {
      setSelectedProject(null);
      return;
    }

    if (latestSelectedProject !== selectedProject) {
      setSelectedProject(latestSelectedProject);
    }
  }, [projects, selectedProject]);

  useEffect(() => {
    if (!selectedTaskDetails) return;

    const latestTask = tasks.find((task) => task._id === selectedTaskDetails._id);

    if (!latestTask) {
      setIsTaskDetailsOpen(false);
      setSelectedTaskDetails(null);
      return;
    }

    if (latestTask !== selectedTaskDetails) {
      setSelectedTaskDetails(latestTask);
    }
  }, [tasks, selectedTaskDetails]);

  // Parse invite or decline token from URL query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const tokenParam = params.get('inviteToken');
    const declineParam = params.get('declineToken');

    if (tabParam === 'billing') {
      setActiveTab('billing');
    }

    if (tokenParam) {
      setInviteToken(tokenParam);
      if (!token) {
        showNotification('Please log in with the invited email to accept the project invitation.', 'info');
      }
    }
    if (declineParam) {
      setDeclineToken(declineParam);
      if (!token) {
        showNotification('Please log in with the invited email to decline the project invitation.', 'info');
      }
    }
  }, [token]);

  useEffect(() => {
    const processInviteToken = async (mode, tokenValue) => {
      if (!user || !tokenValue) return;
      const requestKey = `${mode}:${tokenValue}:${user._id || user.email || ''}`;
      if (processedInviteRequestRef.current === requestKey) return;
      processedInviteRequestRef.current = requestKey;
      try {
        setInviteLoading(true);
        const route = mode === 'accept' ? 'accept' : 'decline';
        const res = await axios.post(`${API_BASE}/projects/invites/${tokenValue}/${route}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showNotification(res.data.message, 'success');
        setInviteToken('');
        setDeclineToken('');
        window.history.replaceState(null, '', window.location.pathname);
        fetchProjects(token);
        fetchTasks(token);
      } catch (err) {
        showNotification(err.response?.data?.message || 'Unable to process the project invitation.', 'error');
        processedInviteRequestRef.current = '';
      } finally {
        setInviteLoading(false);
      }
    };

    if (inviteToken) {
      processInviteToken('accept', inviteToken);
    } else if (declineToken) {
      processInviteToken('decline', declineToken);
    }
  }, [user, inviteToken, declineToken, token]);

  // 3. Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!authUsername.trim() || !authEmail.trim() || !authPassword.trim()) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    try {
      setAuthLoading(true);
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
      showNotification(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const changeAuthMode = (mode) => {
    setAuthMode(mode);
    setResetToken('');
    setAuthPassword('');
  };

  // 4. Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      showNotification('Please enter your email and password.', 'error');
      return;
    }
    try {
      setAuthLoading(true);
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
      showNotification(err.response?.data?.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithGoogle = useCallback(async (idToken) => {
    setGoogleLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/google`, { idToken });
      const { token: receivedToken, username, email, avatar } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser({ username, email, avatar });
      setAuthUsername('');
      setAuthEmail('');
      setAuthPassword('');
      showNotification('Đăng nhập bằng Google thành công!', 'success');
    } catch (err) {
      console.error('Google login error:', err);
      showNotification(err.response?.data?.message || 'Google login failed.', 'error');
    } finally {
      setGoogleLoading(false);
    }
  }, [showNotification]);

  const handleGoogleSignIn = useCallback(() => {
    if (!googleClientId) {
      showNotification('Vui lòng cấu hình GOOGLE_CLIENT_ID để bật đăng nhập bằng Google.', 'error');
      return;
    }
    if (!googleReady || !window.google?.accounts?.id) {
      showNotification('Google login chưa sẵn sàng. Vui lòng thử lại sau.', 'error');
      return;
    }
    window.google.accounts.id.prompt();
  }, [googleClientId, googleReady, showNotification]);

  useEffect(() => {
    if (!googleReady || googleInitRef.current || !googleClientId) return;
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (response?.credential) {
          await loginWithGoogle(response.credential);
        }
      },
      auto_select: false
    });

    googleInitRef.current = true;
  }, [googleReady, googleClientId, loginWithGoogle]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!authEmail.trim()) {
      showNotification('Please enter your email to reset your password.', 'error');
      return;
    }
    try {
      setPasswordResetLoading(true);
      const res = await axios.post(`${API_BASE}/auth/forgot-password`, {
        email: authEmail
      });
      changeAuthMode('reset');
      showNotification(res.data.message || 'Password reset request has been sent.', 'success');
    } catch (err) {
      console.error('Forgot password error:', err);
      showNotification(err.response?.data?.message || 'Unable to send password reset email.', 'error');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetToken.trim() || !authPassword.trim()) {
      showNotification('Please enter the reset code and a new password.', 'error');
      return;
    }
    try {
      setPasswordResetLoading(true);
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
      showNotification('Password reset successfully.', 'success');
    } catch (err) {
      console.error('Reset password error:', err);
      showNotification(err.response?.data?.message || 'Unable to reset password.', 'error');
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
    setActiveTab('dashboard');
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const currentPlan = user?.plan || 'Free';
    const ownedProjectsCount = projects.filter(p => {
      const ownerId = p.user && typeof p.user === 'object' ? p.user._id : p.user;
      return ownerId === user?._id;
    }).length;

    if (currentPlan === 'Free' && ownedProjectsCount >= 2) {
      showNotification('Free plan allows up to 2 projects only. Upgrade to continue.', 'warning');
      return;
    }
    if (currentPlan === 'Premium' && ownedProjectsCount >= 10) {
      showNotification('Premium plan allows up to 10 projects only. Upgrade to continue.', 'warning');
      return;
    }

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
      showNotification('Unable to create a new project.', 'error');
    }
  };

  const handleInviteMember = async (projectId) => {
    if (!inviteEmail.trim()) {
      showNotification('Please enter a member email.', 'error');
      return;
    }

    const project = projects.find(p => p._id === projectId);
    if (project) {
      const currentPlan = user?.plan || 'Free';
      const memberCount = project.members?.length || 0;

      if (currentPlan === 'Free' && memberCount >= 3) {
        showNotification('Free plan allows up to 3 members per project only. Upgrade to continue.', 'warning');
        return;
      }
      if (currentPlan === 'Premium' && memberCount >= 10) {
        showNotification('Premium plan allows up to 10 members per project only. Upgrade to continue.', 'warning');
        return;
      }
    }

    try {
      setInviteLoading(true);
      await axios.post(`${API_BASE}/projects/${projectId}/invite`, {
        email: inviteEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('Invitation has been sent to the member email.', 'success');
      setInviteEmail('');
      fetchProjects(token);
    } catch (err) {
      console.error('Invite member error:', err);
      showNotification(err.response?.data?.message || 'Unable to send member invitation.', 'error');
    } finally {
      setInviteLoading(false);
    }
  };

  // 5c. Delete Project Handler
  const handleDeleteProject = async (id, e) => {
    if (e) e.stopPropagation();
    showNotification({
      message: 'Are you sure you want to delete this project? All tasks in the project will be moved to no project.',
      type: 'warning',
      actionLabel: 'Delete project',
      cancelLabel: 'Cancel',
      onAction: async () => {
        try {
          await axios.delete(`${API_BASE}/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
          setTasks((prevTasks) => prevTasks.map((task) => task.project === id ? { ...task, project: null } : task));
          if (selectedProject?._id === id) {
            setSelectedProject(null);
          }
          showNotification('Project deleted successfully.', 'success');
        } catch (err) {
          console.error('Error deleting project:', err);
          showNotification('Unable to delete the project.', 'error');
        }
      }
    });
  };

  const handleLeaveProject = async (id, e) => {
    if (e) e.stopPropagation();
    showNotification({
      message: 'Are you sure you want to leave this project? Tasks assigned to you in this project will no longer be available in your workspace.',
      type: 'warning',
      actionLabel: 'Leave project',
      cancelLabel: 'Cancel',
      onAction: async () => {
        try {
          await axios.post(`${API_BASE}/projects/${id}/leave`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProjects((prevProjects) => prevProjects.filter((project) => project._id !== id));
          setTasks((prevTasks) => prevTasks.filter((task) => task.project !== id));
          if (selectedProject?._id === id) {
            setSelectedProject(null);
          }
          showNotification('You left the project successfully.', 'success');
        } catch (err) {
          console.error('Error leaving project:', err);
          showNotification(err.response?.data?.message || 'Unable to leave the project.', 'error');
        }
      }
    });
  };

  // 6. Handle Avatar File Upload and Convert to Base64
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showNotification('Avatar size must be 2MB or smaller.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileAvatar(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  // 7. Handle Profile Update API
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileUsername.trim()) {
      showNotification('Username cannot be empty.', 'error');
      return;
    }

    try {
      setProfileLoading(true);

      const res = await axios.put(`${API_BASE}/auth/profile`, {
        username: profileUsername,
        password: profilePassword || undefined,
        avatar: profileAvatar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
      showNotification('Profile updated successfully!', 'success');

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      }

      setTimeout(() => {
        setIsProfileOpen(false);
      }, 1200);
    } catch (err) {
      console.error('Profile update error:', err);
      showNotification(err.response?.data?.message || 'Failed to update profile.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  // 8. Add Task via API
  const handleAddTask = async (e, forceProject = null) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const targetProjectId = forceProject || newTaskProject;
    if (targetProjectId) {
      const project = projects.find(p => p._id === targetProjectId);
      if (project) {
        const projectOwnerId = project.user && typeof project.user === 'object' ? project.user._id : project.user;
        const currentPlan = user?.plan || 'Free';

        if (projectOwnerId === user?._id) {
          const projectTasksCount = tasks.filter(t => t.project === targetProjectId).length;
          if (currentPlan === 'Free' && projectTasksCount >= 15) {
            showNotification('Free projects can only have up to 15 tasks. Upgrade to continue.', 'warning');
            return;
          }
          if (currentPlan === 'Premium' && projectTasksCount >= 50) {
            showNotification('Premium projects can only have up to 50 tasks. Upgrade to continue.', 'warning');
            return;
          }
        }
      }
    }

    try {
      const taskData = {
        title: newTaskTitle,
        priority: newPriority,
        category: newCategory,
        deadline: newDeadline || getTodayStr(),
        project: targetProjectId || null,
        assignee: newTaskAssignee || null
      };

      const res = await axios.post(`${API_BASE}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([res.data, ...tasks]);
      setNewTaskTitle('');
      setNewDeadline('');
      setNewTaskProject('');
      setNewTaskAssignee('');
    } catch (err) {
      console.error('Error adding task:', err);
      showNotification(err.response?.data?.message || 'Unable to add a new task.', 'error');
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
      showNotification('Unable to update task status.', 'error');
    }
  };

  // 10. Delete Task via API
  const deleteTask = async (id) => {
    showNotification({
      message: 'Are you sure you want to delete this task?',
      type: 'warning',
      actionLabel: 'Delete task',
      cancelLabel: 'Cancel',
      onAction: async () => {
        try {
          await axios.delete(`${API_BASE}/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
          showNotification('Task deleted successfully.', 'success');
        } catch (err) {
          console.error('Error deleting task:', err);
          showNotification('Unable to delete the task.', 'error');
        }
      }
    });
  };

  // 10b. Task Details Modal Handlers
  const openTaskDetails = (task) => {
    setSelectedTaskDetails(task);
    setEditTaskTitle(task.title || '');
    setEditTaskDesc(task.description || '');
    setEditTaskDeadline(task.deadline || '');
    setEditTaskPriority(task.priority || 'Medium');
    setEditTaskCategory(task.category || 'Personal');
    setEditTaskProject(task.project || '');
    setEditTaskStatus(getTaskStatus(task));
    setEditTaskAssignee(task.assignee && typeof task.assignee === 'object' ? task.assignee._id : task.assignee || '');
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
        completed: editTaskStatus === 'done',
        assignee: editTaskAssignee || null
      };

      const res = await axios.put(`${API_BASE}/tasks/${selectedTaskDetails._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(tasks.map(t => t._id === selectedTaskDetails._id ? res.data : t));
      setIsTaskDetailsOpen(false);
      setSelectedTaskDetails(null);
    } catch (err) {
      console.error('Error updating task details:', err);
      showNotification(err.response?.data?.message || 'Unable to save task changes.', 'error');
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
    // Do nothing to avoid UI flicker
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
      showNotification('Unable to update task status on the server. Restoring previous state...', 'error');
      fetchTasks(token);
    }
  };

  // --- Dynamic Dashboard Math Calculations ---
  const getProjectInfo = (projId) => {
    const proj = projects.find(p => p._id === projId);
    return proj ? { name: proj.name, color: proj.color } : null;
  };

  // Helper to classify task status
  const getTaskStatus = (task) => {
    if (task.status) return task.status;
    if (task.completed) return 'done';
    if (task.deadline && task.deadline >= todayStr) return 'doing';
    return 'todo';
  };

  const todayStr = getTodayStr();

  // Filter tasks by the selected project on the Kanban board
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

  // "Pending" = not completed tasks (in progress + not started)
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
      label: 'September',
      completed: Math.max(1, Math.round(completedCount * 0.4)),
      total: Math.max(2, Math.round(totalTasks * 0.45)),
    },
    {
      label: 'October',
      completed: Math.max(2, Math.round(completedCount * 0.7)),
      total: Math.max(4, Math.round(totalTasks * 0.75)),
    },
    {
      label: 'November',
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
      <>
        <NotificationBanner notification={notification} onClose={hideNotification} />
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
          passwordResetLoading={passwordResetLoading}
          authLoading={authLoading}
          googleLoading={googleLoading}
          googleReady={googleReady}
          handleLogin={handleLogin}
          handleGoogleSignIn={handleGoogleSignIn}
          handleRegister={handleRegister}
          handleForgotPassword={handleForgotPassword}
          handleResetPassword={handleResetPassword}
        />
      </>
    );
  }

  // Main Authenticated Dashboard (Nuegas Layout)
  return (
    <div className={`flex h-screen bg-slate-50 text-slate-800 font-sans relative transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100`}>
      <NotificationBanner notification={notification} onClose={hideNotification} />

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
        editTaskAssignee={editTaskAssignee}
        setEditTaskAssignee={setEditTaskAssignee}
        handleUpdateTaskDetails={handleUpdateTaskDetails}
        projects={projects}
        user={user}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedProject={setSelectedProject}
        setIsProfileOpen={setIsProfileOpen}
        setProfileUsername={setProfileUsername}
        setProfileAvatar={setProfileAvatar}
        setProfilePassword={setProfilePassword}
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
          handleLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          showNotification={showNotification}
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
            handleLeaveProject={handleLeaveProject}
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
            user={user}
            handleInviteMember={handleInviteMember}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            inviteLoading={inviteLoading}
            newTaskAssignee={newTaskAssignee}
            setNewTaskAssignee={setNewTaskAssignee}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanTab
            projects={projects}
            showNotification={showNotification}
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

        {activeTab === 'billing' && (
          <BillingTab
            user={user}
            token={token}
            fetchUserInfo={fetchUserInfo}
            showNotification={showNotification}
          />
        )}
      </main>
    </div>
  );
}

export default App;
