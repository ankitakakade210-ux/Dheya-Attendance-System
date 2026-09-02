import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarClock,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Wifi,
  AlertCircle,
  Video,
  UserCheck,
  Building,
  Key
} from 'lucide-react';

const ScheduleAvailability = () => {
  const {
    teachers,
    teacherAvailability,
    addTeacherAvailability,
    deleteTeacherAvailability,
    standards,
    subjects,
    sessions,
    addSession,
    updateSessionStatus,
    deleteSession,
    setCurrentView,
    setSelectedSessionId
  } = useApp();

  const [activeTab, setActiveTab] = useState('sessions'); // 'sessions' or 'availability'
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  // Form states
  const [sessionForm, setSessionForm] = useState({
    title: '',
    standardId: standards[0]?.id || '',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    mode: 'Offline', // Offline or Online
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:30',
    venue: 'Main Building - Room 101',
    meetingLink: 'https://meet.google.com/class-session',
    meetingPasscode: 'EDULIVE2026',
    strictTimeoutMins: 10
  });

  const [availForm, setAvailForm] = useState({
    teacherId: teachers[0]?.id || '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '12:00',
    preferredMode: 'Offline',
    location: 'Lab Building - Room 201'
  });

  // Handle Standard Change in Session Form (Auto-updates subject list)
  const availableSubjectsForStandard = subjects.filter(s => s.standardId === sessionForm.standardId);

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    const selectedTeacher = teachers.find(t => t.id === sessionForm.teacherId);
    const newSession = addSession({
      ...sessionForm,
      teacherName: selectedTeacher ? selectedTeacher.name : 'Faculty Member',
      strictMode: true
    });
    setShowScheduleModal(false);
  };

  const handleAvailSubmit = (e) => {
    e.preventDefault();
    const selectedTeacher = teachers.find(t => t.id === availForm.teacherId);
    addTeacherAvailability({
      ...availForm,
      teacherName: selectedTeacher ? selectedTeacher.name : 'Faculty Member'
    });
    setShowAvailabilityModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Schedule & Teacher Availability</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Schedule hybrid online/offline class sessions based on teacher availability slots
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {activeTab === 'sessions' ? (
            <button onClick={() => setShowScheduleModal(true)} className="btn btn-primary">
              <Plus size={16} /> Schedule Class Session
            </button>
          ) : (
            <button onClick={() => setShowAvailabilityModal(true)} className="btn btn-primary">
              <Plus size={16} /> Add Teacher Availability Slot
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarClock size={16} /> Scheduled Sessions ({sessions.length})
          </div>
        </button>
        <button
          className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveTab('availability')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} /> Teacher Availability Slots ({teacherAvailability.length})
          </div>
        </button>
      </div>

      {/* TAB 1: SCHEDULED SESSIONS */}
      {activeTab === 'sessions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="table-container glass-card">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Session Details & Title</th>
                  <th>Delivery Mode</th>
                  <th>Standard & Subject</th>
                  <th>Faculty & Time</th>
                  <th>Venue / Link & Strict PIN</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No class sessions scheduled yet. Click "Schedule Class Session" to add one.
                    </td>
                  </tr>
                ) : (
                  sessions.map(session => {
                    const std = standards.find(s => s.id === session.standardId);
                    const sub = subjects.find(s => s.id === session.subjectId);

                    return (
                      <tr key={session.id}>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '15px' }}>{session.title}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {session.id}</div>
                        </td>

                        <td>
                          <span className={`badge ${session.mode === 'Offline' ? 'badge-offline' : 'badge-online'}`}>
                            {session.mode === 'Offline' ? <MapPin size={12} /> : <Wifi size={12} />}
                            {session.mode} Class
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600, fontSize: '13px' }}>{sub?.name || 'Subject'}</div>
                          <span className="badge badge-purple" style={{ fontSize: '10px', marginTop: '2px' }}>
                            {std?.name || 'Standard'}
                          </span>
                        </td>

                        <td>
                          <div style={{ fontWeight: 600 }}>{session.teacherName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={11} /> {session.date} ({session.startTime} - {session.endTime})
                          </div>
                        </td>

                        <td>
                          {session.mode === 'Offline' ? (
                            <div style={{ fontSize: '13px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Building size={12} color="var(--offline-color)" /> {session.venue || 'Campus Room'}
                              </div>
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px' }}>
                              <a href={session.meetingLink} target="_blank" rel="noreferrer" style={{ color: 'var(--online-color)', fontWeight: 600, textDecoration: 'underline' }}>
                                Launch Online Meeting
                              </a>
                              {session.meetingPasscode && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Passcode: {session.meetingPasscode}</div>
                              )}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: 'var(--warning)', fontFamily: 'monospace' }}>
                            <Key size={10} /> PIN: {session.strictPasscode}
                          </div>
                        </td>

                        <td>
                          <select
                            value={session.status}
                            onChange={(e) => updateSessionStatus(session.id, e.target.value)}
                            className="form-select"
                            style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }}
                          >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Active">Active (Live Now)</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setSelectedSessionId(session.id);
                                setCurrentView('strict-marking');
                              }}
                              className="btn btn-primary btn-sm"
                              title="Mark Attendance"
                            >
                              <UserCheck size={14} /> Strict Mark
                            </button>
                            <button
                              onClick={() => deleteSession(session.id)}
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

      {/* TAB 2: TEACHER AVAILABILITY SLOTS */}
      {activeTab === 'availability' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {teacherAvailability.map(avail => {
            const teacherObj = teachers.find(t => t.id === avail.teacherId);
            return (
              <div key={avail.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{avail.teacherName}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{teacherObj?.department}</div>
                  </div>
                  <button
                    onClick={() => deleteTeacherAvailability(avail.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-primary)' }}>{avail.dayOfWeek}</span>
                    <span className={`badge ${avail.preferredMode === 'Offline' ? 'badge-offline' : 'badge-online'}`}>
                      {avail.preferredMode} Preferred
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-main)', fontWeight: 600 }}>
                    <Clock size={14} color="var(--accent-primary)" />
                    {avail.startTime} - {avail.endTime}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong>Default Location/Link:</strong>
                  <div style={{ color: 'var(--text-main)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {avail.location}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: SCHEDULE CLASS SESSION */}
      {showScheduleModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Schedule Class Session</h2>

            <form onSubmit={handleSessionSubmit}>
              <div className="form-group">
                <label className="form-label">Session Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thermodynamics & Heat Engine Lecture"
                  value={sessionForm.title}
                  onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                  className="form-control"
                />
              </div>

              {/* Mode Selection */}
              <div className="form-group">
                <label className="form-label">Class Mode (Offline vs Online)</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className={`btn ${sessionForm.mode === 'Offline' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setSessionForm({ ...sessionForm, mode: 'Offline' })}
                  >
                    <MapPin size={16} /> Offline Campus Class
                  </button>
                  <button
                    type="button"
                    className={`btn ${sessionForm.mode === 'Online' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setSessionForm({ ...sessionForm, mode: 'Online' })}
                  >
                    <Wifi size={16} /> Online Remote Class
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Target Standard / Class</label>
                  <select
                    value={sessionForm.standardId}
                    onChange={e => setSessionForm({ ...sessionForm, standardId: e.target.value })}
                    className="form-select"
                  >
                    {standards.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    value={sessionForm.subjectId}
                    onChange={e => setSessionForm({ ...sessionForm, subjectId: e.target.value })}
                    className="form-select"
                  >
                    {availableSubjectsForStandard.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Assigned Teacher</label>
                  <select
                    value={sessionForm.teacherId}
                    onChange={e => setSessionForm({ ...sessionForm, teacherId: e.target.value })}
                    className="form-select"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    value={sessionForm.date}
                    onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Start & End Time</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <input
                      type="time"
                      value={sessionForm.startTime}
                      onChange={e => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                      className="form-control"
                    />
                    <input
                      type="time"
                      value={sessionForm.endTime}
                      onChange={e => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Mode Fields */}
              {sessionForm.mode === 'Offline' ? (
                <div className="form-group">
                  <label className="form-label">Physical Room / Building Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics Hall 2, Science Block B"
                    value={sessionForm.venue}
                    onChange={e => setSessionForm({ ...sessionForm, venue: e.target.value })}
                    className="form-control"
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Video Meeting URL (Google Meet / Zoom)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://meet.google.com/xyz-abc"
                      value={sessionForm.meetingLink}
                      onChange={e => setSessionForm({ ...sessionForm, meetingLink: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Meeting Passcode</label>
                    <input
                      type="text"
                      placeholder="e.g. CLASS123"
                      value={sessionForm.meetingPasscode}
                      onChange={e => setSessionForm({ ...sessionForm, meetingPasscode: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowScheduleModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm & Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD TEACHER AVAILABILITY */}
      {showAvailabilityModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Add Teacher Availability Slot</h2>
            <form onSubmit={handleAvailSubmit}>
              <div className="form-group">
                <label className="form-label">Teacher Name</label>
                <select
                  value={availForm.teacherId}
                  onChange={e => setAvailForm({ ...availForm, teacherId: e.target.value })}
                  className="form-select"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Day of Week</label>
                  <select
                    value={availForm.dayOfWeek}
                    onChange={e => setAvailForm({ ...availForm, dayOfWeek: e.target.value })}
                    className="form-select"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    value={availForm.startTime}
                    onChange={e => setAvailForm({ ...availForm, startTime: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    value={availForm.endTime}
                    onChange={e => setAvailForm({ ...availForm, endTime: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Mode</label>
                <select
                  value={availForm.preferredMode}
                  onChange={e => setAvailForm({ ...availForm, preferredMode: e.target.value })}
                  className="form-select"
                >
                  <option value="Offline">Offline Physical Classroom</option>
                  <option value="Online">Online Video Link</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Default Room / Meeting Link</label>
                <input
                  type="text"
                  placeholder="Room 102 or Google Meet Link"
                  value={availForm.location}
                  onChange={e => setAvailForm({ ...availForm, location: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAvailabilityModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleAvailability;
