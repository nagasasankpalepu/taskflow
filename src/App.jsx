import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ─── Theme & Design System ───────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0c10",
  surface: "#12151c",
  surfaceAlt: "#1a1e28",
  border: "#252a38",
  accent: "#4f8ef7",
  accentGlow: "#4f8ef720",
  green: "#3ecf8e",
  yellow: "#f5c542",
  red: "#f05c5c",
  purple: "#a78bfa",
  text: "#e8eaf0",
  textMuted: "#6b7280",
  textDim: "#9ca3af",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }

  .app-shell {
    display: flex;
    min-height: 100vh;
  }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    background: ${COLORS.surface};
    border-right: 1px solid ${COLORS.border};
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    transition: transform 0.3s ease;
  }

  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid ${COLORS.border};
  }

  .logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 18px;
    color: ${COLORS.text};
    letter-spacing: -0.5px;
  }

  .logo-dot { color: ${COLORS.accent}; }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 600;
    color: ${COLORS.textMuted};
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 8px 8px 4px;
    margin-top: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: ${COLORS.textMuted};
    transition: all 0.15s ease;
    border: 1px solid transparent;
    position: relative;
  }

  .nav-item:hover {
    background: ${COLORS.surfaceAlt};
    color: ${COLORS.text};
  }

  .nav-item.active {
    background: ${COLORS.accentGlow};
    color: ${COLORS.accent};
    border-color: ${COLORS.accent}30;
  }

  .nav-badge {
    margin-left: auto;
    background: ${COLORS.red};
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 20px;
    font-family: 'DM Mono', monospace;
  }

  .sidebar-user {
    padding: 16px;
    border-top: 1px solid ${COLORS.border};
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    flex-shrink: 0;
  }

  .avatar-sm { width: 26px; height: 26px; font-size: 10px; }
  .avatar-lg { width: 40px; height: 40px; font-size: 15px; }

  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: ${COLORS.text}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: ${COLORS.textMuted}; font-family: 'DM Mono', monospace; }

  /* MAIN */
  .main {
    margin-left: 240px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    background: ${COLORS.surface};
    border-bottom: 1px solid ${COLORS.border};
    padding: 0 32px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .topbar-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: ${COLORS.text};
  }

  .topbar-actions { display: flex; gap: 10px; align-items: center; }

  .content { padding: 28px 32px; flex: 1; }

  /* BUTTONS */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s ease;
    font-family: 'Inter', sans-serif;
    white-space: nowrap;
  }

  .btn-primary {
    background: ${COLORS.accent};
    color: white;
    box-shadow: 0 2px 12px ${COLORS.accent}40;
  }

  .btn-primary:hover {
    background: #6fa3f9;
    box-shadow: 0 4px 16px ${COLORS.accent}60;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: ${COLORS.surfaceAlt};
    color: ${COLORS.textDim};
    border-color: ${COLORS.border};
  }

  .btn-secondary:hover { background: ${COLORS.border}; color: ${COLORS.text}; }

  .btn-danger { background: ${COLORS.red}20; color: ${COLORS.red}; border-color: ${COLORS.red}40; }
  .btn-danger:hover { background: ${COLORS.red}30; }

  .btn-sm { padding: 5px 11px; font-size: 12px; }
  .btn-ghost { background: transparent; color: ${COLORS.textMuted}; }
  .btn-ghost:hover { color: ${COLORS.text}; background: ${COLORS.surfaceAlt}; }

  /* CARDS */
  .card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 20px;
  }

  .card-hover { transition: border-color 0.2s, transform 0.2s; cursor: pointer; }
  .card-hover:hover { border-color: ${COLORS.accent}50; transform: translateY(-2px); }

  /* STATS */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 28px;
  }

  .stat-card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }

  .stat-card.blue::before { background: ${COLORS.accent}; }
  .stat-card.green::before { background: ${COLORS.green}; }
  .stat-card.yellow::before { background: ${COLORS.yellow}; }
  .stat-card.red::before { background: ${COLORS.red}; }
  .stat-card.purple::before { background: ${COLORS.purple}; }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 32px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label { font-size: 12px; color: ${COLORS.textMuted}; font-weight: 500; }

  /* TABLES */
  .table-wrap { overflow-x: auto; }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  th {
    text-align: left;
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 600;
    color: ${COLORS.textMuted};
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border-bottom: 1px solid ${COLORS.border};
    font-family: 'DM Mono', monospace;
  }

  td {
    padding: 13px 16px;
    border-bottom: 1px solid ${COLORS.border}60;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover td { background: ${COLORS.surfaceAlt}30; }

  /* BADGES */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
  }

  .badge-todo { background: ${COLORS.textMuted}20; color: ${COLORS.textMuted}; }
  .badge-in_progress { background: ${COLORS.accent}20; color: ${COLORS.accent}; }
  .badge-review { background: ${COLORS.purple}20; color: ${COLORS.purple}; }
  .badge-done { background: ${COLORS.green}20; color: ${COLORS.green}; }
  .badge-overdue { background: ${COLORS.red}20; color: ${COLORS.red}; }
  .badge-low { background: ${COLORS.green}15; color: ${COLORS.green}; }
  .badge-medium { background: ${COLORS.yellow}15; color: ${COLORS.yellow}; }
  .badge-high { background: ${COLORS.red}15; color: ${COLORS.red}; }
  .badge-admin { background: ${COLORS.accent}20; color: ${COLORS.accent}; }
  .badge-member { background: ${COLORS.purple}20; color: ${COLORS.purple}; }

  /* MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .modal {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 16px;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.2s ease;
  }

  .modal-header {
    padding: 24px 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
  }

  .modal-body { padding: 20px 24px 24px; }

  /* FORMS */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: ${COLORS.textMuted}; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }

  .form-input, .form-select, .form-textarea {
    width: 100%;
    background: ${COLORS.surfaceAlt};
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    padding: 10px 14px;
    color: ${COLORS.text};
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    transition: border-color 0.15s;
    outline: none;
  }

  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 0 3px ${COLORS.accentGlow};
  }

  .form-textarea { min-height: 90px; resize: vertical; }
  .form-select { cursor: pointer; }
  .form-select option { background: ${COLORS.surfaceAlt}; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* AUTH */
  .auth-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${COLORS.bg};
    position: relative;
    overflow: hidden;
  }

  .auth-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 40%, ${COLORS.accent}08 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, ${COLORS.purple}06 0%, transparent 50%);
  }

  .auth-card {
    width: 420px;
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 20px;
    padding: 40px;
    position: relative;
    z-index: 1;
  }

  .auth-logo {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 8px;
  }

  .auth-tagline {
    text-align: center;
    color: ${COLORS.textMuted};
    font-size: 13px;
    margin-bottom: 32px;
  }

  .auth-tabs {
    display: flex;
    background: ${COLORS.surfaceAlt};
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 24px;
  }

  .auth-tab {
    flex: 1;
    padding: 8px;
    text-align: center;
    border-radius: 7px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: ${COLORS.textMuted};
    transition: all 0.15s;
    border: none;
    background: transparent;
  }

  .auth-tab.active {
    background: ${COLORS.surface};
    color: ${COLORS.text};
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }

  .auth-error {
    background: ${COLORS.red}15;
    border: 1px solid ${COLORS.red}30;
    color: ${COLORS.red};
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 14px;
  }

  /* PROGRESS BAR */
  .progress-bar {
    height: 6px;
    background: ${COLORS.border};
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
  }

  /* TASK CARD */
  .task-card {
    background: ${COLORS.surface};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 8px;
    transition: border-color 0.15s, transform 0.15s;
  }

  .task-card:hover { border-color: ${COLORS.accent}40; transform: translateX(2px); }

  .task-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
  .task-meta { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

  /* EMPTY STATE */
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: ${COLORS.textMuted};
  }

  .empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
  .empty-title { font-size: 15px; font-weight: 600; color: ${COLORS.textDim}; margin-bottom: 6px; }
  .empty-text { font-size: 13px; }

  /* SECTION HEADER */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .section-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: ${COLORS.text};
  }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

  /* SEARCH */
  .search-wrap { position: relative; }
  .search-wrap .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: ${COLORS.textMuted}; font-size: 14px; }
  .search-input { padding-left: 36px !important; }

  /* TOOLTIP / TAG */
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: ${COLORS.surfaceAlt};
    border: 1px solid ${COLORS.border};
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    color: ${COLORS.textMuted};
    font-family: 'DM Mono', monospace;
  }

  /* NOTIFICATION */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${COLORS.surfaceAlt};
    border: 1px solid ${COLORS.border};
    border-radius: 10px;
    padding: 14px 18px;
    font-size: 13px;
    color: ${COLORS.text};
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: slideUp 0.3s ease;
    max-width: 340px;
  }

  .toast.success { border-left: 3px solid ${COLORS.green}; }
  .toast.error { border-left: 3px solid ${COLORS.red}; }
  .toast.info { border-left: 3px solid ${COLORS.accent}; }

  /* DIVIDER */
  .divider { border: none; border-top: 1px solid ${COLORS.border}; margin: 20px 0; }

  /* FLEX UTILS */
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .mb-2 { margin-bottom: 8px; }
  .mb-3 { margin-bottom: 12px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .text-muted { color: ${COLORS.textMuted}; font-size: 12px; }
  .text-sm { font-size: 13px; }
  .text-mono { font-family: 'DM Mono', monospace; }
  .w-full { width: 100%; }

  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .main { margin-left: 0; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .content { padding: 16px; }
  }
`;

// ─── Data Layer (in-memory DB) ────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

const DB = {
  users: [
    { id: "u1", name: "Alex Morgan", email: "admin@demo.com", password: "demo123", role: "admin", avatar: "#4f8ef7", initials: "AM", createdAt: now() },
    { id: "u2", name: "Sam Rivera", email: "member@demo.com", password: "demo123", role: "member", avatar: "#3ecf8e", initials: "SR", createdAt: now() },
    { id: "u3", name: "Jordan Lee", email: "jordan@demo.com", password: "demo123", role: "member", avatar: "#a78bfa", initials: "JL", createdAt: now() },
  ],
  projects: [
    { id: "p1", name: "Website Redesign", description: "Revamp the company website with new branding", status: "active", ownerId: "u1", members: ["u1", "u2", "u3"], createdAt: now(), dueDate: "2026-06-15" },
    { id: "p2", name: "Mobile App MVP", description: "Build the first version of our mobile application", status: "active", ownerId: "u1", members: ["u1", "u3"], createdAt: now(), dueDate: "2026-07-01" },
  ],
  tasks: [
    { id: "t1", title: "Design new homepage mockups", description: "Create wireframes and high-fidelity mockups for the new homepage", projectId: "p1", assigneeId: "u2", creatorId: "u1", status: "in_progress", priority: "high", dueDate: "2026-05-20", createdAt: now(), tags: ["design", "ux"] },
    { id: "t2", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated deployments", projectId: "p1", assigneeId: "u1", creatorId: "u1", status: "done", priority: "high", dueDate: "2026-05-10", createdAt: now(), tags: ["devops"] },
    { id: "t3", title: "Write API documentation", description: "Document all REST API endpoints using OpenAPI spec", projectId: "p2", assigneeId: "u3", creatorId: "u1", status: "todo", priority: "medium", dueDate: "2026-05-05", createdAt: now(), tags: ["docs"] },
    { id: "t4", title: "Implement auth system", description: "JWT-based authentication with refresh tokens", projectId: "p2", assigneeId: "u1", creatorId: "u1", status: "review", priority: "high", dueDate: "2026-05-25", createdAt: now(), tags: ["backend", "security"] },
    { id: "t5", title: "Performance audit", description: "Run Lighthouse audits and fix critical issues", projectId: "p1", assigneeId: "u2", creatorId: "u2", status: "todo", priority: "low", dueDate: "2026-04-30", createdAt: now(), tags: ["perf"] },
  ],
  comments: [],
  session: null,
};

// ─── Auth Context ─────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ─── Toast Context ────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
const useToast = () => useContext(ToastCtx);

// ─── Utils ────────────────────────────────────────────────────────────────────
const isOverdue = (task) => {
  if (task.status === "done") return false;
  return task.dueDate && new Date(task.dueDate) < new Date();
};

const getStatusLabel = (s) => ({ todo: "To Do", in_progress: "In Progress", review: "In Review", done: "Done" }[s] || s);
const getPriorityEmoji = (p) => ({ low: "🟢", medium: "🟡", high: "🔴" }[p] || "⚪");

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const projectProgress = (projectId) => {
  const tasks = DB.tasks.filter(t => t.projectId === projectId);
  if (!tasks.length) return 0;
  return Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100);
};

// ─── Icons (SVG inline) ───────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    projects: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
    tasks: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    team: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  };
  return icons[name] || null;
};

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ toast }) {
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  return (
    <div className={`toast ${toast.type}`}>
      <span>{icons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  );
}

// ─── Auth Screen ──────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = () => {
    setError("");
    const user = DB.users.find(u => u.email === form.email && u.password === form.password);
    if (!user) { setError("Invalid email or password"); return; }
    onLogin(user);
  };

  const handleSignup = () => {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("All fields required"); return; }
    if (DB.users.find(u => u.email === form.email)) { setError("Email already registered"); return; }
    const initials = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const colors = ["#4f8ef7", "#3ecf8e", "#a78bfa", "#f5c542", "#f05c5c"];
    const user = {
      id: genId(), name: form.name, email: form.email, password: form.password,
      role: form.role, avatar: colors[DB.users.length % colors.length], initials, createdAt: now()
    };
    DB.users.push(user);
    onLogin(user);
  };

  const demoLogin = (role) => {
    const demos = { admin: "admin@demo.com", member: "member@demo.com" };
    const user = DB.users.find(u => u.email === demos[role]);
    if (user) onLogin(user);
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">Task<span className="logo-dot">·</span>Flow</div>
        <div className="auth-tagline">Team collaboration, simplified</div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Sign Up</button>
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        {tab === "login" ? (
          <>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <button className="btn btn-primary w-full" style={{ justifyContent: "center", marginBottom: 12 }} onClick={handleLogin}>Sign In</button>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => demoLogin("admin")}>Demo Admin</button>
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => demoLogin("member")}>Demo Member</button>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => set("password", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={e => set("role", e.target.value)}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary w-full" style={{ justifyContent: "center" }} onClick={handleSignup}>Create Account</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = "md" }) {
  const cls = size === "sm" ? "avatar avatar-sm" : size === "lg" ? "avatar avatar-lg" : "avatar";
  return <div className={cls} style={{ background: user?.avatar + "30", color: user?.avatar, border: `1px solid ${user?.avatar}50` }}>{user?.initials || "?"}</div>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ view, setView, user, onLogout }) {
  const overdueTasks = DB.tasks.filter(t => isOverdue(t) && (user.role === "admin" || t.assigneeId === user.id)).length;

  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "projects", icon: "projects", label: "Projects" },
    { id: "tasks", icon: "tasks", label: "My Tasks", badge: overdueTasks || null },
    ...(user.role === "admin" ? [{ id: "team", icon: "team", label: "Team" }] : []),
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">Task<span className="logo-dot">·</span>Flow</div>
        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>v1.0 · Workspace</div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        {navItems.map(item => (
          <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)}>
            <Icon name={item.icon} size={15} />
            {item.label}
            {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
          </div>
        ))}
      </div>

      <div className="sidebar-user">
        <Avatar user={user} />
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Logout" style={{ padding: "5px" }}>
          <Icon name="logout" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user }) {
  const myTasks = user.role === "admin" ? DB.tasks : DB.tasks.filter(t => t.assigneeId === user.id);
  const myProjects = user.role === "admin" ? DB.projects : DB.projects.filter(p => p.members.includes(user.id));

  const stats = {
    total: myTasks.length,
    done: myTasks.filter(t => t.status === "done").length,
    inProgress: myTasks.filter(t => t.status === "in_progress").length,
    overdue: myTasks.filter(t => isOverdue(t)).length,
    projects: myProjects.length,
  };

  const recentTasks = [...myTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const overdueTasks = myTasks.filter(t => isOverdue(t));

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-num" style={{ color: COLORS.accent }}>{stats.projects}</div>
          <div className="stat-label">Active Projects</div>
        </div>
        <div className="stat-card green">
          <div className="stat-num" style={{ color: COLORS.green }}>{stats.done}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-num" style={{ color: COLORS.yellow }}>{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card red">
          <div className="stat-num" style={{ color: COLORS.red }}>{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-num" style={{ color: COLORS.purple }}>{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="section-header">
            <div className="section-title">Project Progress</div>
          </div>
          {myProjects.length === 0 ? (
            <div className="empty"><div className="empty-text">No projects yet</div></div>
          ) : myProjects.map(p => {
            const prog = projectProgress(p.id);
            const taskCount = DB.tasks.filter(t => t.projectId === p.id).length;
            return (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: prog === 100 ? COLORS.green : COLORS.accent }}>{prog}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${prog}%`, background: prog === 100 ? COLORS.green : COLORS.accent }} />
                </div>
                <div className="text-muted" style={{ marginTop: 4 }}>{taskCount} tasks · due {formatDate(p.dueDate)}</div>
              </div>
            );
          })}
        </div>

        {overdueTasks.length > 0 && (
          <div className="card" style={{ borderColor: `${COLORS.red}40` }}>
            <div className="section-header">
              <div className="section-title" style={{ color: COLORS.red }}>⚠ Overdue Tasks</div>
              <span className="badge badge-overdue">{overdueTasks.length}</span>
            </div>
            {overdueTasks.map(t => {
              const assignee = DB.users.find(u => u.id === t.assigneeId);
              return (
                <div key={t.id} className="task-card" style={{ borderColor: `${COLORS.red}30`, marginBottom: 8 }}>
                  <div className="task-title">{t.title}</div>
                  <div className="task-meta">
                    <span className="badge badge-high">{getPriorityEmoji(t.priority)} {t.priority}</span>
                    <span className="tag"><Icon name="calendar" size={10} /> {formatDate(t.dueDate)}</span>
                    {assignee && <Avatar user={assignee} size="sm" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="card" style={{ gridColumn: overdueTasks.length === 0 ? "2" : "auto" }}>
          <div className="section-header">
            <div className="section-title">Recent Activity</div>
          </div>
          {recentTasks.length === 0 ? (
            <div className="empty"><div className="empty-text">No tasks yet</div></div>
          ) : recentTasks.map(t => {
            const assignee = DB.users.find(u => u.id === t.assigneeId);
            const project = DB.projects.find(p => p.id === t.projectId);
            return (
              <div key={t.id} style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
                <Avatar user={assignee} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.title}</div>
                  <div className="text-muted">{project?.name} · <span className={`badge badge-${t.status}`}>{getStatusLabel(t.status)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Task Modal ───────────────────────────────────────────────────────────────
function TaskModal({ task, projectId, user, onClose, onSave }) {
  const [form, setForm] = useState(task || {
    title: "", description: "", projectId: projectId || DB.projects[0]?.id || "",
    assigneeId: user.id, status: "todo", priority: "medium", dueDate: "", tags: []
  });
  const [tagInput, setTagInput] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canEdit = user.role === "admin" || !task || task.creatorId === user.id;

  const save = () => {
    if (!form.title.trim()) return;
    if (task) {
      Object.assign(task, form);
    } else {
      DB.tasks.push({ ...form, id: genId(), creatorId: user.id, createdAt: now() });
    }
    onSave();
    onClose();
  };

  const project = DB.projects.find(p => p.id === form.projectId);
  const members = project ? DB.users.filter(u => project.members.includes(u.id)) : DB.users;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{task ? "Edit Task" : "New Task"}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="Task title" value={form.title} onChange={e => set("title", e.target.value)} disabled={!canEdit} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Describe the task..." value={form.description} onChange={e => set("description", e.target.value)} disabled={!canEdit} />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Project</label>
              <select className="form-select" value={form.projectId} onChange={e => set("projectId", e.target.value)} disabled={!canEdit || !!projectId}>
                {DB.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Assignee</label>
              <select className="form-select" value={form.assigneeId} onChange={e => set("assigneeId", e.target.value)} disabled={user.role !== "admin" && !canEdit}>
                {members.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div style={{ height: 12 }} />
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => set("status", e.target.value)}>
                {["todo", "in_progress", "review", "done"].map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Priority</label>
              <select className="form-select" value={form.priority} onChange={e => set("priority", e.target.value)} disabled={!canEdit}>
                {["low", "medium", "high"].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{ height: 12 }} />
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input className="form-input" type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} disabled={!canEdit} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
              {(form.tags || []).map(tag => (
                <span key={tag} className="tag" style={{ cursor: "pointer" }} onClick={() => set("tags", form.tags.filter(t => t !== tag))}>
                  {tag} ×
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="form-input" placeholder="Add tag..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { set("tags", [...(form.tags || []), tagInput.trim()]); setTagInput(""); } }}
                disabled={!canEdit} />
              <button className="btn btn-secondary btn-sm" onClick={() => { if (tagInput.trim()) { set("tags", [...(form.tags || []), tagInput.trim()]); setTagInput(""); } }}>Add</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save}><Icon name="check" size={14} /> Save Task</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Projects View ────────────────────────────────────────────────────────────
function ProjectModal({ project, user, onClose, onSave }) {
  const [form, setForm] = useState(project || { name: "", description: "", dueDate: "", members: [user.id] });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleMember = (uid) => {
    set("members", form.members.includes(uid) ? form.members.filter(id => id !== uid) : [...form.members, uid]);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (project) {
      Object.assign(project, form);
    } else {
      DB.projects.push({ ...form, id: genId(), ownerId: user.id, status: "active", createdAt: now() });
    }
    onSave();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{project ? "Edit Project" : "New Project"}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input className="form-input" placeholder="e.g. Website Redesign" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="What is this project about?" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input className="form-input" type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Team Members</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DB.users.map(u => (
                <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.members.includes(u.id)} onChange={() => toggleMember(u.id)} style={{ accentColor: COLORS.accent }} />
                  <Avatar user={u} size="sm" />
                  <span style={{ fontSize: 13 }}>{u.name}</span>
                  <span className={`badge badge-${u.role}`}>{u.role}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save}><Icon name="check" size={14} /> Save Project</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsView({ user }) {
  const [modal, setModal] = useState(null);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const projects = user.role === "admin" ? DB.projects : DB.projects.filter(p => p.members.includes(user.id));

  const deleteProject = (p) => {
    if (!window.confirm(`Delete "${p.name}"? All tasks will be removed.`)) return;
    DB.tasks = DB.tasks.filter(t => t.projectId !== p.id);
    const idx = DB.projects.indexOf(p);
    if (idx > -1) DB.projects.splice(idx, 1);
    refresh();
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title" style={{ fontSize: 20 }}>Projects</div>
        {user.role === "admin" && (
          <button className="btn btn-primary" onClick={() => setModal({ type: "new" })}>
            <Icon name="plus" size={14} /> New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="empty-icon">📁</div>
            <div className="empty-title">No projects yet</div>
            <div className="empty-text">Create your first project to get started</div>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {projects.map(p => {
            const prog = projectProgress(p.id);
            const tasks = DB.tasks.filter(t => t.projectId === p.id);
            const members = DB.users.filter(u => p.members.includes(u.id));
            const overdue = tasks.filter(t => isOverdue(t)).length;

            return (
              <div key={p.id} className="card" style={{ position: "relative" }}>
                <div className="flex justify-between items-center mb-3">
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700 }}>{p.name}</div>
                  {user.role === "admin" && (
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "edit", project: p })}><Icon name="edit" size={13} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteProject(p)}><Icon name="trash" size={13} /></button>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16 }}>{p.description}</div>

                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontSize: 12, color: COLORS.textMuted }}>Progress</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: prog === 100 ? COLORS.green : COLORS.accent }}>{prog}%</span>
                </div>
                <div className="progress-bar" style={{ marginBottom: 16 }}>
                  <div className="progress-fill" style={{ width: `${prog}%`, background: prog === 100 ? COLORS.green : COLORS.accent }} />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="tag"><Icon name="tasks" size={10} /> {tasks.length} tasks</span>
                    {overdue > 0 && <span className="tag" style={{ color: COLORS.red, borderColor: COLORS.red + "40" }}>⚠ {overdue} overdue</span>}
                  </div>
                  <div className="flex gap-1">
                    {members.slice(0, 4).map(u => <Avatar key={u.id} user={u} size="sm" />)}
                    {members.length > 4 && <div className="avatar avatar-sm" style={{ background: COLORS.surfaceAlt, color: COLORS.textMuted }}>+{members.length - 4}</div>}
                  </div>
                </div>

                <hr className="divider" />
                <div className="flex justify-between" style={{ fontSize: 12, color: COLORS.textMuted }}>
                  <span><Icon name="calendar" size={11} /> Due {formatDate(p.dueDate)}</span>
                  <span>Owner: {DB.users.find(u => u.id === p.ownerId)?.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal?.type === "new" && <ProjectModal user={user} onClose={() => setModal(null)} onSave={refresh} />}
      {modal?.type === "edit" && <ProjectModal project={modal.project} user={user} onClose={() => setModal(null)} onSave={refresh} />}
    </div>
  );
}

// ─── Tasks View ───────────────────────────────────────────────────────────────
function TasksView({ user }) {
  const [modal, setModal] = useState(null);
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const refresh = () => setTick(t => t + 1);

  const baseTasks = user.role === "admin" ? DB.tasks : DB.tasks.filter(t => t.assigneeId === user.id || t.creatorId === user.id);

  const tasks = baseTasks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterProject !== "all" && t.projectId !== filterProject) return false;
    return true;
  });

  const deleteTask = (t) => {
    const idx = DB.tasks.indexOf(t);
    if (idx > -1) DB.tasks.splice(idx, 1);
    refresh();
  };

  const userProjects = user.role === "admin" ? DB.projects : DB.projects.filter(p => p.members.includes(user.id));

  return (
    <div>
      <div className="section-header">
        <div className="section-title" style={{ fontSize: 20 }}>Tasks</div>
        <button className="btn btn-primary" onClick={() => setModal({ type: "new" })}>
          <Icon name="plus" size={14} /> New Task
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="search-wrap" style={{ flex: 1, minWidth: 180 }}>
            <span className="search-icon"><Icon name="search" size={13} /></span>
            <input className="form-input search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            {["todo", "in_progress", "review", "done"].map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
          </select>
          <select className="form-select" style={{ width: 130 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="form-select" style={{ width: 160 }} value={filterProject} onChange={e => setFilterProject(e.target.value)}>
            <option value="all">All Projects</option>
            {userProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card">
        {tasks.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✅</div>
            <div className="empty-title">No tasks found</div>
            <div className="empty-text">Try adjusting your filters or create a new task</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(t => {
                  const assignee = DB.users.find(u => u.id === t.assigneeId);
                  const project = DB.projects.find(p => p.id === t.projectId);
                  const overdue = isOverdue(t);
                  const canAct = user.role === "admin" || t.creatorId === user.id || t.assigneeId === user.id;

                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13, color: overdue ? COLORS.red : COLORS.text }}>{t.title}</div>
                        {overdue && <span style={{ fontSize: 11, color: COLORS.red }}>⚠ Overdue</span>}
                        {(t.tags || []).length > 0 && (
                          <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                            {t.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                          </div>
                        )}
                      </td>
                      <td><span style={{ fontSize: 12, color: COLORS.textMuted }}>{project?.name || "—"}</span></td>
                      <td>
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar user={assignee} size="sm" />
                            <span style={{ fontSize: 12 }}>{assignee.name}</span>
                          </div>
                        ) : "—"}
                      </td>
                      <td><span className={`badge badge-${t.status}`}>{getStatusLabel(t.status)}</span></td>
                      <td><span className={`badge badge-${t.priority}`}>{getPriorityEmoji(t.priority)} {t.priority}</span></td>
                      <td><span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: overdue ? COLORS.red : COLORS.textMuted }}>{formatDate(t.dueDate)}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {canAct && (
                            <>
                              <button className="btn btn-ghost btn-sm" onClick={() => setModal({ type: "edit", task: t })}><Icon name="edit" size={13} /></button>
                              {(user.role === "admin" || t.creatorId === user.id) && (
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTask(t)}><Icon name="trash" size={13} /></button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal?.type === "new" && <TaskModal user={user} onClose={() => setModal(null)} onSave={refresh} />}
      {modal?.type === "edit" && <TaskModal task={modal.task} user={user} onClose={() => setModal(null)} onSave={refresh} />}
    </div>
  );
}

// ─── Team View (Admin only) ───────────────────────────────────────────────────
function TeamView({ user }) {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const changeRole = (u, role) => {
    if (u.id === user.id) { alert("Can't change your own role"); return; }
    u.role = role;
    refresh();
  };

  const removeUser = (u) => {
    if (u.id === user.id) { alert("Can't remove yourself"); return; }
    if (!window.confirm(`Remove ${u.name}?`)) return;
    const idx = DB.users.indexOf(u);
    if (idx > -1) DB.users.splice(idx, 1);
    DB.projects.forEach(p => { p.members = p.members.filter(id => id !== u.id); });
    DB.tasks.forEach(t => { if (t.assigneeId === u.id) t.assigneeId = user.id; });
    refresh();
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title" style={{ fontSize: 20 }}>Team Members</div>
        <span className="badge badge-admin">{DB.users.length} members</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Email</th>
                <th>Role</th>
                <th>Tasks Assigned</th>
                <th>Completed</th>
                <th>Projects</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {DB.users.map(u => {
                const assigned = DB.tasks.filter(t => t.assigneeId === u.id);
                const done = assigned.filter(t => t.status === "done");
                const projects = DB.projects.filter(p => p.members.includes(u.id));

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar user={u} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                          {u.id === user.id && <span style={{ fontSize: 10, color: COLORS.accent }}>You</span>}
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: COLORS.textMuted }}>{u.email}</span></td>
                    <td>
                      <select className="form-select" style={{ width: 110, padding: "4px 8px", fontSize: 12 }}
                        value={u.role} onChange={e => changeRole(u, e.target.value)} disabled={u.id === user.id}>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                      </select>
                    </td>
                    <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{assigned.length}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: COLORS.green }}>{done.length}</span>
                        {assigned.length > 0 && (
                          <div className="progress-bar" style={{ width: 50 }}>
                            <div className="progress-fill" style={{ width: `${(done.length / assigned.length) * 100}%`, background: COLORS.green }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td><span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13 }}>{projects.length}</span></td>
                    <td>
                      {u.id !== user.id && (
                        <button className="btn btn-danger btn-sm" onClick={() => removeUser(u)}><Icon name="trash" size={13} /></button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div className="section-title" style={{ marginBottom: 14 }}>Role Permissions</div>
        <div className="grid-2">
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-admin">Admin</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Full Access</span>
            </div>
            {["Manage all projects & tasks", "Add/remove team members", "Change user roles", "View all tasks & reports", "Delete any content"].map(p => (
              <div key={p} className="flex items-center gap-2" style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>
                <span style={{ color: COLORS.green }}>✓</span> {p}
              </div>
            ))}
          </div>
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-member">Member</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Limited Access</span>
            </div>
            {[
              ["View assigned projects & tasks", true],
              ["Create and manage own tasks", true],
              ["Update status of assigned tasks", true],
              ["Manage team members", false],
              ["Delete others' tasks", false],
            ].map(([p, allowed]) => (
              <div key={p} className="flex items-center gap-2" style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>
                <span style={{ color: allowed ? COLORS.green : COLORS.red }}>{allowed ? "✓" : "✕"}</span> {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [tick, setTick] = useState(0);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name.split(" ")[0]}! 👋`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("dashboard");
    showToast("Logged out successfully", "info");
  };

  if (!currentUser) return (
    <ToastCtx.Provider value={showToast}>
      <style>{css}</style>
      <AuthScreen onLogin={handleLogin} />
      {toast && <Toast toast={toast} />}
    </ToastCtx.Provider>
  );

  const viewTitles = { dashboard: "Dashboard", projects: "Projects", tasks: "Tasks", team: "Team" };

  return (
    <AuthCtx.Provider value={currentUser}>
      <ToastCtx.Provider value={showToast}>
        <style>{css}</style>
        <div className="app-shell">
          <Sidebar view={view} setView={setView} user={currentUser} onLogout={handleLogout} />
          <div className="main">
            <div className="topbar">
              <div className="topbar-title">{viewTitles[view]}</div>
              <div className="topbar-actions">
                <span className="tag"><Icon name="clock" size={11} /> {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                <Avatar user={currentUser} />
              </div>
            </div>
            <div className="content">
              {view === "dashboard" && <Dashboard user={currentUser} key={tick} />}
              {view === "projects" && <ProjectsView user={currentUser} key={tick} />}
              {view === "tasks" && <TasksView user={currentUser} key={tick} />}
              {view === "team" && currentUser.role === "admin" && <TeamView user={currentUser} key={tick} />}
              {view === "team" && currentUser.role !== "admin" && (
                <div className="card">
                  <div className="empty">
                    <div className="empty-icon">🔒</div>
                    <div className="empty-title">Access Denied</div>
                    <div className="empty-text">Only admins can manage the team</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {toast && <Toast toast={toast} />}
      </ToastCtx.Provider>
    </AuthCtx.Provider>
  );
}
