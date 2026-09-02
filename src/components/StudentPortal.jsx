import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  LogOut,
  Mail,
  Calendar,
  Clock,
  Award
} from 'lucide-react';

const StudentPortal = () => {
  const { currentUser, logout, getStudentStats, attendanceRecords, subjects } = useApp();

  if (!currentUser) return null;

  const stats = getStudentStats(currentUser.id);
  const { overallPercentage, isEligible, attendedClasses, totalClasses, subjectBreakdown } = stats;

  const studentRecords = attendanceRecords.filter(r => r.studentId === currentUser.id);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 40%), var(--bg-primary)',
      padding: '30px'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Top Header Navigation */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'var(--bg-card)',
          backdropFilter: 'var(--glass-backdrop)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Student Portal</h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>9th Standard Attendance System</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={currentUser.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
                alt={currentUser.name}
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: isEligible ? '2px solid var(--success)' : '2px solid var(--danger)' }}
              />
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800 }}>{currentUser.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 700 }}>Roll: {currentUser.rollNo}</div>
              </div>
            </div>

            <button onClick={logout} className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        {/* Hero Overall Attendance Card */}
        <div className="glass-card" style={{
          padding: '28px',
          borderLeft: isEligible ? '6px solid var(--success)' : '6px solid var(--danger)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info">{currentUser.rollNo}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>9th Standard • Division A</span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '6px' }}>Welcome back, {currentUser.name}!</h1>

            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
              Minimum required attendance for examination eligibility: <strong>75%</strong>
            </p>
          </div>

          {/* Right Stat */}
          <div style={{
            background: isEligible ? 'var(--success-bg)' : 'var(--danger-bg)',
            border: isEligible ? '1px solid var(--success-border)' : '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '20px 28px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: isEligible ? 'var(--success)' : 'var(--danger)', textTransform: 'uppercase' }}>
              Your Overall Attendance
            </div>
            <div style={{ fontSize: '42px', fontWeight: 900, color: isEligible ? 'var(--success)' : 'var(--danger)', lineHeight: 1.1, margin: '6px 0' }}>
              {overallPercentage}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 600 }}>
              {attendedClasses} of {totalClasses} Classes Attended
            </div>

            <div style={{ marginTop: '12px' }}>
              <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 14px', fontSize: '12px' }}>
                {isEligible ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                {isEligible ? 'ELIGIBLE FOR EXAMS (≥75%)' : 'SHORTAGE WARNING (<75%)'}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Banner if Defaulter */}
        {!isEligible && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AlertTriangle size={24} color="var(--danger)" />
            <div>
              <h4 style={{ fontSize: '15px', color: 'var(--danger)', fontWeight: 800 }}>ATTENDANCE SHORTAGE NOTICE (&lt;75%)</h4>
              <p style={{ fontSize: '13px', color: 'var(--danger)', opacity: 0.9 }}>
                Your overall attendance is currently at {overallPercentage}%, which is below the mandatory 75% threshold. Please meet your class teacher (Prof. Sarah Jenkins) immediately.
              </p>
            </div>
          </div>
        )}

        {/* Subject-Wise Breakdown Cards */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} color="var(--accent-primary)" /> Your Subject-Wise Attendance Track
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {subjectBreakdown.map(sub => (
              <div
                key={sub.subjectId}
                className="glass-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderTop: sub.isEligible ? '4px solid var(--success)' : '4px solid var(--danger)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '24px' }}>{sub.icon}</span>
                  <span className={`badge ${sub.isEligible ? 'badge-success' : 'badge-danger'}`}>
                    {sub.percentage}%
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{sub.subjectName}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Teacher: {sub.teacher}</div>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${sub.percentage}%`, height: '100%', background: sub.isEligible ? 'var(--success)' : 'var(--danger)' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-subtle)' }}>
                  <span>Attended: <strong>{sub.attendedClasses}/{sub.totalClasses}</strong></span>
                  <span>Min Requirement: 75%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Log Table */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Recent Attendance Activity Log</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Verification Mode</th>
                </tr>
              </thead>
              <tbody>
                {studentRecords.slice(0, 10).map(rec => {
                  const sub = subjects.find(s => s.id === rec.subjectId) || { name: 'Class Session', icon: '📖' };
                  return (
                    <tr key={rec.id}>
                      <td>{rec.timestamp ? rec.timestamp.replace('T', ' ') : rec.sessionId}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <span>{sub.icon}</span> {sub.name}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${rec.status === 'Present' ? 'badge-success' : rec.status === 'Late' ? 'badge-warning' : 'badge-danger'}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rec.mode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
