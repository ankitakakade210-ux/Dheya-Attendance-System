import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  Download,
  Printer,
  ChevronDown,
  ChevronUp,
  BarChart2,
  BellRing,
  BookOpen,
  Filter,
  UserCheck
} from 'lucide-react';

const FinalTrackLedger = () => {
  const { classSummaryStats, subjects, setSelectedStudentForProfile, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'eligible', 'defaulters'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStudentId, setExpandedStudentId] = useState(null);

  const {
    totalStudents,
    eligibleCount,
    defaulterCount,
    averageAttendancePercentage,
    studentsWithStats,
    eligibleStudents,
    defaulterStudents
  } = classSummaryStats;

  // Filter students based on activeTab and searchQuery
  const getFilteredStudents = () => {
    let list = studentsWithStats;
    if (activeTab === 'eligible') {
      list = eligibleStudents;
    } else if (activeTab === 'defaulters') {
      list = defaulterStudents;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const filteredList = getFilteredStudents();

  const toggleExpand = (id) => {
    setExpandedStudentId(prev => (prev === id ? null : id));
  };

  const handleExportCSV = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Overall Attendance %', 'Status (≥75%)', 'Classes Attended', 'Total Classes'];
    const rows = studentsWithStats.map(s => [
      s.rollNo,
      `"${s.name}"`,
      s.email,
      `${s.stats.overallPercentage}%`,
      s.stats.isEligible ? 'Eligible (>=75%)' : 'Shortage Defaulter (<75%)',
      s.stats.attendedClasses,
      s.stats.totalClasses
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `9th_Standard_Attendance_Final_Review_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('9th Standard Attendance Report exported to CSV.', 'success');
  };

  const handleSendNotices = () => {
    showToast(`Attendance warning notices sent to all ${defaulterCount} defaulter students (<75%).`, 'info');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* View Title & Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>📊</span>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 800 }}>9th Standard Final Review & Attendance Tracker</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '2px' }}>
                Track overall & subject-wise attendance for 9th Standard. Minimum requirement: <strong>75% Attendance</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSendNotices} className="btn btn-warning" style={{ fontSize: '13px' }}>
            <BellRing size={15} /> Notify Defaulters ({defaulterCount})
          </button>
          <button onClick={handleExportCSV} className="btn btn-secondary" style={{ fontSize: '13px' }}>
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => window.print()} className="btn btn-primary" style={{ fontSize: '13px' }}>
            <Printer size={15} /> Print Summary
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {/* Card 1: Total 9th Std Students */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Total 9th Std Students</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--accent-primary)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0 4px 0', color: 'var(--text-main)' }}>
            {totalStudents}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Class 9-A & 9-B Roster</div>
        </div>

        {/* Card 2: Attendance >= 75% (Eligible) */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>Above 75% (Eligible)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="var(--success)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0 4px 0', color: 'var(--success)' }}>
            {eligibleCount} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>({totalStudents > 0 ? Math.round((eligibleCount/totalStudents)*100) : 0}%)</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success)' }}>
            Students cleared for exams
          </div>
        </div>

        {/* Card 3: Attendance < 75% (Defaulter Warning) */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--danger)' }}>Below 75% (Shortage)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="var(--danger)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0 4px 0', color: 'var(--danger)' }}>
            {defaulterCount} <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>({totalStudents > 0 ? Math.round((defaulterCount/totalStudents)*100) : 0}%)</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--danger)' }}>
            Defaulters requiring action
          </div>
        </div>

        {/* Card 4: Class Average % */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Overall Class Average</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={20} color="var(--info)" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, margin: '10px 0 4px 0', color: 'var(--text-main)' }}>
            {averageAttendancePercentage}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Across 5 Core Subjects</div>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Segmented Tab Filter */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(15,23,42,0.6)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'all' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'all' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All Students ({totalStudents})
            </button>
            <button
              onClick={() => setActiveTab('eligible')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'eligible' ? 'var(--success)' : 'transparent',
                color: activeTab === 'eligible' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CheckCircle2 size={14} /> ≥ 75% Attendance ({eligibleCount})
            </button>
            <button
              onClick={() => setActiveTab('defaulters')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeTab === 'defaulters' ? 'var(--danger)' : 'transparent',
                color: activeTab === 'defaulters' ? '#fff' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <AlertTriangle size={14} /> &lt; 75% Shortage ({defaulterCount})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '400px' }}>
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
        </div>

        {/* Tab Context Banner */}
        {activeTab === 'defaulters' && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} color="var(--danger)" />
            <div style={{ fontSize: '13px', color: 'var(--danger)', fontWeight: 600 }}>
              Showing {filteredList.length} defaulter student(s) whose overall attendance is below 75%. Click on any student to view their exact subject-wise deficit.
            </div>
          </div>
        )}

        {activeTab === 'eligible' && (
          <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={20} color="var(--success)" />
            <div style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>
              Showing {filteredList.length} student(s) with attendance ≥ 75% meeting academic eligibility criteria.
            </div>
          </div>
        )}
      </div>

      {/* Student Overall Attendance List / Cards ("WHO ARE THEY?") */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Student Attendance Roster ({filteredList.length} Students)
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
            Click student card to expand subject-wise breakdown
          </span>
        </div>

        {filteredList.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
            <h4>No students found matching current filter/search.</h4>
          </div>
        ) : (
          filteredList.map(student => {
            const isExpanded = expandedStudentId === student.id;
            const { overallPercentage, isEligible, attendedClasses, totalClasses, subjectBreakdown } = student.stats;

            return (
              <div
                key={student.id}
                className="glass-card glass-card-interactive"
                style={{
                  padding: '18px 22px',
                  borderLeft: isEligible ? '5px solid var(--success)' : '5px solid var(--danger)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                {/* Main Card Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  {/* Left: Student Identity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1', minWidth: '240px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={student.photo}
                        alt={student.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isEligible ? '2px solid var(--success)' : '2px solid var(--danger)'
                        }}
                      />
                      <span className="badge badge-info" style={{ position: 'absolute', bottom: '-4px', right: '-8px', fontSize: '10px', padding: '1px 5px' }}>
                        {student.rollNo}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                        {student.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {student.email} • 9th Standard
                      </div>
                    </div>
                  </div>

                  {/* Middle: Progress Bar & Percentage */}
                  <div style={{ flex: '1.2', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Overall Attendance:</span>
                      <strong style={{ fontSize: '15px', color: isEligible ? 'var(--success)' : 'var(--danger)' }}>
                        {overallPercentage}% ({attendedClasses}/{totalClasses} Classes)
                      </strong>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${overallPercentage}%`,
                          height: '100%',
                          background: isEligible
                            ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                          borderRadius: '5px',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Right: Status Tag & Expand Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge ${isEligible ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 12px', fontSize: '12px' }}>
                      {isEligible ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                      {isEligible ? 'ELIGIBLE (≥75%)' : 'SHORTAGE ALERT (<75%)'}
                    </span>

                    <button
                      onClick={() => toggleExpand(student.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '4px' }}
                    >
                      {isExpanded ? 'Hide Subjects' : 'Subject Details'}
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <button
                      onClick={() => setSelectedStudentForProfile(student)}
                      className="btn btn-outline btn-sm"
                    >
                      Profile
                    </button>
                  </div>
                </div>

                {/* Accordion: Expandable Subject-wise breakdown */}
                {isExpanded && (
                  <div style={{
                    marginTop: '10px',
                    paddingTop: '16px',
                    borderTop: '1px dashed var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={15} /> Subject-Wise Attendance Breakdown for {student.name}:
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px'
                    }}>
                      {subjectBreakdown.map(sub => (
                        <div
                          key={sub.subjectId}
                          style={{
                            background: 'rgba(15, 23, 42, 0.5)',
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>{sub.icon}</span> {sub.subjectName}
                            </span>
                            <span style={{
                              fontWeight: 800,
                              fontSize: '13px',
                              color: sub.isEligible ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {sub.percentage}%
                            </span>
                          </div>

                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${sub.percentage}%`,
                                height: '100%',
                                background: sub.isEligible ? 'var(--success)' : 'var(--danger)',
                                borderRadius: '3px'
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-subtle)' }}>
                            <span>Attended: {sub.attendedClasses}/{sub.totalClasses}</span>
                            <span>Teacher: {sub.teacher.split(' ')[1] || sub.teacher}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FinalTrackLedger;
