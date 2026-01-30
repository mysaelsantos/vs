import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function ClientsPage() {
    const { clients, updateClient, addClientCashback, exportClients, setCurrentPage, plans } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedClient, setSelectedClient] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [cashbackModalOpen, setCashbackModalOpen] = useState(false);
    const [cashbackAmount, setCashbackAmount] = useState('');
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({});

    const filteredClients = clients.filter(client => {
        const matchesSearch = (client.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.phone || '').includes(searchTerm);
        const matchesFilter = filter === 'all' ||
            (filter === 'subscribers' && client.planId) ||
            (filter === 'regular' && !client.planId) ||
            (filter === 'withCashback' && (client.cashback || 0) > 0);
        return matchesSearch && matchesFilter;
    });

    const openWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const whatsappUrl = `https://wa.me/55${cleanPhone}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleExport = () => {
        exportClients();
    };

    const handleEditClick = (client) => {
        setEditForm({
            name: client.name || '',
            email: client.email || '',
            phone: client.phone || '',
            birthdate: client.birthdate || '',
            planId: client.planId || '',
            referralCredits: client.referralCredits || 0
        });
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedClient) return;
        setSaving(true);

        const planData = plans.find(p => p.id === editForm.planId);
        const updatedData = {
            ...editForm,
            planName: planData?.title || null
        };

        await updateClient(selectedClient.id, updatedData);
        setSelectedClient(prev => ({ ...prev, ...updatedData }));
        setSaving(false);
        setEditModalOpen(false);
    };

    const handleOpenCashbackModal = (client) => {
        setSelectedClient(client);
        setCashbackAmount('');
        setCashbackModalOpen(true);
    };

    const handleAddCashback = async () => {
        if (!selectedClient || !cashbackAmount) return;
        setSaving(true);
        await addClientCashback(selectedClient.id, parseFloat(cashbackAmount));
        setSelectedClient(prev => ({
            ...prev,
            cashback: (prev.cashback || 0) + parseFloat(cashbackAmount)
        }));
        setSaving(false);
        setCashbackModalOpen(false);
    };

    const handleNewAppointment = () => {
        // Navegar para página de agendamentos
        setCurrentPage('appointments');
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 bg-bg-card rounded-lg px-4 py-2">
                    <i className="fas fa-search text-secondary"></i>
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone..."
                        className="bg-transparent border-none outline-none w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        className="form-select text-sm py-2"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Todos</option>
                        <option value="subscribers">Assinantes</option>
                        <option value="regular">Regulares</option>
                        <option value="withCashback">Com Cashback</option>
                    </select>
                    <button className="btn-outline py-2 px-4" onClick={handleExport}>
                        <i className="fas fa-download mr-2"></i>
                        Exportar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lista de Clientes */}
                <div className="lg:col-span-2">
                    <div className="admin-card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Telefone</th>
                                        <th>Plano</th>
                                        <th>Cashback</th>
                                        <th>Créditos</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center text-secondary py-8">
                                                <i className="fas fa-users text-4xl mb-4 opacity-30 block"></i>
                                                <p>Nenhum cliente encontrado</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredClients.map((client) => (
                                            <tr
                                                key={client.id}
                                                className={`cursor-pointer ${selectedClient?.id === client.id ? 'bg-primary/10' : ''}`}
                                                onClick={() => setSelectedClient(client)}
                                            >
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center text-black font-bold">
                                                            {(client.name || 'U').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{client.name || 'Sem nome'}</p>
                                                            <p className="text-xs text-secondary">{client.email || '-'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{client.phone || '-'}</td>
                                                <td>
                                                    {client.planName ? (
                                                        <span className="badge badge-primary">{client.planName}</span>
                                                    ) : (
                                                        <span className="text-secondary">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {(client.cashback || 0) > 0 ? (
                                                        <span className="text-green-500 font-semibold">
                                                            R$ {(client.cashback || 0).toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-secondary">R$ 0,00</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {(client.referralCredits || 0) > 0 ? (
                                                        <span className="text-primary font-semibold">{client.referralCredits}</span>
                                                    ) : (
                                                        <span className="text-secondary">0</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            className="p-2 rounded hover:bg-primary/20 text-primary"
                                                            onClick={() => handleEditClick(client)}
                                                            title="Editar"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="p-2 rounded hover:bg-green-500/20 text-green-500"
                                                            onClick={() => openWhatsApp(client.phone)}
                                                            title="WhatsApp"
                                                        >
                                                            <i className="fab fa-whatsapp"></i>
                                                        </button>
                                                        <button
                                                            className="p-2 rounded hover:bg-yellow-500/20 text-yellow-500"
                                                            onClick={() => handleOpenCashbackModal(client)}
                                                            title="Adicionar Cashback"
                                                        >
                                                            <i className="fas fa-coins"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detalhes do Cliente */}
                <div className="lg:col-span-1">
                    {selectedClient ? (
                        <div className="admin-card p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center text-black text-2xl font-bold mx-auto mb-3">
                                    {(selectedClient.name || 'U').charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold">{selectedClient.name || 'Sem nome'}</h3>
                                <p className="text-secondary text-sm">{selectedClient.email || '-'}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-secondary">Telefone</span>
                                    <span className="font-semibold">{selectedClient.phone || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Nascimento</span>
                                    <span className="font-semibold">{selectedClient.birthdate || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Cliente desde</span>
                                    <span className="font-semibold">
                                        {selectedClient.createdAt?.toDate?.()?.toLocaleDateString('pt-BR') || '-'}
                                    </span>
                                </div>
                                <div className="divider"></div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Plano</span>
                                    <span className="font-semibold text-primary">{selectedClient.planName || 'Nenhum'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Cashback</span>
                                    <span className="font-semibold text-green-500">
                                        R$ {(selectedClient.cashback || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Total de Atendimentos</span>
                                    <span className="font-semibold">{selectedClient.totalAppointments || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Código de Indicação</span>
                                    <span className="font-semibold text-primary">{selectedClient.referralCode || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Créditos de Indicação</span>
                                    <span className="font-semibold">{selectedClient.referralCredits || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Cancelamentos</span>
                                    <span className={`font-semibold ${(selectedClient.cancellations || 0) > 2 ? 'text-red-500' : ''}`}>
                                        {selectedClient.cancellations || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Não compareceu</span>
                                    <span className={`font-semibold ${(selectedClient.noShows || 0) > 0 ? 'text-red-500' : ''}`}>
                                        {selectedClient.noShows || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <button className="btn-primary w-full" onClick={handleNewAppointment}>
                                    <i className="fas fa-calendar-plus mr-2"></i>
                                    Novo Agendamento
                                </button>
                                <button
                                    className="btn-outline w-full"
                                    onClick={() => openWhatsApp(selectedClient.phone)}
                                >
                                    <i className="fab fa-whatsapp mr-2"></i>
                                    Enviar Mensagem
                                </button>
                                <button
                                    className="btn-secondary w-full"
                                    onClick={() => handleEditClick(selectedClient)}
                                >
                                    <i className="fas fa-edit mr-2"></i>
                                    Editar Cliente
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="admin-card p-6 text-center text-secondary">
                            <i className="fas fa-user text-4xl mb-4 opacity-30"></i>
                            <p>Selecione um cliente para ver detalhes</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Edição */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="admin-card p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Editar Cliente</h3>
                            <button
                                className="text-secondary hover:text-white"
                                onClick={() => setEditModalOpen(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Nome</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Telefone</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Data de Nascimento</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="DD/MM/AAAA"
                                    value={editForm.birthdate}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, birthdate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Plano</label>
                                <select
                                    className="form-select"
                                    value={editForm.planId}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, planId: e.target.value }))}
                                >
                                    <option value="">Nenhum</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-secondary mb-1 block">Créditos de Indicação</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    value={editForm.referralCredits}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, referralCredits: parseInt(e.target.value) || 0 }))}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                className="btn-secondary flex-1"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={handleSaveEdit}
                                disabled={saving}
                            >
                                {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cashback */}
            {cashbackModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="admin-card p-6 w-full max-w-sm mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Adicionar Cashback</h3>
                            <button
                                className="text-secondary hover:text-white"
                                onClick={() => setCashbackModalOpen(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <p className="text-secondary mb-4">
                            Adicionar cashback para <strong className="text-white">{selectedClient?.name}</strong>
                        </p>

                        <p className="text-sm text-secondary mb-2">
                            Cashback atual: <span className="text-green-500 font-semibold">
                                R$ {(selectedClient?.cashback || 0).toFixed(2)}
                            </span>
                        </p>

                        <div className="mb-6">
                            <label className="text-sm text-secondary mb-1 block">Valor (R$)</label>
                            <input
                                type="number"
                                className="form-input"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={cashbackAmount}
                                onChange={(e) => setCashbackAmount(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="btn-secondary flex-1"
                                onClick={() => setCashbackModalOpen(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-primary flex-1"
                                onClick={handleAddCashback}
                                disabled={saving || !cashbackAmount}
                            >
                                {saving ? <i className="fas fa-spinner fa-spin"></i> : 'Adicionar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClientsPage;
