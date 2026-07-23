import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthSessionContext';

const AuthRouteGuard = ({ children }) => {
    const { token, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080C14] text-white flex items-center justify-center">
                <p className="text-cyan-400 font-semibold animate-pulse">Initializing AutoPulse Session...</p>
            </div>
        );
    }
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthRouteGuard;
