import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, CarFront, Tag, DollarSign } from 'lucide-react';

const InventoryQueryBar = ({ onSearch, onReset }) => {
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch({ make, model, category, minPrice, maxPrice });
    };

    const handleResetFilters = () => {
        setMake('');
        setModel('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        onReset();
    };

    return (
        <form onSubmit={handleSearchSubmit} className="bg-[#0F172A]/90 border border-slate-800/90 rounded-3xl p-6 mb-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm tracking-wide">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>FLEET INVENTORY FILTERS</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Real-time parameters</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Make Filter */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <CarFront className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Make (Brand)</span>
                    </label>
                    <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder="e.g. Tesla, Porsche"
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                    />
                </div>

                {/* Model Filter */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <CarFront className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Model Name</span>
                    </label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="e.g. Taycan, Model S"
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                    />
                </div>

                {/* Category Dropdown */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Category</span>
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                    >
                        <option value="">All Categories</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Electric">Electric</option>
                        <option value="Sports">Sports</option>
                    </select>
                </div>

                {/* Min Price */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Min Price ($)</span>
                    </label>
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                    />
                </div>

                {/* Max Price */}
                <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Max Price ($)</span>
                    </label>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="250000"
                        className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all font-medium"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-5 border-t border-slate-800/80">
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-2xl text-xs font-semibold flex items-center space-x-2 transition-all border border-slate-800"
                >
                    <RotateCcw className="w-4 h-4 text-slate-400" />
                    <span>Reset Filters</span>
                </button>

                <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-2xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
                >
                    <Search className="w-4 h-4" />
                    <span>Apply Search</span>
                </button>
            </div>
        </form>
    );
};

export default InventoryQueryBar;
