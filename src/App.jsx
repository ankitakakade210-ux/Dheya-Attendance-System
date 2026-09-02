import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FinalTrackLedger from './components/FinalTrackLedger';
import SubjectRegister from './components/SubjectRegister';
import StudentsRoster from './components/StudentsRoster';
import SubjectsManager from './components/SubjectsManager';
import StudentProfileModal from './components/StudentProfileModal';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import Toast from './components/Toast';

const MainLayout = () => {
  const { currentView, currentUser } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'final-track':
      case 'dashboard':
      case 'alerts':
        return <FinalTrackLedger />;
      case 'subject-register':
      case 'strict-marking':
        return <SubjectRegister />;
      case 'students-list':
        return <StudentsRoster />;
      case 'subjects-mgr':
      case 'standards':
      case 'schedule':
        return currentUser?.role === 'admin' ? <SubjectsManager /> : <FinalTrackLedger />;
      default:
        return <FinalTrackLedger />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="content-area">
          {renderView()}
        </main>
      </div>
      <StudentProfileModal />
      <Toast />
    </div>
  );
};

const AppContent = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <>
        <Login />
        <Toast />
      </>
    );
  }

  if (currentUser.role === 'student') {
    return (
      <>
        <StudentPortal />
        <Toast />
      </>
    );
  }

  return <MainLayout />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
