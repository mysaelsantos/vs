import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function PlansPage() {
    const { plans, services, addPlan, updatePlan, deletePlan } = useAdmin();
    const [showForm, setShowForm] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        period: '/mês',
        coveredServices: [],
        features: [''],
    });

    const handleEdit = (plan) => {
        setEditingPlan(plan);
        setFormData({
            title: plan.title,
            price: plan.price.toString(),
            period: plan.period,
            coveredServices: plan.coveredServices,
            features: plan.features,
        });
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const planData = {
            ...formData,
            price: parseFloat(formData.price),
            features: formData.features.filter(f => f.trim() !== ''),
        };

        if (editingPlan) {
            updatePlan(editingPlan.id, planData);
        } else {
            addPlan(planData);
        }
        setShowForm(false);
        setEditingPlan(null);
        setFormData({ title: '', price: '', period: '/mês', coveredServices: [], features: [''] });
    };

    const toggleService = (serviceId) => {
        setFormData(prev => ({
            ...prev,
            coveredServices: prev.coveredServices.includes(serviceId)
                ? prev.coveredServices.filter(id => id !== serviceId)
                : [...prev.coveredServices, serviceId]
        }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const updateFeature = (index, value) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? value : f)
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-secondary">{plans.length} planos cadastrados</p>
                    <p className="text-primary font-semibold">
                        {plans.reduce((acc, p) => acc + p.subscribers, 0)} assinantes ativos
                    </p>
                </div>
                <button className="btn-primary py-2 px-4" onClick={() => setShowForm(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Novo Plano
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="admin-card p-6 w-full max-w-lg my-8">
                        <h2 className="text-xl font-bold mb-4">
                            {editingPlan ? 'Editar Plano' : 'Novo Plano'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Nome do Plano</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: Plano Premium"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                                    <label className="text-sm text-secondary mb-1 block">Período</label>
                                    <select
                                        className="form-select"
                                        value={formData.period}
                                        onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                                    >
                                        <option value="/mês">/mês</option>
                                        <option value="/trimestre">/trimestre</option>
                                        <option value="/ano">/ano</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-2 block">Serviços Inclusos</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {services.map(service => (
                                        <button
                                            key={service.id}
                                            type="button"
                                            className={`p-2 rounded-lg text-sm flex items-center gap-2 ${formData.coveredServices.includes(service.id)
                                                    ? 'bg-primary text-black'
                                                    : 'bg-bg-alt'
                                                }`}
                                            onClick={() => toggleService(service.id)}
                                        >
                                            <i className={`fas ${service.icon}`}></i>
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-secondary mb-2 block">Benefícios</label>
                                <div className="space-y-2">
                                    {formData.features.map((feature, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                className="form-input flex-1"
                                                placeholder="Ex: 4 cortes por mês"
                                                value={feature}
                                                onChange={(e) => updateFeature(idx, e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="p-2 text-red-500"
                                                onClick={() => removeFeature(idx)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn-secondary w-full py-2 text-sm"
                                        onClick={addFeature}
                                    >
                                        <i className="fas fa-plus mr-1"></i>
                                        Adicionar Benefício
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" className="btn-secondary flex-1" onClick={() => {
                                    setShowForm(false);
                                    setEditingPlan(null);
                                }}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingPlan ? 'Salvar' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="admin-card p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center">
                                <i className="fas fa-crown text-xl text-black"></i>
                            </div>
                            <span className="badge badge-primary">{plan.subscribers} assinantes</span>
                        </div>

                        <h3 className="font-bold text-xl mb-1">{plan.title}</h3>
                        <div className="flex items-baseline mb-4">
                            <span className="text-3xl font-bold text-primary">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                            <span className="text-secondary ml-1">{plan.period}</span>
                        </div>

                        <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                    <i className="fas fa-check text-green-500"></i>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-2">
                            <button
                                className="btn-outline flex-1 py-2 text-sm"
                                onClick={() => handleEdit(plan)}
                            >
                                <i className="fas fa-edit mr-1"></i>
                                Editar
                            </button>
                            <button
                                className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                onClick={() => deletePlan(plan.id)}
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

export default PlansPage;
