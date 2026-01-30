import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function ClientsPage() {
    const { clients } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedClient, setSelectedClient] = useState(null);

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm);
        const matchesFilter = filter === 'all' ||
            (filter === 'subscribers' && client.planId) ||
            (filter === 'regular' && !client.planId);
        return matchesSearch && matchesFilter;
    });

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
                    </select>
                    <button className="btn-outline py-2 px-4">
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
                                        <th>Atendimentos</th>
                                        <th>Créditos</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className={`cursor-pointer ${selectedClient?.id === client.id ? 'bg-primary/10' : ''}`}
                                            onClick={() => setSelectedClient(client)}
                                        >
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center text-black font-bold">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{client.name}</p>
                                                        <p className="text-xs text-secondary">{client.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{client.phone}</td>
                                            <td>
                                                {client.planName ? (
                                                    <span className="badge badge-primary">{client.planName}</span>
                                                ) : (
                                                    <span className="text-secondary">-</span>
                                                )}
                                            </td>
                                            <td className="font-semibold">{client.totalAppointments}</td>
                                            <td>
                                                {client.referralCredits > 0 ? (
                                                    <span className="text-primary font-semibold">{client.referralCredits}</span>
                                                ) : (
                                                    <span className="text-secondary">0</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 rounded hover:bg-primary/20 text-primary">
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button className="p-2 rounded hover:bg-green-500/20 text-green-500">
                                                        <i className="fab fa-whatsapp"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
                                    {selectedClient.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                                <p className="text-secondary text-sm">{selectedClient.email}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-secondary">Telefone</span>
                                    <span className="font-semibold">{selectedClient.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Nascimento</span>
                                    <span className="font-semibold">{selectedClient.birthdate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Cliente desde</span>
                                    <span className="font-semibold">{selectedClient.createdAt}</span>
                                </div>
                                <div className="divider"></div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Plano</span>
                                    <span className="font-semibold text-primary">{selectedClient.planName || 'Nenhum'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Total de Atendimentos</span>
                                    <span className="font-semibold">{selectedClient.totalAppointments}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Código de Indicação</span>
                                    <span className="font-semibold text-primary">{selectedClient.referralCode}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-secondary">Créditos de Indicação</span>
                                    <span className="font-semibold">{selectedClient.referralCredits}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <button className="btn-primary w-full">
                                    <i className="fas fa-calendar-plus mr-2"></i>
                                    Novo Agendamento
                                </button>
                                <button className="btn-outline w-full">
                                    <i className="fab fa-whatsapp mr-2"></i>
                                    Enviar Mensagem
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
        </div>
    );
}

export default ClientsPage;
