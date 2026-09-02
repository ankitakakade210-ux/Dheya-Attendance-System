import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  RotateCcw,
  UserCheck,
  CheckSquare,
  Square
} from 'lucide-react';

const SubjectRegister = () => {
  const { subjects, students, markSubjectAttendance, showToast } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sub-math9');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Attendance state map: { 'stu-901': 'Present', 'stu-902': 'Absent', ... }
  const [attendanceMap, setAttendanceMap] = useState({});

  // Initialize attendance map with 'Present' by default for all students when subject or date changes
  useEffect(() => {
    const initialMap = {};
    students.forEach(student => {
      initialMap[student.id] = 'Present';
    });
    setAttendanceMap(initialMap);
  }, [selectedSubjectId, selectedDate, students]);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleToggleStatus = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updatedMap = {};
    students.forEach(student => {
      updatedMap[student.id] = status;
    });
    setAttendanceMap(updatedMap);
    showToast(`Marked all 9th Standard students as ${status}.`, 'info');
  };

  const handleSave = (e) => {
    e.preventDefault();
    markSubjectAttendance({
      subjectId: selectedSubjectId,
      date: selectedDate,
      attendanceMap
    });
  };

  // Count stats for current form state
  const presentCount = Object.values(attendanceMap).filter(s => s === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter(s => s === 'Absent').length;
  const lateCount = Object.values(attendanceMap).filter(s => s === 'Late').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📝</span>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Subject-Wise Attendance Register</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
              Select subject and date to mark attendance for 9th Standard students.
            </p>
          </div>
        </div>
      </div>

      {/* Subject & Date Selector Bar */}
      <div className="glass-card" style={{ padding: '22px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          alignItems: 'end'
        }}>
          {/* Subject Dropdown */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={15} color="var(--accent-primary)" /> Select 9th Standard Subject:
            </label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              style={{ height: '42px', fontWeight: 600 }}
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.icon || '📖'} {sub.name} ({sub.code}) - {sub.teacher}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="var(--accent-primary)" /> Select Date:
            </label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ height: '42px', fontWeight: 600 }}
            />
          </div>

          {/* Quick Stats Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700 }}>PRESENT</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)' }}>{presentCount}</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 700 }}>ABSENT</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--danger)' }}>{absentCount}</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 700 }}>LATE</span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--warning)' }}>{lateCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Marking Toolbar & Student Table */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{currentSubject?.icon}</span> {currentSubject?.name} Register - {selectedDate}
            </h3>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Class Teacher / Faculty: <strong>{currentSubject?.teacher}</strong>
            </div>
          </div>

          {/* Quick Mark All Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleMarkAll('Present')}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--success)' }}
            >
              <CheckCircle2 size={14} /> Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('Absent')}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--danger)' }}
            >
              <XCircle size={14} /> Mark All Absent
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '14px' }}
            >
              <Save size={16} /> Save Register
            </button>
          </div>
        </div>

        {/* Student Register Table */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Roll No</th>
                <th>Student Name</th>
                <th>Email</th>
                <th style={{ textAlign: 'center' }}>Mark Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => {
                const currentStatus = attendanceMap[student.id] || 'Present';

                return (
                  <tr key={student.id}>
                    <td>
                      <span className="badge badge-info">{student.rollNo}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={student.photo}
                          alt={student.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 700 }}>{student.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{student.email}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.id, 'Present')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: currentStatus === 'Present' ? 'var(--success)' : 'transparent',
                            color: currentStatus === 'Present' ? '#fff' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle2 size={13} /> Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.id, 'Absent')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: currentStatus === 'Absent' ? 'var(--danger)' : 'transparent',
                            color: currentStatus === 'Absent' ? '#fff' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <XCircle size={13} /> Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(student.id, 'Late')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 'var(--radius-sm)',
                            border: 'none',
                            background: currentStatus === 'Late' ? 'var(--warning)' : 'transparent',
                            color: currentStatus === 'Late' ? '#fff' : 'var(--text-muted)',
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Clock size={13} /> Late
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary btn-lg"
          >
            <Save size={18} /> Save 9th Standard Attendance Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectRegister;
