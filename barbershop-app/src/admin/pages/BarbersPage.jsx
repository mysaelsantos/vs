import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function BarbersPage() {
    const { barbers, units, addBarber, updateBarber, deleteBarber } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingBarber, setEditingBarber] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: 'Barbeiro',
        image: 'https://i.pravatar.cc/150?img=10',
        unitId: '',
        active: true,
    });

    const roles = ['Barbeiro Junior', 'Barbeiro', 'Barbeiro Senior', 'Gerente'];

    const handleEdit = (barber) => {
        setEditingBarber(barber);
        setFormData({
            name: barber.name,
            role: barber.role,
            image: barber.image,
            unitId: barber.unitId.toString(),
            active: barber.active,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const unit = units.find(u => u.id === parseInt(formData.unitId));
        const barberData = {
            ...formData,
            unitId: parseInt(formData.unitId),
            unitName: unit?.name || '',
            rating: editingBarber?.rating || 5.0,
            totalServices: editingBarber?.totalServices || 0,
        };

        if (editingBarber) {
            updateBarber(editingBarber.id, barberData);
        } else {
            addBarber(barberData);
        }

        setShowForm(false);
        setEditingBarber(null);
        setFormData({ name: '', role: 'Barbeiro', image: 'https://i.pravatar.cc/150?img=10', unitId: '', active: true });
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-secondary">{barbers.length} barbeiros cadastrados</p>
                <button className="btn-primary py-2 px-4" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Novo Barbeiro
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="admin-card p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingBarber ? 'Editar Barbeiro' : 'Novo Barbeiro'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-center mb-4">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Nome Completo</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Cargo</label>
                                <select
                                    className="form-select"
                                    value={formData.role}
                                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Unidade</label>
                                <select
                                    className="form-select"
                                    value={formData.unitId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
                                    required
                                >
                                    <option value="">Selecione uma unidade</option>
                                    {units.map(unit => (
                                        <option key={unit.id} value={unit.id}>{unit.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">URL da Foto</label>
                                <input
                                    type="url"
                                    className="form-input"
                                    value={formData.image}
                                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className={`toggle-switch ${formData.active ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                                ></div>
                                <span className="text-sm">Barbeiro Ativo</span>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn-secondary flex-1" onClick={() => {
                                    setShowForm(false);
                                    setEditingBarber(null);
                                }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingBarber ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {barbers.map(barber => (
                    <div key={barber.id} className={`admin-card p-6 text-center ${!barber.active ? 'opacity-50' : ''}`}>
                        <img
                            src={barber.image}
                            alt={barber.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                        />
                        <h3 className="font-bold text-lg mb-1">{barber.name}</h3>
                        <p className="text-secondary text-sm mb-2">{barber.role}</p>

                        <div className="flex items-center justify-center gap-1 text-primary mb-3">
                            <i className="fas fa-star"></i>
                            <span className="font-bold">{barber.rating}</span>
                        </div>

                        <p className="text-xs text-secondary mb-1">
                            <i className="fas fa-location-dot mr-1"></i>
                            {barber.unitName}
                        </p>
                        <p className="text-xs text-secondary mb-4">
                            <i className="fas fa-scissors mr-1"></i>
                            {barber.totalServices} atendimentos
                        </p>

                        <div className="flex items-center justify-center gap-2">
                            <button
                                className="p-2 rounded hover:bg-primary/20 text-primary"
                                onClick={() => handleEdit(barber)}
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button
                                className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                onClick={() => deleteBarber(barber.id)}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BarbersPage;
