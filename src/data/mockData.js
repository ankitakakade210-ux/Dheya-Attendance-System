export const initialStandards = [
  {
    id: 'std-9th',
    name: '9th Standard (Grade 9)',
    code: 'STD-09',
    academicYear: '2026-2027',
    capacity: 40,
    classTeacher: 'Prof. Sarah Jenkins',
    description: 'Secondary Education - 9th Standard Division A & B'
  }
];

export const initialSubjects = [
  {
    id: 'sub-math9',
    code: 'MATH-901',
    name: 'Mathematics',
    standardId: 'std-9th',
    credits: 4,
    minAttendance: 75,
    teacher: 'Prof. Sarah Jenkins',
    icon: '📐'
  },
  {
    id: 'sub-sci9',
    code: 'SCI-901',
    name: 'General Science',
    standardId: 'std-9th',
    credits: 4,
    minAttendance: 75,
    teacher: 'Dr. Robert Chen',
    icon: '🧪'
  },
  {
    id: 'sub-eng9',
    code: 'ENG-901',
    name: 'English Literature',
    standardId: 'std-9th',
    credits: 3,
    minAttendance: 75,
    teacher: 'Michael Scott',
    icon: '📚'
  },
  {
    id: 'sub-soc9',
    code: 'SOC-901',
    name: 'Social Science',
    standardId: 'std-9th',
    credits: 3,
    minAttendance: 75,
    teacher: 'Amanda Vance',
    icon: '🌍'
  },
  {
    id: 'sub-cs9',
    code: 'CS-901',
    name: 'Computer Science',
    standardId: 'std-9th',
    credits: 3,
    minAttendance: 75,
    teacher: 'Alan Turing',
    icon: '💻'
  }
];

export const initialTeachers = [
  {
    id: 'tch-1',
    name: 'Prof. Sarah Jenkins',
    email: 'sarah.jenkins@school.edu',
    department: 'Mathematics',
    phone: '+1 555-0144',
    subjects: ['MATH-901']
  },
  {
    id: 'tch-2',
    name: 'Dr. Robert Chen',
    email: 'robert.chen@school.edu',
    department: 'Science',
    phone: '+1 555-0192',
    subjects: ['SCI-901']
  },
  {
    id: 'tch-3',
    name: 'Michael Scott',
    email: 'michael.scott@school.edu',
    department: 'English',
    phone: '+1 555-0177',
    subjects: ['ENG-901']
  },
  {
    id: 'tch-4',
    name: 'Amanda Vance',
    email: 'amanda.vance@school.edu',
    department: 'Social Science',
    phone: '+1 555-0188',
    subjects: ['SOC-901']
  },
  {
    id: 'tch-5',
    name: 'Alan Turing',
    email: 'alan.turing@school.edu',
    department: 'Computer Science',
    phone: '+1 555-0133',
    subjects: ['CS-901']
  }
];

export const initialTeacherAvailability = [
  {
    id: 'avail-1',
    teacherId: 'tch-1',
    teacherName: 'Prof. Sarah Jenkins',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    preferredMode: 'Offline',
    location: 'Classroom 9-A'
  },
  {
    id: 'avail-2',
    teacherId: 'tch-2',
    teacherName: 'Dr. Robert Chen',
    dayOfWeek: 'Tuesday',
    startTime: '10:45',
    endTime: '12:15',
    preferredMode: 'Offline',
    location: 'Science Lab 1'
  }
];

