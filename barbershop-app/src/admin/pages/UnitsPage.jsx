import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function UnitsPage() {
    const { units, addUnit, updateUnit } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        active: true,
    });

    const handleEdit = (unit) => {
        setEditingUnit(unit);
        setFormData({
            name: unit.name,
            address: unit.address,
            phone: unit.phone,
            active: unit.active,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUnit) {
            updateUnit(editingUnit.id, formData);
        } else {
            addUnit(formData);
        }
        setShowForm(false);
        setEditingUnit(null);
        setFormData({ name: '', address: '', phone: '', active: true });
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-secondary">{units.length} unidades cadastradas</p>
                <button className="btn-primary py-2 px-4" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Nova Unidade
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="admin-card p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingUnit ? 'Editar Unidade' : 'Nova Unidade'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Nome da Unidade</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: VS Barbearia - Centro"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Endereço</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Rua, número - Bairro"
                                    value={formData.address}
                                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Telefone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="(00) 0000-0000"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className={`toggle-switch ${formData.active ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                                ></div>
                                <span className="text-sm">Unidade Ativa</span>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn-secondary flex-1" onClick={() => {
                                    setShowForm(false);
                                    setEditingUnit(null);
                                }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingUnit ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {units.map(unit => (
                    <div key={unit.id} className={`admin-card p-6 ${!unit.active ? 'opacity-50' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                                <i className="fas fa-location-dot text-2xl text-primary"></i>
                            </div>
                            <span className={`badge ${unit.active ? 'badge-success' : 'badge-gray'}`}>
                                {unit.active ? 'Ativa' : 'Inativa'}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg mb-2">{unit.name}</h3>
                        <p className="text-secondary text-sm mb-1">
                            <i className="fas fa-map-marker-alt mr-2"></i>
                            {unit.address}
                        </p>
                        <p className="text-secondary text-sm mb-4">
                            <i className="fas fa-phone mr-2"></i>
                            {unit.phone}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                className="btn-outline flex-1 py-2 text-sm"
                                onClick={() => handleEdit(unit)}
                            >
                                <i className="fas fa-edit mr-1"></i>
                                Editar
                            </button>
                            <a
                                href={`https://maps.google.com?q=${encodeURIComponent(unit.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary py-2 px-4 text-sm"
                            >
                                <i className="fas fa-map"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UnitsPage;
