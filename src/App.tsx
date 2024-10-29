import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;