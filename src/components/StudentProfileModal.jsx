import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  GraduationCap,
  Mail,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';

const StudentProfileModal = () => {
  const {
    selectedStudentForProfile,
    setSelectedStudentForProfile,
    getStudentStats
  } = useApp();

  if (!selectedStudentForProfile) return null;

  const student = selectedStudentForProfile;
  const stats = getStudentStats(student.id);
  const { overallPercentage, isEligible, attendedClasses, totalClasses, subjectBreakdown } = stats;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-card" style={{ maxWidth: '720px' }}>
        {/* Close Button */}
        <button
          onClick={() => setSelectedStudentForProfile(null)}
          style={{ position: 'absolute', right: '20px', top: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <img
            src={student.photo}
            alt={student.name}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: isEligible ? '3px solid var(--success)' : '3px solid var(--danger)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{student.name}</h2>
              <span className="badge badge-info">9th Standard</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span><strong>Roll No:</strong> {student.rollNo}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={13} /> {student.email}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Summary Bar */}
        <div style={{
          background: isEligible ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: isEligible ? '1px solid var(--success-border)' : '1px solid var(--danger-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: isEligible ? 'var(--success)' : 'var(--danger)', textTransform: 'uppercase' }}>
              Overall Attendance Status
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: isEligible ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
              {overallPercentage}% <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>({attendedClasses}/{totalClasses} Classes)</span>
            </div>
          </div>

          <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`} style={{ padding: '8px 16px', fontSize: '14px' }}>
            {isEligible ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {isEligible ? 'ELIGIBLE FOR EXAMS (≥75%)' : 'SHORTAGE ALERT (<75%)'}
          </span>
        </div>

        {/* Subject Breakdown */}
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--accent-primary)" /> 9th Standard Subject Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {subjectBreakdown.map(sub => (
            <div
              key={sub.subjectId}
              style={{
                padding: '14px 18px',
                background: 'rgba(15,23,42,0.5)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{sub.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{sub.subjectName} ({sub.subjectCode})</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Faculty: {sub.teacher}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: sub.isEligible ? 'var(--success)' : 'var(--danger)' }}>
                    {sub.percentage}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                    {sub.attendedClasses}/{sub.totalClasses} Attended
                  </div>
                </div>
                <span className={`badge ${sub.isEligible ? 'badge-success' : 'badge-danger'}`}>
                  {sub.isEligible ? '≥ 75%' : '< 75%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
