import React from 'react';
import { Dashboard } from './Dashboard';

export function AuthenticatedApp() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Dashboard />
    </div>
  );
}