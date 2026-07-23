import React from 'react';
import { useAuth } from '../../modules/auth/AuthSessionContext';
import { ShoppingBag, PlusCircle, Trash2, Tag, CarFront, Zap, Shield, Sparkles } from 'lucide-react';

const FleetVehicleTile = ({ vehicle, onPurchase, onRestock, onDelete }) => {
    const { isAdmin } = useAuth();
    const isOutOfStock = vehicle.quantity <= 0;

    return (
        <div className="bg-[#0F172A]/80 border border-slate-800/80 hover:border-cyan-500/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-cyan-500/5 relative overflow-hidden group">
            {/* Background Ambient Glow on Hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-all duration-500"></div>

            {/* Category Tag & Stock Status */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-sm">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>{vehicle.category}</span>
                </span>

                <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase ${isOutOfStock
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : vehicle.quantity < 3
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        }`}
                >
                    {isOutOfStock ? 'Sold Out' : `${vehicle.quantity} Units Available`}
                </span>
            </div>

            {/* Vehicle Card Body */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5">
                    <CarFront className="w-4 h-4 text-cyan-400" />
                    <span>{vehicle.make}</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                    {vehicle.model}
                </h3>

                <div className="mt-5 p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">MSRP Tag</span>
                    <span className="text-2xl font-black text-white tracking-tight">
                        ${vehicle.price?.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80 relative z-10">
                {/* Customer Purchase CTA */}
                <button
                    onClick={() => onPurchase(vehicle._id)}
                    disabled={isOutOfStock}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${isOutOfStock
                            ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
                        }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Currently Unavailable' : 'Order / Acquire Vehicle'}</span>
                </button>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                            onClick={() => onRestock(vehicle._id)}
                            className="py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/20 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                        >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>Restock</span>
                        </button>

                        <button
                            onClick={() => onDelete(vehicle._id)}
                            className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/20 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FleetVehicleTile;
