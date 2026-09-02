import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialStandards,
  initialSubjects,
  initialTeachers,
  initialStudents,
  initialAttendanceRecords
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('std9_theme') || 'dark');

  // Registered Accounts (Users created on the website)
  const [userAccounts, setUserAccounts] = useState(() => {
    const saved = localStorage.getItem('std9_user_accounts_v3');
    return saved ? JSON.parse(saved) : [];
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('std9_current_user_v3');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Navigation state
  const [currentView, setCurrentView] = useState('final-track');
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);

  // Entities state with LocalStorage backup
  const [standards, setStandards] = useState(initialStandards);

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('std9_subjects_v3');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('std9_teachers_v3');
    return saved ? JSON.parse(saved) : []; // Starts empty for self-registration as requested
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('std9_students_v3');
    return saved ? JSON.parse(saved) : []; // Starts empty for self-registration as requested
  });

  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    const saved = localStorage.getItem('std9_attendance_v3');
    return saved ? JSON.parse(saved) : []; // Starts empty
  });

  // Save auth state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('std9_current_user_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('std9_current_user_v3');
    }
  }, [currentUser]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('std9_user_accounts_v3', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    localStorage.setItem('std9_subjects_v3', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('std9_teachers_v3', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('std9_students_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('std9_attendance_v3', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('std9_theme', theme);
  }, [theme]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sign Up / Create Account Flow
  const registerAccount = ({ name, email, password, role, department, rollNo }) => {
    // Check if email already exists
    const existing = userAccounts.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('An account with this email already exists! Please sign in.', 'danger');
      return false;
    }

    const userId = `${role}-${Date.now()}`;
    let newProfile = {
      id: userId,
      name,
      email,
      password,
      role
    };

    if (role === 'student') {
      const assignedRoll = rollNo || `9A-${(students.length + 1).toString().padStart(2, '0')}`;
      const studentObj = {
        id: userId,
        rollNo: assignedRoll,
        name,
        email,
        standardId: 'std-9th',
        photo: `https://images.unsplash.com/photo-${1500000000000 + (Date.now() % 100000)}?w=150`
      };
      setStudents(prev => [...prev, studentObj]);
      newProfile = {
        ...newProfile,
        rollNo: assignedRoll,
        title: '9th Standard Student',
        photo: studentObj.photo
      };
    } else if (role === 'teacher') {
      const teacherObj = {
        id: userId,
        name,
        email,
        department: department || 'General Education',
        subjects: ['9th Std Core']
      };
      setTeachers(prev => [...prev, teacherObj]);
      newProfile = {
        ...newProfile,
        department: teacherObj.department,
        title: `Faculty (${teacherObj.department})`
      };
    } else if (role === 'admin') {
      newProfile = {
        ...newProfile,
        title: 'System Administrator'
      };
    }

    setUserAccounts(prev => [...prev, newProfile]);
    setCurrentUser(newProfile);

    if (role === 'student') setCurrentView('student-dashboard');
    else if (role === 'teacher') setCurrentView('subject-register');
    else setCurrentView('final-track');

    showToast(`Account created successfully! Welcome, ${name}.`, 'success');
    return true;
  };

  // Login
  const login = ({ email, password, role, demoUser }) => {
    if (demoUser) {
      setCurrentUser(demoUser);
      if (demoUser.role === 'student') setCurrentView('student-dashboard');
      else if (demoUser.role === 'teacher') setCurrentView('subject-register');
      else setCurrentView('final-track');
      showToast(`Signed in as ${demoUser.name} (${demoUser.role.toUpperCase()})`, 'success');
      return true;
    }

    const matchedUser = userAccounts.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!matchedUser) {
      showToast('Invalid email or password. If you don\'t have an account, click "Create Account".', 'danger');
      return false;
    }

    setCurrentUser(matchedUser);
    if (matchedUser.role === 'student') setCurrentView('student-dashboard');
    else if (matchedUser.role === 'teacher') setCurrentView('subject-register');
    else setCurrentView('final-track');

    showToast(`Signed in as ${matchedUser.name}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  // Clear all registered students & teachers data
  const clearAllData = () => {
    setStudents([]);
    setTeachers([]);
    setAttendanceRecords([]);
    setUserAccounts([]);
    localStorage.removeItem('std9_students_v3');
    localStorage.removeItem('std9_teachers_v3');
    localStorage.removeItem('std9_attendance_v3');
    localStorage.removeItem('std9_user_accounts_v3');
    showToast('All student, teacher, and attendance data cleared! Ready for new registrations.', 'info');
  };

  // Seed sample data option for quick testing if requested
  const loadSampleSeedData = () => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setAttendanceRecords(initialAttendanceRecords);
    showToast('Sample demo students and teachers loaded.', 'success');
  };

  // Dynamic Student Attendance Calculations
  const getStudentStats = (studentId) => {
    const studentRecords = attendanceRecords.filter(r => r.studentId === studentId);
    const totalClasses = studentRecords.length;
    const attendedClasses = studentRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;
    const isEligible = overallPercentage >= 75;

    const subjectBreakdown = subjects.map(sub => {
      const subRecords = studentRecords.filter(r => r.subjectId === sub.id || (r.sessionId && r.sessionId.includes(sub.id)));
      const subTotal = subRecords.length;
      const subAttended = subRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
      const subPercentage = subTotal > 0 ? Math.round((subAttended / subTotal) * 100) : 100;
      return {
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        icon: sub.icon || '📖',
        teacher: sub.teacher,
        totalClasses: subTotal,
        attendedClasses: subAttended,
        percentage: subPercentage,
        isEligible: subPercentage >= 75
      };
    });

    return {
      totalClasses,
      attendedClasses,
      overallPercentage,
      isEligible,
      subjectBreakdown
    };
  };

  // Class-wide summary stats
  const classSummaryStats = useMemo(() => {
    let eligibleCount = 0;
    let defaulterCount = 0;
    let totalPctSum = 0;

    const studentListWithStats = students.map(student => {
      const stats = getStudentStats(student.id);
      totalPctSum += stats.overallPercentage;
      if (stats.isEligible) {
        eligibleCount++;
      } else {
        defaulterCount++;
      }
      return {
        ...student,
        stats
      };
    });

    const averageAttendancePercentage = students.length > 0 
      ? Math.round(totalPctSum / students.length) 
      : 0;

    return {
      totalStudents: students.length,
      eligibleCount,
      defaulterCount,
      averageAttendancePercentage,
      studentsWithStats: studentListWithStats,
      eligibleStudents: studentListWithStats.filter(s => s.stats.isEligible),
      defaulterStudents: studentListWithStats.filter(s => !s.stats.isEligible)
    };
  }, [students, attendanceRecords, subjects]);

  // Save Subject-Wise Attendance
  const markSubjectAttendance = ({ subjectId, date, attendanceMap }) => {
    const sessionKey = `ses-${subjectId}-${date}`;

    setAttendanceRecords(prev => {
      const filtered = prev.filter(r => r.sessionId !== sessionKey);
      
      const newRecords = Object.entries(attendanceMap).map(([studentId, status]) => ({
        id: `rec-${Date.now()}-${studentId}`,
        sessionId: sessionKey,
        studentId,
        subjectId,
        status,
        mode: 'Subject Register',
        timestamp: `${date}T09:00:00`,
        notes: `Marked as ${status} for ${date}`
      }));

      return [...filtered, ...newRecords];
    });

    showToast(`Attendance updated for ${date}!`, 'success');
  };

  // Add / Delete Student
  const addStudent = (studentData) => {
    const newId = 'stu-9' + Math.floor(100 + Math.random() * 900);
    const rollNo = `9A-${(students.length + 1).toString().padStart(2, '0')}`;
    const newStudent = {
      id: newId,
      rollNo,
      standardId: 'std-9th',
      photo: `https://images.unsplash.com/photo-${1500000000000 + (Date.now() % 100000)}?w=150`,
      ...studentData
    };
    setStudents(prev => [...prev, newStudent]);
    showToast(`Student "${newStudent.name}" added to 9th Standard roster.`, 'success');
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setAttendanceRecords(prev => prev.filter(r => r.studentId !== id));
    showToast('Student removed from roster.', 'warning');
  };

  // Add / Delete Subject
  const addSubject = (subjectData) => {
    const newId = 'sub-' + Date.now();
    const newSubject = { id: newId, standardId: 'std-9th', icon: '📚', minAttendance: 75, ...subjectData };
    setSubjects(prev => [...prev, newSubject]);
    showToast(`Subject "${newSubject.name}" added to 9th Standard curriculum.`);
  };

  const deleteSubject = (id) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast('Subject removed.', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        userAccounts,
        registerAccount,
        login,
        logout,
        clearAllData,
        loadSampleSeedData,

        currentView,
        setCurrentView,
        selectedStudentForProfile,
        setSelectedStudentForProfile,
        toastMessage,
        showToast,

        standards,
        subjects,
        teachers,
        students,
        attendanceRecords,

        getStudentStats,
        classSummaryStats,
        markSubjectAttendance,

        addStudent,
        deleteStudent,
        addSubject,
        deleteSubject
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
