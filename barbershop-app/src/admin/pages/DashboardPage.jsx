import React from 'react';
import { useAdmin } from '../context/AdminContext';

function DashboardPage() {
    const { metrics, appointments, clients, barbers } = useAdmin();

    const statCards = [
        { icon: 'fa-calendar-check', label: 'Agendamentos Hoje', value: metrics.todayAppointments, color: 'bg-blue-500' },
        { icon: 'fa-clock', label: 'Pendentes', value: metrics.pendingAppointments, color: 'bg-yellow-500' },
        { icon: 'fa-users', label: 'Clientes Ativos', value: metrics.activeClients, color: 'bg-green-500' },
        { icon: 'fa-crown', label: 'Assinantes', value: metrics.planSubscribers, color: 'bg-purple-500' },
        { icon: 'fa-wallet', label: 'Receita Semanal', value: `R$ ${metrics.weeklyRevenue.toFixed(2)}`, color: 'bg-primary' },
        { icon: 'fa-arrow-trend-up', label: 'Crescimento', value: `${metrics.monthlyGrowth}%`, color: 'bg-teal-500' },
    ];

    const todayAppointments = appointments.filter(apt => apt.date === '2024-01-15').slice(0, 5);
    const topBarbers = [...barbers].sort((a, b) => b.rating - a.rating).slice(0, 4);

    return (
        <div className="admin-page">
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
                        {todayAppointments.map((apt) => (
                            <div key={apt.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="font-bold text-primary">{apt.time}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{apt.clientName}</p>
                                        <p className="text-sm text-secondary">{apt.serviceName} • {apt.barberName}</p>
                                    </div>
                                </div>
                                <span className={`badge ${apt.status === 'confirmed' ? 'badge-success' : apt.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>
                                    {apt.status === 'confirmed' ? 'Confirmado' : apt.status === 'pending' ? 'Pendente' : 'Concluído'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Barbeiros */}
                <div className="admin-card">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <h2 className="font-bold text-lg">Top Barbeiros</h2>
                        <i className="fas fa-trophy text-primary"></i>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {topBarbers.map((barber, idx) => (
                            <div key={barber.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
                                        {idx + 1}
                                    </span>
                                    <img src={barber.image} alt={barber.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold">{barber.name}</p>
                                        <p className="text-sm text-secondary">{barber.totalServices} atendimentos</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-primary">
                                    <i className="fas fa-star"></i>
                                    <span className="font-bold">{barber.rating}</span>
                                </div>
                            </div>
                        ))}
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
                            <i className="fas fa-arrow-up mr-1"></i>
                            +12% este mês
                        </span>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {clients.slice(0, 4).map((client) => (
                            <div key={client.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-yellow-500 flex items-center justify-center text-black font-bold">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{client.name}</p>
                                        <p className="text-sm text-secondary">{client.phone}</p>
                                    </div>
                                </div>
                                {client.planName && (
                                    <span className="badge badge-primary text-xs">{client.planName}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