export const initialStudents = [
  { id: 'stu-901', rollNo: '9A-01', name: 'Aarav Sharma', email: 'aarav.sharma@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'stu-902', rollNo: '9A-02', name: 'Ananya Patel', email: 'ananya.patel@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'stu-903', rollNo: '9A-03', name: 'Rohan Verma', email: 'rohan.verma@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'stu-904', rollNo: '9A-04', name: 'Priya Nair', email: 'priya.nair@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'stu-905', rollNo: '9A-05', name: 'Kabir Roy', email: 'kabir.roy@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'stu-906', rollNo: '9A-06', name: 'Sneha Gupta', email: 'sneha.gupta@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'stu-907', rollNo: '9A-07', name: 'Devansh Joshi', email: 'devansh.j@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'stu-908', rollNo: '9A-08', name: 'Ishita Singh', email: 'ishita.singh@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { id: 'stu-909', rollNo: '9A-09', name: 'Aditya Kumar', email: 'aditya.k@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { id: 'stu-910', rollNo: '9A-10', name: 'Riya Sen', email: 'riya.sen@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 'stu-911', rollNo: '9A-11', name: 'Siddharth Malhotra', email: 'sid.m@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 'stu-912', rollNo: '9A-12', name: 'Diya Reddy', email: 'diya.reddy@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  { id: 'stu-913', rollNo: '9A-13', name: 'Varun Mehta', email: 'varun.m@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 'stu-914', rollNo: '9A-14', name: 'Kavya Iyer', email: 'kavya.i@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 'stu-915', rollNo: '9A-15', name: 'Yash Singhania', email: 'yash.s@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
  { id: 'stu-916', rollNo: '9A-16', name: 'Meera Kapoor', email: 'meera.k@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
  { id: 'stu-917', rollNo: '9A-17', name: 'Arjun Saxena', email: 'arjun.s@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
  { id: 'stu-918', rollNo: '9A-18', name: 'Tanvi Rao', email: 'tanvi.r@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
  { id: 'stu-919', rollNo: '9A-19', name: 'Rahul Deshmukh', email: 'rahul.d@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { id: 'stu-920', rollNo: '9A-20', name: 'Pooja Trivedi', email: 'pooja.t@student.edu', standardId: 'std-9th', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
];

export const initialSessions = [
  {
    id: 'ses-901',
    title: 'Linear Equations in Two Variables',
    standardId: 'std-9th',
    subjectId: 'sub-math9',
    teacherId: 'tch-1',
    teacherName: 'Prof. Sarah Jenkins',
    mode: 'Offline',
    date: '2026-09-01',
    startTime: '09:00',
    endTime: '10:00',
    venue: 'Classroom 9-A',
    status: 'Completed'
  },
  {
    id: 'ses-902',
    title: 'Structure of the Atom',
    standardId: 'std-9th',
    subjectId: 'sub-sci9',
    teacherId: 'tch-2',
    teacherName: 'Dr. Robert Chen',
    mode: 'Offline',
    date: '2026-09-01',
    startTime: '10:15',
    endTime: '11:15',
    venue: 'Science Lab 1',
    status: 'Completed'
  },
  {
    id: 'ses-903',
    title: 'The Road Not Taken - Poem Analysis',
    standardId: 'std-9th',
    subjectId: 'sub-eng9',
    teacherId: 'tch-3',
    teacherName: 'Michael Scott',
    mode: 'Offline',
    date: '2026-09-01',
    startTime: '11:30',
    endTime: '12:30',
    venue: 'Classroom 9-A',
    status: 'Completed'
  },
  {
    id: 'ses-904',
    title: 'French Revolution & Modern Society',
    standardId: 'std-9th',
    subjectId: 'sub-soc9',
    teacherId: 'tch-4',
    teacherName: 'Amanda Vance',
    mode: 'Offline',
    date: '2026-09-02',
    startTime: '09:00',
    endTime: '10:00',
    venue: 'Classroom 9-A',
    status: 'Completed'
  },
  {
    id: 'ses-905',
    title: 'Introduction to Python Logic',
    standardId: 'std-9th',
    subjectId: 'sub-cs9',
    teacherId: 'tch-5',
    teacherName: 'Alan Turing',
    mode: 'Offline',
    date: '2026-09-02',
    startTime: '10:15',
    endTime: '11:15',
    venue: 'Computer Lab 2',
    status: 'Completed'
  }
];

// Helper to pre-seed comprehensive subject attendance history for 20 9th std students across 10 classes per subject
// This gives realistic percentages: some >= 75% (Eligible), some < 75% (Shortage defaulters).
const buildInitialAttendance = () => {
  const records = [];
  const studentProfiles = [
    { id: 'stu-901', targetPct: 0.95 }, // Aarav - 95%
    { id: 'stu-902', targetPct: 0.88 }, // Ananya - 88%
    { id: 'stu-903', targetPct: 0.62 }, // Rohan - 62% (DEF)
    { id: 'stu-904', targetPct: 0.96 }, // Priya - 96%
    { id: 'stu-905', targetPct: 0.55 }, // Kabir - 55% (DEF)
    { id: 'stu-906', targetPct: 0.82 }, // Sneha - 82%
    { id: 'stu-907', targetPct: 0.78 }, // Devansh - 78%
    { id: 'stu-908', targetPct: 0.58 }, // Ishita - 58% (DEF)
    { id: 'stu-909', targetPct: 0.92 }, // Aditya - 92%
    { id: 'stu-910', targetPct: 0.68 }, // Riya - 68% (DEF)
    { id: 'stu-911', targetPct: 0.86 }, // Siddharth - 86%
    { id: 'stu-912', targetPct: 0.90 }, // Diya - 90%
    { id: 'stu-913', targetPct: 0.50 }, // Varun - 50% (DEF)
    { id: 'stu-914', targetPct: 0.84 }, // Kavya - 84%
    { id: 'stu-915', targetPct: 0.76 }, // Yash - 76%
    { id: 'stu-916', targetPct: 0.94 }, // Meera - 94%
    { id: 'stu-917', targetPct: 0.65 }, // Arjun - 65% (DEF)
    { id: 'stu-918', targetPct: 0.80 }, // Tanvi - 80%
    { id: 'stu-919', targetPct: 0.89 }, // Rahul - 89%
    { id: 'stu-920', targetPct: 0.71 }  // Pooja - 71% (DEF)
  ];

  const subjectsList = ['sub-math9', 'sub-sci9', 'sub-eng9', 'sub-soc9', 'sub-cs9'];
  const dates = ['2026-08-15', '2026-08-18', '2026-08-20', '2026-08-22', '2026-08-25', '2026-08-28', '2026-08-30', '2026-09-01', '2026-09-02'];

  let recId = 1;
  subjectsList.forEach((subId, subIdx) => {
    dates.forEach((dateStr, dIdx) => {
      const sessionId = `ses-hist-${subId}-${dIdx}`;
      studentProfiles.forEach((sp, sIdx) => {
        // deterministic attendance pattern based on targetPct
        const val = ((sIdx * 7 + dIdx * 13 + subIdx * 3) % 100) / 100;
        const isPresent = val < sp.targetPct;
        records.push({
          id: `rec-hist-${recId++}`,
          sessionId,
          studentId: sp.id,
          subjectId: subId,
          status: isPresent ? 'Present' : 'Absent',
          mode: 'Roll Call Register',
          timestamp: `${dateStr}T09:15:00`,
          notes: isPresent ? 'Attended' : 'Absence recorded'
        });
      });
    });
  });

  return records;
};

export const initialAttendanceRecords = buildInitialAttendance();
