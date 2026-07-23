import React from 'react';
import { useAuth } from '../../modules/auth/AuthSessionContext';
import { Gauge, LogOut, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

const HeaderNavigation = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-2xl">
            {/* Brand Logo & Title */}
            <div className="flex items-center space-x-3.5">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                    <div className="relative p-2.5 bg-slate-900 rounded-xl border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                        <Gauge className="w-6 h-6 transform -rotate-45" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <h1 className="font-extrabold text-xl tracking-tight text-white font-sans">
                            AUTO<span className="text-cyan-400">PULSE</span>
                        </h1>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Fleet OS
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Smart Inventory & Dealership Operations</p>
                </div>
            </div>

            {/* User Info & Actions */}
            {user && (
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                        <div className="flex items-center space-x-2">
                            {user.role === 'admin' ? (
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <UserCheck className="w-4 h-4 text-cyan-400" />
                            )}
                            <span className="text-sm font-semibold text-slate-200">{user.name || user.email}</span>
                        </div>
                        <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-md uppercase font-extrabold tracking-wider ${user.role === 'admin'
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                                }`}
                        >
                            {user.role}
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center space-x-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 px-3.5 py-2 rounded-xl border border-rose-500/20 transition-all text-xs font-semibold hover:shadow-lg hover:shadow-rose-500/10"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </nav>
    );
};

export default HeaderNavigation;
