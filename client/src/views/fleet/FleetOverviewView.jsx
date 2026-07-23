import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../modules/auth/AuthSessionContext';
import HeaderNavigation from '../../components/common/HeaderNavigation';
import FleetVehicleTile from '../../components/fleet/FleetVehicleTile';
import InventoryQueryBar from '../../components/fleet/InventoryQueryBar';
import VehicleRegistrationDialog from '../../components/fleet/VehicleRegistrationDialog';
import { PlusCircle, CarFront, CheckCircle2, Layers, PackageCheck, Loader2 } from 'lucide-react';

const FleetOverviewView = () => {
    const { isAdmin } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all vehicles on mount
    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/vehicles');
            setVehicles(res.data.vehicles);
        } catch (err) {
            setError('Failed to load vehicles from fleet inventory.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Search & Filter vehicles
    const handleSearch = async (filters) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.make) queryParams.append('make', filters.make);
            if (filters.model) queryParams.append('model', filters.model);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
            if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

            const res = await apiClient.get(`/vehicles/search?${queryParams.toString()}`);
            setVehicles(res.data.vehicles);
        } catch (err) {
            setError('Search failed.');
        } finally {
            setLoading(false);
        }
    };

    // Purchase vehicle (decreases quantity by 1)
    const handlePurchase = async (vehicleId) => {
        try {
            const res = await apiClient.post(`/vehicles/${vehicleId}/purchase`);
            setMessage(res.data.message || 'Vehicle purchase transaction confirmed!');
            setTimeout(() => setMessage(''), 4000);
            fetchVehicles();
        } catch (err) {
            alert(err.response?.data?.error || 'Purchase transaction failed.');
        }
    };

    // Admin Restock
    const handleRestock = async (vehicleId) => {
        const inputAmount = prompt('Enter fleet restock quantity:', '5');
        if (!inputAmount || isNaN(inputAmount) || Number(inputAmount) <= 0) return;

        const amount = Number(inputAmount);

        try {
            const res = await apiClient.post(`/vehicles/${vehicleId}/restock`, { amount });
            setMessage(res.data.message || `Fleet restocked with +${amount} units successfully!`);
            setTimeout(() => setMessage(''), 4000);
            fetchVehicles();
        } catch (err) {
            alert(err.response?.data?.error || 'Restock failed.');
        }
    };

    // Admin Delete Vehicle
    const handleDelete = async (vehicleId) => {
        if (!window.confirm('Are you sure you want to remove this vehicle from fleet records?')) return;

        try {
            await apiClient.delete(`/vehicles/${vehicleId}`);
            setMessage('Vehicle removed from catalog.');
            setTimeout(() => setMessage(''), 4000);
            fetchVehicles();
        } catch (err) {
            alert(err.response?.data?.error || 'Delete failed.');
        }
    };

    // Admin Add New Vehicle
    const handleAddVehicle = async (newVehicle) => {
        await apiClient.post('/vehicles', newVehicle);
        setMessage('New vehicle successfully added to inventory!');
        setTimeout(() => setMessage(''), 4000);
        fetchVehicles();
    };

    // Computed Stats
    const totalFleetCount = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
    const uniqueCategoriesCount = new Set(vehicles.map((v) => v.category)).size;

    return (
        <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
            <HeaderNavigation />

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                {/* Notification Toast */}
                {message && (
                    <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center space-x-3 shadow-lg shadow-emerald-500/10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                        <span className="font-bold text-sm">{message}</span>
                    </div>
                )}

                {/* Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#0F172A]/70 border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Models</p>
                            <h4 className="text-2xl font-black text-white mt-1">{vehicles.length}</h4>
                        </div>
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl">
                            <CarFront className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-[#0F172A]/70 border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Stock Units</p>
                            <h4 className="text-2xl font-black text-emerald-400 mt-1">{totalFleetCount}</h4>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
                            <PackageCheck className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-[#0F172A]/70 border border-slate-800/80 rounded-3xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fleet Categories</p>
                            <h4 className="text-2xl font-black text-purple-400 mt-1">{uniqueCategoriesCount}</h4>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
                            <Layers className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Top Header & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Fleet Inventory Catalog</h2>
                        <p className="text-slate-400 text-sm mt-1 font-medium">Explore live vehicle listings, stock status, and acquisition management</p>
                    </div>

                    {/* Admin Add Vehicle Trigger */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-3 rounded-2xl flex items-center space-x-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span className="text-sm">Register New Vehicle</span>
                        </button>
                    )}
                </div>

                {/* Filter Search Bar */}
                <InventoryQueryBar onSearch={handleSearch} onReset={fetchVehicles} />

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-24 bg-[#0F172A]/40 rounded-3xl border border-slate-800/60">
                        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-semibold text-sm">Syncing live fleet inventory...</p>
                    </div>
                ) : vehicles.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-20 bg-[#0F172A]/50 border border-slate-800/90 rounded-3xl p-8">
                        <CarFront className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">No Matching Fleet Vehicles</h3>
                        <p className="text-slate-400 text-sm mt-1.5 max-w-md mx-auto">
                            No inventory records matched your search parameters. Try clearing your filters or adding new vehicles.
                        </p>
                    </div>
                ) : (
                    /* Vehicle Grid Deck */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <FleetVehicleTile
                                key={vehicle._id}
                                vehicle={vehicle}
                                onPurchase={handlePurchase}
                                onRestock={handleRestock}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Admin Add Vehicle Modal */}
            <VehicleRegistrationDialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddVehicle={handleAddVehicle}
            />
        </div>
    );
};

export default FleetOverviewView;
