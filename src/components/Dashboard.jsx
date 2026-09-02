import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  BookOpen,
  CalendarCheck,
  Percent,
  MapPin,
  Wifi,
  ArrowRight,
  ShieldAlert,
  PlayCircle,
  Plus,
  Clock,
  UserCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const {
    students,
    standards,
    subjects,
    sessions,
    attendanceRecords,
    setCurrentView,
    setSelectedSessionId
  } = useApp();

  // Metrics calculation
  const totalStudents = students.length;
  const totalStandards = standards.length;
  const totalSubjects = subjects.length;

  const totalSessions = sessions.length;
  const offlineSessions = sessions.filter(s => s.mode === 'Offline').length;
  const onlineSessions = sessions.filter(s => s.mode === 'Online').length;

  const totalMarkedRecords = attendanceRecords.length;
  const totalPresentCount = attendanceRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const overallAttendancePct = totalMarkedRecords > 0
    ? Math.round((totalPresentCount / totalMarkedRecords) * 100)
    : 0;

  // Standard-wise attendance rate calculation
  const standardStatsData = standards.map(std => {
    const stdStudentIds = students.filter(s => s.standardId === std.id).map(s => s.id);
    const stdRecords = attendanceRecords.filter(r => stdStudentIds.includes(r.studentId));
    const stdPresent = stdRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const pct = stdRecords.length > 0 ? Math.round((stdPresent / stdRecords.length) * 100) : 0;
    return {
      name: std.code || std.name,
      fullName: std.name,
      attendance: pct,
      studentsCount: stdStudentIds.length
    };
  });

  // Pie chart data for mode split
  const modePieData = [
    { name: 'Offline Classes', value: offlineSessions, color: '#8b5cf6' },
    { name: 'Online Classes', value: onlineSessions, color: '#3b82f6' }
  ];

  // Active / Upcoming sessions
  const activeSessions = sessions.filter(s => s.status === 'Active' || s.status === 'Upcoming');

  const handleStartMarking = (sessionId) => {
    setSelectedSessionId(sessionId);
    setCurrentView('strict-marking');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Welcome */}
      <div className="glass-card" style={{
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1px solid var(--border-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
            Attendance & Teacher Scheduling Console
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '700px' }}>
            Comprehensive hybrid attendance engine tracking both offline physical classes and online remote sessions with teacher availability scheduling and strict verification.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setCurrentView('schedule')} className="btn btn-primary">
            <Plus size={16} /> Schedule Class Session
          </button>
          <button onClick={() => setCurrentView('strict-marking')} className="btn btn-secondary">
            <UserCheck size={16} /> Mark Strict Attendance
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Card 1: Total Students */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Students Enrolled</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{totalStudents}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px' }}>
            Across {totalStandards} Standards & Streams
          </div>
        </div>

        {/* Card 2: Standards & Subjects */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Active Subjects</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.12)', color: 'var(--info)' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{totalSubjects}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px' }}>
            Assigned to faculty members
          </div>
        </div>

        {/* Card 3: Offline vs Online Split */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Class Sessions Tracked</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{totalSessions}</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '11px' }}>
            <span className="badge badge-offline"><MapPin size={10} /> {offlineSessions} Offline</span>
            <span className="badge badge-online"><Wifi size={10} /> {onlineSessions} Online</span>
          </div>
        </div>

        {/* Card 4: Overall Attendance Rate */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Attendance Rate</span>
            <div style={{ padding: '8px', borderRadius: '10px', background: overallAttendancePct >= 75 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: overallAttendancePct >= 75 ? 'var(--success)' : 'var(--danger)' }}>
              <Percent size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: overallAttendancePct >= 75 ? 'var(--success)' : 'var(--danger)' }}>
            {overallAttendancePct}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-subtle)', marginTop: '4px' }}>
            {overallAttendancePct >= 75 ? 'Optimal compliance level' : 'Below 75% target threshold'}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Class Sessions Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Chart 1: Attendance Rate by Standard */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Attendance Percentage by Standard</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Comparison across academic sections and streams</p>
            </div>
            <button onClick={() => setCurrentView('final-track')} className="btn btn-outline btn-sm">
              View Detailed Ledger <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={standardStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff' }}
                  formatter={(val) => [`${val}% Attendance`, 'Compliance']}
                />
                <Bar dataKey="attendance" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Mode Breakdown (Offline vs Online) */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Offline vs Online Ratio</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Class scheduling delivery distribution</p>
          </div>

          <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8b5cf6' }}></div>
              <span>Offline ({offlineSessions})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></div>
              <span>Online ({onlineSessions})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active & Scheduled Sessions */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Upcoming & Active Class Sessions</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sessions scheduled based on teacher availability</p>
          </div>
          <button onClick={() => setCurrentView('schedule')} className="btn btn-outline btn-sm">
            Manage Availability & Schedules
          </button>
        </div>

        {activeSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No active or upcoming class sessions scheduled right now.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeSessions.map(session => {
              const std = standards.find(s => s.id === session.standardId);
              const sub = subjects.find(s => s.id === session.subjectId);
              const isLive = session.status === 'Active';

              return (
                <div
                  key={session.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    background: isLive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isLive ? '1px solid var(--border-glow)' : '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      padding: '12px',
                      borderRadius: '12px',
                      background: session.mode === 'Offline' ? 'var(--offline-bg)' : 'var(--online-bg)',
                      color: session.mode === 'Offline' ? 'var(--offline-color)' : 'var(--online-color)'
                    }}>
                      {session.mode === 'Offline' ? <MapPin size={22} /> : <Wifi size={22} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700 }}>{session.title}</span>
                        <span className={`badge ${session.mode === 'Offline' ? 'badge-offline' : 'badge-online'}`}>
                          {session.mode}
                        </span>
                        {isLive && (
                          <span className="badge badge-danger">
                            <span className="live-indicator"></span> LIVE NOW
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span><strong>Standard:</strong> {std?.name || 'Standard'}</span>
                        <span><strong>Subject:</strong> {sub?.name || 'Subject'}</span>
                        <span><strong>Teacher:</strong> {session.teacherName}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {session.startTime} - {session.endTime} ({session.date})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {session.strictMode && (
                      <div style={{ textAlign: 'right', marginRight: '8px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>Strict PIN Code</div>
                        <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                          {session.strictPasscode}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleStartMarking(session.id)}
                      className={`btn ${isLive ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <PlayCircle size={16} /> Mark Strict Attendance
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
