import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  BookOpen,
  Users,
  Layers,
  RotateCcw,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  LogOut,
  User
} from 'lucide-react';

const Sidebar = () => {
  const { currentView, setCurrentView, resetToDemoData, classSummaryStats, currentUser, logout } = useApp();

  const defaulterCount = classSummaryStats.defaulterCount;
  const eligibleCount = classSummaryStats.eligibleCount;

  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';

  const navItems = [
    {
      id: 'final-track',
      label: 'Final Review & Defaulters',
      icon: <BarChart3 size={18} />,
      badge: defaulterCount > 0 ? `${defaulterCount} Shortage` : null,
      badgeColor: 'badge-danger',
      roles: ['admin', 'teacher']
    },
    {
      id: 'subject-register',
      label: 'Subject Attendance Register',
      icon: <BookOpen size={18} />,
      roles: ['admin', 'teacher']
    },
    {
      id: 'students-list',
      label: '9th Std Students Roster',
      icon: <Users size={18} />,
      badge: `${classSummaryStats.totalStudents}`,
      badgeColor: 'badge-info',
      roles: ['admin', 'teacher']
    },
    {
      id: 'subjects-mgr',
      label: 'Subjects & Curriculum',
      icon: <Layers size={18} />,
      roles: ['admin'] // Only admin can manage subjects & curriculum!
    }
  ];

  const allowedNavItems = navItems.filter(item => item.roles.includes(currentUser?.role || 'admin'));

  return (
    <aside className="no-print" style={{
      width: '270px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      flexShrink: 0
    }}>
      <div>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px 20px 8px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <GraduationCap size={26} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Grade 9 Tracker
            </h2>
            <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {currentUser?.role || 'System'} Access
            </div>
          </div>
        </div>

        {/* Role Badge Box */}
        <div style={{
          background: isAdmin ? 'rgba(168, 85, 247, 0.12)' : 'rgba(99, 102, 241, 0.1)',
          border: isAdmin ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-md)',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: isAdmin ? '#c084fc' : 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isAdmin ? <ShieldCheck size={14} /> : <UserCheck size={14} />} Active Role: {currentUser?.role.toUpperCase()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 700 }}>
            {currentUser?.name}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isAdmin ? 'Full System Control & Management' : 'Faculty Attendance Register Access'}
          </div>
        </div>

        {/* 75% Benchmark Quick Summary */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 12px',
          marginBottom: '20px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
            <span>≥75% Eligible:</span>
            <strong>{eligibleCount} Students</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)', fontWeight: 600, marginTop: '4px' }}>
            <span>&lt;75% Defaulter:</span>
            <strong>{defaulterCount} Students</strong>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {allowedNavItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${item.badgeColor}`} style={{ fontSize: '10px', padding: '2px 7px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Demo Data Reset */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isAdmin && (
          <button
            onClick={resetToDemoData}
            className="btn btn-outline"
            style={{ width: '100%', fontSize: '12px', padding: '8px 12px' }}
          >
            <RotateCcw size={14} /> Reset Demo Data
          </button>
        )}

        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ width: '100%', fontSize: '12px', padding: '8px 12px', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
        >
          <LogOut size={14} /> Switch Account / Logout
        </button>

        <div style={{ fontSize: '11px', color: 'var(--text-subtle)', textAlign: 'center', marginTop: '4px' }}>
          Role Auth Engine v3.2
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
