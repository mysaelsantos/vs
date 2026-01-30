import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

function ReportsPage() {
    const { appointments, clients, services, barbers, plans, metrics } = useAdmin();
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    // Estatísticas calculadas
    const totalRevenue = appointments
        .filter(a => a.status === 'completed')
        .reduce((acc, a) => acc + a.price, 0);

    const subscribersRevenue = plans.reduce((acc, p) => acc + (p.subscribers * p.price), 0);

    const topServices = services.map(service => ({
        ...service,
        count: appointments.filter(a => a.serviceName === service.name).length,
    })).sort((a, b) => b.count - a.count);

    const topBarbers = barbers.map(barber => ({
        ...barber,
        revenue: appointments
            .filter(a => a.barberName === barber.name && a.status === 'completed')
            .reduce((acc, a) => acc + a.price, 0),
    })).sort((a, b) => b.revenue - a.revenue);

    return (
        <div className="admin-page">
            {/* Period Filter */}
            <div className="flex items-center gap-2 mb-6">
                <span className="text-secondary">Período:</span>
                <div className="flex bg-bg-card rounded-lg p-1">
                    {[
                        { id: 'week', label: 'Semana' },
                        { id: 'month', label: 'Mês' },
                        { id: 'quarter', label: 'Trimestre' },
                        { id: 'year', label: 'Ano' },
                    ].map(period => (
                        <button
                            key={period.id}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedPeriod === period.id ? 'bg-primary text-black' : ''
                                }`}
                            onClick={() => setSelectedPeriod(period.id)}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="admin-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                            <i className="fas fa-wallet text-white"></i>
                        </div>
                        <span className="text-secondary">Receita Total</span>
                    </div>
                    <p className="text-2xl font-bold text-green-500">R$ {(totalRevenue + subscribersRevenue).toFixed(2)}</p>
                </div>
                <div className="admin-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                            <i className="fas fa-scissors text-white"></i>
                        </div>
                        <span className="text-secondary">Serviços Avulsos</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-500">R$ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="admin-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                            <i className="fas fa-crown text-white"></i>
                        </div>
                        <span className="text-secondary">Assinaturas</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-500">R$ {subscribersRevenue.toFixed(2)}</p>
                </div>
                <div className="admin-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <i className="fas fa-arrow-trend-up text-black"></i>
                        </div>
                        <span className="text-secondary">Crescimento</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">+{metrics.monthlyGrowth}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Serviços */}
                <div className="admin-card">
                    <div className="p-4 border-b border-gray-800">
                        <h3 className="font-bold text-lg">Serviços Mais Realizados</h3>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {topServices.slice(0, 5).map((service, idx) => (
                            <div key={service.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-yellow-500 text-black' :
                                            idx === 1 ? 'bg-gray-400 text-black' :
                                                idx === 2 ? 'bg-amber-700 text-white' : 'bg-gray-700'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <i className={`fas ${service.icon} text-primary`}></i>
                                        <span>{service.name}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{service.count}x</p>
                                    <p className="text-xs text-secondary">R$ {(service.count * (service.promoPrice || service.price)).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Barbeiros */}
                <div className="admin-card">
                    <div className="p-4 border-b border-gray-800">
                        <h3 className="font-bold text-lg">Barbeiros por Faturamento</h3>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {topBarbers.slice(0, 5).map((barber, idx) => (
                            <div key={barber.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-yellow-500 text-black' :
                                            idx === 1 ? 'bg-gray-400 text-black' :
                                                idx === 2 ? 'bg-amber-700 text-white' : 'bg-gray-700'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <img src={barber.image} alt={barber.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{barber.name}</p>
                                        <p className="text-xs text-secondary">{barber.role}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-primary">R$ {barber.revenue.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clientes */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">Clientes</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-bg-alt rounded-lg">
                            <p className="text-3xl font-bold text-primary">{clients.length}</p>
                            <p className="text-sm text-secondary">Total de Clientes</p>
                        </div>
                        <div className="text-center p-4 bg-bg-alt rounded-lg">
                            <p className="text-3xl font-bold text-green-500">{clients.filter(c => c.planId).length}</p>
                            <p className="text-sm text-secondary">Assinantes</p>
                        </div>
                        <div className="text-center p-4 bg-bg-alt rounded-lg">
                            <p className="text-3xl font-bold text-blue-500">{clients.reduce((acc, c) => acc + c.totalAppointments, 0)}</p>
                            <p className="text-sm text-secondary">Atendimentos</p>
                        </div>
                        <div className="text-center p-4 bg-bg-alt rounded-lg">
                            <p className="text-3xl font-bold text-purple-500">{clients.reduce((acc, c) => acc + c.referralCredits, 0)}</p>
                            <p className="text-sm text-secondary">Créditos Ativos</p>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="admin-card p-6">
                    <h3 className="font-bold text-lg mb-4">Exportar Dados</h3>
                    <div className="space-y-3">
                        <button className="btn-outline w-full py-3">
                            <i className="fas fa-file-csv mr-2"></i>
                            Exportar Relatório de Vendas (CSV)
                        </button>
                        <button className="btn-outline w-full py-3">
                            <i className="fas fa-file-excel mr-2"></i>
                            Exportar Lista de Clientes (Excel)
                        </button>
                        <button className="btn-outline w-full py-3">
                            <i className="fas fa-file-pdf mr-2"></i>
                            Gerar Relatório Completo (PDF)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;
