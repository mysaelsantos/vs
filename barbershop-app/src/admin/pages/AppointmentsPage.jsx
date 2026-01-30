import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function AppointmentsPage() {
    const { appointments, updateAppointmentStatus, barbers, services, units } = useAdmin();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAppointments = appointments.filter(apt => {
        const matchesFilter = filter === 'all' || apt.status === filter;
        const matchesSearch = apt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.barberName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        const badges = {
            confirmed: { class: 'badge-success', text: 'Confirmado' },
            pending: { class: 'badge-warning', text: 'Pendente' },
            completed: { class: 'badge-info', text: 'Concluído' },
            cancelled: { class: 'badge-danger', text: 'Cancelado' },
        };
        return badges[status] || badges.pending;
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 bg-bg-card rounded-lg px-4 py-2">
                    <i className="fas fa-search text-secondary"></i>
                    <input
                        type="text"
                        placeholder="Buscar cliente ou barbeiro..."
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
                        <option value="confirmed">Confirmados</option>
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídos</option>
                        <option value="cancelled">Cancelados</option>
                    </select>
                    <button className="btn-primary py-2 px-4">
                        <i className="fas fa-plus mr-2"></i>
                        Novo
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Serviço</th>
                                <th>Barbeiro</th>
                                <th>Data/Hora</th>
                                <th>Unidade</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((apt) => {
                                const statusBadge = getStatusBadge(apt.status);
                                return (
                                    <tr key={apt.id}>
                                        <td>
                                            <div>
                                                <p className="font-semibold">{apt.clientName}</p>
                                                <p className="text-xs text-secondary">{apt.clientPhone}</p>
                                            </div>
                                        </td>
                                        <td>{apt.serviceName}</td>
                                        <td>{apt.barberName}</td>
                                        <td>
                                            <div>
                                                <p>{apt.date}</p>
                                                <p className="text-xs text-secondary">{apt.time}</p>
                                            </div>
                                        </td>
                                        <td className="text-xs">{apt.unitName}</td>
                                        <td className="font-semibold text-primary">R$ {apt.price.toFixed(2)}</td>
                                        <td>
                                            <span className={`badge ${statusBadge.class}`}>
                                                {statusBadge.text}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {apt.status === 'pending' && (
                                                    <button
                                                        className="p-2 rounded hover:bg-green-500/20 text-green-500"
                                                        onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                                                        title="Confirmar"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                )}
                                                {apt.status === 'confirmed' && (
                                                    <button
                                                        className="p-2 rounded hover:bg-blue-500/20 text-blue-500"
                                                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                                                        title="Concluir"
                                                    >
                                                        <i className="fas fa-check-double"></i>
                                                    </button>
                                                )}
                                                {['pending', 'confirmed'].includes(apt.status) && (
                                                    <button
                                                        className="p-2 rounded hover:bg-red-500/20 text-red-500"
                                                        onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                                                        title="Cancelar"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                                <button className="p-2 rounded hover:bg-primary/20 text-primary" title="Editar">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AppointmentsPage;
