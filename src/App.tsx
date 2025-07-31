import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { BeneficiaryDashboard } from './components/beneficiary/BeneficiaryDashboard';
import { Footer } from './components/Footer';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { currentUser } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (!currentUser) {
    if (showRegister) {
      return <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
  }

  const renderDashboard = () => {
  switch (currentUser.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'data_entry_officer':
      return <OfficerDashboard />;
    case 'beneficiary':
      return <BeneficiaryDashboard />;
    default:
      return <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
  }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        {renderDashboard()}
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-purple-50">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;