import React from 'react';
import { useAdmin } from '../context/AdminContext';

function DashboardPage() {
    const { metrics, appointments, clients, barbers, isAdminLoading, refreshData } = useAdmin();

    // Data de hoje para filtrar agendamentos
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(apt => apt.date === today).slice(0, 5);
    const topBarbers = [...barbers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

    // Calcular total de cashback dos clientes
    const totalCashback = clients.reduce((sum, client) => sum + (client.cashback || 0), 0);

    const statCards = [
        { icon: 'fa-calendar-check', label: 'Agendamentos Hoje', value: metrics.todayAppointments || 0, color: 'bg-blue-500' },
        { icon: 'fa-clock', label: 'Pendentes', value: metrics.pendingAppointments || 0, color: 'bg-yellow-500' },
        { icon: 'fa-users', label: 'Clientes Ativos', value: metrics.activeClients || 0, color: 'bg-green-500' },
        { icon: 'fa-crown', label: 'Assinantes', value: metrics.planSubscribers || 0, color: 'bg-purple-500' },
        { icon: 'fa-wallet', label: 'Receita Semanal', value: `R$ ${(metrics.weeklyRevenue || 0).toFixed(2)}`, color: 'bg-primary' },
        { icon: 'fa-coins', label: 'Cashback Total', value: `R$ ${totalCashback.toFixed(2)}`, color: 'bg-teal-500' },
    ];

    if (isAdminLoading) {
        return (
            <div className="admin-page flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
                    <p className="text-secondary">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Botão de Atualizar */}
            <div className="flex justify-end mb-4">
                <button
                    className="btn-secondary py-2 px-4"
                    onClick={refreshData}
                >
                    <i className="fas fa-sync-alt mr-2"></i>
                    Atualizar Dados
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="admin-card p-4">
                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                            <i className={`fas ${stat.icon} text-white`}></i>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-secondary">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agendamentos de Hoje */}
                <div className="admin-card">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="font-bold text-lg">Agendamentos de Hoje</h2>
                        <span className="badge badge-primary">{todayAppointments.length}</span>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {todayAppointments.length === 0 ? (
                            <div className="p-8 text-center text-secondary">
                                <i className="fas fa-calendar text-4xl mb-4 opacity-30"></i>
                                <p>Nenhum agendamento para hoje</p>
                            </div>
                        ) : (
                            todayAppointments.map((apt) => (
                                <div key={apt.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="font-bold text-primary">{apt.time || '--:--'}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold">{apt.clientName || 'Cliente'}</p>
                                            <p className="text-sm text-secondary">
                                                {apt.serviceName || 'Serviço'} • {apt.barberName || 'Barbeiro'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`badge ${apt.status === 'confirmed' ? 'badge-success' :
                                            apt.status === 'pending' ? 'badge-warning' :
                                                apt.status === 'completed' ? 'badge-info' :
                                                    'badge-secondary'
                                        }`}>
                                        {apt.status === 'confirmed' ? 'Confirmado' :
                                            apt.status === 'pending' ? 'Pendente' :
                                                apt.status === 'completed' ? 'Concluído' :
                                                    apt.status === 'cancelled' ? 'Cancelado' : apt.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Barbeiros */}
                <div className="admin-card">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="font-bold text-lg">Top Barbeiros</h2>
                        <i className="fas fa-trophy text-primary"></i>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {topBarbers.length === 0 ? (
                            <div className="p-8 text-center text-secondary">
                                <i className="fas fa-user-tie text-4xl mb-4 opacity-30"></i>
                                <p>Nenhum barbeiro cadastrado</p>
                            </div>
                        ) : (
                            topBarbers.map((barber, idx) => (
                                <div key={barber.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
                                            {idx + 1}
                                        </span>
                                        {barber.image ? (
                                            <img src={barber.image} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                <i className="fas fa-user text-primary"></i>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold">{barber.name || 'Barbeiro'}</p>
                                            <p className="text-sm text-secondary">{barber.totalServices || 0} atendimentos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-primary">
                                        <i className="fas fa-star"></i>
                                        <span className="font-bold">{(barber.rating || 0).toFixed(1)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Gráfico de Receita (Simulado) */}
                <div className="admin-card p-6">
                    <h2 className="font-bold text-lg mb-4">Receita Semanal</h2>
                    <div className="flex items-end justify-between h-40 gap-2">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => {
                            const height = [60, 75, 45, 80, 90, 100, 40][idx];
                            return (
                                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                    <div
                                        className="w-full bg-primary/80 rounded-t-lg transition-all hover:bg-primary"
                                        style={{ height: `${height}%` }}
                                    ></div>
                                    <span className="text-xs text-secondary">{day}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Novos Clientes */}
                <div className="admin-card">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="font-bold text-lg">Novos Clientes</h2>
                        <span className="text-green-500 text-sm">
                            <i className="fas fa-user-plus mr-1"></i>
                            {clients.length} total
                        </span>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {clients.length === 0 ? (
                            <div className="p-8 text-center text-secondary">
                                <i className="fas fa-users text-4xl mb-4 opacity-30"></i>
                                <p>Nenhum cliente cadastrado</p>
                            </div>
                        ) : (
                            clients.slice(0, 4).map((client) => (
                                <div key={client.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center text-black font-bold">
                                            {(client.name || 'U').charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{client.name || 'Sem nome'}</p>
                                            <p className="text-sm text-secondary">{client.phone || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(client.cashback || 0) > 0 && (
                                            <span className="badge bg-green-500/20 text-green-500 text-xs">
                                                R$ {(client.cashback || 0).toFixed(2)}
                                            </span>
                                        )}
                                        {client.planName && (
                                            <span className="badge badge-primary text-xs">{client.planName}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
