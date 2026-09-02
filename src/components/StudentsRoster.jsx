import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Trash2,
  X
} from 'lucide-react';

const StudentsRoster = () => {
  const { classSummaryStats, addStudent, deleteStudent, setSelectedStudentForProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: ''
  });

  const studentsList = classSummaryStats.studentsWithStats;

  const filteredStudents = studentsList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name.trim()) return;

    addStudent({
      name: newStudent.name.trim(),
      email: newStudent.email.trim() || `${newStudent.name.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
      rollNo: newStudent.rollNo.trim() || `9A-${(studentsList.length + 1).toString().padStart(2, '0')}`
    });

    setNewStudent({ name: '', email: '', rollNo: '' });
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>👨‍🎓</span>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>9th Standard Students Roster</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
              Enrolled students in 9th Standard. Total: <strong>{studentsList.length} Students</strong>.
            </p>
          </div>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <UserPlus size={16} /> Add New Student
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="glass-card" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by student name or roll number..."
            className="form-control"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '36px', height: '40px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> {classSummaryStats.eligibleCount} Eligible (≥75%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontWeight: 700 }}>
            <AlertTriangle size={16} /> {classSummaryStats.defaulterCount} Defaulters (&lt;75%)
          </span>
        </div>
      </div>

      {/* Grid of Student Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {filteredStudents.map(student => {
          const { overallPercentage, isEligible, attendedClasses, totalClasses } = student.stats;

          return (
            <div
              key={student.id}
              className="glass-card glass-card-interactive"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                borderTop: isEligible ? '4px solid var(--success)' : '4px solid var(--danger)'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <img
                  src={student.photo}
                  alt={student.name}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: isEligible ? '2px solid var(--success)' : '2px solid var(--danger)'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span className="badge badge-info">{student.rollNo}</span>
                    <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`}>
                      {overallPercentage}%
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '6px', color: 'var(--text-main)' }}>
                    {student.name}
                  </h3>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <Mail size={12} /> {student.email}
                  </div>
                </div>
              </div>

              {/* Progress & Stat */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Classes Attended:</span>
                  <strong>{attendedClasses} / {totalClasses}</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${overallPercentage}%`, height: '100%', background: isEligible ? 'var(--success)' : 'var(--danger)' }} />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <button
                  onClick={() => setSelectedStudentForProfile(student)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, marginRight: '8px' }}
                >
                  View Details & History
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Remove ${student.name} from 9th Standard?`)) {
                      deleteStudent(student.id);
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ color: 'var(--danger)', padding: '6px 10px' }}
                  title="Remove Student"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Add Student to 9th Standard</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent}>
              <div className="form-group">
                <label className="form-label">Student Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Auto: 9A-${(studentsList.length + 1).toString().padStart(2, '0')}`}
                  value={newStudent.rollNo}
                  onChange={e => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="student@school.edu"
                  value={newStudent.email}
                  onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsRoster;
