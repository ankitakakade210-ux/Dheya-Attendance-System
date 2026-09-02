import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  RefreshCw,
  Camera,
  MapPin,
  Wifi,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  Check,
  Ban,
  Radio,
  Scan,
  UserCheck
} from 'lucide-react';

const StrictAttendance = () => {
  const {
    sessions,
    standards,
    subjects,
    students,
    attendanceRecords,
    selectedSessionId,
    setSelectedSessionId,
    regenerateSessionPin,
    markAttendanceRecord,
    bulkMarkAttendance,
    showToast,
    setCurrentView
  } = useApp();

  // If no session is explicitly selected, pick the first active or upcoming session
  const activeSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  // Verification method state: 'pin', 'biometric', 'location', 'manual'
  const [verificationMode, setVerificationMode] = useState('pin');

  // Interactive Biometric Scanner Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scannedStudent, setScannedStudent] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');

  // Lock timer state (minutes left)
  const [isLocked, setIsLocked] = useState(false);

  // Filter students by current session standard
  const targetStandard = standards.find(st => st.id === activeSession?.standardId);
  const targetSubject = subjects.find(sub => sub.id === activeSession?.subjectId);
  const classStudents = students.filter(s => s.standardId === activeSession?.standardId);

  // Existing records for this session
  const currentSessionRecords = attendanceRecords.filter(r => r.sessionId === activeSession?.id);

  // Calculate live presence statistics for this session
  const presentCount = currentSessionRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const totalCount = classStudents.length;
  const currentPct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Handle single student marking toggle
  const handleToggleStatus = (studentId, newStatus) => {
    if (isLocked) {
      showToast('Session attendance is strictly LOCKED! Unlock to edit.', 'danger');
      return;
    }
    markAttendanceRecord(
      activeSession.id,
      studentId,
      newStatus,
      verificationMode === 'pin' ? 'Strict PIN Verification' : 'Biometric Face ID Scan'
    );
  };

  // Simulate AI Biometric / Face Recognition Check
  const handleSimulateBiometricScan = (student) => {
    if (isLocked) return;
    setIsScanning(true);
    setScannedStudent(student);

    setTimeout(() => {
      setIsScanning(false);
      markAttendanceRecord(
        activeSession.id,
        student.id,
        'Present',
        'AI Face Biometric Scan',
        'Facial geometry match 99.4% verified'
      );
      showToast(`Biometric Verified: ${student.name} marked Present!`, 'success');
      setScannedStudent(null);
    }, 1200);
  };

  // Bulk Actions
  const handleMarkAllPresent = () => {
    if (isLocked) return;
    const allIds = classStudents.map(s => s.id);
    bulkMarkAttendance(activeSession.id, allIds, 'Present', 'Teacher Strict Bulk');
  };

  const handleMarkAllAbsent = () => {
    if (isLocked) return;
    const allIds = classStudents.map(s => s.id);
    bulkMarkAttendance(activeSession.id, allIds, 'Absent', 'Teacher Strict Bulk');
  };

  if (!activeSession) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>No Class Sessions Scheduled</h2>
        <p style={{ color: 'var(--text-muted)', margin: '12px 0 20px 0' }}>
          Please schedule a class session first to launch the strict attendance engine.
        </p>
        <button onClick={() => setCurrentView('schedule')} className="btn btn-primary">
          Schedule Session Now
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner & Session Selector */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-purple">STRICT MODE ACTIVE</span>
              <span className={`badge ${activeSession.mode === 'Offline' ? 'badge-offline' : 'badge-online'}`}>
                {activeSession.mode === 'Offline' ? <MapPin size={12} /> : <Wifi size={12} />}
                {activeSession.mode} Class
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{activeSession.title}</h1>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span><strong>Standard:</strong> {targetStandard?.name || 'N/A'}</span>
              <span><strong>Subject:</strong> {targetSubject?.name || 'N/A'}</span>
              <span><strong>Faculty:</strong> {activeSession.teacherName}</span>
            </div>
          </div>

          {/* Session Switcher Dropdown */}
          <div style={{ width: '280px' }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Switch Active Session:</label>
            <select
              value={activeSession.id}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="form-select"
            >
              {sessions.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.date} - {s.mode})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Strict Session Controls Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {/* PIN Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Key size={12} color="var(--warning)" /> Dynamic Session PIN
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
                {activeSession.strictPasscode}
              </div>
            </div>
            <button
              onClick={() => regenerateSessionPin(activeSession.id)}
              className="btn btn-outline btn-sm"
              title="Generate new 4-digit PIN for students"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Compliance Meter */}
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Live Class Attendance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: currentPct >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                {currentPct}%
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                ({presentCount} / {totalCount} Present)
              </div>
            </div>
          </div>

          {/* Strict Lock Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Attendance Lock</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: isLocked ? 'var(--danger)' : 'var(--success)' }}>
                {isLocked ? 'STRICT LOCKED' : 'UNLOCKED FOR MARKING'}
              </div>
            </div>
            <button
              onClick={() => {
                setIsLocked(!isLocked);
                showToast(isLocked ? 'Attendance unlocked.' : 'Attendance STRICTLY LOCKED to prevent proxy entries.', isLocked ? 'info' : 'warning');
              }}
              className={`btn btn-sm ${isLocked ? 'btn-danger' : 'btn-success'}`}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />} {isLocked ? 'Locked' : 'Lock Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Verification Mode Toolbar & Bulk Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setVerificationMode('pin')}
            className={`btn ${verificationMode === 'pin' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Key size={16} /> Strict Session PIN
          </button>
          <button
            onClick={() => setVerificationMode('biometric')}
            className={`btn ${verificationMode === 'biometric' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Camera size={16} /> AI Face/Biometric Scanner
          </button>
          {activeSession.mode === 'Offline' && (
            <button
              onClick={() => setVerificationMode('location')}
              className={`btn ${verificationMode === 'location' ? 'btn-primary' : 'btn-outline'}`}
            >
              <MapPin size={16} /> GPS Geofence Check
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleMarkAllPresent} disabled={isLocked} className="btn btn-success btn-sm">
            <CheckCircle2 size={14} /> Mark All Present
          </button>
          <button onClick={handleMarkAllAbsent} disabled={isLocked} className="btn btn-danger btn-sm">
            <XCircle size={14} /> Mark All Absent
          </button>
        </div>
      </div>

      {/* Simulated Scanner / Verification Area */}
      {verificationMode === 'biometric' && (
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-glow)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
            Interactive AI Face Recognition & Biometric Scanner
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Click "Scan Face ID" next to any student below to simulate real-time strict facial verification
          </p>

          {isScanning && scannedStudent ? (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px 40px', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-primary)' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--accent-primary)' }}>
                <img src={scannedStudent.photo} alt={scannedStudent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, border: '2px dashed var(--success)', borderRadius: '50%', animation: 'spin 2s linear infinite' }}></div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Scanning {scannedStudent.name}...</div>
              <div className="badge badge-purple">Comparing Facial Embeddings (99.4% Match)</div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <Scan size={32} color="var(--accent-primary)" />
              <span>Biometric engine ready. Select student below for instant verification.</span>
            </div>
          )}
        </div>
      )}

      {/* Student Attendance Marking Roster Table */}
      <div className="table-container glass-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Roll No & Student Name</th>
              <th>Biometric PIN</th>
              <th>Current Status</th>
              <th>Check-in Timestamp</th>
              <th>Verification Mode</th>
              <th>Quick Strict Toggle</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No students enrolled in this standard ({targetStandard?.name}).
                </td>
              </tr>
            ) : (
              classStudents.map(student => {
                const record = currentSessionRecords.find(r => r.studentId === student.id);
                const status = record ? record.status : 'Not Marked';

                return (
                  <tr key={student.id} style={{ opacity: isLocked ? 0.7 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={student.photo}
                          alt={student.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700 }}>{student.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            Roll: {student.rollNo}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                        {student.biometricPin}
                      </span>
                    </td>

                    <td>
                      {status === 'Present' && <span className="badge badge-success"><CheckCircle2 size={12} /> Present</span>}
                      {status === 'Absent' && <span className="badge badge-danger"><XCircle size={12} /> Absent</span>}
                      {status === 'Late' && <span className="badge badge-warning"><Clock size={12} /> Late</span>}
                      {status === 'Excused' && <span className="badge badge-info">Excused</span>}
                      {status === 'Not Marked' && <span className="badge badge-secondary" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Pending</span>}
                    </td>

                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {record ? new Date(record.timestamp).toLocaleTimeString() : '--:--'}
                    </td>

                    <td style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                      {record ? record.mode : 'Pending Verification'}
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {verificationMode === 'biometric' ? (
                          <button
                            onClick={() => handleSimulateBiometricScan(student)}
                            disabled={isLocked}
                            className="btn btn-outline btn-sm"
                            style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                          >
                            <Camera size={13} /> Scan Face ID
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleToggleStatus(student.id, 'Present')}
                              disabled={isLocked}
                              className={`btn btn-sm ${status === 'Present' ? 'btn-success' : 'btn-outline'}`}
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleToggleStatus(student.id, 'Late')}
                              disabled={isLocked}
                              className={`btn btn-sm ${status === 'Late' ? 'btn-warning' : 'btn-outline'}`}
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleToggleStatus(student.id, 'Absent')}
                              disabled={isLocked}
                              className={`btn btn-sm ${status === 'Absent' ? 'btn-danger' : 'btn-outline'}`}
                              style={{ padding: '5px 10px', fontSize: '12px' }}
                            >
                              Absent
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StrictAttendance;
