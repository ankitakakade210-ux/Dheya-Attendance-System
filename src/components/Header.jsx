import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Moon, Sun, Clock, Calendar, Search, GraduationCap, ShieldCheck, UserCheck, LogOut } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme, setCurrentView, currentView, currentUser, logout } = useApp();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getRoleBadge = () => {
    if (currentUser?.role === 'admin') {
      return (
        <span className="badge badge-purple" style={{ fontSize: '11px' }}>
          <ShieldCheck size={12} /> ADMIN CONTROL
        </span>
      );
    }
    if (currentUser?.role === 'teacher') {
      return (
        <span className="badge badge-info" style={{ fontSize: '11px' }}>
          <UserCheck size={12} /> TEACHER
        </span>
      );
    }
    return null;
  };

  return (
    <header className="no-print" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-card)',
      backdropFilter: 'var(--glass-backdrop)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Search & Class Info Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search 9th Std students or roll no..."
            className="form-control"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
            onFocus={() => {
              if (currentView !== 'final-track' && currentView !== 'student-dashboard') setCurrentView('final-track');
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <GraduationCap size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
            9th Standard Attendance System
          </span>
        </div>

        {getRoleBadge()}
      </div>

      {/* Right controls: Date/Time, Theme Toggle, User Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Live Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} color="var(--accent-primary)" />
            <span>{dateStr}</span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'var(--border-color)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--text-main)' }}>
            <Clock size={13} color="var(--accent-primary)" />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-outline"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
        </button>

        {/* Logged in User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '10px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px', boxShadow: '0 2px 10px rgba(99,102,241,0.4)' }}>
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'US'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.2 }}>{currentUser?.name || 'User'}</div>
            <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>{currentUser?.title || currentUser?.role}</div>
          </div>

          <button
            onClick={logout}
            className="btn btn-outline btn-sm"
            style={{ padding: '6px 10px', marginLeft: '6px', color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
