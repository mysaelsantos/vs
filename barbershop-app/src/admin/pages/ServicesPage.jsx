import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function ServicesPage() {
    const { services, addService, updateService, deleteService } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        promoPrice: '',
        duration: '',
        icon: 'fa-scissors',
        active: true,
    });

    const icons = [
        'fa-scissors', 'fa-face-grin-beam', 'fa-wand-magic-sparkles',
        'fa-eye', 'fa-paintbrush', 'fa-wind', 'fa-spray-can', 'fa-crown'
    ];

    const handleEdit = (service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            price: service.price.toString(),
            promoPrice: service.promoPrice?.toString() || '',
            duration: service.duration,
            icon: service.icon,
            active: service.active,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const serviceData = {
            ...formData,
            price: parseFloat(formData.price),
            promoPrice: formData.promoPrice ? parseFloat(formData.promoPrice) : null,
        };

        if (editingService) {
            updateService(editingService.id, serviceData);
        } else {
            addService(serviceData);
        }

        setShowForm(false);
        setEditingService(null);
        setFormData({ name: '', price: '', promoPrice: '', duration: '', icon: 'fa-scissors', active: true });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingService(null);
        setFormData({ name: '', price: '', promoPrice: '', duration: '', icon: 'fa-scissors', active: true });
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <p className="text-secondary">{services.length} serviços cadastrados</p>
                <button className="btn-primary py-2 px-4" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Novo Serviço
                </button>
            </div>

            {/* Modal de confirmação de exclusão */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="admin-card p-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                        <h3 className="text-lg font-bold mb-2">Confirmar Exclusão</h3>
                        <p className="text-secondary mb-6">
                            Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-3">
                            <button className="btn-secondary flex-1" onClick={() => setShowDeleteConfirm(null)}>
                                Cancelar
                            </button>
                            <button
                                className="btn-primary flex-1 bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                    deleteService(showDeleteConfirm);
                                    setShowDeleteConfirm(null);
                                }}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="admin-card p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Nome</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-secondary mb-1 block">Preço (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-secondary mb-1 block">Preço Promo</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-input"
                                        placeholder="Opcional"
                                        value={formData.promoPrice}
                                        onChange={(e) => setFormData(prev => ({ ...prev, promoPrice: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Duração</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: 45 min"
                                    value={formData.duration}
                                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-1 block">Ícone</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${formData.icon === icon ? 'bg-primary text-black' : 'bg-bg-alt'
                                                }`}
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                        >
                                            <i className={`fas ${icon}`}></i>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className={`toggle-switch ${formData.active ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                                ></div>
                                <span className="text-sm">Serviço Ativo</span>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn-secondary flex-1" onClick={handleCancel}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingService ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(service => (
                    <div key={service.id} className={`admin-card p-4 ${!service.active ? 'opacity-50' : ''}`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <i className={`fas ${service.icon} text-xl text-primary`}></i>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    className="p-2 rounded hover:bg-primary/20 text-primary"
                                    onClick={() => handleEdit(service)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                    onClick={() => setShowDeleteConfirm(service.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                        <p className="text-secondary text-sm mb-3">
                            <i className="fas fa-clock mr-1"></i>
                            {service.duration}
                        </p>

                        <div className="flex items-center justify-between">
                            <div>
                                {service.promoPrice ? (
                                    <>
                                        <span className="text-gray-500 line-through text-sm mr-2">
                                            R$ {service.price.toFixed(2)}
                                        </span>
                                        <span className="text-primary font-bold text-lg">
                                            R$ {service.promoPrice.toFixed(2)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-primary font-bold text-lg">
                                        R$ {service.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <span className={`badge ${service.active ? 'badge-success' : 'badge-gray'}`}>
                                {service.active ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServicesPage;
