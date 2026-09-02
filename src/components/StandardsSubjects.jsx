import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  BookOpen,
  UserPlus,
  Plus,
  Trash2,
  Users,
  Search,
  CheckCircle,
  Key,
  GraduationCap
} from 'lucide-react';

const StandardsSubjects = () => {
  const {
    standards,
    subjects,
    students,
    teachers,
    addStandard,
    deleteStandard,
    addSubject,
    deleteSubject,
    addStudent,
    deleteStudent,
    setSelectedStudentForProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState('standards'); // 'standards', 'subjects', 'students'
  const [showAddStandardModal, setShowAddStandardModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Form states
  const [standardForm, setStandardForm] = useState({
    name: '',
    code: '',
    academicYear: '2026-2027',
    capacity: 40,
    classTeacher: '',
    description: ''
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    standardId: standards[0]?.id || '',
    credits: 4,
    minAttendance: 75,
    teacher: teachers[0]?.name || ''
  });

  const [studentForm, setStudentForm] = useState({
    name: '',
    rollNo: '',
    email: '',
    standardId: standards[0]?.id || ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStandardId, setFilterStandardId] = useState('all');

  // Submit Handlers
  const handleStandardSubmit = (e) => {
    e.preventDefault();
    if (!standardForm.name || !standardForm.code) return;
    addStandard(standardForm);
    setStandardForm({ name: '', code: '', academicYear: '2026-2027', capacity: 40, classTeacher: '', description: '' });
    setShowAddStandardModal(false);
  };

  const handleSubjectSubmit = (e) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code || !subjectForm.standardId) return;
    addSubject(subjectForm);
    setSubjectForm({ name: '', code: '', standardId: standards[0]?.id || '', credits: 4, minAttendance: 75, teacher: teachers[0]?.name || '' });
    setShowAddSubjectModal(false);
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.rollNo || !studentForm.standardId) return;
    addStudent(studentForm);
    setStudentForm({ name: '', rollNo: '', email: '', standardId: standards[0]?.id || '' });
    setShowAddStudentModal(false);
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStandard = filterStandardId === 'all' || s.standardId === filterStandardId;
    return matchesSearch && matchesStandard;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Controls & Navigation Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Standards & Subjects Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Configure target standards/grades, subjects with credit limits, and student rosters
          </p>
        </div>

        {/* Action Buttons based on active tab */}
        <div>
          {activeTab === 'standards' && (
            <button onClick={() => setShowAddStandardModal(true)} className="btn btn-primary">
              <Plus size={16} /> Add Standard / Class
            </button>
          )}
          {activeTab === 'subjects' && (
            <button onClick={() => setShowAddSubjectModal(true)} className="btn btn-primary">
              <Plus size={16} /> Add Subject
            </button>
          )}
          {activeTab === 'students' && (
            <button onClick={() => setShowAddStudentModal(true)} className="btn btn-primary">
              <UserPlus size={16} /> Enroll New Student
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'standards' ? 'active' : ''}`}
          onClick={() => setActiveTab('standards')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> Standards & Grades ({standards.length})
          </div>
        </button>
        <button
          className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} /> Subjects & Modules ({subjects.length})
          </div>
        </button>
        <button
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} /> Enrolled Students Roster ({students.length})
          </div>
        </button>
      </div>

      {/* TAB 1: STANDARDS */}
      {activeTab === 'standards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {standards.map(std => {
            const count = students.filter(s => s.standardId === std.id).length;
            const stdSubjects = subjects.filter(sub => sub.standardId === std.id);

            return (
              <div key={std.id} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className="badge badge-purple" style={{ marginBottom: '8px' }}>{std.code}</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{std.name}</h3>
                  </div>
                  <button
                    onClick={() => deleteStandard(std.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
                    title="Delete standard"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', minHeight: '38px' }}>
                  {std.description || 'No description provided for this academic section.'}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Class Teacher:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{std.classTeacher || 'Unassigned'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Enrolled Students:</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>{count} / {std.capacity} Students</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Associated Subjects:</span>
                    <strong style={{ color: 'var(--info)' }}>{stdSubjects.length} Subjects</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SUBJECTS */}
      {activeTab === 'subjects' && (
        <div className="table-container glass-card">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subject Code & Name</th>
                <th>Target Standard</th>
                <th>Assigned Teacher</th>
                <th>Credits</th>
                <th>Strict Target %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => {
                const std = standards.find(s => s.id === sub.standardId);
                return (
                  <tr key={sub.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '12px' }}>
                          {sub.code}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{sub.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{std?.name || 'Unassigned'}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{sub.teacher || 'Unassigned'}</div>
                    </td>
                    <td>{sub.credits} Credits</td>
                    <td>
                      <span className="badge badge-warning">{sub.minAttendance || 75}% Required</span>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteSubject(sub.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: STUDENTS ROSTER */}
      {activeTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Filter Header */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search student by name, roll no, email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '36px' }}
              />
            </div>

            <div style={{ width: '220px' }}>
              <select
                value={filterStandardId}
                onChange={e => setFilterStandardId(e.target.value)}
                className="form-select"
              >
                <option value="all">Filter by Standard (All)</option>
                {standards.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-container glass-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Standard / Stream</th>
                  <th>Biometric / PIN Passcode</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const std = standards.find(s => s.id === student.standardId);
                    return (
                      <tr key={student.id}>
                        <td>
                          <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                            {student.rollNo}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={student.photo}
                              alt={student.name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span style={{ fontWeight: 600 }}>{student.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-purple">{std?.name || 'N/A'}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '6px', width: 'fit-content' }}>
                            <Key size={12} color="var(--warning)" /> {student.biometricPin}
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{student.email}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedStudentForProfile(student)}
                              className="btn btn-outline btn-sm"
                            >
                              <GraduationCap size={14} /> Profile
                            </button>
                            <button
                              onClick={() => deleteStudent(student.id)}
                              className="btn btn-outline btn-sm"
                              style={{ color: 'var(--danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
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
      )}

      {/* MODAL 1: ADD STANDARD */}
      {showAddStandardModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Add New Standard / Grade</h2>
            <form onSubmit={handleStandardSubmit}>
              <div className="form-group">
                <label className="form-label">Standard Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard 11 - Science A"
                  value={standardForm.name}
                  onChange={e => setStandardForm({ ...standardForm, name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Code / ID Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STD-11SCI"
                    value={standardForm.code}
                    onChange={e => setStandardForm({ ...standardForm, code: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Academic Year</label>
                  <input
                    type="text"
                    value={standardForm.academicYear}
                    onChange={e => setStandardForm({ ...standardForm, academicYear: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Student Capacity</label>
                  <input
                    type="number"
                    value={standardForm.capacity}
                    onChange={e => setStandardForm({ ...standardForm, capacity: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Class Teacher</label>
                  <select
                    value={standardForm.classTeacher}
                    onChange={e => setStandardForm({ ...standardForm, classTeacher: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Class Teacher</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Notes about curriculum or classroom stream..."
                  value={standardForm.description}
                  onChange={e => setStandardForm({ ...standardForm, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddStandardModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SUBJECT */}
      {showAddSubjectModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Add New Subject</h2>
            <form onSubmit={handleSubjectSubmit}>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Chemistry"
                  value={subjectForm.name}
                  onChange={e => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CHEM-201"
                    value={subjectForm.code}
                    onChange={e => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Standard</label>
                  <select
                    value={subjectForm.standardId}
                    onChange={e => setSubjectForm({ ...subjectForm, standardId: e.target.value })}
                    className="form-select"
                  >
                    {standards.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Credits</label>
                  <input
                    type="number"
                    value={subjectForm.credits}
                    onChange={e => setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Strict Target %</label>
                  <input
                    type="number"
                    value={subjectForm.minAttendance}
                    onChange={e => setSubjectForm({ ...subjectForm, minAttendance: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Teacher</label>
                  <select
                    value={subjectForm.teacher}
                    onChange={e => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                    className="form-select"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddSubjectModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ENROLL STUDENT */}
      {showAddStudentModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Enroll Student</h2>
            <form onSubmit={handleStudentSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Roll Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12S-10"
                    value={studentForm.rollNo}
                    onChange={e => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Standard / Class</label>
                  <select
                    value={studentForm.standardId}
                    onChange={e => setStudentForm({ ...studentForm, standardId: e.target.value })}
                    className="form-select"
                  >
                    {standards.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@school.edu"
                  value={studentForm.email}
                  onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} className="btn btn-secondary">
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

export default StandardsSubjects;
