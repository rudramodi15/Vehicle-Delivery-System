import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthSessionContext';
import { Gauge, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const UserSignInView = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to authenticate. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080C14] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-[#0F172A]/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3.5 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-2xl text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
                        <Gauge className="w-8 h-8 transform -rotate-45" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">AutoPulse</h2>
                    <p className="text-slate-400 text-sm mt-1 font-medium">Sign in to access your fleet operations portal</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-sm flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@autopulse.io"
                                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
                    >
                        <span>{loading ? 'Authenticating...' : 'Access Portal'}</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                {/* Register Link */}
                <div className="text-center text-sm text-slate-400 mt-6 pt-6 border-t border-slate-800/80">
                    Need a new dealership account?{' '}
                    <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 hover:underline">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserSignInView;
