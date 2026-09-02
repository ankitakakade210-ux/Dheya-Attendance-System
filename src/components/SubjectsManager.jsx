import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Plus, BookOpen, User, Percent, Trash2, X } from 'lucide-react';

const SubjectsManager = () => {
  const { subjects, addSubject, deleteSubject, teachers } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newSub, setNewSub] = useState({
    name: '',
    code: '',
    teacher: teachers[0]?.name || 'Prof. Sarah Jenkins',
    credits: 4,
    icon: '📚'
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newSub.name.trim()) return;

    addSubject({
      name: newSub.name.trim(),
      code: newSub.code.trim() || `SUB-${Math.floor(100 + Math.random() * 900)}`,
      teacher: newSub.teacher,
      credits: Number(newSub.credits) || 4,
      icon: newSub.icon || '📚',
      minAttendance: 75
    });

    setNewSub({ name: '', code: '', teacher: teachers[0]?.name || 'Prof. Sarah Jenkins', credits: 4, icon: '📚' });
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>📚</span>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800 }}>9th Standard Subjects & Curriculum</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
              Manage subjects, faculty teachers, and minimum attendance thresholds.
            </p>
          </div>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {/* Grid of Subjects */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {subjects.map(sub => (
          <div
            key={sub.id}
            className="glass-card glass-card-interactive"
            style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '32px' }}>{sub.icon || '📖'}</span>
                <span className="badge badge-info">{sub.code}</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '12px', color: 'var(--text-main)' }}>
                {sub.name}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} color="var(--accent-primary)" /> Faculty: <strong>{sub.teacher}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Percent size={14} color="var(--warning)" /> Minimum Required: <strong>75% Attendance</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <span className="badge badge-purple">{sub.credits} Credits</span>
              <button
                onClick={() => {
                  if (confirm(`Delete subject ${sub.name}?`)) deleteSubject(sub.id);
                }}
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--danger)' }}
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Add Subject to 9th Standard</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Physics & Chemistry"
                  value={newSub.name}
                  onChange={e => setNewSub({ ...newSub, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. SCI-902"
                  value={newSub.code}
                  onChange={e => setNewSub({ ...newSub, code: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Faculty Teacher</label>
                <select
                  className="form-select"
                  value={newSub.teacher}
                  onChange={e => setNewSub({ ...newSub, teacher: e.target.value })}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsManager;
