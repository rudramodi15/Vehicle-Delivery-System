import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

const VehicleRegistrationDialog = ({ isOpen, onClose, onAddVehicle }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('Sedan');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onAddVehicle({
                make,
                model,
                category,
                price: Number(price),
                quantity: Number(quantity),
            });

            // Reset form
            setMake('');
            setModel('');
            setCategory('Sedan');
            setPrice('');
            setQuantity('1');
            onClose();
        } catch (err) {
            alert('Failed to add vehicle to fleet inventory.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#080C14]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl w-full max-w-lg p-7 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3.5 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/10">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-white tracking-tight">Register New Vehicle</h2>
                        <p className="text-xs text-slate-400 font-medium">Fleet Operations Admin Control</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Make (Brand)</label>
                            <input
                                type="text"
                                required
                                value={make}
                                onChange={(e) => setMake(e.target.value)}
                                placeholder="Porsche"
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Model Name</label>
                            <input
                                type="text"
                                required
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                placeholder="911 GT3"
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category Class</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                        >
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                            <option value="Electric">Electric</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">MSRP Price ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="180000"
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Stock Units</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="3"
                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-5 border-t border-slate-800/80 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl text-xs font-semibold border border-slate-800 transition-colors"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? 'Processing...' : 'Register Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleRegistrationDialog;
