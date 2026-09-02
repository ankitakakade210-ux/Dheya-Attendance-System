import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  User,
  Lock,
  ArrowRight,
  Sparkles,
  UserPlus,
  LogIn,
  Trash2,
  RefreshCw,
  Mail,
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const Login = () => {
  const { registerAccount, login, clearAllData, loadSampleSeedData, students, teachers, userAccounts } = useApp();
  
  const [authMode, setAuthMode] = useState('register'); // 'signin' or 'register'
  const [selectedRole, setSelectedRole] = useState('student'); // 'admin', 'teacher', 'student'

  // Form Fields for Sign Up / Register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Mathematics');
  const [rollNo, setRollNo] = useState('');

  // Form Fields for Sign In
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    registerAccount({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: selectedRole,
      department: selectedRole === 'teacher' ? department : null,
      rollNo: selectedRole === 'student' ? rollNo.trim() : null
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (selectedRole === 'admin') {
      login({
        demoUser: {
          id: 'admin-1',
          name: 'Dr. Arthur Pendelton',
          email: loginEmail || 'admin@school.edu',
          role: 'admin',
          title: 'System Administrator'
        }
      });
    } else if (selectedRole === 'teacher') {
      const tch = teachers.find(t => t.id === selectedTeacherId) || teachers[0];
      if (tch) {
        login({
          demoUser: {
            id: tch.id,
            name: tch.name,
            email: tch.email,
            role: 'teacher',
            title: `Faculty (${tch.department || 'Education'})`
          }
        });
      } else {
        login({ email: loginEmail, password: loginPassword });
      }
    } else if (selectedRole === 'student') {
      const stu = students.find(s => s.id === selectedStudentId) || students[0];
      if (stu) {
        login({
          demoUser: {
            id: stu.id,
            name: stu.name,
            email: stu.email,
            rollNo: stu.rollNo,
            photo: stu.photo,
            role: 'student',
            title: '9th Standard Student'
          }
        });
      } else {
        login({ email: loginEmail, password: loginPassword });
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 40%), var(--bg-primary)',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '940px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Main Header Brand */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--accent-gradient)',
            boxShadow: 'var(--shadow-glow)',
            marginBottom: '16px'
          }}>
            <GraduationCap size={36} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Grade 9 Attendance System
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '4px' }}>
            Create Your Account or Sign In to Track & Manage Attendance
          </p>
        </div>

        {/* Data Tools Bar (Clear / Seed) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={clearAllData}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--danger)', border: '1px solid var(--danger-border)' }}
          >
            <Trash2 size={14} /> Clear All Student & Teacher Data
          </button>

          <button
            onClick={loadSampleSeedData}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--accent-primary)', border: '1px solid var(--border-glow)' }}
          >
            <RefreshCw size={14} /> Load Sample Demo Roster
          </button>
        </div>

        {/* Card Container */}
        <div className="glass-card" style={{ padding: '36px', maxWidth: '620px', margin: '0 auto', width: '100%' }}>
          
          {/* Top Auth Mode Switcher (Sign Up vs Sign In) */}
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(15, 23, 42, 0.7)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '28px' }}>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: authMode === 'register' ? 'var(--accent-gradient)' : 'transparent',
                color: authMode === 'register' ? '#fff' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={16} /> Create Account (Sign Up)
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: authMode === 'signin' ? 'var(--accent-gradient)' : 'transparent',
                color: authMode === 'signin' ? '#fff' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogIn size={16} /> Sign In
            </button>
          </div>

          {/* Role Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`btn ${selectedRole === 'student' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '13px', padding: '10px' }}
            >
              <User size={15} /> Student
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`btn ${selectedRole === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '13px', padding: '10px' }}
            >
              <UserCheck size={15} /> Teacher
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`btn ${selectedRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, fontSize: '13px', padding: '10px' }}
            >
              <ShieldCheck size={15} /> Admin
            </button>
          </div>

          {/* REGISTER / SIGN UP FORM */}
          {authMode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '13px' }}>
                ✨ <strong>Create New Account:</strong> Registering as <strong>{selectedRole.toUpperCase()}</strong>.
                {selectedRole === 'student' && ' You will be added to the 9th Standard class roster!'}
                {selectedRole === 'teacher' && ' You will be registered to mark subject attendance!'}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder={selectedRole === 'student' ? 'e.g. Aarav Sharma' : 'e.g. Prof. Sarah Jenkins'}
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Create Password *</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {selectedRole === 'student' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Roll Number (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Auto-assigned e.g. 9A-${(students.length + 1).toString().padStart(2, '0')}`}
                    value={rollNo}
                    onChange={e => setRollNo(e.target.value)}
                  />
                </div>
              )}

              {selectedRole === 'teacher' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Teaching Department / Subject</label>
                  <select
                    className="form-select"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="General Science">General Science</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '12px' }}
              >
                Create Account & Sign In <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedRole === 'student' && students.length > 0 && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Select Registered Student:</label>
                  <select
                    className="form-select"
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.rollNo} - {s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedRole === 'teacher' && teachers.length > 0 && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Select Registered Teacher:</label>
                  <select
                    className="form-select"
                    value={selectedTeacherId}
                    onChange={e => setSelectedTeacherId(e.target.value)}
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@school.edu"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '12px' }}
              >
                Sign In as {selectedRole.toUpperCase()} <ArrowRight size={18} />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
