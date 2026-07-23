import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/auth/AuthSessionContext';
import AuthRouteGuard from './modules/auth/AuthRouteGuard';
import UserSignInView from './views/auth/UserSignInView';
import UserSignUpView from './views/auth/UserSignUpView';
import FleetOverviewView from './views/fleet/FleetOverviewView';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<UserSignInView />} />
          <Route path="/register" element={<UserSignUpView />} />
          <Route
            path="/"
            element={
              <AuthRouteGuard>
                <FleetOverviewView />
              </AuthRouteGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
